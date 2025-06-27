import Dashboard from "@/components/admin/Dashboard";
import { currentUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";
import React from "react";

//! DASHBOARD :
// Résumé rapide :
// - Prochaines réservations
// - Nombre de couverts du jour
// - Créneaux libres/restants
// - ...
export default async function Admin() {
  const user = await currentUser();

  console.log("User in Admin Dashboard:", user);

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
        <Dashboard userId={user.id} />
      </section>
    </div>
  );
}
