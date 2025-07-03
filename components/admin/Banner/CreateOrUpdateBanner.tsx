import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { BannerProps } from "@/lib/type";
import { bannerSchema } from "@/lib/zod/validator.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function CreateOrUpdateBanner({
  userId,
  onCreate,
  existingBanner,
  setIsOpen = () => {},
}: {
  userId: string;
  onCreate: () => void;
  existingBanner?: BannerProps;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: existingBanner?.title || "",
      link: existingBanner?.link || "",
      image: existingBanner?.image || "",
      startsAt: existingBanner?.startsAt
        ? new Date(existingBanner.startsAt).toISOString().slice(0, 16)
        : "",
      endsAt: existingBanner?.endsAt
        ? new Date(existingBanner.endsAt).toISOString().slice(0, 16)
        : "",
      isActive: existingBanner?.isActive || false,
    },
  });

  const onSubmit = async (data: z.infer<typeof bannerSchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const url = existingBanner
      ? `${process.env.NEXT_PUBLIC_BACK_URL}/banner/${existingBanner.id}`
      : `${process.env.NEXT_PUBLIC_BACK_URL}/banner`;

    try {
      const response = await fetch(url, {
        method: existingBanner ? "PATCH" : "POST",
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

      setSuccess("Bannière créée ou mis à jour avec succès !");
      onCreate();
      setIsOpen(false);
    } catch (error) {
      console.error(
        "Erreur lors de la création ou mise à jour de la bannière :",
        error
      );
      setError(
        "Une erreur est survenue lors de la création ou mise à jour de la bannière."
      );
    } finally {
      toast.success("Bannière créée ou mis à jour avec succès !");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg relative">
          <h2 className="text-lg font-semibold font-one text-secondary-500 mb-4">
            {existingBanner ? `${existingBanner.title}` : "Nouvelle bannière"}
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                Lien (optionnel)
              </label>
              <input
                {...form.register("link")}
                className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
              />
              {form.formState.errors.link && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.link.message}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Début de la période
                </label>
                <input
                  {...form.register("startsAt")}
                  type="datetime-local"
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
                />
                {form.formState.errors.startsAt && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.startsAt.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Fin de la période
                </label>
                <input
                  {...form.register("endsAt")}
                  type="datetime-local"
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
                />
                {form.formState.errors.endsAt && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.endsAt.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center gap-4 w-full p-1 border border-gray-300">
              <label className="block text-sm font-medium font-one text-secondary-500">
                Actif
              </label>
              <input
                type="checkbox"
                {...form.register("isActive")}
                className="w-5 h-5"
              />
              {form.formState.errors.isActive && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.isActive.message}
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
                  ? existingBanner
                    ? "Modification en cours..."
                    : "Création en cours..."
                  : existingBanner
                  ? "Modifier"
                  : "Créer une bannière"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
