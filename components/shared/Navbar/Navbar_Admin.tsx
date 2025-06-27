"use client";
// import { useUser } from "@/components/auth/Context/UserContext";
import { LogoutBtn } from "@/components/auth/LogoutBtn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

export default function NavbarApp() {
  // const user = useUser();
  const pathname = usePathname();

  const navRef = useRef<HTMLUListElement>(null);

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/reservations", label: "Réservations" },
    { href: "/admin/tables", label: "Tables" },
    { href: "/admin/menus", label: "Menus" },
    { href: "/admin/clients", label: "Clients" },
    { href: "/admin/evenements", label: "Evénements" },
    { href: "/admin/actus", label: "Actualités" },
    { href: "/admin/banners", label: "Bannières" },
    { href: "/admin/parametres", label: "Paramètres" },
  ];

  return (
    <nav className="flex justify-between items-center py-4 px-20 bg-secondary-500">
      {" "}
      <Link
        href={"/"}
        className="font-two uppercase font-bold text-xl text-white"
      >
        {"Gleamy Food"}
      </Link>
      <ul ref={navRef} className="flex justify-center items-center gap-8">
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
        <li className="relative">
          <button
            onClick={toggleMenu}
            className="cursor-pointer items-center text-white hover:text-white/70 transition duration-300"
          >
            {/* <CgProfile size={20} /> */}
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-4 p-2 w-[300px] bg-noir-700 text-white rounded shadow-lg z-50 flex flex-col gap-2">
              <Link
                href="/mon-compte"
                className="px-4 py-2 text-xs hover:bg-noir-500 transition-colors"
              >
                Paramètres du compte
              </Link>
              <Link
                href="/mon-compte"
                className="px-4 py-2 text-xs hover:bg-noir-500 transition-colors"
              >
                Mes
              </Link>
              <LogoutBtn>
                <span className="block text-xs w-full text-left transition-colors">
                  Déconnexion
                </span>
              </LogoutBtn>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
