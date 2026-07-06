"use client";

import DishImage from "./DishImage";
import type { Dish } from "@/lib/db";

type Props = {
  dish: Dish & { notes?: string | null };
};

export default function DishCard({ dish }: Props) {
  const notes = (dish as any).notes as string | undefined;

  return (
    <div
      className="group relative bg-white/75 backdrop-blur-sm rounded-[20px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
      style={{
        boxShadow: "0 4px 16px rgba(217, 124, 150, 0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(217, 124, 150, 0.10)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(217, 124, 150, 0.06)";
      }}
    >
      {/* 图片区域 */}
      <div className="aspect-square bg-gradient-to-br from-[#FFF7F3] to-[#F8D7DF]/40 flex items-center justify-center overflow-hidden">
        {dish.image_url ? (
          <DishImage
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 opacity-30 group-hover:opacity-45 transition-opacity">
            <span className="text-5xl">🍽️</span>
          </div>
        )}
      </div>

      {/* 文字区域 */}
      <div className="p-3 text-center">
        <h4
          className="font-medium text-sm truncate transition-colors duration-200"
          style={{ color: "#3E2A32" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#D97C96";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#3E2A32";
          }}
        >
          {dish.name}
        </h4>
        {notes && (
          <p className="text-xs text-[#B5A3AA] mt-0.5 truncate">{notes}</p>
        )}
      </div>

      {/* 悬浮光泽 */}
      <div
        className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}
