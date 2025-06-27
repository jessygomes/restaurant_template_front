import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { updateUserSchema } from "@/lib/zod/validator.schema";
import { DAYS_FR } from "@/lib/utils/days";
import { UserInfo } from "@/lib/type";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/**
 * Nettoie les heures d'ouverture et de fermeture pour chaque jour de la semaine.
 * Supprime les jours qui n'ont pas d'heures définies.
 * @param rawHours - Les heures brutes à nettoyer.
 * @returns Un objet avec les heures nettoyées.
 */
function cleanHours(
  rawHours: Record<string, { open: string | null; close: string | null } | null>
): Record<string, { open?: string; close?: string }> {
  const cleaned: Record<string, { open?: string; close?: string }> = {};

  for (const [day, value] of Object.entries(rawHours)) {
    if (value && (value.open || value.close)) {
      cleaned[day] = {
        ...(value.open !== null ? { open: value.open } : {}),
        ...(value.close !== null ? { close: value.close } : {}),
      };
    }
  }

  return cleaned;
}

export default function UpdateUser({
  user,
  onCreate,
  setIsOpen,
}: {
  user: UserInfo;
  onCreate: () => void;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  //! State pour les erreurs et succès
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  //! State pour les jours fermés
  const [closedDays, setClosedDays] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    daysOfWeek.forEach((day) => {
      const dayData = user.hours?.[day];
      initial[day] = !dayData?.open && !dayData?.close;
    });
    return initial;
  });

  //! Formulaire
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      restaurantName: user.restaurantName || "",
      hours: cleanHours(user?.hours || {}),
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
      postalCode: user?.postalCode || "",
    },
  });

  //! Fonction de soumission du formulaire
  const onSubmit = async (data: z.infer<typeof updateUserSchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    console.log("Data to submit:", data);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/user/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Une erreur est survenue.");
        return;
      }

      setSuccess("Vos informations ont été mises à jour avec succès.");
      onCreate();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setError("Une erreur est survenue lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  //! Affichage du formulaire
  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-xs p-6 w-[700px] shadow-lg relative">
          <h2 className="text-lg font-semibold font-one text-secondary-500 mb-2">
            Modifier mes informations
          </h2>

          <form
            onSubmit={form.handleSubmit(onSubmit, (formErrors) => {
              console.log("❌ Erreurs dans le formulaire :", formErrors);
              setError("Veuillez corriger les erreurs dans le formulaire.");
            })}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium font-one text-secondary-500">
                Nom du restaurant
              </label>
              <input
                {...form.register("restaurantName")}
                className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
              />
              {form.formState.errors.restaurantName && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.restaurantName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Email
                </label>
                <input
                  {...form.register("email")}
                  disabled
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm bg-gray-300"
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
            </div>

            <div>
              <label className="block text-sm font-medium font-one text-secondary-500">
                Horaire
              </label>
              {daysOfWeek.map((day) => {
                return (
                  <div
                    key={day}
                    className="grid grid-cols-5 gap-2 items-center mb-2 "
                  >
                    <p className="text-sm text-gray-700 col-span-1">
                      {DAYS_FR[day] ?? day}
                    </p>

                    <input
                      type="time"
                      {...form.register(`hours.${day}.open`)}
                      disabled={closedDays[day]}
                      className="border border-gray-300 px-2 py-1 text-sm text-black col-span-1"
                    />

                    <input
                      type="time"
                      {...form.register(`hours.${day}.close`)}
                      disabled={closedDays[day]}
                      className="border border-gray-300 px-2 py-1 text-sm text-black col-span-1"
                    />

                    <label className="col-span-2 flex items-center gap-2 text-sm text-gray-600 ">
                      <input
                        type="checkbox"
                        checked={closedDays[day]}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setClosedDays((prev) => ({
                            ...prev,
                            [day]: checked,
                          }));
                          if (checked) {
                            form.setValue(`hours.${day}.open`, "");
                            form.setValue(`hours.${day}.close`, "");
                          }
                        }}
                      />
                      Fermé
                    </label>
                  </div>
                );
              })}
              {/* {form.formState.errors.hours && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.hours.message}
                </p>
              )} */}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Adresse
                </label>
                <input
                  {...form.register("address")}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
                />
                {form.formState.errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Ville
                </label>
                <input
                  {...form.register("city")}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
                />
                {form.formState.errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium font-one text-secondary-500">
                  Code Postal
                </label>
                <input
                  {...form.register("postalCode")}
                  className="w-full mt-1 border border-gray-300 px-3 py-2 text-black text-sm"
                />
                {form.formState.errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />

            <div className="flex gap-4">
              <button
                onClick={() => setIsOpen && setIsOpen(false)}
                className="w-full text-noir-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-noir-500 hover:border-noir-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full text-secondary-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
              >
                {loading ? "Chargement..." : "Mettre à jour"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
