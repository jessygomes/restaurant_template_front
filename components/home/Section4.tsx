import Link from "next/link";
import React from "react";

export default function Section4() {
  return (
    <section className="pb-44 flex flex-col items-center justify-center bg-white">
      <div className="w-full flex flex-col items-center justify-center gap-4 bg-gradient-to-l from-noir-500 via-noir-500 to-noir-800 px-32 pt-14 pb-32">
        <h2 className="text-5xl font-one font-bold">Notre cave à vin</h2>
        <p className="text-center">
          Découvrez une expérience culinaire unique où chaque plat est préparé
          avec passion et savoir-faire.
        </p>
      </div>

      <div
        className="w-3/4 h-[350px] mx-auto -mt-[100px] bg-blue-300 mb-16 shadow-[30px_30px_0px_0px_rgba(26,26,26,1.00)]"
        style={{
          backgroundImage: "url('/images/vin.png')",
          backgroundSize: "cover",
        }}
      ></div>

      <div className="flex gap-2 w-3/4 h-[350px] mx-auto">
        <div className="relative group flex-1 bg-gradient-to-l from-noir-500 to-noir-800 m-1 flex flex-col gap-8 items-center justify-center">
          <p className="text-sm text-center px-8 z-20">
            Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
            des fois, en ropm deijdesq
          </p>
          <p className="text-sm text-center px-8 z-20">
            Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
            des fois, en ropm deijdesq
          </p>
          <Link href={"/vins"} className="w-2/4 text-center">
            <div className="w-full text-white font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300">
              Acheter mon vin
            </div>
          </Link>
        </div>

        {/* Répéter le même principe pour les autres cartes */}
        <div
          className="relative group flex-2 bg-gray-700 m-1 flex flex-col gap-4 items-center justify-center"
          style={{
            backgroundImage: "url('/images/degust.png')",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
          <h3 className="text-3xl font-bold font-one px-8 text-center z-20">
            Soirée dégustation & Achat à emporter
          </h3>
        </div>
      </div>
    </section>
  );
}
