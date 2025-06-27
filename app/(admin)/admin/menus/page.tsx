import { currentUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";
import React from "react";

//! MENUS :
// - Gérer les MenuCategory (Saisonnier, Signature, etc.)
// - Ajouter/modifier des MenuItem
// - Filtrer par catégorie, disponibilité
// - ...
export default async function MenusAdmin() {
  const user = await currentUser();

  if (user === null || user === undefined) {
    redirect("/");
  }

  return <div>MenusAdmin</div>;
}
