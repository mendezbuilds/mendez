"use client";

import React, { useRef, useState } from "react";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className = "", ...props }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`${className}`}
      style={{
        position: "relative",
        overflow: "hidden"
      }}
      {...props}
    >
      {/* Spotlight background radial glow overlay */}
      {isFocused && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 0,
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, rgba(201, 168, 76, 0.08), transparent 80%)`
          }}
        />
      )}

      {/* Spotlight border glow layer */}
      {isFocused && (
        <div
          style={{
            position: "absolute",
            top: -1,
            left: -1,
            right: -1,
            bottom: -1,
            pointerEvents: "none",
            zIndex: 1,
            borderRadius: "inherit",
            border: "1px solid transparent",
            background: `radial-gradient(220px circle at ${coords.x}px ${coords.y}px, rgba(201, 168, 76, 0.4), transparent 80%)`,
            WebkitMaskImage: "linear-gradient(#fff, #fff)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude"
          }}
        />
      )}

      {/* Card content container above overlays */}
      <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {children}
      </div>
    </div>
  );
}
