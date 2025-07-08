"use client";
import { ActusProps, EventProps } from "@/lib/type";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Section5() {
  const [loading, setLoading] = useState(true);

  const [lastEvent, setLastEvent] = useState<EventProps>();
  const [lastArticle, setLastArticle] = useState<ActusProps>();

  const fetchLastEvent = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/event/last`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();

      if (data.error || data.message === "Aucun événement à venir trouvé.") {
        setLastEvent(undefined);
      } else {
        setLastEvent(data);
      }
    } catch (err) {
      console.error("Erreur lors du chargement de l'événement :", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLastArticle = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/actus/last`,
        {
          cache: "no-store",
        }
      );
      const data = await res.json();
      setLastArticle(data);
    } catch (err) {
      console.error("Erreur lors du chargement de l'article :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastEvent();
    fetchLastArticle();
  }, []);

  if (loading)
    return (
      <div className="px-8 md:px-20 font-one text-gray-600 text-center animate-pulse">
        Chargement...
      </div>
    );

  return (
    <section className={`py-30 bg-gradient-to-l from-gray-100 to-gray-300`}>
      <h2 className="text-center mb-10 font-one font-semibold text-secondary-500 text-3xl tracking-wide">
        Evénement & Actus
      </h2>
      <div
        className={`w-3/4 mx-auto grid gap-8 ${
          lastEvent && lastArticle
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {lastEvent && (
          <div
            key={lastEvent.id}
            className="border border-gray-300 bg-white shadow-sm hover:shadow-md transition duration-300 flex flex-col md:flex-row"
          >
            {/* Image */}
            {lastEvent.image ? (
              <div className="md:w-1/3 w-full h-48 md:h-auto overflow-hidden">
                <Image
                  src={lastEvent.image}
                  alt={lastEvent.title}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="md:w-1/3 w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                Pas d&apos;image
              </div>
            )}

            {/* Contenu texte */}
            <div className="p-6 flex flex-col gap-3 md:w-2/3">
              <div>
                <h3 className="text-2xl font-one font-semibold text-secondary-500 uppercase tracking-wide">
                  {lastEvent.title}
                </h3>
                <p className="text-gray-600 text-xs uppercase mb-2">
                  {new Date(lastEvent.date).toLocaleString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-gray-800 leading-relaxed">
                  {lastEvent.description}
                </p>
              </div>
            </div>
          </div>
        )}
        {lastArticle && (
          <article className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 bg-white shadow-sm hover:shadow-md transition duration-300">
            {/* Image */}
            {lastArticle.image ? (
              <div className="h-56 md:h-full w-full overflow-hidden">
                <Image
                  src={lastArticle.image}
                  alt={lastArticle.title}
                  className="object-cover w-full h-full"
                  width={800}
                  height={600}
                />
              </div>
            ) : (
              <div className="h-56 md:h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                Pas d&apos;image
              </div>
            )}

            {/* Contenu */}
            <div className="md:col-span-2 p-6 flex flex-col justify-between gap-4">
              <div>
                <h3 className="text-2xl font-one font-bold text-gray-900 tracking-tight">
                  {lastArticle.title}
                </h3>
                <p className="text-gray-600 text-xs uppercase mb-2">
                  {new Date(lastArticle.publishedAt).toLocaleString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p
                  style={{ whiteSpace: "pre-line" }}
                  className="text-gray-800 leading-relaxed text-base"
                >
                  {lastArticle.content.length > 150
                    ? `${lastArticle.content.substring(0, 150)}...`
                    : lastArticle.content}
                </p>
              </div>

              <div>
                <Link
                  href={"/actus"}
                  className="cursor-pointer mt-4 inline-block text-sm font-medium text-secondary-500 hover:underline"
                >
                  {"Lire l'article →"}
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
