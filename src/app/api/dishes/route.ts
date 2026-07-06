import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabase();

    // 获取分类
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");

    if (catError) throw catError;

    // 获取菜品
    const { data: dishes, error: dishError } = await supabase
      .from("dishes")
      .select("*")
      .order("created_at", { ascending: false });

    if (dishError) throw dishError;

    const result = categories.map((cat) => ({
      ...cat,
      dishes: dishes.filter((d: { category_id: string }) => d.category_id === cat.id),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/dishes error:", error);
    return NextResponse.json(
      { error: "获取数据失败" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const { name, category_id, image_url, notes } = await request.json();

    if (!name || !category_id) {
      return NextResponse.json(
        { error: "名称和分类不能为空" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("dishes")
      .insert({ name, category_id, image_url: image_url || null, notes: notes || null })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/dishes error:", error);
    return NextResponse.json(
      { error: "添加菜品失败" },
      { status: 500 }
    );
  }
}
