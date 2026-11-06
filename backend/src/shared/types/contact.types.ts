export type ContactType = "lien-he" | "bao-gia" | "danh-gia";
export type MessageStatus = "pending" | "contacted" | "cancelled";

export interface ContactMessage {
  id?: string;
  type: ContactType;
  name: string;
  phone: string;
  email?: string;
  company?: string;
  quantity?: string;
  budget?: string;
  date?: string;
  product?: string;
  stars?: number;
  message: string;
  createdAt: string;
  status?: MessageStatus;
  adminNote?: string;
  updatedAt?: string;
}

export interface MessageMetrics {
  totalMessages: number;
  pendingCount: number;
  quoteCount: number;
  reviewCount: number;
  contactedCount: number;
}
