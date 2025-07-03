"use client";
import { CategoryProps, MenuProps } from "@/lib/type";
import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { menuSchema } from "@/lib/zod/validator.schema";
import { getSessionToken } from "@/lib/session";
import { toast } from "sonner";
import { AiOutlineDelete } from "react-icons/ai";

export default function CreateOrUpdateMenu({
  userId,
  onCreate,
  existingMenu,
  setIsOpen = () => {},
  categories,
}: {
  userId: string;
  onCreate: () => void;
  existingMenu?: MenuProps;
  setIsOpen?: (isOpen: boolean) => void;
  categories?: CategoryProps[];
}) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof menuSchema>>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      title: existingMenu?.title || "",
      description: existingMenu?.description || "",
      price: existingMenu?.price || 1,
      image: existingMenu?.image || "",
      ingredients: existingMenu?.ingredients?.map((i) => ({ value: i })) || [
        { value: "" },
      ],
      available: existingMenu?.available || true,
      categoryId: existingMenu?.categoryId || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const onSubmit = async (data: z.infer<typeof menuSchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    console.log("Données du formulaire :", data);

    const url = existingMenu
      ? `${process.env.NEXT_PUBLIC_BACK_URL}/menu/item/${existingMenu.id}`
      : `${process.env.NEXT_PUBLIC_BACK_URL}/menu/item`;

    const token = await getSessionToken();

    try {
      const response = await fetch(url, {
        method: existingMenu ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          ingredients: data.ingredients.map((i) => i.value), // ← transforme [{ value: "Tomate" }] → ["Tomate"]
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Une erreur est survenue.");
        return;
      }

      setSuccess("Menu créé ou mis à jour avec succès !");
      onCreate();
      setIsOpen(false);
    } catch (err) {
      console.error("Erreur lors de la création ou mise à jour du menu :", err);
      setError("Une erreur est survenue. Veuillez réessayer plus tard.");
    } finally {
      toast.success(success || "Menu créé ou mis à jour avec succès !");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg relative">
          <h2 className="text-lg font-semibold font-one text-secondary-500 mb-4">
            {existingMenu ? `${existingMenu.title}` : "Nouveau menu"}
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Titre
                </label>
                <input
                  {...form.register("title")}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-xs"
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Prix
                </label>
                <input
                  type="number"
                  {...form.register("price")}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-xs"
                />
                {form.formState.errors.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Catégorie
                </label>
                <select
                  {...form.register("categoryId")}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-xs"
                >
                  <option value="">-- Sélectionner une catégorie --</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.type})
                    </option>
                  ))}
                </select>
                {form.formState.errors.categoryId && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.categoryId.message}
                  </p>
                )}
              </div>
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
                Ingrédients
              </label>

              <div className="grid grid-cols-2 gap-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mt-1">
                    <input
                      {...form.register(`ingredients.${index}.value`)}
                      className="w-full border border-gray-300 px-3 py-2 text-black text-xs"
                      placeholder={`Ingrédient #${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="cursor-pointer text-red-500 text-xs font-bold"
                    >
                      <AiOutlineDelete
                        size={20}
                        className="hover:text-secondary-500"
                      />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => append({ value: "" })}
                className="cursor-pointer font-one mt-2 py-1 px-2 text-xs font-bold bg-secondary-500 hover:bg-secondary-700 text-white"
              >
                + Ajouter un ingrédient
              </button>

              {form.formState.errors.ingredients && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.ingredients?.message}
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
                  ? existingMenu
                    ? "Modification en cours..."
                    : "Création en cours..."
                  : existingMenu
                  ? "Modifier"
                  : "Créer le plat"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
