"use client";

import { BannerProps } from "@/lib/type";
import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Banner() {
  const [banner, setBanner] = useState<BannerProps>();
  const [showBanner, setShowBanner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const fetchBanner = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACK_URL}/banner/active`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();

      setBanner(data);
      if (data.title) {
        setShowBanner(true);
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  // Ne rien afficher si pas de banner
  if (!banner || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gradient-to-l from-secondary-600 to-secondary-800 text-white rounded-lg shadow-lg max-w-sm">
      {/* Header du banner (toujours visible) */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-one text-lg font-bold truncate">{banner?.title}</h3>
        <button className="ml-2 p-1 hover:bg-white/20 rounded">
          {isExpanded ? (
            <FaChevronDown className="w-5 h-5" />
          ) : (
            <FaChevronUp className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Contenu dépliable */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-3 pt-2 border-t border-white/20">
          <p className="font-one text-sm">
            {banner?.startsAt && banner?.endsAt && (
              <>
                Du{" "}
                {new Date(banner.startsAt).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                à{" "}
                {new Date(banner.startsAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                au{" "}
                {new Date(banner.endsAt).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}{" "}
                à{" "}
                {new Date(banner.endsAt).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </>
            )}
          </p>

          {/* Optionnel: bouton d'action si banner.link existe */}
          {banner.link && (
            <a
              href={banner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-3 py-1 bg-white text-secondary-600 rounded text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              En savoir plus
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
