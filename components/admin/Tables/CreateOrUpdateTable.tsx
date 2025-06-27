"use client";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { tableSchema } from "@/lib/zod/validator.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Table } from "./TableList";

export default function CreateOrUpdateTable({
  userId,
  onCreate,
  existingTable,
  setIsOpen = () => {},
}: {
  userId: string;
  onCreate: () => void;
  existingTable?: Table;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof tableSchema>>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      name: existingTable?.name || "",
      type: existingTable?.type || "",
      capacity: existingTable?.capacity || 1,
    },
  });

  const onSubmit = async (data: z.infer<typeof tableSchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const url = existingTable
      ? `${process.env.NEXT_PUBLIC_BACK_URL}/tables/${existingTable.id}`
      : `${process.env.NEXT_PUBLIC_BACK_URL}/tables`;

    try {
      const response = await fetch(url, {
        method: existingTable ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Une erreur est survenue.");
        return;
      }

      const result = await response.json();
      setSuccess(result.message || "Table créée avec succès !");
      form.reset();
      onCreate();
    } catch (error) {
      console.error("Erreur lors de la création de la table :", error);
      setError("Une erreur est survenue lors de la création de la table.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
          <h2 className="text-lg font-semibold font-one text-secondary-500 mb-4">
            {existingTable ? `${existingTable.name}` : "Nouvelle table"}
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium font-one text-secondary-500">
                Type (Terrasse, Intérieur, etc.)
              </label>
              <input
                {...form.register("type")}
                className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
              />
              {form.formState.errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium font-one text-secondary-500">
                Nom
              </label>
              <input
                {...form.register("name")}
                className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
              />
              {form.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium font-one text-secondary-500">
                Capacité
              </label>
              <input
                type="number"
                {...form.register("capacity")}
                className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
              />
              {form.formState.errors.capacity && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.capacity.message}
                </p>
              )}
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
                  ? existingTable
                    ? "Modification en cours..."
                    : "Création en cours..."
                  : existingTable
                  ? "Modifier"
                  : "Créer une table"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
