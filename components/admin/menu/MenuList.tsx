"use client";
import { MenuProps } from "@/lib/type";
import { useEffect, useState } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import CreateCategory from "./CreateCategory";
import { getSessionToken } from "@/lib/session";
import CreateOrUpdateMenu from "./CreateOrUpdateMenu";
import DeleteMenu from "./DeleteMenu";

export default function MenuList({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);

  //! Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalCategoryOpen, setIsModalCategoryOpen] = useState(false);

  //! State pour les tables et la table sélectionnée
  const [menu, setMenu] = useState<MenuProps[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<MenuProps | null>(null);

  //! Filtre
  const [filterCategory, setFilterCategory] = useState("all");
  const [availableFilter, setAvailableFilter] = useState<
    "all" | "available" | "unavailable"
  >("all");

  //! Récupère les catégories du menu
  const [categories, setCategories] = useState<
    { id: string; name: string; type: string }[]
  >([]);

  //! Récuperer le token de session

  const fetchCategoriesMenu = async () => {
    const token = await getSessionToken();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/menu/category`,
        {
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories de menu :", err);
    }
  };

  //! Récupère les menus
  const fetchMenus = async () => {
    const token = await getSessionToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/menu/item`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`, // ← ajout ici
        },
      });
      const data = await res.json();
      setMenu(data);
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

  //! Handlers pour les actions
  const handleCreateCategory = () => {
    setIsModalCategoryOpen(true);
  };

  const handleEdit = (menu: MenuProps) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const handleDelete = (menu: MenuProps) => {
    setSelectedMenu(menu);
    setIsModalDeleteOpen(true);
  };

  const handleCreate = () => {
    setSelectedMenu(null);
    setIsModalOpen(true);
  };

  //! Filtrage des tables
  const filteredMenus =
    menu.length > 0
      ? menu.filter((item) => {
          if (filterCategory !== "all" && item.categoryId !== filterCategory)
            return false;

          if (availableFilter === "available" && !item.available) return false;
          if (availableFilter === "unavailable" && item.available) return false;

          return true;
        })
      : [];

  return (
    <section>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-secondary-500 font-one font-bold text-4xl py-10">
            Nos Menus
          </h1>

          <div className="flex gap-2">
            <button
              onClick={handleCreateCategory}
              className="text-black font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
            >
              Nouvelle catégorie
            </button>
            <button
              onClick={handleCreate}
              className="text-black font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
            >
              Nouveau plat
            </button>
          </div>
        </div>

        <div className="flex gap-4 items-center mb-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          >
            <option value="all">Toutes les catégories</option>
            {categories.length > 0 &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.type})
                </option>
              ))}
          </select>

          <select
            value={availableFilter}
            onChange={(e) =>
              setAvailableFilter(
                e.target.value as "all" | "available" | "unavailable"
              )
            }
            className="border border-gray-300 px-2 py-1 text-xs text-noir-500"
          >
            <option value="all">Tous les plats</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">Indisponibles</option>
          </select>
        </div>

        <div className="grid grid-cols-6 gap-2 px-4 py-2 text-secondary-500 text-xs font-bold">
          <p>Titre</p>
          <p>Description</p>
          <p>Prix</p>
          <p>Disponible</p>
          <p>Catégorie</p>
        </div>

        {loading ? (
          <p>Chargement...</p>
        ) : (
          filteredMenus.map((menu) => (
            <div
              key={menu.id}
              className="grid grid-cols-6 justify-center items-center gap-2 bg-gray-200 hover:bg-gray-300 duration-200 p-4 mb-2"
            >
              <h2 className="font-one font-semibold text-xs text-secondary-500">
                {menu.title}
              </h2>
              <h2 className="text-xs text-gray-600 truncate">
                {menu.description}
              </h2>

              <p className="text-gray-600 text-xs">{menu.price} €</p>
              <p
                className={`text-xs font-bold ${
                  menu.available ? "text-green-500" : "text-red-500"
                }`}
              >
                {" "}
                {menu.available ? "Disponible" : "Indisponible"}
              </p>
              <p className="text-gray-600 text-xs">{menu.category?.name}</p>
              <div className="flex gap-2 text-xs items-center justify-center">
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleEdit(menu)}
                >
                  <IoCreateOutline
                    size={20}
                    className="hover:text-secondary-500"
                  />
                </button>
                <button
                  className="cursor-pointer text-black"
                  onClick={() => handleDelete(menu)}
                >
                  {" "}
                  <AiOutlineDelete
                    size={20}
                    className="hover:text-secondary-500"
                  />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalCategoryOpen && (
        <CreateCategory
          userId={userId}
          onCreate={() => {
            fetchCategoriesMenu();
            setIsModalCategoryOpen(false);
          }}
          setIsOpen={setIsModalCategoryOpen}
        />
      )}

      {isModalOpen && (
        <CreateOrUpdateMenu
          userId={userId}
          onCreate={() => {
            fetchMenus();
            setIsModalOpen(false);
          }}
          setIsOpen={setIsModalOpen}
          existingMenu={selectedMenu ?? undefined}
          categories={categories}
        />
      )}

      {isModalDeleteOpen && (
        <DeleteMenu
          onDelete={() => {
            fetchMenus();
            setIsModalDeleteOpen(false);
          }}
          setIsOpen={setIsModalDeleteOpen}
          menu={selectedMenu ?? undefined}
        />
      )}
    </section>
  );
}
