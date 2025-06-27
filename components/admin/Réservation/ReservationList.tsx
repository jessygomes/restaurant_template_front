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
  const [filterDate, setFilterDate] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [filterClient, setFilterClient] = useState<string>("");
  const [filterPrivate, setFilterPrivate] = useState<
    "all" | "private" | "public"
  >("all");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [availableClients, setAvailableClients] = useState<string[]>([]);

  //! Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

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

  //! Filtrage des réservations
  const statusMap: Record<"pending" | "confirmed" | "cancelled", string> = {
    pending: "Attente",
    confirmed: "Confirmée",
    cancelled: "Annulée",
  };

  const filteredReservations = reservations.filter((reservation) => {
    const dateMatch = !filterDate || reservation.date === filterDate;
    const statusMatch =
      filterStatus === "all" ||
      reservation.status === statusMap[filterStatus as keyof typeof statusMap];
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
    const privateMatch =
      filterPrivate === "all" ||
      (filterPrivate === "private" && reservation.isPrivate) ||
      (filterPrivate === "public" && !reservation.isPrivate);

    return dateMatch && statusMatch && clientMatch && privateMatch;
  });

  console.log("Reservations for today:", filteredReservations);

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
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          >
            <option value="">Trier par date</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString("fr-FR")}
              </option>
            ))}
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

        <div className="grid grid-cols-7 gap-2 px-4 py-2 text-secondary-500 text-xs font-bold">
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
              className="grid grid-cols-7 justify-center items-center gap-2 bg-gray-200 p-2 mb-2"
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
    </section>
  );
}
