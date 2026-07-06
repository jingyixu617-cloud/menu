"use client";

import Link from "next/link";
import CategorySection from "@/components/CategorySection";
import type { CategoryWithDishes } from "@/lib/db";

type Props = {
  initialCategories: CategoryWithDishes[];
  initialError: string;
};

export default function HomeClient({ initialCategories, initialError }: Props) {
  if (initialError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <span className="text-6xl">😢</span>
        <p className="text-rose-400">加载失败: {initialError}</p>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pb-20">
      {/* 头部 */}
      <div className="text-center mb-10">
        <p className="text-sm tracking-widest text-pink-400/70 mb-2">
          ✨ 我们的美食小本本 ✨
        </p>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          今天吃什么 💕
        </h1>
        <p className="text-gray-400 text-xs mt-2">
          做饭 · 外卖 · 出去吃，选一个吧
        </p>
        <Link
          href="/admin"
          className="inline-block mt-4 px-5 py-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full hover:from-pink-500 hover:to-rose-500 transition-all text-sm font-medium shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-300/50 hover:-translate-y-0.5"
        >
          ✏️ 管理菜品
        </Link>
      </div>

      {/* 三个分类区域 */}
      {initialCategories.length === 0 ? (
        <div className="text-center py-20">
          <div className="flex justify-center gap-3 mb-4">
            <span className="text-5xl">🍜</span>
            <span className="text-5xl">🍕</span>
            <span className="text-5xl">🍣</span>
          </div>
          <p className="text-gray-400 text-lg mb-1">还没有菜品哦</p>
          <p className="text-pink-300/80 text-sm mb-6">
            点击上方「管理菜品」开始记录我们的美食吧 💕
          </p>
          <Link
            href="/admin"
            className="inline-block px-8 py-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg shadow-pink-200/50"
          >
            去添加
          </Link>
        </div>
      ) : (
        initialCategories.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))
      )}
    </main>
  );
}
