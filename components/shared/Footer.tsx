import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="px-4 pt-20 sm:px-20 bg-noir-500 flex flex-col justify-between">
      <div className="flex items-center justify-center gap-4 mb-8">
        <h3 className="text-white text-4xl font-one font-bold whitespace-nowrap">
          Gleamy Food
        </h3>
        <div className="bg-white/50 w-full h-[1px]"></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 text-white">
        <ul className="font-two flex flex-col gap-4 text-sm">
          <li className="text-white uppercase font-bold font-one">
            Navigation
          </li>
          <li>
            <Link
              href={"/"}
              className="hover:text-white/70 duration-300 text-xs"
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              href={"/notre-histoire"}
              className="hover:text-white/70 duration-300 text-xs"
            >
              Notre Histoire
            </Link>
          </li>
          <li>
            <Link
              href={"/nos-menus"}
              className="hover:text-white/70 duration-300 text-xs"
            >
              Nos menus
            </Link>
          </li>
          <li>
            <Link
              href={"/evenements"}
              className="hover:text-white/70 duration-300 text-xs"
            >
              Evénements
            </Link>
          </li>
          <li>
            <Link
              href={"/actus"}
              className="hover:text-white/70 duration-300 text-xs"
            >
              Actualités
            </Link>
          </li>
          <li>
            <Link
              href={"/reservation"}
              className="hover:text-white/70 duration-300 text-xs"
            >
              Réserver une table
            </Link>
          </li>
        </ul>

        {/* <ul className="font-two flex flex-col gap-4 text-sm">
          <li className="text-tertiary-500 uppercase font-bold">
            Qui sommes-nous ?
          </li>
          <li>
            <Link
              href={"/a-propos"}
               className="hover:text-white/70 duration-300 text-xs"
            >
              A Propos de INKSTUDIO
            </Link>
          </li>
          <li>
            <Link
              href={"https://www.inthegleam.com/"}
              target="_blank"
               className="hover:text-white/70 duration-300 text-xs"
            >
              Project by inTheGleam
            </Link>
          </li>
        </ul> */}

        <ul className="font-two flex flex-col gap-4 text-sm">
          <li className="text-white uppercase font-bold font-one">Légales</li>
          <li>
            <Link
              href={"/mentions-legales"}
              className="hover:text-white/70 duration-300 text-xs"
            >
              Mentions Légales
            </Link>
          </li>
          <li>
            <Link
              href={"/politique-de-confidentialite"}
              className="hover:text-white/70 duration-300 text-xs"
            >
              Politique de confidentialité
            </Link>
          </li>
          <li>
            <Link
              href={"/cgu-cgv"}
              className="hover:text-white/70 duration-300 text-xs"
            >
              CGU / CGV
            </Link>
          </li>
        </ul>

        <ul className="font-two flex flex-col gap-4 text-sm">
          <li className="text-white uppercase font-bold font-one">Contact</li>
          <li>
            <Link
              href={"/contactez-nous"}
              className="hover:text-white/70 duration-300 text-xs"
            >
              Contactez-nous
            </Link>
          </li>
          {/* <li>
            <Link
              href={"/politique-de-confidentialite"}
               className="hover:text-white/70 duration-300 text-xs"
            >
              Politique de confidentialité
            </Link>
          </li>
          <li>
            <Link
              href={"/cgu-cgv"}
               className="hover:text-white/70 duration-300 text-xs"
            >
              CGU / CGV
            </Link>
          </li> */}
        </ul>
      </div>

      <div className="flex items-center justify-center gap-1 pt-20 pb-4">
        <p className="text-white font-two text-[10px]">
          2025 Restaurant Template © - All rights reserved - Website by
        </p>
        <Link
          href={"https://www.inthegleam.com/"}
          target="_blank"
          className=" text-white font-two font-bold uppercase text-xs hover:text-white/70 duration-300"
        >
          inTheGleam
        </Link>
      </div>
    </footer>
  );
}
