import React from "react";

export default function HeroSection() {
  return (
    <div>
      <h1 className="flex flex-col gap-4 text-7xl backdrop-blur-md border-2 p-6 font-one font-bold text-center text-white shadow-2xl">
        <span className="text-[20px] font-one font-normal">Restaurant</span>
        Gleamy Food
      </h1>
      <div className="bg-white w-[400px] text-xl py-2 mx-auto text-center text-secondary-500 font-one shadow-2xl rounded-b-2xl">
        HAPPY HOURS 18H - 20H
      </div>
    </div>
  );
}
