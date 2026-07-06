import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabase();
    const { id } = await params;
    const { name, category_id, image_url, notes } = await request.json();

    const updates: Record<string, string | null> = {};
    if (name) updates.name = name;
    if (category_id) updates.category_id = category_id;
    if (image_url !== undefined) updates.image_url = image_url;
    if (notes !== undefined) updates.notes = notes;

    const { error } = await supabase
      .from("dishes")
      .update(updates)
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`PUT /api/dishes error:`, error);
    return NextResponse.json(
      { error: "更新菜品失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabase();
    const { id } = await params;

    const { error } = await supabase
      .from("dishes")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/dishes error:`, error);
    return NextResponse.json(
      { error: "删除菜品失败" },
      { status: 500 }
    );
  }
}
