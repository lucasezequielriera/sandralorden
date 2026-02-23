"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "@/i18n/navigation";

interface SearchResult {
  type: "client" | "invoice";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const listboxId = "global-search-listbox";

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setActiveIndex(-1); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setActiveIndex(-1);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const selectResult = useCallback((r: SearchResult) => {
    router.push(r.href);
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!results.length) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < results.length) {
          selectResult(results[activeIndex]);
        }
        break;
    }
  }, [results, activeIndex, selectResult]);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const activeDescendant = activeIndex >= 0 && results[activeIndex]
    ? `search-option-${results[activeIndex].type}-${results[activeIndex].id}`
    : undefined;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => { setOpen(true); requestAnimationFrame(() => inputRef.current?.focus()); }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-gray-300 text-sm cursor-pointer hover:border-warm-gray-300 transition-colors"
        aria-label="Buscar (⌘K)"
      >
        <svg className="w-4 h-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden sm:inline text-[10px] bg-white px-1.5 py-0.5 rounded border border-warm-gray-200 ml-auto">⌘K</kbd>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-warm-gray-100 shadow-xl z-50 overflow-hidden min-w-[280px]">
          <div className="p-3 border-b border-warm-gray-100">
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={results.length > 0}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={activeDescendant}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar clientes, facturas..."
              className="w-full text-sm text-warm-dark placeholder:text-warm-gray-300 focus:outline-none"
              autoFocus
            />
          </div>
          <div id={listboxId} role="listbox" aria-label="Resultados de búsqueda" className="max-h-64 overflow-y-auto">
            {loading && (
              <p className="text-xs text-warm-gray-300 text-center py-4" aria-live="polite">Buscando...</p>
            )}
            {!loading && query.length >= 2 && results.length === 0 && (
              <p className="text-xs text-warm-gray-300 text-center py-4" aria-live="polite">Sin resultados</p>
            )}
            {results.map((r, i) => {
              const optionId = `search-option-${r.type}-${r.id}`;
              return (
                <div
                  key={optionId}
                  id={optionId}
                  role="option"
                  aria-selected={i === activeIndex}
                  onClick={() => selectResult(r)}
                  className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 cursor-pointer ${
                    i === activeIndex ? "bg-warm-gray-100/50" : "hover:bg-warm-gray-100/30"
                  }`}
                >
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider ${
                    r.type === "client" ? "bg-rosa-100 text-rosa-500" : "bg-green-100 text-green-600"
                  }`}>
                    {r.type === "client" ? "Cliente" : "Factura"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-warm-dark truncate">{r.title}</p>
                    <p className="text-[11px] text-warm-gray-300 truncate">{r.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
