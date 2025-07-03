import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { EventProps } from "@/lib/type";
import { eventSchema } from "@/lib/zod/validator.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateOrUpdateEvent({
  userId,
  onCreate,
  existingEvent,
  setIsOpen = () => {},
}: {
  userId: string;
  onCreate: () => void;
  existingEvent?: EventProps;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: existingEvent?.title || "",
      description: existingEvent?.description || "",
      date: existingEvent?.date || "",
      image: existingEvent?.image || "",
      banner: existingEvent?.banner || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof eventSchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const url = existingEvent
      ? `${process.env.NEXT_PUBLIC_BACK_URL}/event/${existingEvent.id}`
      : `${process.env.NEXT_PUBLIC_BACK_URL}/event`;

    try {
      const response = await fetch(url, {
        method: existingEvent ? "PATCH" : "POST",
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

      setSuccess("Événement créé ou mis à jour avec succès !");
      onCreate();
      setIsOpen(false);
    } catch (error) {
      console.error(
        "Erreur lors de la création ou mise à jour de l'événement :",
        error
      );
      setError(
        "Une erreur est survenue lors de la création ou mise à jour de l'événement."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
          <h2 className="text-lg font-semibold font-one text-secondary-500 mb-4">
            {existingEvent ? `${existingEvent.title}` : "Nouvel événement"}
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Titre
                </label>
                <input
                  {...form.register("title")}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Date
                </label>
                <input
                  {...form.register("date")}
                  type="datetime-local"
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
                />
                {form.formState.errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium font-one text-secondary-500">
                Description
              </label>
              <textarea
                {...form.register("description")}
                className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-xs"
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium font-one text-secondary-500">
                banner (phrase d&apos;accroche)
              </label>
              <input
                {...form.register("banner")}
                className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
              />
              {form.formState.errors.banner && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.banner.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium font-one text-secondary-500">
                Image (optionnelle)
              </label>
              <input
                {...form.register("image")}
                className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-xs"
              />
              {form.formState.errors.image && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.image.message}
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
                  ? existingEvent
                    ? "Modification en cours..."
                    : "Création en cours..."
                  : existingEvent
                  ? "Modifier"
                  : "Créer un événement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
