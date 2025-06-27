import React from "react";

export default function Section3() {
  return (
    <section className="pb-20 flex flex-col items-center justify-center bg-white">
      <div className="w-full flex flex-col items-center justify-center gap-4 bg-white px-32 pt-14 pb-32">
        <h2 className="text-5xl text-secondary-500 font-one font-bold">
          Bienvenue dans notre restaurant
        </h2>
        <p className="text-center text-secondary-500">
          Découvrez une expérience culinaire unique où chaque plat est préparé
          avec passion et savoir-faire.
        </p>
      </div>

      <div
        className="w-3/4 h-[350px] mx-auto -mt-[100px] bg-blue-300 mb-16 shadow-[15px_15px_0.30000001192092896px_0px_rgba(143,23,40,1.00)]"
        style={{
          backgroundImage: "url('/images/resto.png')",
          backgroundSize: "cover",
        }}
      ></div>

      <div className="flex gap-2 w-3/4 h-[350px] mx-auto">
        <div
          className="relative group flex-1 bg-gray-700 m-1 transition-all duration-300 group-hover:flex-[1] hover:flex-[2] flex flex-col gap-4 items-center justify-center"
          style={{
            backgroundImage: "url('/images/cuisine.png')",
            backgroundSize: "cover",
            boxShadow: "15px 15px 0.3px 0px rgba(26,26,26,0.20)",
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
          <h3 className="text-3xl font-bold font-one uppercase px-8 text-center z-20">
            Service midi & soir
          </h3>
          <p className="text-sm text-center px-8 opacity-0 hidden group-hover:block group-hover:opacity-100 transition-opacity duration-300 z-20">
            Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
            des fois, en ropm deijdesq
          </p>
          <p className="text-sm text-center px-8 opacity-0 hidden group-hover:block group-hover:opacity-100 transition-opacity duration-300 z-20">
            Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
            des fois, en ropm deijdesq
          </p>
        </div>

        {/* Répéter le même principe pour les autres cartes */}
        <div
          className="relative group flex-1 bg-gray-700 m-1 transition-all duration-300 group-hover:flex-[1] hover:flex-[2] flex flex-col gap-4 items-center justify-center"
          style={{
            backgroundImage: "url('/images/priver.png')",
            backgroundSize: "cover",
            boxShadow: "15px 15px 0.3px 0px rgba(26,26,26,0.20)",
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
          <h3 className="text-3xl font-bold font-one uppercase px-8 text-center z-20">
            Privatisation
          </h3>
          <p className="text-sm text-center px-8 opacity-0 hidden group-hover:block group-hover:opacity-100 transition-opacity duration-300 z-20">
            Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
            des fois, en ropm deijdesq
          </p>
          <p className="text-sm text-center px-8 opacity-0 hidden group-hover:block group-hover:opacity-100 transition-opacity duration-300 z-20">
            Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
            des fois, en ropm deijdesq
          </p>
        </div>

        {/* Troisième carte */}
        <div
          className="relative group flex-1 bg-gray-700 m-1 transition-all duration-300 group-hover:flex-[1] hover:flex-[2] flex flex-col gap-4 items-center justify-center"
          style={{
            backgroundImage: "url('/images/priver.png')",
            backgroundSize: "cover",
            boxShadow: "15px 15px 0.3px 0px rgba(26,26,26,0.20)",
          }}
        >
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>
          <h3 className="text-3xl font-bold font-one uppercase px-8 text-center z-20">
            Evénements
          </h3>
          <p className="text-sm text-center px-8 opacity-0 hidden group-hover:block group-hover:opacity-100 transition-opacity duration-300 z-20">
            Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
            des fois, en ropm deijdesq
          </p>
          <p className="text-sm text-center px-8 opacity-0 hidden group-hover:block group-hover:opacity-100 transition-opacity duration-300 z-20">
            Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
            des fois, en ropm deijdesq
          </p>
        </div>
      </div>
    </section>
  );
}
