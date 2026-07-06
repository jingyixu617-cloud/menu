import { getDishesByCategory, type CategoryWithDishes } from "@/lib/db";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  let categories: CategoryWithDishes[] = [];
  let error = "";

  try {
    categories = await getDishesByCategory();
  } catch (e: any) {
    error = e.message || "获取数据失败";
  }

  return <HomeClient initialCategories={categories} initialError={error} />;
}
