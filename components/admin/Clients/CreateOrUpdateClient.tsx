"use client";
import { Client } from "@/lib/type";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { clientSchema } from "@/lib/zod/validator.schema";
import { toast } from "sonner";

export default function CreateOrUpdateClient({
  userId,
  onCreate,
  existingClient,
  setIsOpen = () => {},
}: {
  userId: string;
  onCreate: () => void;
  existingClient?: Client | null;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: existingClient?.firstName || "",
      lastName: existingClient?.lastName || "",
      phone: existingClient?.phone || "",
      email: existingClient?.email || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof clientSchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    console.log("USER ID :", userId);
    console.log("Données du formulaire :", data, userId);

    const url = existingClient
      ? `${process.env.NEXT_PUBLIC_BACK_URL}/client/update/${existingClient.id}`
      : `${process.env.NEXT_PUBLIC_BACK_URL}/client/create`;

    try {
      const response = await fetch(url, {
        method: existingClient ? "PATCH" : "POST",
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
      setSuccess(result.message || "Client créé avec succès !");
      form.reset();
      onCreate();
    } catch (error) {
      console.error("Erreur lors de la création du client :", error);
      setError("Une erreur est survenue lors de la création du client.");
    } finally {
      toast.success(
        existingClient
          ? "Client modifié avec succès !"
          : "Client créé avec succès !"
      );
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
          <h2 className="text-lg font-semibold font-one text-secondary-500 mb-4">
            {existingClient
              ? `${existingClient.firstName} ${existingClient.lastName}`
              : "Nouveau client"}
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Prénom
                </label>
                <input
                  {...form.register("firstName")}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
                />
                {form.formState.errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Nom
                </label>
                <input
                  {...form.register("lastName")}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
                />
                {form.formState.errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium font-one text-secondary-500">
                Email
              </label>
              <input
                {...form.register("email")}
                className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium font-one text-secondary-500">
                Téléphone
              </label>
              <input
                {...form.register("phone")}
                className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
              />
              {form.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.phone.message}
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
                  ? existingClient
                    ? "Modification en cours..."
                    : "Création en cours..."
                  : existingClient
                  ? "Modifier"
                  : "Créer un client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
