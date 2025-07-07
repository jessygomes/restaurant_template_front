"use client";
import { ActusProps } from "@/lib/type";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function ShowArticles() {
  const [loading, setLoading] = useState(true);

  const [articles, setArticles] = useState<ActusProps[]>([]);
  const [expandedArticles, setExpandedArticles] = useState<string[]>([]);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/actus`, {
        cache: "no-store",
      });
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error("Erreur lors du chargement des articles :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  console.log("articles", articles);

  const toggleExpand = (id: string) => {
    setExpandedArticles((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  if (loading)
    return (
      <div className="px-8 md:px-20 font-one text-gray-600 text-center animate-pulse">
        Chargement...
      </div>
    );
  return (
    <div className="space-y-8 px-8 md:px-20">
      {articles.length === 0 ? (
        <p className="font-one text-gray-500 text-center italic">
          Aucune actualité pour le moment.
        </p>
      ) : (
        <div className="space-y-12">
          {articles.map((article) => {
            const isExpanded = expandedArticles.includes(article.id);

            return (
              <article
                key={article.id}
                className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 bg-white shadow-sm hover:shadow-md transition duration-300"
              >
                {/* Image */}
                {article.image ? (
                  <div className="h-56 md:h-full w-full overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
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
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-xs uppercase mb-2">
                      {new Date(article.publishedAt).toLocaleString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p
                      style={{ whiteSpace: "pre-line" }}
                      className={`text-gray-800 leading-relaxed text-base ${
                        isExpanded ? "" : "line-clamp-5"
                      }`}
                    >
                      {article.content}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => toggleExpand(article.id)}
                      className="cursor-pointer mt-4 inline-block text-sm font-medium text-secondary-500 hover:underline"
                    >
                      {isExpanded ? "Réduire l’article ↑" : "Lire l’article →"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
