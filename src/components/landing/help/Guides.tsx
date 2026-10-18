"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { helpTopics } from "./data";

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export function Guides() {
  const [query, setQuery] = useState("");

  const term = normalize(query.trim());
  const topics = term
    ? helpTopics.filter((topic) =>
        normalize(
          [topic.title, topic.description, ...topic.articles].join(" "),
        ).includes(term),
      )
    : helpTopics;

  return (
    <section className="py-10 space-y-12">
      {/* Buscador */}
      <div className="max-w-xl mx-auto">
        <label htmlFor="help-search" className="sr-only">
          Buscar en el centro de ayuda
        </label>
        <div className="glass rounded-full flex items-center gap-x-3 px-5 py-1 focus-within:ring-3 focus-within:ring-ring/50">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            id="help-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Busca una guía: inventario, caja, permisos..."
            className="w-full bg-transparent py-2.5 text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Temas */}
      {topics.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <article
                key={topic.title}
                className="rounded-xl border border-border bg-card p-6 space-y-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-x-2.5">
                    <Icon className="size-5 text-primary" />
                    <h2 className="font-semibold">{topic.title}</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {topic.description}
                  </p>
                </div>

                <ul className="space-y-2.5 border-t border-border pt-4">
                  {topic.articles.map((article) => (
                    <li
                      key={article}
                      className="flex items-start gap-x-2.5 text-sm"
                    >
                      <span className="mt-2 size-1 min-w-1 rounded-full bg-primary" />
                      {article}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center space-y-2 py-10">
          <p className="font-medium">
            No encontramos guías para &ldquo;{query}&rdquo;
          </p>
          <p className="text-muted-foreground">
            Prueba con otra palabra o{" "}
            <Link
              href="/contacto"
              className="font-medium text-primary hover:underline"
            >
              escríbenos
            </Link>{" "}
            y te ayudamos.
          </p>
        </div>
      )}
    </section>
  );
}
