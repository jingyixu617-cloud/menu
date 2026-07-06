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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 page-container">
        <span className="text-6xl">😢</span>
        <p className="text-[#C16B83] text-sm">加载失败: {initialError}</p>
      </div>
    );
  }

  return (
    <div className="page-container pb-20">
      {/* 头部 */}
      <div className="text-center mb-12">
        <p className="text-sm tracking-[0.15em] text-[#B5A3AA] mb-2">
          ✨ 我们的美食小本本 ✨
        </p>
        <h1 className="text-4xl font-semibold bg-gradient-to-r from-[#D97C96] via-[#C16B83] to-[#E8A87C] bg-clip-text text-transparent">
          今天吃什么 💕
        </h1>
        <p className="text-[#B5A3AA] text-xs mt-2.5">
          做饭 · 外卖 · 出去吃，选一个吧
        </p>
        <Link
          href="/admin"
          className="inline-block mt-5 px-6 py-2.5 bg-gradient-to-r from-[#EFA4B8] to-[#D97C96] text-white rounded-full hover:from-[#E892A9] hover:to-[#C96B87] transition-all text-sm font-medium"
          style={{ boxShadow: "0 6px 16px rgba(217, 124, 150, 0.16)" }}
        >
          ✏️ 管理菜品
        </Link>
      </div>

      {/* 分类区域 */}
      {initialCategories.length === 0 ? (
        <div className="text-center py-20 rounded-[24px] bg-white/70 border border-[rgba(239,164,184,0.18)]"
          style={{ boxShadow: "0 12px 32px rgba(217, 124, 150, 0.05)" }}
        >
          <div className="flex justify-center gap-3 mb-4">
            <span className="text-5xl">🍜</span>
            <span className="text-5xl">🍕</span>
            <span className="text-5xl">🍣</span>
          </div>
          <p className="text-[#8B7B82] text-base mb-1">还没有菜品哦</p>
          <p className="text-[#B5A3AA] text-sm mb-6">
            点击上方「管理菜品」开始记录我们的美食吧 💕
          </p>
          <Link
            href="/admin"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#EFA4B8] to-[#D97C96] text-white rounded-full hover:from-[#E892A9] hover:to-[#C96B87] transition-all text-sm font-medium"
            style={{ boxShadow: "0 6px 16px rgba(217, 124, 150, 0.16)" }}
          >
            去添加
          </Link>
        </div>
      ) : (
        initialCategories.map((cat) => (
          <CategorySection key={cat.id} category={cat} />
        ))
      )}
    </div>
  );
}
