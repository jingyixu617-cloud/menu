import { getSupabase } from "./supabase";

const BUCKET = "dish-images";

// 上传图片到 Supabase Storage
export async function uploadImage(file: File): Promise<string> {
  const supabase = getSupabase();
  const filename = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  return publicUrl;
}

// 通过 URL 路径删除图片
export async function deleteImage(url: string): Promise<void> {
  const supabase = getSupabase();
  // 从 URL 中提取文件名
  const path = url.split("/").pop();
  if (!path) return;

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
