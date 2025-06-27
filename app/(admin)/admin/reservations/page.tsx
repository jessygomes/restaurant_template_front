import ReservationList from "@/components/admin/Réservation/ReservationList";
import { currentUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";

//! RESERVATIONS :
// - Liste des réservations par jour
// - Bouton pour créer une réservation
// - Bouton pour confirmer, annuler ou modifier une réservation
// - Assigner une ou plusieurs tables à une réservation
// - Filtre par date, statut, client, etc.
// - ...
export default async function ReservationAdmin() {
  const user = await currentUser();

  if (
    !user ||
    typeof user !== "object" ||
    !("userId" in user) ||
    typeof user.userId !== "string"
  ) {
    redirect("/");
  }

  return (
    <div className="py-20 px-20 bg-white flex justify-center items-center">
      <section className=" w-full bg-white h-screen">
        <ReservationList userId={user.userId} />
      </section>
    </div>
  );
}
