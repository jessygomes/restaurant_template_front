/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Client } from "@/lib/type";
import React, { useEffect, useState } from "react";
import CreateOrUpdateClient from "./CreateOrUpdateClient";
import DeleteClient from "./DeleteClient";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";

export default function ClientList({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);

  //! State pour les clients
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  //! Filtre
  const [searchTerm, setSearchTerm] = useState("");

  //! Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [clientForReservations, setClientForReservations] =
    useState<Client | null>(null);

  //! Récupère les clients
  const fetchClients = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/client`, {
        cache: "no-store",
      });
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error("Erreur lors du chargement des clients :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  console.log("Clients:", clients);
  console.log("User ID:", userId);

  //! Filtre les clients en fonction du terme de recherche

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  //! Handler pour afficher les réservations
  const handleShowReservations = (client: Client) => {
    setClientForReservations(client);
    setIsReservationModalOpen(true);
  };

  //! Handlers pour les actions
  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = (client: Client) => {
    setSelectedClient(client);
    setIsModalDeleteOpen(true);
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  return (
    <section>
      <div>
        {" "}
        <div className="flex justify-between items-center">
          <h1 className="text-secondary-500 font-one font-bold text-4xl py-10">
            Liste des clients
          </h1>

          <button
            onClick={handleCreate}
            className="text-black font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
          >
            Nouveau client
          </button>
        </div>
        <div className="flex gap-4 items-center mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par client"
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          />
        </div>
        <div className="grid grid-cols-5 gap-2 px-4 py-2 text-secondary-500 text-xs font-bold">
          <p>Nom & Prénom</p>
          <p>Email</p>
          <p>Téléphone</p>
          <p>Réservation</p>
        </div>
        {loading ? (
          <p>Chargement...</p>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="grid grid-cols-5 gap-2 px-4 py-2 border-b border-gray-200 hover:bg-gray-50"
            >
              <p className="text-gray-600 text-xs">
                {client.lastName} {client.firstName}
              </p>
              <p className="text-gray-600 text-xs">{client.email}</p>
              <p className="text-gray-600 text-xs">{client.phone}</p>
              <button
                onClick={() => handleShowReservations(client)}
                className="cursor-pointer text-secondary-500 hover:underline text-xs text-left"
              >
                {client.reservation.length} réservation
                {client.reservation.length > 1 ? "s" : ""}
              </button>
              <div className="flex gap-2 text-xs items-center justify-center">
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleEdit(client)}
                >
                  <IoCreateOutline
                    size={20}
                    className="hover:text-secondary-500"
                  />
                </button>
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleDelete(client)}
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
        {/* Modal des réservations */}
        {isReservationModalOpen && clientForReservations && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[600px] p-6 rounded-lg overflow-y-auto">
              <h2 className="text-lg font-one text-secondary-500 font-bold mb-4">
                Réservations de {clientForReservations.firstName}{" "}
                {clientForReservations.lastName}
              </h2>
              {clientForReservations.reservation.length === 0 ? (
                <p className="text-gray-500">Aucune réservation</p>
              ) : (
                <div className="space-y-3">
                  {clientForReservations.reservation.map(
                    (reservation: any, index: number) => (
                      <div
                        key={index}
                        className="border p-3 rounded grid grid-cols-2"
                      >
                        <p className="text-gray-600 text-xs">
                          <strong>Date:</strong>{" "}
                          {new Date(reservation.date).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                        <p className="text-gray-600 text-xs">
                          <strong>Heure:</strong>{" "}
                          {new Date(reservation.arrivalTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                        <p className="text-gray-600 text-xs">
                          <strong>Personnes:</strong> {reservation.guests}
                        </p>
                        <p className="text-gray-600 text-xs">
                          <strong>Statut:</strong> {reservation.status}
                        </p>
                        {reservation.isPrivate && (
                          <p className="text-sm text-orange-600">
                            <strong>Privatisation</strong>
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
              <button
                onClick={() => setIsReservationModalOpen(false)}
                className="w-full mt-4 text-noir-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-noir-500 hover:border-noir-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <CreateOrUpdateClient
          userId={userId}
          onCreate={() => {
            fetchClients();
            setIsModalOpen(false);
          }}
          setIsOpen={setIsModalOpen}
          existingClient={selectedClient ?? undefined}
        />
      )}

      {isModalDeleteOpen && (
        <DeleteClient
          onDelete={() => {
            fetchClients();
            setIsModalDeleteOpen(false);
          }}
          setIsOpen={setIsModalDeleteOpen}
          client={selectedClient ?? undefined}
        />
      )}
    </section>
  );
}
