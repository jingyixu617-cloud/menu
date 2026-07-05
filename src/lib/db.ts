import { getSupabase } from "./supabase";

export type Dish = {
  id: string;
  category_id: string;
  name: string;
  image_url: string | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type CategoryWithDishes = Category & {
  dishes: Dish[];
};

// 获取所有分类
export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (error) throw error;
  return data;
}

// 获取所有菜品（按分类分组）
export async function getDishesByCategory(): Promise<CategoryWithDishes[]> {
  const supabase = getSupabase();
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (catError) throw catError;

  const { data: dishes, error: dishError } = await supabase
    .from("dishes")
    .select("*")
    .order("created_at", { ascending: false });

  if (dishError) throw dishError;

  return categories.map((cat) => ({
    ...cat,
    dishes: dishes.filter((d) => d.category_id === cat.id),
  }));
}

// 添加菜品
export async function addDish(
  name: string,
  category_id: string,
  image_url: string
): Promise<Dish> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("dishes")
    .insert({ name, category_id, image_url })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 更新菜品
export async function updateDish(
  id: string,
  name: string,
  category_id: string,
  image_url?: string
): Promise<void> {
  const supabase = getSupabase();
  const updates: Record<string, string> = { name, category_id };
  if (image_url) updates.image_url = image_url;

  const { error } = await supabase.from("dishes").update(updates).eq("id", id);

  if (error) throw error;
}

// 删除菜品
export async function deleteDish(id: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("dishes").delete().eq("id", id);

  if (error) throw error;
}
