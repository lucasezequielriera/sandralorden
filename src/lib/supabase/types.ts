export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  goal: string;
  status: "lead" | "active" | "inactive";
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  client_id: string;
  date: string;
  type: "presencial" | "virtual";
  duration_minutes: number;
  notes: string;
  created_at: string;
}

export interface FileRecord {
  id: string;
  client_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  amount: number;
  currency: string;
  concept: string;
  status: "pending" | "paid" | "cancelled";
  due_date: string | null;
  paid_date: string | null;
  created_at: string;
}

export type ClientInsert = Omit<Client, "id" | "created_at" | "updated_at">;
export type ClientUpdate = Partial<ClientInsert>;
export type InvoiceInsert = Omit<Invoice, "id" | "created_at">;
export type InvoiceUpdate = Partial<InvoiceInsert>;
export type SessionInsert = Omit<Session, "id" | "created_at">;
export type FileInsert = Omit<FileRecord, "id" | "uploaded_at">;
