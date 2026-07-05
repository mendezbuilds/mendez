"use client";

import React, { useEffect, useRef } from "react";

interface ThreeDCardIconProps {
  shape?: "cube" | "tetrahedron" | "octahedron";
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function ThreeDCardIcon({ shape = "cube" }: ThreeDCardIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angleX = Math.random() * Math.PI;
    let angleY = Math.random() * Math.PI;

    let vertices: Point3D[] = [];
    let edges: [number, number][] = [];

    if (shape === "cube") {
      vertices = [
        { x: -1, y: -1, z: -1 },
        { x: 1, y: -1, z: -1 },
        { x: 1, y: 1, z: -1 },
        { x: -1, y: 1, z: -1 },
        { x: -1, y: -1, z: 1 },
        { x: 1, y: -1, z: 1 },
        { x: 1, y: 1, z: 1 },
        { x: -1, y: 1, z: 1 },
      ];
      edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];
    } else if (shape === "tetrahedron") {
      vertices = [
        { x: 0, y: -1.1, z: 0 },
        { x: 1.0, y: 0.8, z: -0.7 },
        { x: -1.0, y: 0.8, z: -0.7 },
        { x: 0, y: 0.8, z: 1.1 },
      ];
      edges = [
        [0, 1], [0, 2], [0, 3],
        [1, 2], [2, 3], [3, 1],
      ];
    } else {
      // octahedron
      vertices = [
        { x: 0, y: -1.3, z: 0 },
        { x: 0.9, y: 0, z: -0.9 },
        { x: -0.9, y: 0, z: -0.9 },
        { x: -0.9, y: 0, z: 0.9 },
        { x: 0.9, y: 0, z: 0.9 },
        { x: 0, y: 1.3, z: 0 },
      ];
      edges = [
        [0, 1], [0, 2], [0, 3], [0, 4],
        [5, 1], [5, 2], [5, 3], [5, 4],
        [1, 2], [2, 3], [3, 4], [4, 1],
      ];
    }

    // Scale shape
    vertices = vertices.map(v => ({ x: v.x * 12, y: v.y * 12, z: v.z * 12 }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const projected = vertices.map((v) => {
        // Rotate Y
        let x1 = v.x * cosY - v.z * sinY;
        let z1 = v.z * cosY + v.x * sinY;

        // Rotate X
        let y2 = v.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + v.y * sinX;

        // Perspective
        const d = 50;
        const scale = d / (d + z2);
        
        return {
          x: canvas.width / 2 + x1 * scale,
          y: canvas.height / 2 + y2 * scale,
        };
      });

      // Draw edges
      ctx.beginPath();
      edges.forEach(([u, v]) => {
        ctx.moveTo(projected[u].x, projected[u].y);
        ctx.lineTo(projected[v].x, projected[v].y);
      });
      ctx.strokeStyle = "rgba(201, 168, 76, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw vertices
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#c9a84c";
        ctx.shadowColor = "#c9a84c";
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      angleX += 0.008;
      angleY += 0.01;

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [shape]);

  return (
    <canvas
      ref={canvasRef}
      width={48}
      height={48}
      style={{
        width: "48px",
        height: "48px",
        display: "block",
        marginRight: "0.75rem",
        flexShrink: 0,
        background: "transparent"
      }}
    />
  );
}
