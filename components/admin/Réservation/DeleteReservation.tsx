import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { ReservationListItem } from "@/lib/type";
import React, { useState } from "react";

export default function DeleteReservation({
  reservation,
  onDelete,
  setIsOpen,
}: {
  reservation?: ReservationListItem;
  onDelete: () => void;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState("");

  if (!reservation) {
    return (
      <div className="text-red-500">
        Aucune reservation sélectionnée pour la suppression.
      </div>
    );
  }

  const handleDelete = async () => {
    if (!reservation.id) return;

    setLoading(true);
    setError("");

    console.log("Suppression de la réservation :", reservation.id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/reservation/delete/${reservation.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la suppression");
      }

      setSuccess("Table supprimée avec succès");
      if (setIsOpen) setIsOpen(false);
      onDelete(); // pour refresh
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const date: string = new Date(reservation.date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const hour: string = new Date(reservation.arrivalTime).toLocaleTimeString(
    "fr-FR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-xs p-6 w-full max-w-md shadow-lg relative">
          <h2 className="text-lg font-semibold font-one text-secondary-500 mb-4">
            {`Confirmer la suppression : ${date} - ${hour} - ${reservation.client?.lastName}`}
          </h2>

          <p className="text-sm text-noir-500 mb-4">
            Es-tu sûr de vouloir supprimer cette table ? Cette action est
            irréversible.
          </p>

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
              onClick={handleDelete}
              disabled={loading}
              className="w-full text-secondary-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
            >
              {loading ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
