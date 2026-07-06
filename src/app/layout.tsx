import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "我们的菜单 💕",
  description: "做饭、点外卖、出去吃，我们的美食记录",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="relative">
        {/* 浮动装饰 */}
        <div className="floating-decorations" aria-hidden="true">
          <span>💕</span>
          <span>🍜</span>
          <span>❤️</span>
          <span>🍕</span>
          <span>💖</span>
          <span>🍣</span>
          <span>💗</span>
          <span>🥘</span>
          <span>🌸</span>
          <span>✨</span>
        </div>

        {/* 内容层 */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
