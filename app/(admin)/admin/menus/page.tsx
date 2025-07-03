import MenuList from "@/components/admin/menu/MenuList";
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
          <MenuList userId={user.userId} />
        </div>
      </section>
    </div>
  );
}
