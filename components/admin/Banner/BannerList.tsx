"use client";
import { BannerProps } from "@/lib/type";
import React, { useEffect, useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import CreateOrUpdateBanner from "./CreateOrUpdateBanner";
import DeleteBanner from "./DeleteBanner";

export default function BannerList({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);

  //! State pour les tables et la table sélectionnée
  const [banners, setBanners] = useState<BannerProps[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<BannerProps | null>(
    null
  );

  //! Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  //! Récupère les événements
  const fetchBanner = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/banner`, {
        cache: "no-store",
      });
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error("Erreur lors du chargement des événements :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  //! Handlers pour les actions
  const handleEdit = (banner: BannerProps) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleDelete = (banner: BannerProps) => {
    setSelectedBanner(banner);
    setIsModalDeleteOpen(true);
  };

  const handleCreate = () => {
    setSelectedBanner(null);
    setIsModalOpen(true);
  };

  return (
    <section>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-secondary-500 font-one font-bold text-4xl py-10">
            Bannières
          </h1>

          <button
            onClick={handleCreate}
            className="text-black font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
          >
            Nouvelle bannière
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

        <div className="grid grid-cols-6 gap-2 px-4 py-2 text-secondary-500 text-xs font-bold">
          <p>Titre</p>
          <p>Début</p>
          <p>Fin</p>
          <p>Lien</p>
          <p>Actif</p>
        </div>

        {loading ? (
          <p className="mt-4 text-gray-500 text-center py-8 font-one bg-gray-200 animate-pulse">
            Chargement...
          </p>
        ) : banners.length === 0 ? (
          <p className="mt-4 text-gray-500 text-center py-8 font-one bg-gray-200 ">
            Aucune bannière trouvée.
          </p>
        ) : (
          banners.map((banner) => (
            <div
              key={banner.id}
              className="grid grid-cols-6 justify-center items-center gap-2 bg-gray-200 hover:bg-gray-300 duration-200 p-4 mb-2"
            >
              <h2 className="font-one font-semibold text-secondary-500">
                {banner.title}
              </h2>

              <p className="text-gray-600 text-xs truncate">
                {new Date(banner.startsAt).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className="text-gray-600 text-xs">
                {new Date(banner.endsAt).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className="text-gray-600 text-xs">{banner.link || "Aucun"}</p>

              <p
                className={`text-xs font-bold ${
                  banner.isActive ? "text-green-500" : "text-red-500"
                }`}
              >
                {banner.isActive ? "Utilisation en cours" : "Pas actif"}
              </p>

              <div className="flex gap-2 text-xs items-center justify-center">
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleEdit(banner)}
                >
                  <IoCreateOutline
                    size={20}
                    className="hover:text-secondary-500"
                  />
                </button>
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleDelete(banner)}
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
        <CreateOrUpdateBanner
          userId={userId}
          onCreate={() => {
            fetchBanner();
            setIsModalOpen(false);
          }}
          setIsOpen={setIsModalOpen}
          existingBanner={selectedBanner ?? undefined}
        />
      )}

      {isModalDeleteOpen && (
        <DeleteBanner
          onDelete={() => {
            fetchBanner();
            setIsModalDeleteOpen(false);
          }}
          setIsOpen={setIsModalDeleteOpen}
          banner={selectedBanner ?? undefined}
        />
      )}
    </section>
  );
}
