"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export default function DishImage({ src, alt, className = "" }: Props) {
  const [zoomed, setZoomed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer object-cover transition-all duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        onClick={() => setZoomed(true)}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />

      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomed(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300"
          />
          <button
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 text-white rounded-full text-xl backdrop-blur-sm transition-colors"
            onClick={() => setZoomed(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* 图片加载前的骨架占位 */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF7F3] to-[#F8D7DF]/40 animate-pulse" />
      )}
    </>
  );
}
