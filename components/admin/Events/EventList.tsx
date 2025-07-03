"use client";
import { EventProps } from "@/lib/type";
import React, { useEffect, useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import CreateOrUpdateEvent from "./CreateOrUpdateEvent";
import DeleteEvent from "./DeleteEvent";

export default function EventList({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);

  //! State pour les tables et la table sélectionnée
  const [events, setEvents] = useState<EventProps[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventProps | null>(null);

  //! Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  //! Filtre
  const [filterDate, setFilterDate] = useState<"all" | "past" | "upcoming">(
    "all"
  );

  //! Récupère les événements
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/event`, {
        cache: "no-store",
      });
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Erreur lors du chargement des événements :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  //! Handlers pour les actions
  const handleEdit = (event: EventProps) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = (event: EventProps) => {
    setSelectedEvent(event);
    setIsModalDeleteOpen(true);
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  //! Filtrage des tables
  const filteredEvent =
    events.length > 0
      ? events.filter((event) => {
          const eventDate = new Date(event.date);
          const now = new Date();

          if (filterDate === "past" && eventDate > now) return false;
          if (filterDate === "upcoming" && eventDate <= now) return false;

          return true;
        })
      : [];

  return (
    <section>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-secondary-500 font-one font-bold text-4xl py-10">
            Liste des événements
          </h1>

          <button
            onClick={handleCreate}
            className="text-black font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
          >
            Créer une évenement
          </button>
        </div>

        <div className="flex gap-4 items-center mb-4">
          <select
            value={filterDate}
            onChange={(e) =>
              setFilterDate(e.target.value as "all" | "past" | "upcoming")
            }
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          >
            <option value="all">Trier par date</option>
            <option value="upcoming">À venir</option>
            <option value="past">Passés</option>
          </select>
        </div>

        <div className="grid grid-cols-6 gap-2 px-4 py-2 text-secondary-500 text-xs font-bold">
          <p>Nom</p>
          <p>Date</p>
          <p>Descripption</p>
          <p>Banner</p>
          <p></p>
        </div>

        {loading ? (
          <p className="mt-4 text-gray-500 text-center py-8 font-one bg-gray-200 animate-pulse">
            Chargement...
          </p>
        ) : filteredEvent.length === 0 ? (
          <p className="mt-4 text-gray-500 text-center py-8 font-one bg-gray-200 ">
            Aucun événement
          </p>
        ) : (
          filteredEvent.map((event) => (
            <div
              key={event.id}
              className="grid grid-cols-6 justify-center items-center gap-2 bg-gray-200 hover:bg-gray-300 duration-200 p-4 mb-2"
            >
              <h2 className="font-one font-semibold text-secondary-500">
                {event.title}
              </h2>
              <h2 className="font-one text-xs  text-gray-600">
                {new Date(event.date).toLocaleDateString("fr-FR")}
              </h2>
              <p className="text-gray-600 text-xs truncate">
                {event.description}
              </p>
              <p className="text-gray-600 text-xs truncate">{event.banner}</p>
              <p
                className={`text-xs font-bold text-center ${
                  new Date(event.date) > new Date()
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {new Date(event.date) > new Date() ? "À venir" : "Passé"}
              </p>
              <div className="flex gap-2 text-xs items-center justify-center">
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleEdit(event)}
                >
                  <IoCreateOutline
                    size={20}
                    className="hover:text-secondary-500"
                  />
                </button>
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleDelete(event)}
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
        <CreateOrUpdateEvent
          userId={userId}
          onCreate={() => {
            fetchEvents();
            setIsModalOpen(false);
          }}
          setIsOpen={setIsModalOpen}
          existingEvent={selectedEvent ?? undefined}
        />
      )}

      {isModalDeleteOpen && (
        <DeleteEvent
          onDelete={() => {
            fetchEvents();
            setIsModalDeleteOpen(false);
          }}
          setIsOpen={setIsModalDeleteOpen}
          event={selectedEvent ?? undefined}
        />
      )}
    </section>
  );
}
