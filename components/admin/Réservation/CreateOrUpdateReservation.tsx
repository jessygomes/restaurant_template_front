/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { Client, ReservationListItem, Table } from "@/lib/type";
import { reservationSchema } from "@/lib/zod/validator.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formatDate = (isoDate: string) => isoDate.split("T")[0]; // "2025-06-19"
function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toTimeString().slice(0, 5); // HH:MM
}

export default function CreateOrUpdateReservation({
  userId,
  onCreate,
  existingResa,
  setIsOpen = () => {},
}: {
  userId: string;
  onCreate: () => void;
  existingResa?: ReservationListItem | null;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);
  const [formReady, setFormReady] = useState(false);

  //! Formulaire de création ou de modification de réservation
  const form = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      date: existingResa?.date ? formatDate(existingResa.date) : "",
      arrivalTime: existingResa?.arrivalTime
        ? formatTime(existingResa.arrivalTime)
        : "",
      guests: existingResa?.guests ?? 1,
      status: existingResa?.status ?? "Attente",
      isPrivate: existingResa?.isPrivate ?? false,
      privateFrom: existingResa?.privateFrom
        ? formatTime(existingResa.privateFrom)
        : "",
      privateTo: existingResa?.privateTo
        ? formatTime(existingResa.privateTo)
        : "",
      tableIds: existingResa?.tables?.map((t) => t.table.id) ?? [],
      client: existingResa?.client
        ? {
            firstName: existingResa.client.firstName,
            lastName: existingResa.client.lastName,
            email: existingResa.client.email,
            phone: existingResa.client.phone,
          }
        : {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
          },
    },
  });

  useEffect(() => {
    form.reset({
      date: existingResa?.date ? formatDate(existingResa.date) : "",
      arrivalTime: existingResa?.arrivalTime
        ? formatTime(existingResa.arrivalTime)
        : "",
      guests: existingResa?.guests ?? 1,
      status: existingResa?.status ?? "Attente",
      isPrivate: existingResa?.isPrivate ?? false,
      privateFrom: existingResa?.privateFrom
        ? formatTime(existingResa.privateFrom)
        : "",
      privateTo: existingResa?.privateTo
        ? formatTime(existingResa.privateTo)
        : "",
      tableIds: existingResa?.tables?.map((t) => t.table.id) ?? [],
      client: existingResa?.client
        ? {
            firstName: existingResa.client.firstName,
            lastName: existingResa.client.lastName,
            email: existingResa.client.email,
            phone: existingResa.client.phone,
          }
        : {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
          },
    });

    setFormReady(true);
  }, [existingResa]);

  //! Fonction pour rechercher un client par email
  const [searchClientQuery, setSearchClientQuery] = useState("");
  const [clientResults, setClientResults] = useState<Client[]>([]);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const handleClientSearch = async (query: string) => {
    if (!query.trim()) {
      setClientResults([]);
      return;
    }

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACK_URL
        }/client/search?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) {
        throw new Error("Erreur lors de la recherche de clients");
      }
      const results = await res.json();
      setClientResults(results);
    } catch (error) {
      console.error("Erreur recherche client :", error);
      setClientResults([]);
    }
  };

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);

    if (searchClientQuery.length < 2) {
      setClientResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      handleClientSearch(searchClientQuery);
    }, 400); // délai de 400ms

    setSearchTimeout(timeout);
  }, [searchClientQuery]);

  //! Liste des tables
  const [tableList, setTableList] = useState<Table[]>([]);
  const [capacityFilter, setCapacityFilter] = useState<string>("all");
  const [availableCapacities, setAvailableCapacities] = useState<number[]>([]);

  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    if (!formReady) return;

    const fetchTables = async () => {
      try {
        const date = form.watch("date");
        const arrivalTime = form.watch("arrivalTime");

        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACK_URL
          }/tables/resa?date=${date}&arrivalTime=${arrivalTime}${
            existingResa?.id ? `&excludeResaId=${existingResa.id}` : ""
          }`
        );
        const tables = await res.json();
        setTableList(tables);

        // Récupère les capacités uniques
        const capacities = Array.from(
          new Set<number>(tables.map((t: Table) => t.capacity))
        ).sort((a: number, b: number) => a - b);
        setAvailableCapacities(capacities);

        // Récupère les types uniques
        const types = Array.from(
          new Set<string>(tables.map((t: Table) => t.type))
        ).sort();
        setAvailableTypes(types);
      } catch (err) {
        console.error("Erreur lors du chargement des tables :", err);
      }
    };

    fetchTables();
  }, [formReady, form.watch("date"), form.watch("arrivalTime")]);

  //! Filtrage des tables
  const filteredTables = tableList.filter((table) => {
    if (
      capacityFilter !== "all" &&
      table.capacity.toString() !== capacityFilter
    ) {
      return false;
    }

    if (typeFilter !== "all" && table.type !== typeFilter) return false;

    return true;
  });

  useEffect(() => {
    if (existingResa && tableList.length > 0) {
      const selectedTableIds =
        existingResa.tables?.map((t) => t.table.id) || [];

      form.setValue("tableIds", selectedTableIds);
    }
  }, [tableList, existingResa]);

  //! Soumission du formulaire
  const onSubmit = async (data: z.infer<typeof reservationSchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const url = existingResa
      ? `${process.env.NEXT_PUBLIC_BACK_URL}/reservation/update/${existingResa.id}`
      : `${process.env.NEXT_PUBLIC_BACK_URL}/reservation/create-resa-admin`;

    try {
      const response = await fetch(url, {
        method: existingResa ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId,
          resaId: existingResa?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Une erreur est survenue.");
        return;
      }

      const result = await response.json();
      setSuccess(result.message || "Réservation créée avec succès !");
      form.reset();
      onCreate();
    } catch (error) {
      console.error("Erreur lors de la création de la réservation :", error);
      setError(
        "Une erreur est survenue lors de la création de la réservation."
      );
    } finally {
      toast.success(
        existingResa
          ? `Réservation ${existingResa.client?.firstName} ${existingResa.client?.lastName} modifiée avec succès !`
          : "Réservation créée avec succès !"
      );
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-xs p-6 w-[1000px] shadow-lg relative">
          <h2 className="text-lg font-semibold font-one text-secondary-500 mb-4">
            {existingResa ? `${existingResa.date}` : "Nouvelle réservation"}
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Date
                </label>
                <input
                  type="date"
                  {...form.register("date")}
                  className="w-full border border-gray-300 px-3 py-1 text-xs text-noir-500"
                />
                {form.formState.errors.date && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>

              {/* Heure d'arrivée */}
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Heure d’arrivée
                </label>
                <input
                  type="time"
                  {...form.register("arrivalTime")}
                  className="w-full border border-gray-300 px-3 py-1 text-xs text-noir-500"
                />
                {form.formState.errors.arrivalTime && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.arrivalTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Nombre de couverts
                </label>
                <input
                  type="number"
                  {...form.register("guests", { valueAsNumber: true })}
                  className="w-full border border-gray-300 px-3 py-1 text-xs text-noir-500"
                />
                {form.formState.errors.guests && (
                  <p className="text-red-500 text-xs">
                    {form.formState.errors.guests.message}
                  </p>
                )}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Statut
                </label>
                <select
                  {...form.register("status")}
                  className="w-full border border-gray-300 px-3 py-1 text-xs text-noir-500"
                >
                  <option value="Attente">Attente</option>
                  <option value="Confirmée">Confirmée</option>
                  <option value="Annulée">Annulée</option>
                </select>
              </div>
            </div>

            {/* Privatisation */}
            <div className="flex items-center">
              <div className="flex gap-2 items-center justify-center">
                <input type="checkbox" {...form.register("isPrivate")} />
                <label className="text-xs font-medium text-secondary-500 whitespace-nowrap">
                  Privatiser ?
                </label>
              </div>

              {form.watch("isPrivate") && (
                <div className="flex w-full ml-2">
                  <div className="w-1/2 mr-2">
                    <label className="block text-xs font-medium font-one text-secondary-500">
                      De (heure)
                    </label>
                    <input
                      type="time"
                      {...form.register("privateFrom")}
                      className="w-full border border-gray-300 px-3 py-1 text-xs text-noir-500"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-xs font-medium font-one text-secondary-500">
                      À (heure)
                    </label>
                    <input
                      type="time"
                      {...form.register("privateTo")}
                      className="w-full border border-gray-300 px-3 py-1 text-xs text-noir-500"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="w-full h-[1px] bg-secondary-500" />

            {/* Client ID (optionnel - à remplacer par un vrai select plus tard) */}
            <div className="flex gap-2 items-end">
              <input
                type="text"
                value={searchClientQuery}
                onChange={(e) => setSearchClientQuery(e.target.value)}
                className="w-full border border-gray-300 px-3 py-1 text-xs text-noir-500"
                placeholder="Rechercher un client par nom ou email du client..."
              />
            </div>
            {clientResults.length > 0 && (
              <div className="border rounded p-1 mb-2 bg-gray-50 max-h-40 overflow-auto hover:bg-gray-100">
                {clientResults.map((client) => (
                  <div
                    key={client.id}
                    className="cursor-pointer text-gray-600  px-2 py-1 text-xs"
                    onClick={() => {
                      form.setValue("client.firstName", client.firstName);
                      form.setValue("client.lastName", client.lastName);
                      form.setValue("client.email", client.email);
                      form.setValue("client.phone", client.phone);
                      setSearchClientQuery(""); // reset l'input
                      setClientResults([]); // fermer les résultats
                    }}
                  >
                    {client.firstName} {client.lastName} - {client.email}
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Prénom du client
                </label>
                <input
                  type="text"
                  {...form.register("client.firstName")}
                  className="w-full border border-gray-300 px-3 py-1 text-xs text-noir-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Nom du client
                </label>
                <input
                  type="text"
                  {...form.register("client.lastName")}
                  className="w-full border border-gray-300 px-3 py-1 text-xs text-noir-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Email du client
                </label>
                <input
                  type="email"
                  {...form.register("client.email")}
                  className="w-full border border-gray-300 px-3 py-1 text-xs text-noir-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Téléphone du client
                </label>
                <input
                  type="tel"
                  {...form.register("client.phone")}
                  className="w-full border border-gray-300 px-3 py-1 text-xs text-noir-500"
                />
              </div>
            </div>

            <div className="w-full h-[1px] bg-secondary-500" />
            {/* Tables (checkboxes ou select multiple selon ton besoin) */}
            <div>
              <label className="block text-sm font-medium font-one text-secondary-500">
                Tables
              </label>

              <div className="flex gap-4 items-center mb-2">
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

              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {filteredTables.length > 0 ? (
                  filteredTables.map((table) => {
                    const selectedIds = form.watch("tableIds") || [];
                    const isSelected = selectedIds.includes(table.id);
                    const toggleTable = () => {
                      const newSelected = isSelected
                        ? selectedIds.filter((id) => id !== table.id)
                        : [...selectedIds, table.id];

                      form.setValue("tableIds", newSelected);
                    };

                    return (
                      <div
                        key={table.id}
                        onClick={toggleTable}
                        className={`flex items-center p-2 border rounded cursor-pointer transition ${
                          isSelected
                            ? "bg-secondary-500/20 "
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="mr-2"
                        />
                        <span className="text-xs font-one text-noir-500">
                          {table.name} ({table.capacity} pers) - {table.type} -{" "}
                          {table.isReserved ? "Réservée" : "Disponible"}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500">
                    Aucune table disponible
                  </p>
                )}
              </div>
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />

            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-noir-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-noir-500 hover:border-noir-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-secondary-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
              >
                {loading
                  ? existingResa
                    ? "Modification en cours..."
                    : "Création en cours..."
                  : existingResa
                  ? "Modifier"
                  : "Créer une réservation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
