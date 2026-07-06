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

  // 获取菜品列表（含分类信息）
  const fetchDishes = () => {
    fetch("/api/dishes")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDishes();
  }, []);

  // 获取所有纯分类列表（不带 dish）
  const categoryList: Category[] = categories.map(
    ({ dishes: _dishes, ...cat }) => cat
  );

  const displayCategories =
    categoryList.length > 0
      ? categoryList
      : [
          { id: "cook", name: "做饭", slug: "cook", sort_order: 1 },
          { id: "takeout", name: "点外卖", slug: "takeout", sort_order: 2 },
          { id: "dine-out", name: "出去吃", slug: "dine-out", sort_order: 3 },
        ];

  // 所有菜品（扁平化）
  const allDishes: { dish: Dish; categoryName: string }[] = categories.flatMap(
    (cat) =>
      cat.dishes.map((d) => ({ dish: d, categoryName: cat.name }))
  );
  allDishes.sort(
    (a, b) =>
      new Date(b.dish.created_at).getTime() -
      new Date(a.dish.created_at).getTime()
  );

  // 图片上传
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setFormImageUrl(data.url);
        setMessage("图片上传成功！");
      } else {
        setMessage("上传失败: " + data.error);
      }
    } catch {
      setMessage("上传失败");
    }
    setUploading(false);
  };

  // 提交表单
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
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("更新失败");
        setMessage("菜品已更新 💕");
      } else {
        const res = await fetch("/api/dishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("添加失败");
        setMessage("菜品已添加 🎉");
      }
      resetForm();
      fetchDishes();
    } catch (err) {
      setMessage("操作失败: " + (err as Error).message);
    }
    setSaving(false);
  };

  // 删除菜品
  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个菜品吗？")) return;
    try {
      const res = await fetch(`/api/dishes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("删除失败");
      setMessage("菜品已删除");
      fetchDishes();
    } catch (err) {
      setMessage("删除失败: " + (err as Error).message);
    }
  };

  // 编辑
  const startEdit = (dish: Dish) => {
    setEditingDish(dish);
    setFormName(dish.name);
    setFormCategory(dish.category_id);
    setFormImageUrl(dish.image_url || "");
    setFormNotes((dish as any).notes || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 取消编辑
  const resetForm = () => {
    setEditingDish(null);
    setFormName("");
    setFormCategory("");
    setFormImageUrl("");
    setFormNotes("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="flex gap-1">
          {["🍳", "🍲", "🥗"].map((e, i) => (
            <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}>{e}</span>
          ))}
        </div>
        <p className="text-pink-400/70 text-sm">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-rose-400">加载失败: {error}</p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 pb-20">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="text-pink-500 hover:text-pink-600 transition-colors text-sm font-medium"
        >
          ← 返回首页
        </Link>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">📋 管理菜品</h1>
      </div>

      {/* 提示消息 */}
      {message && (
        <div className="mb-4 p-3.5 bg-green-50 text-green-700 rounded-xl text-sm flex justify-between items-center border border-green-200/50 shadow-sm">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="text-green-400 hover:text-green-600">
            ✕
          </button>
        </div>
      )}

      {/* 添加/编辑表单 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_2px_15px_rgba(244,114,182,0.08)] p-6 mb-8 border border-pink-100/50">
        <h2 className="text-lg font-semibold text-gray-700 mb-5 flex items-center gap-2">
          <span>{editingDish ? "✏️ 编辑菜品" : "➕ 添加菜品"}</span>
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              菜品名称
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="例如：红烧排骨"
              className="w-full px-4 py-2.5 bg-pink-50/30 border border-pink-200/40 rounded-xl focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 focus:bg-white outline-none transition-all text-sm placeholder:text-gray-300"
              required
            />
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              分类
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-pink-50/30 border border-pink-200/40 rounded-xl focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 focus:bg-white outline-none transition-all text-sm"
              required
            >
              <option value="">请选择分类</option>
              {displayCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              备注 <span className="text-gray-300 font-normal">（选填）</span>
            </label>
            <input
              type="text"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="例如：微辣、¥38、他推荐的..."
              className="w-full px-4 py-2.5 bg-pink-50/30 border border-pink-200/40 rounded-xl focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300 focus:bg-white outline-none transition-all text-sm placeholder:text-gray-300"
            />
          </div>

          {/* 图片上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              菜品图片
            </label>
            <div className="flex gap-3 items-center">
              <label className="px-4 py-2.5 bg-pink-50 text-pink-600 rounded-xl cursor-pointer hover:bg-pink-100 transition-colors text-sm font-medium border border-pink-200/40">
                {uploading ? "上传中..." : "📷 选择图片"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {formImageUrl && (
                <img
                  src={formImageUrl}
                  alt="预览"
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-pink-200"
                />
              )}
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-xl hover:from-pink-500 hover:to-rose-500 transition-all disabled:opacity-50 text-sm font-semibold shadow-lg shadow-pink-200/50"
            >
              {saving
                ? "保存中..."
                : editingDish
                ? "💾 更新菜品"
                : "✨ 添加菜品"}
            </button>
            {editingDish && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors text-sm"
              >
                取消编辑
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 已有菜品列表 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          已有菜品 ({allDishes.length})
        </h2>
        {allDishes.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-2xl border border-dashed border-pink-200/60">
            <span className="text-5xl opacity-30">🍽️</span>
            <p className="text-pink-300 text-sm mt-3">还没有菜品，用表单添加第一个吧</p>
          </div>
        ) : (
          <div className="space-y-2">
            {allDishes.map(({ dish, categoryName }) => (
              <div
                key={dish.id}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-3.5 flex items-center gap-3 border border-pink-50/50 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {dish.image_url ? (
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl opacity-30">🍽️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-700 text-sm truncate">
                    {dish.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-pink-400/70">{categoryName}</p>
                    {(dish as any).notes && (
                      <p className="text-xs text-gray-400 truncate">
                        · {(dish as any).notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(dish)}
                    className="px-3 py-1.5 text-xs bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors font-medium"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(dish.id)}
                    className="px-3 py-1.5 text-xs bg-red-50 text-red-400 rounded-lg hover:bg-red-100 transition-colors font-medium"
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
