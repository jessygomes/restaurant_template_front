import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { ActusProps } from "@/lib/type";
import { actusSchema } from "@/lib/zod/validator.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function CreateOrUpdateActus({
  userId,
  onCreate,
  existingActu,
  setIsOpen = () => {},
}: {
  userId: string;
  onCreate: () => void;
  existingActu?: ActusProps;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(actusSchema),
    defaultValues: {
      title: existingActu?.title || "",
      content: existingActu?.content || "",
      image: existingActu?.image || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof actusSchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    const url = existingActu
      ? `${process.env.NEXT_PUBLIC_BACK_URL}/actus/${existingActu.id}`
      : `${process.env.NEXT_PUBLIC_BACK_URL}/actus`;

    try {
      const response = await fetch(url, {
        method: existingActu ? "PATCH" : "POST",
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

      setSuccess("Article créé ou mis à jour avec succès !");
      onCreate();
      setIsOpen(false);
    } catch (error) {
      console.error(
        "Erreur lors de la création ou mise à jour de l'article :",
        error
      );
      setError(
        "Une erreur est survenue lors de la création ou mise à jour de l'article."
      );
    } finally {
      toast.success("Article créé ou mis à jour avec succès !");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg relative">
          <h2 className="text-lg font-semibold font-one text-secondary-500 mb-4">
            {existingActu ? `${existingActu.title}` : "Nouvel article"}
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
                Contenu
              </label>
              <textarea
                {...form.register("content")}
                className="w-full mt-1 h-[250px] border border-gray-300 px-3 py-2 text-black text-xs"
              />
              {form.formState.errors.content && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.content.message}
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
                  ? existingActu
                    ? "Modification en cours..."
                    : "Création en cours..."
                  : existingActu
                  ? "Modifier"
                  : "Créer un article"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
