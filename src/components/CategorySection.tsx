import DishCard from "./DishCard";
import type { CategoryWithDishes } from "@/lib/db";

type Props = {
  category: CategoryWithDishes;
};

const themeColors: Record<string, {
  emoji: string;
  badgeBg: string;
  badgeText: string;
  titleColor: string;
  emptyBg: string;
  emptyBorder: string;
}> = {
  cook: {
    emoji: "👨‍🍳",
    badgeBg: "rgba(239,164,184,0.12)",
    badgeText: "#C16B83",
    titleColor: "#5C3D45",
    emptyBg: "rgba(239,164,184,0.04)",
    emptyBorder: "rgba(239,164,184,0.14)",
  },
  takeout: {
    emoji: "🛵",
    badgeBg: "rgba(232,168,124,0.12)",
    badgeText: "#B8825E",
    titleColor: "#5C453D",
    emptyBg: "rgba(232,168,124,0.04)",
    emptyBorder: "rgba(232,168,124,0.14)",
  },
  "dine-out": {
    emoji: "🍴",
    badgeBg: "rgba(193,107,131,0.12)",
    badgeText: "#9B5A6B",
    titleColor: "#5C3D45",
    emptyBg: "rgba(193,107,131,0.04)",
    emptyBorder: "rgba(193,107,131,0.14)",
  },
};

export default function CategorySection({ category }: Props) {
  const theme = themeColors[category.slug] || themeColors.cook;

  return (
    <section className="mb-12">
      {/* 分类标题 */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-3xl">{theme.emoji}</span>
        <h2 className="text-xl font-semibold" style={{ color: theme.titleColor }}>
          {category.name}
        </h2>
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{ background: theme.badgeBg, color: theme.badgeText }}
        >
          {category.dishes.length} 道
        </span>
      </div>

      {/* 菜品列表 */}
      {category.dishes.length === 0 ? (
        <div
          className="text-center py-10 rounded-[24px]"
          style={{
            background: theme.emptyBg,
            border: `1px dashed ${theme.emptyBorder}`,
          }}
        >
          <span className="text-4xl opacity-25">{theme.emoji}</span>
          <p className="text-[#B5A3AA] text-sm mt-2">还没有添加菜品</p>
        </div>
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
