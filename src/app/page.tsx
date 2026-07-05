"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CategorySection from "@/components/CategorySection";
import type { CategoryWithDishes } from "@/lib/db";

export default function Home() {
  const [categories, setCategories] = useState<CategoryWithDishes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dishes")
      .then((res) => {
        if (!res.ok) throw new Error("加载失败");
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">加载失败: {error}</p>
        <p className="text-gray-400 text-sm">
          请确保已配置 Supabase 环境变量 和导入数据库表
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🍽️ 我们的菜单</h1>
        <Link
          href="/admin"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
        >
          ✏️ 管理菜品
        </Link>
      </div>

      {/* 三个分类区域 */}
      {categories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🍜</p>
          <p className="text-gray-500 text-lg mb-2">还没有菜品</p>
          <p className="text-gray-400 text-sm mb-6">
            点击右上角「管理菜品」开始添加
          </p>
          <Link
            href="/admin"
            className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            去添加
          </Link>
        </div>
      ) : (
        categories.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))
      )}
    </main>
  );
}
