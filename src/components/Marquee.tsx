"use client";

import React from "react";

const logos = [
  {
    name: "Ethereum",
    svg: (
      <svg viewBox="0 0 784 1277" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ height: "24px", width: "auto" }}>
        <path d="M392 0L383.5 28.5V870.5L392 879L784 648L392 0Z" fillOpacity="0.6"/>
        <path d="M392 0L0 648L392 879V470V0Z" fillOpacity="0.4"/>
        <path d="M392 956L387 962V1271.5L392 1277L784.5 725L392 956Z" fillOpacity="0.6"/>
        <path d="M392 1277V956L0 725L392 1277Z" fillOpacity="0.4"/>
        <path d="M392 879L784 648L392 555.5V879Z" fillOpacity="0.5"/>
        <path d="M0 648L392 879V555.5L0 648Z" fillOpacity="0.3"/>
      </svg>
    )
  },
  {
    name: "Solana",
    svg: (
      <svg viewBox="0 0 398 333" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ height: "18px", width: "auto" }}>
        <path d="M12.2 268.4h373.6c6.8 0 12.2 5.5 12.2 12.2v40.1c0 6.8-5.5 12.2-12.2 12.2H12.2C5.5 333 0 327.5 0 320.7v-40.1c0-6.8 5.5-12.2 12.2-12.2zM385.8 64.6H12.2C5.5 64.6 0 59.2 0 52.4V12.2C0 5.5 5.5 0 12.2 0h373.6c6.8 0 12.2 5.5 12.2 12.2v40.1c0 6.8-5.4 12.3-12.2 12.3zM385.8 198.8H12.2C5.5 198.8 0 193.3 0 186.6v-40.1c0-6.8 5.5-12.2 12.2-12.2h373.6c6.8 0 12.2 5.5 12.2 12.2v40.1c0 6.7-5.4 12.2-12.2 12.2z" />
      </svg>
    )
  },
  {
    name: "Next.js",
    svg: (
      <svg viewBox="0 0 180 180" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ height: "22px", width: "auto" }}>
        <path fillRule="evenodd" clipRule="evenodd" d="M90 180C139.706 180 180 139.706 180 90C180 40.2944 139.706 0 90 0C40.2944 0 0 40.2944 0 90C0 139.706 40.2944 180 90 180ZM147.747 137.746L98.5445 74.4539L94.6198 69.4589V124.636H83.829V55.364H94.6198L136.953 109.84V55.364H147.747V137.746ZM94.6198 124.636H105.411V83.1895L94.6198 69.4589V124.636Z" />
      </svg>
    )
  },
  {
    name: "Supabase",
    svg: (
      <svg viewBox="0 0 192 192" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ height: "22px", width: "auto" }}>
        <path d="M124.1 14.8c.8-1.5 2.7-2 4.2-1.2l49.4 28.5c1.5.8 2 2.7 1.2 4.2L124.7 141.2c-.8 1.5-2.7 2-4.2 1.2L111 136.8c-1.5-.8-2-2.7-1.2-4.2L124.1 14.8zM67.9 177.2c-.8 1.5-2.7 2-4.2 1.2L14.3 149.9c-1.5-.8-2-2.7-1.2-4.2L67.3 50.8c.8-1.5 2.7-2 4.2-1.2l9.5 5.6c1.5.8 2 2.7 1.2 4.2L67.9 177.2z" />
      </svg>
    )
  },
  {
    name: "Vercel",
    svg: (
      <svg viewBox="0 0 116 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ height: "20px", width: "auto" }}>
        <path d="M57.5 0L115 100H0L57.5 0Z" />
      </svg>
    )
  }
];

export default function Marquee() {
  // Duplicate arrays to facilitate standard infinite scrolling loop width
  const duplicateLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="marquee-container" style={{ margin: "2rem 0 4rem 0" }}>
      <div className="marquee-track">
        {duplicateLogos.map((logo, index) => (
          <div key={index} className="marquee-item">
            {logo.svg}
            <span className="marquee-label">{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
