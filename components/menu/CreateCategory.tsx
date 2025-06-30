"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { categorySchema } from "@/lib/zod/validator.schema";
import { toast } from "sonner";
import { FormError } from "../auth/FormError";
import { FormSuccess } from "../auth/FormSuccess";
import { getSessionToken } from "@/lib/session";

export default function CreateCategory({
  userId,
  onCreate,
  setIsOpen = () => {},
}: {
  userId: string;
  onCreate: () => void;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "Saisonnier",
    },
  });

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = await getSessionToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/menu/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...data,
            userId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Une erreur est survenue.");
        return;
      }

      setSuccess("Catégorie créée avec succès");
      setIsOpen(false);
      onCreate(); // pour refresh
    } catch (error) {
      console.error("Erreur lors de la création de la table :", error);
      setError("Une erreur est survenue lors de la création de la catégorie.");
    } finally {
      toast.success(success || "Catégorie créée avec succès");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
          <h2 className="text-lg font-semibold font-one text-secondary-500 mb-4">
            Nouvelle catégorie
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                Type{" "}
                <span className="text-xs text-gray-600">
                  (Pour des plats de Saison ? Plats Signature ? des suggestions
                  ?)
                </span>
              </label>
              <select
                {...form.register("type")}
                className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
              >
                <option value="Saisonnier">Saisonnier</option>
                <option value="Signature">Signature</option>
                <option value="Suggestion">Suggestion</option>
              </select>
              {form.formState.errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.type.message}
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
                {loading ? "Création..." : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
