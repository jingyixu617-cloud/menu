import DishCard from "./DishCard";
import type { CategoryWithDishes } from "@/lib/db";

type Props = {
  category: CategoryWithDishes;
};

// 每个分类的配色方案
const themeColors: Record<string, {
  emoji: string;
  bg: string;
  border: string;
  badge: string;
  badgeText: string;
  title: string;
  emptyBg: string;
  emptyText: string;
}> = {
  cook: {
    emoji: "👨‍🍳",
    bg: "bg-orange-50/60",
    border: "border-orange-200/60",
    badge: "bg-orange-100",
    badgeText: "text-orange-700",
    title: "text-orange-800",
    emptyBg: "bg-orange-50/40",
    emptyText: "text-orange-300",
  },
  takeout: {
    emoji: "🛵",
    bg: "bg-amber-50/60",
    border: "border-amber-200/60",
    badge: "bg-amber-100",
    badgeText: "text-amber-700",
    title: "text-amber-800",
    emptyBg: "bg-amber-50/40",
    emptyText: "text-amber-300",
  },
  "dine-out": {
    emoji: "🍴",
    bg: "bg-pink-50/60",
    border: "border-pink-200/60",
    badge: "bg-pink-100",
    badgeText: "text-pink-700",
    title: "text-pink-800",
    emptyBg: "bg-pink-50/40",
    emptyText: "text-pink-300",
  },
};

export default function CategorySection({ category }: Props) {
  const theme = themeColors[category.slug] || themeColors.cook;

  return (
    <section className="mb-10">
      {/* 分类标题 */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl">{theme.emoji}</span>
        <h2 className={`text-xl font-bold ${theme.title}`}>{category.name}</h2>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${theme.badge} ${theme.badgeText}`}>
          {category.dishes.length} 道
        </span>
      </div>

      {/* 菜品列表 */}
      {category.dishes.length === 0 ? (
        <div className={`text-center py-12 rounded-2xl border border-dashed ${theme.border} ${theme.emptyBg}`}>
          <span className="text-4xl opacity-30">{theme.emoji}</span>
          <p className={`${theme.emptyText} text-sm mt-2`}>还没有添加菜品</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {category.dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} theme={theme} />
          ))}
        </div>
      )}
    </section>
  );
}
