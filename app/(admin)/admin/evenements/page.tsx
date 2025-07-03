import EventList from "@/components/admin/Events/EventList";
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
          <EventList userId={user.userId} />
        </div>
      </section>
    </div>
  );
}
