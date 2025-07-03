"use client";
import { ActusProps } from "@/lib/type";
import React, { useEffect, useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import CreateOrUpdateActus from "./CreateOrUpdateActus";
import DeleteActus from "./DeleteActus";

export default function ActusList({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);

  //! State pour les tables et la table sélectionnée
  const [actus, setActus] = useState<ActusProps[]>([]);
  const [selectedActus, setSelectedActus] = useState<ActusProps | null>(null);

  //! Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  //! Récupère les événements
  const fetchActus = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/actus`, {
        cache: "no-store",
      });
      const data = await res.json();
      setActus(data);
    } catch (err) {
      console.error("Erreur lors du chargement des événements :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActus();
  }, []);

  //! Handlers pour les actions
  const handleEdit = (actu: ActusProps) => {
    setSelectedActus(actu);
    setIsModalOpen(true);
  };

  const handleDelete = (actu: ActusProps) => {
    setSelectedActus(actu);
    setIsModalDeleteOpen(true);
  };

  const handleCreate = () => {
    setSelectedActus(null);
    setIsModalOpen(true);
  };

  return (
    <section>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-secondary-500 font-one font-bold text-4xl py-10">
            Liste des articles
          </h1>

          <button
            onClick={handleCreate}
            className="text-black font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
          >
            Nouvel article
          </button>
        </div>

        {/* <div className="flex gap-4 items-center mb-4">
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
        </div> */}

        <div className="grid grid-cols-4 gap-2 px-4 py-2 text-secondary-500 text-xs font-bold">
          <p>Titre</p>
          <p>Contenu</p>
          <p className="text-center">Date de publication</p>
        </div>

        {loading ? (
          <p className="mt-4 text-gray-500 text-center py-8 font-one bg-gray-200 animate-pulse">
            Chargement...
          </p>
        ) : actus.length === 0 ? (
          <p className="mt-4 text-gray-500 text-center py-8 font-one bg-gray-200 ">
            Aucune actualité trouvée.
          </p>
        ) : (
          actus.map((actu) => (
            <div
              key={actu.id}
              className="grid grid-cols-4 justify-center items-center gap-2 bg-gray-200 hover:bg-gray-300 duration-200 p-4 mb-2"
            >
              <h2 className="font-one font-semibold text-secondary-500">
                {actu.title}
              </h2>

              <p className="text-gray-600 text-xs truncate">{actu.content}</p>

              <p className="text-gray-600 text-xs text-center">
                {new Date(actu.publishedAt).toLocaleDateString("fr-FR")}
              </p>

              <div className="flex gap-2 text-xs items-center justify-center">
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleEdit(actu)}
                >
                  <IoCreateOutline
                    size={20}
                    className="hover:text-secondary-500"
                  />
                </button>
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleDelete(actu)}
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
        <CreateOrUpdateActus
          userId={userId}
          onCreate={() => {
            fetchActus();
            setIsModalOpen(false);
          }}
          setIsOpen={setIsModalOpen}
          existingActu={selectedActus ?? undefined}
        />
      )}

      {isModalDeleteOpen && (
        <DeleteActus
          onDelete={() => {
            fetchActus();
            setIsModalDeleteOpen(false);
          }}
          setIsOpen={setIsModalDeleteOpen}
          actu={selectedActus ?? undefined}
        />
      )}
    </section>
  );
}
