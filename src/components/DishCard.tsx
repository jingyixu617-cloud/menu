"use client";

import DishImage from "./DishImage";
import type { Dish } from "@/lib/db";

type Props = {
  dish: Dish & { notes?: string | null };
  theme: {
    emptyBg: string;
    emptyText: string;
  };
};

export default function DishCard({ dish, theme }: Props) {
  const notes = (dish as any).notes as string | undefined;

  return (
    <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_2px_15px_rgba(244,114,182,0.08)] hover:shadow-[0_8px_30px_rgba(244,114,182,0.16)] hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
      {/* 图片区域 */}
      <div className="aspect-square bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center overflow-hidden">
        {dish.image_url ? (
          <DishImage
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-60 transition-opacity">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
      </div>

      {/* 文字区域 */}
      <div className="p-3 text-center">
        <h4 className="font-semibold text-gray-700 text-sm truncate group-hover:text-pink-600 transition-colors">
          {dish.name}
        </h4>
        {notes && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{notes}</p>
        )}
      </div>

      {/* 悬浮光泽效果 */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
