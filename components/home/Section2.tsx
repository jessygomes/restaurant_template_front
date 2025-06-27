import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Section2() {
  return (
    <section className="flex flex-col gap-20 pb-20">
      <div className="w-3/4 mx-auto flex items-center gap-8">
        <article className="w-full flex flex-col gap-10 text-black">
          <div className="">
            <h2 className="text-2xl font-bold font-one mb-4">
              Réserver une table chez nous !
            </h2>
            <p>
              Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
              des fois, en ropm deijdesq et pui normal. Lorem ipsum de flacka
              jdei pou rjdekmj de la fuene evied. Apie que des fois, en ropm
              deijdesq et pui normal.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 font-one">
              Le menu du moment...
            </h2>
            <p>
              Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
              des fois, en ropm deijdesq et pui normal. Lorem ipsum de flacka
              jdei pou rjdekmj de la fuene evied. Apie que des fois, en ropm
              deijdesq et pui normal.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href={"/reservation"} className="w-full text-center">
              <div className="w-full text-secondary-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300">
                Réserver une table
              </div>
            </Link>
            <Link href={"/nos-menus"} className="w-full text-center">
              <div className="w-full text-secondary-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300">
                Carte & Menus
              </div>
            </Link>
          </div>
        </article>
        <div className="w-full">
          <Image
            src="/images/assiette.png"
            alt="Section 2 Image"
            width={400}
            height={300}
            className="w-full h-auto object-cover shadowBox"
          />
        </div>
      </div>

      {/* <div className="w-3/4 mx-auto flex flex-row-reverse items-center gap-8 ">
        <article className="flex flex-col gap-10 text-black w-1/2">
          <div className="">
            <h2 className="text-2xl font-bold font-one mb-4">
              Nos actualités...
            </h2>
            <p>
              Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
              des fois, en ropm deijdesq et pui normal. Lorem ipsum de flacka
              jdei pou rjdekmj de la fuene evied. Apie que des fois, en ropm
              deijdesq et pui normal.
            </p>
          </div>
          <div className="">
            <h2 className="text-2xl font-bold font-one mb-4">
              Nos événements...
            </h2>
            <p>
              Lorem ipsum de flacka jdei pou rjdekmj de la fuene evied. Apie que
              des fois, en ropm deijdesq et pui normal. Lorem ipsum de flacka
              jdei pou rjdekmj de la fuene evied. Apie que des fois, en ropm
              deijdesq et pui normal.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href={"/actus"} className="w-full text-center">
              <div className="w-full text-secondary-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300">
                Voir nos actus
              </div>
            </Link>
            <Link href={"/evenement"} className="w-full text-center">
              <div className="w-full text-secondary-500 font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300">
                Voir nos événements
              </div>
            </Link>
          </div>
        </article>
        <div className="w-1/2">
          <Image
            src="/images/assiette.png"
            alt="Section 2 Image"
            width={400}
            height={300}
            className="w-full h-auto object-cover"
          />
        </div>
      </div> */}
    </section>
  );
}
