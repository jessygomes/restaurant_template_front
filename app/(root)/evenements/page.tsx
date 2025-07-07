import ShowEvents from "@/components/vitrine/events/ShowEvents";
import React from "react";

export default function Events() {
  return (
    <div className="bg-white flex flex-col gap-10">
      <div
        className="relative hidden sm:flex h-[400px] w-full bg-cover bg-center items-center justify-center"
        style={{
          backgroundImage: "url('/images/event.png')",
          backgroundSize: "cover",
        }}
      >
        {/* Overlay noir par-dessus l’image */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>

        {/* Contenu visible par-dessus l’overlay */}
        <div className="relative z-20">
          <div className="fex flex-col justify-center items-center">
            <h1 className="flex flex-col gap-4 text-5xl border-2 p-6 font-one font-bold text-center text-white backdrop-blur-xl shadow-2xl">
              EVENEMENTS
            </h1>
            <div className="bg-white w-[200px] mx-auto text-center text-secondary-500 font-one shadow-2xl rounded-b-2xl">
              Gleamy Events
            </div>
          </div>
        </div>
      </div>

      <div className="pb-10">
        <ShowEvents />
      </div>

      {/* <ReserveTableForm /> */}
    </div>
  );
}
