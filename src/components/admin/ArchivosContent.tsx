"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface FileRow {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
  clients: { name: string } | null;
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClient) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("client_id", selectedClient);

      const res = await fetch("/api/admin/files", { method: "POST", body: formData });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-[family-name:var(--font-display)] italic text-2xl sm:text-3xl font-light text-warm-dark">Archivos</h2>
          <p className="text-sm text-warm-gray-400 mt-1">{files.length} archivos</p>
        </div>
      </div>

      {/* Upload */}
      <div className="bg-white rounded-2xl border border-warm-gray-100 p-6 mb-6">
        <h3 className="font-medium text-warm-dark mb-4">Subir archivo</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-warm-gray-100/50 border border-warm-gray-200/50 text-warm-dark text-sm focus:outline-none focus:ring-2 focus:ring-rosa-200">
            <option value="">Seleccionar cliente</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <label className={`inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all cursor-pointer ${
            !selectedClient || uploading ? "bg-warm-gray-300 cursor-not-allowed" : "bg-warm-dark hover:bg-warm-gray-500"
          }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
            {uploading ? "Subiendo..." : "Subir archivo"}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleUpload}
              disabled={!selectedClient || uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* File List */}
      {files.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-warm-gray-100">
          <p className="text-warm-gray-300 text-sm">Sin archivos subidos</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-warm-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-gray-100 bg-warm-gray-100/30">
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider">Archivo</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider hidden sm:table-cell">Cliente</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider hidden md:table-cell">Tipo</th>
                  <th className="text-left px-4 py-3 font-medium text-warm-gray-400 text-xs uppercase tracking-wider">Fecha</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.id} className="border-b border-warm-gray-100/50 hover:bg-warm-gray-100/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-warm-dark truncate max-w-[200px]">{f.file_name}</p>
                        <p className="text-xs text-warm-gray-300 sm:hidden">{f.clients?.name ?? "—"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-warm-gray-400 hidden sm:table-cell">{f.clients?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-warm-gray-300 text-xs hidden md:table-cell">{f.file_type || "—"}</td>
                    <td className="px-4 py-3 text-warm-gray-300 text-xs">{new Date(f.uploaded_at).toLocaleDateString("es-ES")}</td>
                    <td className="px-4 py-3">
                      <a href={f.file_url} target="_blank" rel="noopener noreferrer"
                        className="text-rosa-400 hover:text-rosa-500 text-xs font-medium transition-colors">
                        Descargar
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
