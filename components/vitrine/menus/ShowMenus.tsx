/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MenuProps } from "@/lib/type";
import { useEffect, useState } from "react";

export default function ShowMenus() {
  const [loading, setLoading] = useState(true);

  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState<
    { id: string; name: string; type: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  //! Récupérer les menus depuis l'API
  const fetchCategoriesMenu = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/menu/category`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories de menu :", err);
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/menu/item`, {
        cache: "no-store",
      });
      const data = await res.json();
      setMenus(data);
    } catch (err) {
      console.error("Erreur lors du chargement des menus :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesMenu();
    fetchMenus();
  }, []);

  const filteredMenus = selectedCategory
    ? menus.filter((menu: any) => menu.categoryId === selectedCategory)
    : menus;

  return (
    <div className="py-4 px-20">
      {/* Navbar des catégories */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 border border-gray-400 font-one duration-200 ${
            selectedCategory === null
              ? "bg-secondary-500 border-secondary-500 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-noir-700"
          }`}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 border border-gray-400 font-one duration-200 ${
              selectedCategory === cat.id
                ? "bg-secondary-500 border-secondary-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-noir-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Affichage des menus */}
      {loading ? (
        <p className="font-one text-gray-600 text-center animate-pulse">
          Chargement des menus...
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMenus.map((menu: MenuProps) => (
            <div
              key={menu.id}
              className="flex flex-col gap-4 border p-4 w-[400px] shadow hover:shadow-md transition"
            >
              <h3 className="text-lg font-one text-secondary-500 font-semibold">
                {menu.title}
              </h3>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-gray-600">{menu.description}</p>
                <p className="text-xs text-gray-500 italic">
                  {menu.ingredients.map((ingredient, index) => (
                    <span key={index}>
                      {ingredient}
                      {index < menu.ingredients.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              </div>
              <p className="mt-2 text-right text-noir-700 font-one font-bold">
                {menu.price} €
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
