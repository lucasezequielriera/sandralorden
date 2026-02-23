"use client";

import { useState, useRef } from "react";
import { useRouter } from "@/i18n/navigation";

interface FileRow {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
  clients: { name: string } | null;
}

const typeIcons: Record<string, string> = {
  pdf: "PDF",
  image: "IMG",
  doc: "DOC",
  sheet: "XLS",
};

function getFileCategory(type: string, name: string): string {
  if (type.includes("pdf")) return "pdf";
  if (type.includes("image") || /\.(jpg|jpeg|png|gif|webp)$/i.test(name)) return "image";
  if (type.includes("word") || type.includes("document") || /\.docx?$/i.test(name)) return "doc";
  if (type.includes("sheet") || type.includes("excel") || /\.xlsx?$/i.test(name)) return "sheet";
  return "other";
}

const categoryColors: Record<string, string> = {
  pdf: "bg-[#F2B8B5]/30 text-[#8C4A47]",
  image: "bg-[#D4E8F0]/40 text-[#3A6B7E]",
  doc: "bg-[#A8D5BA]/30 text-[#3D6B4F]",
  sheet: "bg-[#E8D5F0]/40 text-[#6B3A7E]",
  other: "bg-warm-gray-100 text-warm-gray-400",
};

export default function ArchivosContent({
  files,
  clients,
}: {
  files: FileRow[];
  clients: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = files.filter((f) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return f.file_name.toLowerCase().includes(q) || (f.clients?.name ?? "").toLowerCase().includes(q);
  });

  const handleUpload = async (file: File) => {
    if (!file || !selectedClient) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("client_id", selectedClient);
      const res = await fetch("/api/admin/files", { method: "POST", body: formData });
      if (res.ok) router.refresh();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && selectedClient) handleUpload(file);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark">Archivos</h2>
          <p className="text-[11px] text-warm-gray-300 mt-1">{files.length} archivo{files.length !== 1 ? "s" : ""} subido{files.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`bg-crema rounded-3xl p-6 mb-6 transition-all duration-200 ${dragOver ? "ring-2 ring-rosa-300 bg-rosa-50/30" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-medium text-warm-gray-400 uppercase tracking-[0.1em] mb-1.5">Cliente *</label>
            <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-warm-white text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200">
              <option value="">Seleccionar cliente</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <label className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-2xl transition-all cursor-pointer whitespace-nowrap ${
            !selectedClient || uploading ? "bg-warm-gray-200 text-warm-gray-400 cursor-not-allowed" : "bg-warm-dark text-white hover:bg-warm-gray-500"
          }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            {uploading ? "Subiendo..." : "Subir archivo"}
            <input ref={fileInputRef} type="file" onChange={handleFileChange} disabled={!selectedClient || uploading} className="hidden" />
          </label>
        </div>
        {selectedClient && (
          <p className="text-[10px] text-warm-gray-300 mt-3 text-center">o arrastra un archivo aquí</p>
        )}
      </div>

      {/* Search */}
      {files.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o cliente..."
            className="w-full sm:w-72 px-4 py-2.5 rounded-2xl bg-crema text-warm-dark placeholder:text-warm-gray-300 focus:outline-none focus:ring-2 focus:ring-rosa-200 text-sm"
          />
        </div>
      )}

      {/* File List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-crema rounded-3xl">
          <svg className="w-12 h-12 text-warm-gray-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
          </svg>
          <p className="text-warm-gray-300 text-sm">{search ? "Sin resultados" : "Sin archivos subidos"}</p>
        </div>
      ) : (
        <div className="bg-crema rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th scope="col" className="text-left pl-6 pr-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em]">Archivo</th>
                  <th scope="col" className="text-left px-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em] hidden sm:table-cell">Cliente</th>
                  <th scope="col" className="text-center px-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em] hidden md:table-cell">Tipo</th>
                  <th scope="col" className="text-left px-3 py-4 text-[9px] font-medium text-warm-gray-300 uppercase tracking-[0.12em]">Fecha</th>
                  <th scope="col" className="w-10 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => {
                  const cat = getFileCategory(f.file_type, f.file_name);
                  return (
                    <tr key={f.id} className="group hover:bg-warm-white transition-all duration-200">
                      <td className="pl-6 pr-3 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${categoryColors[cat]}`}>
                            <span className="text-[9px] font-bold">{typeIcons[cat] ?? "FILE"}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-warm-dark truncate max-w-[180px] group-hover:text-rosa-500 transition-colors">{f.file_name}</p>
                            <p className="text-[10px] text-warm-gray-300 sm:hidden">{f.clients?.name ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 hidden sm:table-cell">
                        <span className="text-sm text-warm-gray-400">{f.clients?.name ?? "—"}</span>
                      </td>
                      <td className="px-3 py-3.5 hidden md:table-cell text-center">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${categoryColors[cat]}`}>
                          {typeIcons[cat] ?? "FILE"}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-[11px] text-warm-gray-300 tabular-nums">
                          {new Date(f.uploaded_at).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                        </span>
                      </td>
                      <td className="pr-4 py-3.5">
                        <a href={f.file_url} target="_blank" rel="noopener noreferrer"
                          className="text-warm-gray-200 hover:text-rosa-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="Descargar">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
