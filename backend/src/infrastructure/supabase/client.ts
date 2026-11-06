import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ENV } from "../../config/env.js";

/** Bật khi đã cấu hình SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. */
export const supabaseEnabled = Boolean(ENV.SUPABASE_URL && ENV.SUPABASE_SERVICE_ROLE_KEY);

let client: SupabaseClient | null = null;

/** Client dùng khoá service_role (chỉ chạy ở backend, bỏ qua RLS). */
export function getSupabase(): SupabaseClient {
  if (!supabaseEnabled) throw new Error("Supabase chưa được cấu hình (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).");
  if (!client) {
    client = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
