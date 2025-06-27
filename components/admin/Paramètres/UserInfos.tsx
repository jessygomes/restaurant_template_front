"use client";
import { useEffect, useState } from "react";
import UpdateUser from "./UpdateUser";
import { DAYS_FR, DAYS_ORDERED } from "@/lib/utils/days";
import { UserInfo } from "@/lib/type";

export default function UserInfos({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(true);

  //! State pour le user
  const [user, setUser] = useState<UserInfo>();

  //! Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  //! Récupère les tables
  const fetchUser = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/user/${userId}`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Erreur lors du chargement du compte :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  console.log("User in UserInfos:", user);

  return (
    <section>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-secondary-500 font-one font-bold text-4xl py-10">
            Mes informations
          </h1>

          <button
            onClick={() => setIsModalOpen(true)}
            className="text-black font-one tracking-wide text-sm font-bold border px-4 py-2  hover:bg-secondary-500 hover:border-secondary-500 hover:text-white transition-all ease-in-out duration-300 cursor-pointer"
          >
            Modifier
          </button>
        </div>

        <div className="bg-white">
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div className="space-y-4 text-noir-500">
              <div className="border p-2">
                <strong>Nom du restaurant:</strong> {user?.restaurantName}
              </div>
              <div className="border p-2">
                <strong>Horaires:</strong>
                <ul className="mt-2">
                  {user?.hours &&
                    DAYS_ORDERED.map((day) => {
                      const value = user.hours[day];
                      return (
                        <li key={day} className="grid grid-cols-5 space-y-2">
                          <span className="capitalize">
                            {DAYS_FR[day] ?? day} :
                          </span>{" "}
                          <span>
                            {" "}
                            {value?.open && value?.close
                              ? `${value.open} - ${value.close}`
                              : "Fermé"}
                          </span>
                        </li>
                      );
                    })}
                </ul>
              </div>
              <div className="border p-2">
                <strong>Email:</strong> {user?.email}
              </div>
              <div className="border p-2">
                <strong>Téléphone:</strong> {user?.phone}
              </div>
              <div className="border p-2">
                <strong>Adresse:</strong> {user?.address}
              </div>
              <div className="border p-2">
                <strong>Ville:</strong> {user?.city}
              </div>
              <div className="border p-2">
                <strong>Code postal:</strong> {user?.postalCode}
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && user && (
        <UpdateUser
          user={user}
          onCreate={() => {
            fetchUser();
            setIsModalOpen(false);
          }}
          setIsOpen={setIsModalOpen}
        />
      )}
    </section>
  );
}
