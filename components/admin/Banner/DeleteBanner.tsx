import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { BannerProps } from "@/lib/type";
import React, { useState } from "react";
import { toast } from "sonner";

export default function DeleteBanner({
  banner,
  onDelete,
  setIsOpen = () => {},
}: {
  banner?: BannerProps;
  onDelete: () => void;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | undefined>("");
  const [error, setError] = useState("");

  if (!banner) {
    return (
      <div className="text-red-500">
        Aucune bannière sélectionnée pour la suppression.
      </div>
    );
  }

  const handleDelete = async () => {
    if (!banner.id) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/banner/${banner.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de la suppression");
      }

      setSuccess("Bannière supprimée avec succès");
      setIsOpen(false);
      onDelete(); // pour refresh
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      toast.success("Bannière supprimée avec succès");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
          <h2 className="text-lg font-semibold font-one text-secondary-500 mb-4">
            {`Confirmer la suppression : ${banner.title}`}
          </h2>

          <p className="text-sm text-noir-500 mb-4">
            Es-tu sûr de vouloir supprimer cette bannière ? Cette action est
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
