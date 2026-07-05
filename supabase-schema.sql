-- ============================
-- 菜单软件 - 数据库初始化脚本
-- 在 Supabase SQL Editor 中完整运行此脚本
-- ============================

-- 1. 删除旧表（如果存在，注意会清空数据）
DROP TABLE IF EXISTS dishes CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 2. 创建分类表
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL DEFAULT 0
);

-- 3. 开启 RLS 并允许所有人访问（无需登录）
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "允许所有人读取分类" ON categories FOR SELECT USING (true);
CREATE POLICY "允许所有人新增分类" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "允许所有人更新分类" ON categories FOR UPDATE USING (true);
CREATE POLICY "允许所有人删除分类" ON categories FOR DELETE USING (true);

-- 4. 创建菜品表
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 开启 RLS 并允许所有人访问（无需登录）
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "允许所有人读取菜品" ON dishes FOR SELECT USING (true);
CREATE POLICY "允许所有人新增菜品" ON dishes FOR INSERT WITH CHECK (true);
CREATE POLICY "允许所有人更新菜品" ON dishes FOR UPDATE USING (true);
CREATE POLICY "允许所有人删除菜品" ON dishes FOR DELETE USING (true);

-- 6. 插入三个默认分类
INSERT INTO categories (name, slug, sort_order) VALUES
  ('做饭', 'cook', 1),
  ('点外卖', 'takeout', 2),
  ('出去吃', 'dine-out', 3);

-- 7. 删除旧的存储策略（避免重复运行报错）
DROP POLICY IF EXISTS "允许所有人读取图片" ON storage.objects;
DROP POLICY IF EXISTS "允许所有人上传图片" ON storage.objects;
DROP POLICY IF EXISTS "允许所有人更新图片" ON storage.objects;
DROP POLICY IF EXISTS "允许所有人删除图片" ON storage.objects;

-- 8. 创建图片存储桶（公开）
INSERT INTO storage.buckets (id, name, public)
VALUES ('dish-images', 'dish-images', true)
ON CONFLICT (id) DO NOTHING;

-- 9. 允许所有人操作图片
CREATE POLICY "允许所有人读取图片" ON storage.objects FOR SELECT USING (bucket_id = 'dish-images');
CREATE POLICY "允许所有人上传图片" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'dish-images');
CREATE POLICY "允许所有人更新图片" ON storage.objects FOR UPDATE USING (bucket_id = 'dish-images');
CREATE POLICY "允许所有人删除图片" ON storage.objects FOR DELETE USING (bucket_id = 'dish-images');

-- ============================
-- 完成！
-- ============================