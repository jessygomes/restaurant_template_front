import { Suspense } from "react";
// import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";
import { currentUser } from "@/lib/auth.server";

export default async function ConnexionAdmin() {
  const user = await currentUser();
  console.log("User in ConnexionAdmin:", user);
  // if (!user || user.role !== "admin") {
  //   redirect("/");
  // }

  return (
    <section className="">
      <div
        className="relative hidden sm:flex h-screen w-full bg-cover bg-center items-center justify-center"
        style={{
          backgroundImage: "url('/images/hero.png')",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
        {/* Ajoutez ici d'autres éléments si nécessaire */}
        <div className="z-20">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
