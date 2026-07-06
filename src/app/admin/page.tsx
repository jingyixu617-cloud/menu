"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dish, Category, CategoryWithDishes } from "@/lib/db";

export default function AdminPage() {
  const [categories, setCategories] = useState<CategoryWithDishes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 表单状态
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchDishes = () => {
    fetch("/api/dishes")
      .then((res) => res.json())
      .then((data) => { setCategories(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchDishes(); }, []);

  const categoryList: Category[] = categories.map(
    ({ dishes: _dishes, ...cat }) => cat
  );

  const displayCategories = categoryList.length > 0
    ? categoryList
    : [
        { id: "cook", name: "做饭", slug: "cook", sort_order: 1 },
        { id: "takeout", name: "点外卖", slug: "takeout", sort_order: 2 },
        { id: "dine-out", name: "出去吃", slug: "dine-out", sort_order: 3 },
      ];

  const allDishes: { dish: Dish; categoryName: string }[] = categories
    .flatMap((cat) => cat.dishes.map((d) => ({ dish: d, categoryName: cat.name })))
    .sort((a, b) => new Date(b.dish.created_at).getTime() - new Date(a.dish.created_at).getTime());

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) { setFormImageUrl(data.url); setMessage("图片上传成功！"); }
      else { setMessage("上传失败: " + data.error); }
    } catch { setMessage("上传失败"); }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCategory) return;
    setSaving(true);
    try {
      const body: Record<string, string> = {
        name: formName,
        category_id: formCategory,
        image_url: formImageUrl || (editingDish?.image_url || ""),
        notes: formNotes,
      };
      if (editingDish) {
        const res = await fetch(`/api/dishes/${editingDish.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("更新失败");
        setMessage("菜品已更新 💕");
      } else {
        const res = await fetch("/api/dishes", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("添加失败");
        setMessage("菜品已添加 🎉");
      }
      resetForm();
      fetchDishes();
    } catch (err) { setMessage("操作失败: " + (err as Error).message); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个菜品吗？")) return;
    try {
      const res = await fetch(`/api/dishes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("删除失败");
      setMessage("菜品已删除");
      fetchDishes();
    } catch (err) { setMessage("删除失败: " + (err as Error).message); }
  };

  const startEdit = (dish: Dish) => {
    setEditingDish(dish);
    setFormName(dish.name);
    setFormCategory(dish.category_id);
    setFormImageUrl(dish.image_url || "");
    setFormNotes((dish as any).notes || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingDish(null);
    setFormName("");
    setFormCategory("");
    setFormImageUrl("");
    setFormNotes("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#B5A3AA] text-sm">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#C16B83] text-sm">加载失败: {error}</p>
      </div>
    );
  }

  return (
    <main className="page-container pb-20">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="text-[#D97C96] hover:text-[#C16B83] transition-colors text-sm font-medium">
          ← 返回首页
        </Link>
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#D97C96] to-[#8B7B82] bg-clip-text text-transparent">
          📋 管理菜品
        </h1>
      </div>

      {/* 提示消息 */}
      {message && (
        <div className="mb-5 p-3.5 rounded-xl text-sm flex justify-between items-center bg-[#F2F9F2] text-[#5B8C5B] border border-[#C8E6C9]/60"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
        >
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="text-[#8BBF8B] hover:text-[#6A9F6A]">✕</button>
        </div>
      )}

      {/* 表单卡片 */}
      <div
        className="mx-auto mb-10 p-8 rounded-[28px]"
        style={{
          maxWidth: 720,
          background: "rgba(255, 255, 255, 0.72)",
          border: "1px solid rgba(239, 164, 184, 0.22)",
          boxShadow: "0 12px 32px rgba(217, 124, 150, 0.08)",
        }}
      >
        <h2 className="text-lg font-semibold text-[#3E2A32] mb-6">
          {editingDish ? "✏️ 编辑菜品" : "➕ 添加菜品"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 名称 */}
          <div>
            <label className="block text-sm font-medium text-[#8B7B82] mb-1.5">菜品名称</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="例如：红烧排骨"
              className="w-full px-4 py-2.5 bg-[#FFF7F3]/60 border border-[rgba(239,164,184,0.22)] rounded-xl focus:ring-2 focus:ring-[#EFA4B8]/30 focus:border-[#EFA4B8]/40 focus:bg-white outline-none transition-all text-sm placeholder:text-[#C8BCC2] text-[#3E2A32]"
              required
            />
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-[#8B7B82] mb-1.5">分类</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FFF7F3]/60 border border-[rgba(239,164,184,0.22)] rounded-xl focus:ring-2 focus:ring-[#EFA4B8]/30 focus:border-[#EFA4B8]/40 focus:bg-white outline-none transition-all text-sm text-[#3E2A32]"
              required
            >
              <option value="">请选择分类</option>
              {displayCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-[#8B7B82] mb-1.5">
              备注 <span className="text-[#C8BCC2] font-normal">（选填）</span>
            </label>
            <input
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="例如：微辣、¥38、他推荐的..."
              className="w-full px-4 py-2.5 bg-[#FFF7F3]/60 border border-[rgba(239,164,184,0.22)] rounded-xl focus:ring-2 focus:ring-[#EFA4B8]/30 focus:border-[#EFA4B8]/40 focus:bg-white outline-none transition-all text-sm placeholder:text-[#C8BCC2] text-[#3E2A32]"
            />
          </div>

          {/* 图片 */}
          <div>
            <label className="block text-sm font-medium text-[#8B7B82] mb-1.5">菜品图片</label>
            <div className="flex gap-3 items-center">
              <label
                className="px-4 py-2.5 rounded-xl cursor-pointer transition-colors text-sm font-medium"
                style={{
                  background: "rgba(239, 164, 184, 0.1)",
                  color: "#C16B83",
                  border: "1px solid rgba(239, 164, 184, 0.2)",
                }}
              >
                {uploading ? "上传中..." : "📷 选择图片"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
              {formImageUrl && (
                <img src={formImageUrl} alt="预览" className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#EFA4B8]/30" />
              )}
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-[#EFA4B8] to-[#D97C96] text-white rounded-full hover:from-[#E892A9] hover:to-[#C96B87] transition-all disabled:opacity-50 text-sm font-medium"
              style={{ boxShadow: "0 6px 16px rgba(217, 124, 150, 0.16)" }}
            >
              {saving ? "保存中..." : editingDish ? "💾 更新菜品" : "✨ 添加菜品"}
            </button>
            {editingDish && (
              <button type="button" onClick={resetForm} className="px-4 py-2.5 bg-[#F6E7DD]/60 text-[#8B7B82] rounded-full hover:bg-[#F6E7DD] transition-colors text-sm">
                取消编辑
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 已有菜品列表 */}
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2 className="text-lg font-semibold text-[#3E2A32] mb-4">
          已有菜品 ({allDishes.length})
        </h2>
        {allDishes.length === 0 ? (
          <div
            className="text-center py-14 rounded-[24px]"
            style={{
              background: "rgba(239,164,184,0.04)",
              border: "1px dashed rgba(239,164,184,0.14)",
            }}
          >
            <span className="text-5xl opacity-25">🍽️</span>
            <p className="text-[#B5A3AA] text-sm mt-3">还没有菜品，用表单添加第一个吧</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {allDishes.map(({ dish, categoryName }) => (
              <div
                key={dish.id}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-3.5 flex items-center gap-3 transition-shadow"
                style={{
                  border: "1px solid rgba(239, 164, 184, 0.1)",
                  boxShadow: "0 2px 8px rgba(217, 124, 150, 0.04)",
                }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#FFF7F3] to-[#F8D7DF]/40 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {dish.image_url ? (
                    <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl opacity-25">🍽️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#3E2A32] text-sm truncate">{dish.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-[#B5A3AA]">{categoryName}</p>
                    {(dish as any).notes && (
                      <p className="text-xs text-[#C8BCC2] truncate">· {(dish as any).notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(dish)}
                    className="px-3 py-1.5 text-xs rounded-lg transition-colors font-medium"
                    style={{ background: "rgba(239, 164, 184, 0.1)", color: "#C16B83" }}
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(dish.id)}
                    className="px-3 py-1.5 text-xs rounded-lg transition-colors font-medium"
                    style={{ background: "rgba(0,0,0,0.04)", color: "#B5A3AA" }}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
