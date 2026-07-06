"use client";

import React from "react";

const logos = [
  {
    name: "Next.js",
    svg: (
      <svg viewBox="0 0 180 180" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ height: "22px", width: "auto" }}>
        <path fillRule="evenodd" clipRule="evenodd" d="M90 180C139.706 180 180 139.706 180 90C180 40.2944 139.706 0 90 0C40.2944 0 0 40.2944 0 90C0 139.706 40.2944 180 90 180ZM147.747 137.746L98.5445 74.4539L94.6198 69.4589V124.636H83.829V55.364H94.6198L136.953 109.84V55.364H147.747V137.746ZM94.6198 124.636H105.411V83.1895L94.6198 69.4589V124.636Z" />
      </svg>
    )
  },
  {
    name: "Viem",
    svg: null
  },
  {
    name: "Wagmi",
    svg: null
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
    name: "PostgreSQL",
    svg: null
  },
  {
    name: "Hardhat",
    svg: null
  },
  {
    name: "ERC-20",
    svg: null
  },
  {
    name: "ERC-721",
    svg: null
  },
  {
    name: "Web3 Integration",
    svg: null
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
