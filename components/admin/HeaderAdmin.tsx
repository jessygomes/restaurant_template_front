import React from "react";
import Link from "next/link";
import NavbarApp from "../shared/Navbar/Navbar_Admin";
// import NavMobile from "./Navbar/NavMobile";

export default function HeaderAdmin() {
  return (
    <>
      {" "}
      <div className="hidden lg:block">
        <NavbarApp />
      </div>
      <div className="sm:hidden px-4 pt-8 rounded-2xl flex justify-between items-center mx-2">
        <Link
          href={"/dashboard"}
          className="text-xl font-one font-bold text-white "
        >
          InkStudio
        </Link>
        {/* <NavMobile /> */}
      </div>
    </>
  );
}
