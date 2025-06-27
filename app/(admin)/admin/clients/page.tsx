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

  if (user === null || user === undefined) {
    redirect("/");
  }

  return <div>ClientsAdmin</div>;
}
