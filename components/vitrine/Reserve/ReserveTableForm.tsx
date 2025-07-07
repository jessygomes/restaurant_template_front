"use client";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { reservationClientSchema } from "@/lib/zod/validator.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function ReserveTableForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof reservationClientSchema>>({
    resolver: zodResolver(reservationClientSchema),
    defaultValues: {
      date: "",
      arrivalTime: "",
      guests: 1,
      client: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof reservationClientSchema>) => {
    console.log("Form data:", data);
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/reservation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la réservation");
      }

      // const result = await response.json();
      setSuccess(
        "Réservation réussie ! Vous allez recevoir un email de confirmation."
      );
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4 px-4 sm:px-20">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 sm:w-2/4 mx-auto"
      >
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-base font-medium font-one text-secondary-500">
              Date
            </label>
            <input
              type="date"
              {...form.register("date")}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-noir-500"
              placeholder="Date de réservation"
            />
            {form.formState.errors.date && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-base font-medium font-one text-secondary-500">
              Heure d’arrivée
            </label>
            <input
              type="time"
              {...form.register("arrivalTime")}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-noir-500"
            />
            {form.formState.errors.arrivalTime && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.arrivalTime.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-base font-medium font-one text-secondary-500">
              Nombre de couverts
            </label>
            <input
              type="number"
              {...form.register("guests", { valueAsNumber: true })}
              className="w-full border border-gray-300 px-3 py-2 text-sm text-noir-500"
            />
            {form.formState.errors.guests && (
              <p className="text-red-500 text-xs">
                {form.formState.errors.guests.message}
              </p>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-medium font-one text-secondary-500">
                Prénom
              </label>
              <input
                type="text"
                {...form.register("client.firstName")}
                className="w-full border border-gray-300 px-3 py-2 text-sm text-noir-500"
              />
            </div>
            <div>
              <label className="block text-base font-medium font-one text-secondary-500">
                Nom
              </label>
              <input
                type="text"
                {...form.register("client.lastName")}
                className="w-full border border-gray-300 px-3 py-2 text-sm text-noir-500"
              />
            </div>
            <div>
              <label className="block text-base font-medium font-one text-secondary-500">
                Email
              </label>
              <input
                type="email"
                {...form.register("client.email")}
                className="w-full border border-gray-300 px-3 py-2 text-sm text-noir-500"
              />
            </div>
            <div>
              <label className="block text-base font-medium font-one text-secondary-500">
                Téléphone
              </label>
              <input
                type="tel"
                {...form.register("client.phone")}
                className="w-full border border-gray-300 px-3 py-2 text-sm text-noir-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 w-full bg-secondary-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-700 hover:border-secondary-700 hover:text-white transition-all ease-in-out duration-300 cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "En cours..." : "Réserver"}
        </button>
      </form>
    </div>
  );
}
