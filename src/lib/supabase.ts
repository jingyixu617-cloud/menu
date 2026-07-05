import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

function validateUrl(url: string | undefined, label: string): string {
  if (!url) {
    throw new Error(
      `缺少环境变量: ${label}。请确保在 Vercel 项目设置中添加了 ${label} 环境变量。`
    );
  }
  const trimmed = url.trim();
  if (!trimmed.startsWith("https://")) {
    throw new Error(
      `${label} 不是有效 URL (必须以 https:// 开头): "${trimmed.substring(0, 20)}..."`
    );
  }
  if (!trimmed.includes("supabase.co")) {
    throw new Error(
      `${label} 不包含 supabase.co (请检查是否使用了正确的 Supabase Project URL): "${trimmed.substring(0, 30)}..."`
    );
  }
  return trimmed;
}

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const url = typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_SUPABASE_URL
      : process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const validUrl = validateUrl(url, "NEXT_PUBLIC_SUPABASE_URL");
    const validKey = key?.trim();

    if (!validKey) {
      throw new Error(
        "缺少环境变量: NEXT_PUBLIC_SUPABASE_ANON_KEY。请确保在 Vercel 项目设置中添加了此变量。"
      );
    }

    supabaseInstance = createClient(validUrl, validKey);
  }
  return supabaseInstance;
}
