import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const info = {
    NEXT_PUBLIC_SUPABASE_URL: {
      exists: typeof url !== "undefined" && url !== null,
      type: typeof url,
      length: url ? url.length : 0,
      startsWithHttps: url ? url.startsWith("https://") : false,
      containsSupabaseCo: url ? url.includes(".supabase.co") : false,
      firstChars: url ? url.substring(0, 30) + "..." : "(empty)",
      hasWhitespace: url ? url !== url.trim() : false,
      isOnlyWhitespace: url ? url.trim().length === 0 : true,
    },
    NEXT_PUBLIC_SUPABASE_ANON_KEY: {
      exists: typeof key !== "undefined" && key !== null,
      type: typeof key,
      length: key ? key.length : 0,
      firstChars: key ? key.substring(0, 15) + "..." : "(empty)",
    },
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || "(not set)",
    allEnvKeys: Object.keys(process.env)
      .filter((k) => k.startsWith("NEXT_PUBLIC") || k.startsWith("VERCEL"))
      .sort(),
  };

  return NextResponse.json(info);
}
