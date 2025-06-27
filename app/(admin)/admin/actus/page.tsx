import { currentUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";
import React from "react";

export default async function ActusAdmin() {
  const user = await currentUser();
  if (user === null || user === undefined) {
    redirect("/");
  }

  return <div>ActusAdmin</div>;
}
