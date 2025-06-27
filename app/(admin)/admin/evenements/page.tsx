import { currentUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";
import React from "react";

//! EVENTS :
// - Liste des events
// - Créer un nouvel event
// - Modifier un event existant
// - Filtrer par date, type d'event, statut
// - ...
export default async function EventsAdmin() {
  const user = await currentUser();

  if (user === null || user === undefined) {
    redirect("/");
  }

  return <div>EventsAdmin</div>;
}
