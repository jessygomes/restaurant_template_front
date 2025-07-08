"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();

  const navRef = useRef<HTMLUListElement>(null);

  const links = [
    { href: "/notre-histoire", label: "Notre Histoire" },
    { href: "/nos-menus", label: "Nos Menus" },
    { href: "/evenements", label: "Evénements" },
    { href: "/actus", label: "Actus" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    setIsScrolled(offset > 10); // active à partir de 10px de scroll
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`flex justify-between items-center py-4 px-20 transition-all duration-300 ${
          isScrolled ? "bg-secondary-500 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        {" "}
        <Link
          href={"/"}
          className="font-one uppercase font-bold text-3xl text-white tracking-widest hover:text-white/70 transition-all duration-300"
        >
          Gleamy Food
        </Link>
        <ul ref={navRef} className="flex gap-8 items-center">
          {links.map((link, index) => {
            const isActive = pathname === link.href;

            return (
              <li
                key={index}
                className={`${
                  isActive
                    ? "active font-three text-white font-bold"
                    : "font-thin"
                } pb-1 text-white text-sm font-three pt-1 px-2 tracking-widest hover:text-white/70 transition-all duration-300`}
              >
                <Link href={link.href}>{link.label}</Link>
              </li>
            );
          })}
          <Link href={"/reservation"}>
            <div className="text-white font-one tracking-wide text-xs border px-4 py-2 hover:bg-secondary-500 transition-all ease-in-out duration-300">
              Réserver une table
            </div>
          </Link>
        </ul>
      </nav>
    </>
  );
}
