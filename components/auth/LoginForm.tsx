"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { userLoginSchema } from "@/lib/zod/validator.schema";
import { createSession } from "@/lib/session";
import { CardWrapper } from "./Card/CardWrapper";
import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userLoginSchema>) => {
    setError("");
    setSuccess("");
    setIsPending(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      const infos = await response.json();

      if (infos.error) {
        setError(
          infos.message ||
            infos.error ||
            "Une erreur est survenue lors de l'inscription."
        );
        setIsPending(false);
        return;
      }

      setSuccess("Connexion réussie !");
      setIsPending(false);

      console.log("Infos de l'utilisateur connecté :", infos);

      // Créez une session pour l'utilisateur connecté
      await createSession(infos.userId);

      // Appeler l'API pour récupérer l'utilisateur authentifié
      // const userResponse = await fetch("/api/auth");

      // if (!userResponse.ok) {
      //   throw new Error("Impossible de récupérer l'utilisateur authentifié.");
      // }

      // const user = await userResponse.json();
      // console.log("Utilisateur authentifié :", user);

      // Redirigez l'utilisateur vers la page d'accueil
      router.push("/admin");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setError("Impossible de se connecter. Veuillez réessayer plus tard.");
      return;
    }
  };

  return (
    <div className="bg-gradient-to-l from-secondary-500 to-secondary-900 p-8 shadowBox">
      <h2 className="text-center font-one text-white text-3xl">
        Gleamy Food Admin
      </h2>
      <CardWrapper headerLabel="">
        <form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative text-white"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1 font-one">
              <label htmlFor="mail">Email</label>
              <input
                id="mail"
                placeholder="johndoe@domaine.com"
                type="text"
                required
                className="bg-white/30 py-2 px-4"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 font-krub">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                placeholder="Mot de passe"
                type="password"
                required
                className="bg-white/30 py-2 px-4"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <FormError message={error} />
            <FormSuccess message={success} />

            <button
              className="cursor-pointer w-full text-white font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-noir-500 hover:border-noir-500 hover:text-white transition-all ease-in-out duration-300"
              type="submit"
              disabled={isPending}
            >
              SE CONNECTER &rarr;
            </button>
          </div>
        </form>
      </CardWrapper>
      <div className="relative flex flex-col gap-2 justify-center items-center">
        {/* <p className="text-white text-sm text-center font-two mt-2">
          Pas encore de compte ?{" "}
          <Link
            className="text-tertiary-400 hover:text-tertiary-500 transition-all ease-in-out duration-150"
            href="/inscription"
          >
            Créer un compte
          </Link>
        </p> */}
        {/* <div className="h-[1px] bg-white w-[300px]"></div> */}
        <Link
          className="relative text-center text-white text-xs hover:text-white/70 transition-all ease-in-out duration-150"
          href="/motdepasseoublie"
        >
          Mot de passe oublié ?
        </Link>
      </div>
    </div>
  );
}
