/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { EventProps } from "@/lib/type";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ShowEvents() {
  const [loading, setLoading] = useState(true);

  const [upcomingEvents, setUpcomingEvents] = useState<EventProps[]>([]);
  const [pastEvents, setPastEvents] = useState<EventProps[]>([]);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/event`, {
        cache: "no-store",
      });
      const data = await res.json();

      const now = new Date();

      const upcoming = data
        .filter((event: EventProps) => new Date(event.date) > now)
        .sort(
          (a: EventProps, b: EventProps) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      const past = data
        .filter((event: EventProps) => new Date(event.date) <= now)
        .sort(
          (a: EventProps, b: EventProps) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (err) {
      console.error("Erreur lors du chargement des événements :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="font-one text-gray-600 text-center animate-pulse">
        Chargement...
      </div>
    );

  return (
    <div className="space-y-8 px-8 md:px-20">
      <div className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold font-one text-gray-900 tracking-tight">
          Événements à venir
        </h2>

        {upcomingEvents.length === 0 ? (
          <p className="font-one text-gray-500 bg-gray-200 p-4 text-center italic">
            Aucun événement à venir.
          </p>
        ) : (
          upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-300 bg-white shadow-sm hover:shadow-md transition duration-300 flex flex-col md:flex-row"
            >
              {/* Image */}
              {event.image ? (
                <div className="md:w-1/3 w-full h-48 md:h-auto overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
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
                <h3 className="text-2xl font-one font-semibold text-secondary-500 uppercase tracking-wide">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {new Date(event.date).toLocaleString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-gray-800 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold font-one text-gray-900 tracking-tight">
          Événements passés
        </h2>

        {pastEvents.length === 0 ? (
          <p className="font-one text-gray-500 bg-gray-200 p-4 text-center italic">
            Aucun événement passé.
          </p>
        ) : (
          pastEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-300 bg-white shadow-sm hover:shadow-md transition duration-300 flex flex-col md:flex-row opacity-70"
            >
              {/* Image */}
              {event.image ? (
                <div className="md:w-1/3 w-full h-48 md:h-auto overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    className="object-cover w-full h-full"
                    width={600}
                    height={400}
                  />
                </div>
              ) : (
                <div className="md:w-1/3 w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                  Pas d&apos;image
                </div>
              )}

              {/* Contenu texte */}
              <div className="p-6 flex flex-col gap-3 md:w-2/3">
                <h3 className="text-2xl font-one font-semibold text-secondary-500 uppercase tracking-wide">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {new Date(event.date).toLocaleString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-gray-800 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
