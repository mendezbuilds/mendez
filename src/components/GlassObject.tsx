"use client";

import { useEffect, useRef } from "react";

// Icosahedron geometry data
const t = (1 + Math.sqrt(5)) / 2;
const vertices3D = [
  [-1,  t,  0], [ 1,  t,  0], [-1, -t,  0], [ 1, -t,  0],
  [ 0, -1,  t], [ 0,  1,  t], [ 0, -1, -t], [ 0,  1, -t],
  [ t,  0, -1], [ t,  0,  1], [-t,  0, -1], [-t,  0,  1]
].map(([x, y, z]) => {
  const len = Math.sqrt(x*x + y*y + z*z);
  return [x/len, y/len, z/len]; // Normalize to sphere of radius 1
});

const faces = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 8], [7, 1, 6],
  [3, 9, 4], [3, 4, 2], [3, 2, 8], [3, 8, 6], [3, 6, 9],
  [4, 9, 5], [2, 4, 11], [8, 2, 10], [6, 8, 7], [9, 6, 1]
];

export default function GlassObject() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Initial rotations
    let angleX = Math.random() * Math.PI;
    let angleY = Math.random() * Math.PI;
    let angleZ = 0;

    // Light source vector (from top-right-front, warm gold light)
    const light = { x: 0.6, y: -0.8, z: 1.0 };
    const lightLength = Math.sqrt(light.x*light.x + light.y*light.y + light.z*light.z);
    light.x /= lightLength;
    light.y /= lightLength;
    light.z /= lightLength;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      // Normalize values between -1 and 1
      mouseRef.current.targetX = x / (width / 2);
      mouseRef.current.targetY = y / (height / 2);
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smoothly interpolate mouse inputs
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Passive rotation + mouse influence
      angleX += 0.004 + mouse.y * 0.015;
      angleY += 0.005 + mouse.x * 0.015;
      angleZ += 0.001;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      // Scale 3D coordinates based on canvas size
      const scale = Math.min(width, height) * 0.35;
      const fov = 400; // Camera distance / perspective index

      // 1. Rotate and project vertices
      const projected = vertices3D.map(([x, y, z]) => {
        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // Rotate Z
        let x3 = x1 * cosZ - y2 * sinZ;
        let y3 = x1 * sinZ + y2 * cosZ;

        // Scale by our custom object scale factor
        const sx = x3 * scale;
        const sy = y3 * scale;
        const sz = z2 * scale;

        // Perspective Projection
        const distance = 400; // distance from camera
        const pz = sz + distance;
        const px = (sx * fov) / pz + width / 2;
        const py = (sy * fov) / pz + height / 2;

        return { x: px, y: py, z: sz, rx: sx, ry: sy, rz: sz };
      });

      // 2. Compute face details and depths
      const faceDetails = faces.map((faceIndices) => {
        const p0 = projected[faceIndices[0]];
        const p1 = projected[faceIndices[1]];
        const p2 = projected[faceIndices[2]];

        // Average Z for depth sorting
        const avgZ = (p0.z + p1.z + p2.z) / 3;

        // Normal calculation using rotated coordinates
        const ux = p1.rx - p0.rx;
        const uy = p1.ry - p0.ry;
        const uz = p1.rz - p0.rz;

        const vx = p2.rx - p0.rx;
        const vy = p2.ry - p0.ry;
        const vz = p2.rz - p0.rz;

        // Cross product
        let nx = uy * vz - uz * vy;
        let ny = uz * vx - ux * vz;
        let nz = ux * vy - uy * vx;

        // Normalize normal
        const nLength = Math.sqrt(nx*nx + ny*ny + nz*nz);
        nx /= nLength;
        ny /= nLength;
        nz /= nLength;

        // Compute dot product with light source (diffuse lighting component)
        const dot = nx * light.x + ny * light.y + nz * light.z;

        return {
          indices: faceIndices,
          avgZ,
          normalZ: nz,
          dot,
          points: [p0, p1, p2]
        };
      });

      // 3. Sort faces by depth: back-to-front (descending avgZ)
      // Since positive Z is closer to front, we sort descending to render back faces first
      faceDetails.sort((a, b) => b.avgZ - a.avgZ);

      // 4. Render faces
      faceDetails.forEach((face) => {
        const [p0, p1, p2] = face.points;

        // Calculate custom gradient shading
        const dot = face.dot;
        const intensity = Math.max(0, dot);
        
        // Emissive gold styling (warm gold key light, gold emissive wireframe)
        const baseAlpha = 0.05; // Transparent look
        const litAlpha = intensity * 0.18; // Shading highlight
        const alpha = baseAlpha + litAlpha;

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();

        // 3D Glass Face Gradient
        const grad = ctx.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
        // Gold tone colors: #C9A84C (RGB: 201, 168, 76)
        grad.addColorStop(0, `rgba(201, 168, 76, ${alpha})`);
        grad.addColorStop(0.5, `rgba(244, 218, 140, ${alpha * 0.6})`);
        grad.addColorStop(1, `rgba(12, 12, 12, 0.15)`);
        ctx.fillStyle = grad;
        ctx.fill();

        // Emissive Gold Outlines
        // Wireframes get brighter when facing the light
        const outlineAlpha = 0.08 + Math.max(0, intensity) * 0.45;
        ctx.strokeStyle = `rgba(201, 168, 76, ${outlineAlpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 5. Draw glowing vertex highlight points
      projected.forEach((v) => {
        // Vertex is visible if z is in front
        if (v.z > -100) {
          ctx.beginPath();
          ctx.arc(v.x, v.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(244, 218, 140, 0.85)`;
          ctx.fill();

          // Outer vertex ring glow
          ctx.beginPath();
          ctx.arc(v.x, v.y, 6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(201, 168, 76, 0.25)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (canvas) {
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "450px",
          maxWidth: "450px",
        }}
      />
    </div>
  );
}
