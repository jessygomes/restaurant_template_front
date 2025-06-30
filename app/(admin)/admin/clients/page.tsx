import ClientList from "@/components/admin/Clients/ClientList";
import { currentUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";
import React from "react";

//! CLIENTS :
// - Liste des clients
// - Voir leur historique de réservation
// - Ajouter un nouveau client manuellement
// - ...
export default async function ClientsAdmin() {
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
      <section className="w-full h-screen flex flex-col bg-white">
        <div>
          <ClientList userId={user.userId} />
        </div>
      </section>
    </div>
  );
}
