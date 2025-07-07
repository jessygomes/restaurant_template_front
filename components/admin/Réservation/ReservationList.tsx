/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { ReservationListItem } from "@/lib/type";
import CreateOrUpdateReservation from "./CreateOrUpdateReservation";
import DeleteReservation from "./DeleteReservation";
import { toast } from "sonner";

export default function ReservationList({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);

  //! State pour les réservations
  const [reservations, setReservations] = useState<ReservationListItem[]>([]);
  const [selectedReservation, setSelectedReservation] =
    useState<ReservationListItem | null>(null);

  //! Filtre
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "confirmed" | "cancelled"
  >("all");
  const [filterDateRange, setFilterDateRange] = useState<
    "all" | "today" | "week" | "month" | "upcoming" | "past"
  >("upcoming");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [filterClient, setFilterClient] = useState<string>("");
  const [filterPrivate, setFilterPrivate] = useState<
    "all" | "private" | "public"
  >("all");
  const [availableClients, setAvailableClients] = useState<string[]>([]);

  //! Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  //! Récupère les réservations
  const fetchReservations = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/reservation/all/?userId=${userId}`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();
      setReservations(data);

      // Récupère les dates uniques
      const dates = Array.from(
        new Set<string>(data.map((r: ReservationListItem) => r.date))
      ).sort();
      setAvailableDates(dates);

      // Récupère les clients uniques
      const clients = Array.from(
        new Set<string>(data.map((r: ReservationListItem) => r.client))
      ).sort();
      setAvailableClients(clients);
    } catch (err) {
      console.error("Erreur lors du chargement des réservations :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  //! CLOTURER UNE RÉSERVATION
  const confirmCloseReservation = async () => {
    if (!selectedReservation) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/reservation/finish/${selectedReservation.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Clôturé" }),
        }
      );

      if (!res.ok) throw new Error("Erreur lors de la clôture");

      toast(
        `Réservation de ${selectedReservation.client?.firstName} ${selectedReservation.client?.lastName} clôturée avec succès !`
      );

      await fetchReservations();
      setIsCloseModalOpen(false);
      setSelectedReservation(null);
    } catch (err) {
      console.error("Erreur clôture :", err);
    }
  };

  //! Handlers pour les actions
  const handleEdit = (reservation: ReservationListItem) => {
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleDelete = (reservation: ReservationListItem) => {
    setSelectedReservation(reservation);
    setIsModalDeleteOpen(true);
  };

  const handleCreate = () => {
    setSelectedReservation(null);
    setIsModalOpen(true);
  };

  const handleCloseReservation = (reservation: ReservationListItem) => {
    setSelectedReservation(reservation);
    setIsCloseModalOpen(true);
  };

  //! Filtrage des réservations
  const statusMap: Record<"pending" | "confirmed" | "cancelled", string> = {
    pending: "Attente",
    confirmed: "Confirmée",
    cancelled: "Annulée",
  };

  const filteredReservations = reservations.filter((reservation) => {
    // Filtrage par date
    const now = new Date();
    const resDate = new Date(reservation.date);
    let dateMatch = true;

    switch (filterDateRange) {
      case "today":
        dateMatch = resDate.toDateString() === now.toDateString();
        break;
      case "week":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        dateMatch = resDate >= startOfWeek && resDate <= endOfWeek;
        break;
      case "month":
        dateMatch =
          resDate.getMonth() === now.getMonth() &&
          resDate.getFullYear() === now.getFullYear();
        break;
      case "upcoming":
        dateMatch = resDate > now;
        break;
      case "past":
        dateMatch = resDate < now;
        break;
      default:
        dateMatch = true;
    }

    // Filtrage par statut
    const statusMatch =
      filterStatus === "all" ||
      reservation.status === statusMap[filterStatus as keyof typeof statusMap];

    // Filtrage par client
    const clientMatch =
      !filterClient ||
      [
        reservation.client?.firstName,
        reservation.client?.lastName,
        reservation.client?.email,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(filterClient.toLowerCase());

    // Filtrage par privatisation
    const privateMatch =
      filterPrivate === "all" ||
      (filterPrivate === "private" && reservation.isPrivate) ||
      (filterPrivate === "public" && !reservation.isPrivate);

    return dateMatch && statusMatch && clientMatch && privateMatch;
  });

  //! MODIFIER LE STATUT DES RÉSERVATIONS
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Récupération de la réservation actuelle
      const resa = reservations.find((r) => r.id === id);
      console.log("Reservation found:", resa);
      if (!resa) return;

      // Si l'utilisateur essaie de confirmer sans table reliée
      if (
        newStatus === "Confirmée" &&
        (!resa.tables || resa.tables.length === 0)
      ) {
        alert(
          "Veuillez d'abord sélectionner une ou plusieurs tables pour confirmer cette réservation."
        );
        return;
      }

      // Envoi de la requête PATCH
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/reservation/confirm-resa`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reservationId: id,
            status: newStatus,
            tableIds: resa.tables.map((t) => t.tableId),
          }),
        }
      );

      if (!res.ok) throw new Error("Erreur lors du changement de statut");

      toast(
        `Statut de la réservation ${resa.client?.firstName} ${resa.client?.lastName} modifié avec succès !`
      );

      await fetchReservations();
    } catch (err) {
      console.error("Erreur changement de statut :", err);
    }
  };

  return (
    <section>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-secondary-500 font-one font-bold text-4xl py-10">
            Liste des réservations
          </h1>

          <button
            onClick={handleCreate}
            className="text-black font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
          >
            Nouvelle réservation
          </button>
        </div>

        <div className="flex gap-4 items-center mb-4">
          <select
            value={filterDateRange}
            onChange={(e) =>
              setFilterDateRange(
                e.target.value as
                  | "all"
                  | "today"
                  | "week"
                  | "month"
                  | "upcoming"
                  | "past"
              )
            }
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd’hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois-ci</option>
            <option value="upcoming">À venir</option>
            <option value="past">Passées</option>
          </select>

          <input
            type="text"
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            placeholder="Rechercher par client"
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(
                e.target.value as "all" | "pending" | "confirmed" | "cancelled"
              )
            }
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          >
            <option value="all">Trier par statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="cancelled">Annulée</option>
          </select>

          <select
            onChange={(e) =>
              setFilterPrivate(e.target.value as "all" | "private" | "public")
            }
            value={filterPrivate}
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          >
            <option value="all">Trier par privatisation</option>
            <option value="private">Privatisées</option>
            <option value="public">Classiques</option>
          </select>
        </div>

        <div className="grid grid-cols-9 gap-2 px-4 py-2 text-secondary-500 text-xs font-bold">
          <p>Date</p>
          <p>Heure d&apos;arrivée</p>
          <p>Nb de couvert</p>
          <p>Statut</p>
          <p>Privisation</p>
          <p>Client</p>
          <p>Table</p>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          filteredReservations.map((resa) => (
            <div
              key={resa.id}
              className="grid grid-cols-9 justify-center items-center gap-2 bg-gray-200 hover:bg-gray-300 duration-200 p-2 mb-2"
            >
              <p className="text-gray-600 text-xs">
                {new Date(resa.date).toLocaleDateString("fr-FR")}
              </p>
              <p className="text-gray-600 text-xs">
                {" "}
                {new Date(resa.arrivalTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-gray-600 text-xs">{resa.guests} personnes</p>
              <select
                value={resa.status}
                onChange={(e) => handleStatusChange(resa.id, e.target.value)}
                className={`text-xs font-bold bg-transparent border-none p-0 outline-none cursor-pointer ${
                  resa.status === "Annulée"
                    ? "text-red-500"
                    : resa.status === "Attente"
                    ? "text-orange-400"
                    : "text-green-500"
                }`}
              >
                <option value="Attente">Attente</option>
                <option value="Confirmée">Confirmée</option>
                <option value="Annulée">Annulée</option>
              </select>
              <p className="text-gray-600 text-xs">
                {" "}
                {resa.isPrivate ? "Privatisé" : "Non privatisé"}
              </p>
              <p className="text-gray-600 text-xs">
                {resa.client
                  ? `${resa.client.firstName} ${resa.client.lastName}`
                  : "—"}
              </p>
              <p className="text-gray-600 text-xs">
                {resa.tables && resa.tables.length > 0
                  ? resa.tables
                      .map((t) => `${t.table.name} (${t.table.type})`)
                      .join(", ")
                  : "—"}
              </p>
              <button
                onClick={() => handleCloseReservation(resa)}
                disabled={resa.isFinished === true}
                className={`cursor-pointer text-noir-700 text-xs font-one  p-1   duration-200 ${
                  resa.isFinished
                    ? "opacity-50 bg-secondary-500 text-white cursor-not-allowed"
                    : "bg-gray-400 hover:bg-gray-600 hover:text-white"
                }`}
              >
                {resa.isFinished ? "Terminé" : "Clôturer"}
              </button>
              <div className="flex gap-2 text-xs items-center justify-center">
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleEdit(resa)}
                >
                  <IoCreateOutline
                    size={20}
                    className="hover:text-secondary-500"
                  />
                </button>
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleDelete(resa)}
                >
                  {" "}
                  <AiOutlineDelete
                    size={20}
                    className="hover:text-secondary-500"
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <CreateOrUpdateReservation
          userId={userId}
          onCreate={() => {
            fetchReservations();
            setIsModalOpen(false);
          }}
          setIsOpen={setIsModalOpen}
          existingResa={selectedReservation ?? undefined}
        />
      )}

      {isModalDeleteOpen && (
        <DeleteReservation
          onDelete={() => {
            fetchReservations();
            setIsModalDeleteOpen(false);
          }}
          setIsOpen={setIsModalDeleteOpen}
          reservation={selectedReservation ?? undefined}
        />
      )}

      {isCloseModalOpen && selectedReservation && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-xs p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-lg font-semibold font-one text-secondary-500 mb-4">
              Confirmer la clôture
            </h2>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir clôturer la réservation de{" "}
              <strong>
                {selectedReservation.client?.firstName}{" "}
                {selectedReservation.client?.lastName}
              </strong>{" "}
              du{" "}
              {new Date(selectedReservation.date).toLocaleDateString("fr-FR")} ?
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsCloseModalOpen(false);
                  setSelectedReservation(null);
                }}
                className="w-full text-noir-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-noir-500 hover:border-noir-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmCloseReservation}
                className="w-full text-secondary-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
