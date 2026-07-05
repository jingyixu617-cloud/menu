"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Dish, Category, CategoryWithDishes } from "@/lib/db";

export default function AdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryWithDishes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 表单状态
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
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

  // 如果没有预设分类，用默认值
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
      if (editingDish) {
        // 更新
        const res = await fetch(`/api/dishes/${editingDish.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            category_id: formCategory,
            image_url: formImageUrl || editingDish.image_url,
          }),
        });
        if (!res.ok) throw new Error("更新失败");
        setMessage("菜品已更新");
      } else {
        // 新增
        const res = await fetch("/api/dishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            category_id: formCategory,
            image_url: formImageUrl,
          }),
        });
        if (!res.ok) throw new Error("添加失败");
        setMessage("菜品已添加");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 取消编辑
  const resetForm = () => {
    setEditingDish(null);
    setFormName("");
    setFormCategory("");
    setFormImageUrl("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">加载失败: {error}</p>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 pb-20">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="text-orange-500 hover:text-orange-600 transition-colors text-sm"
        >
          ← 返回首页
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">📋 管理菜品</h1>
      </div>

      {/* 提示消息 */}
      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm flex justify-between items-center">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="text-green-500">
            ✕
          </button>
        </div>
      )}

      {/* 添加/编辑表单 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingDish ? "✏️ 编辑菜品" : "➕ 添加菜品"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              菜品名称
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="例如：红烧排骨"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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

          {/* 图片上传 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              菜品图片
            </label>
            <div className="flex gap-3 items-center">
              <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm">
                {uploading ? "上传中..." : "选择图片"}
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
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              {saving
                ? "保存中..."
                : editingDish
                ? "更新菜品"
                : "添加菜品"}
            </button>
            {editingDish && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                取消编辑
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 已有菜品列表 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          已有菜品 ({allDishes.length})
        </h2>
        {allDishes.length === 0 ? (
          <p className="text-gray-400 text-center py-8">还没有菜品</p>
        ) : (
          <div className="space-y-2">
            {allDishes.map(({ dish, categoryName }) => (
              <div
                key={dish.id}
                className="bg-white rounded-lg shadow-sm p-3 flex items-center gap-3"
              >
                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {dish.image_url ? (
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl">🍽️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {dish.name}
                  </p>
                  <p className="text-xs text-gray-400">{categoryName}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(dish)}
                    className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(dish.id)}
                    className="px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
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
