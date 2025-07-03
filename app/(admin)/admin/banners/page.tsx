import BannerList from "@/components/admin/Banner/BannerList";
import { currentUser } from "@/lib/auth.server";
import { redirect } from "next/navigation";
import React from "react";

export default async function BannersAdmin() {
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
          <BannerList userId={user.userId} />
        </div>
      </section>
    </div>
  );
}
