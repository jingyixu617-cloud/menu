"use client";

import DishImage from "./DishImage";
import type { Dish } from "@/lib/db";

type Props = {
  dish: Dish;
};

export default function DishCard({ dish }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
        {dish.image_url ? (
          <DishImage
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full"
          />
        ) : (
          <span className="text-4xl text-gray-300">🍽️</span>
        )}
      </div>
      <div className="p-3 text-center">
        <h4 className="font-medium text-gray-800 text-sm truncate">
          {dish.name}
        </h4>
      </div>
    </div>
  );
}
