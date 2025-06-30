"use client";
import { useEffect, useState } from "react";
import CreateOrUpdateTable from "./CreateOrUpdateTable";

import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteTable from "./DeleteTable";
import { Table } from "@/lib/type";

export default function TableList({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);

  //! State pour les tables et la table sélectionnée
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  //! Filtre
  const [filterReserved, setFilterReserved] = useState<
    "all" | "reserved" | "available"
  >("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [availableCapacities, setAvailableCapacities] = useState<number[]>([]);

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  //! Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  //! Récupère les tables
  const fetchTables = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/tables`, {
        cache: "no-store",
      });
      const data = await res.json();
      setTables(data);

      // Récupère les capacités uniques
      const capacities = Array.from(
        new Set<number>(data.map((t: Table) => t.capacity))
      ).sort((a: number, b: number) => a - b);
      setAvailableCapacities(capacities);

      // Récupère les types uniques
      const types = Array.from(
        new Set<string>(data.map((t: Table) => t.type))
      ).sort();
      setAvailableTypes(types);
    } catch (err) {
      console.error("Erreur lors du chargement des tables :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  //! Handlers pour les actions
  const handleEdit = (table: Table) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const handleDelete = (table: Table) => {
    setSelectedTable(table);
    setIsModalDeleteOpen(true);
  };

  const handleCreate = () => {
    setSelectedTable(null);
    setIsModalOpen(true);
  };

  //! Filtrage des tables
  const filteredTables = tables.filter((table) => {
    if (
      capacityFilter !== "all" &&
      table.capacity.toString() !== capacityFilter
    ) {
      return false;
    }

    if (filterReserved === "reserved" && !table.isReserved) return false;
    if (filterReserved === "available" && table.isReserved) return false;

    if (typeFilter !== "all" && table.type !== typeFilter) return false;

    return true;
  });

  //! Affichage des tables
  return (
    <section>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-secondary-500 font-one font-bold text-4xl py-10">
            Liste des tables
          </h1>

          <button
            onClick={handleCreate}
            className="text-black font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
          >
            Créer une table
          </button>
        </div>

        <div className="flex gap-4 items-center mb-4">
          <select
            value={filterReserved}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e) => setFilterReserved(e.target.value as any)}
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          >
            <option value="all">Trier par disponibilité</option>
            <option value="reserved">Réservées</option>
            <option value="available">Disponibles</option>
          </select>

          <select
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          >
            <option value="all">Trier par capacité</option>
            {availableCapacities.map((cap) => (
              <option key={cap} value={cap}>
                {cap} personnes
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          >
            <option value="all">Trier par salle</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-5 gap-2 px-4 py-2 text-secondary-500 text-xs font-bold">
          <p>Type</p>
          <p>Nom</p>
          <p>Capacités</p>
          <p>Statut</p>
          <p></p>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          filteredTables.map((table) => (
            <div
              key={table.id}
              className="grid grid-cols-5 justify-center items-center gap-2 bg-gray-200 p-4 mb-2"
            >
              <h2 className="font-one font-semibold text-secondary-500">
                {table.type}
              </h2>
              <h2 className="font-one font-semibold text-secondary-500">
                {table.name}
              </h2>
              <p className="text-gray-600 text-xs">
                {table.capacity} personnes
              </p>
              <p
                className={`text-xs font-bold ${
                  table.isReserved ? "text-red-500" : "text-green-500"
                }`}
              >
                {" "}
                {table.isReserved ? "Réservée" : "Disponible"}
              </p>
              <div className="flex gap-2 text-xs items-center justify-center">
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleEdit(table)}
                >
                  <IoCreateOutline
                    size={20}
                    className="hover:text-secondary-500"
                  />
                </button>
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleDelete(table)}
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
        <CreateOrUpdateTable
          userId={userId}
          onCreate={() => {
            fetchTables();
            setIsModalOpen(false);
          }}
          setIsOpen={setIsModalOpen}
          existingTable={selectedTable ?? undefined}
        />
      )}

      {isModalDeleteOpen && (
        <DeleteTable
          onDelete={() => {
            fetchTables();
            setIsModalDeleteOpen(false);
          }}
          setIsOpen={setIsModalDeleteOpen}
          table={selectedTable ?? undefined}
        />
      )}
    </section>
  );
}
