import DishCard from "./DishCard";
import type { CategoryWithDishes } from "@/lib/db";

type Props = {
  category: CategoryWithDishes;
};

export default function CategorySection({ category }: Props) {
  const emojis: Record<string, string> = {
    cook: "👨‍🍳",
    takeout: "🛵",
    "dine-out": "🍴",
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{emojis[category.slug] || "🍽️"}</span>
        <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
        <span className="text-sm text-gray-400 ml-1">
          ({category.dishes.length})
        </span>
      </div>

      {category.dishes.length === 0 ? (
        <p className="text-gray-400 text-center py-8 bg-white rounded-xl border border-dashed border-gray-200">
          还没有添加菜品
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {category.dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
      )}
    </section>
  );
}
