"use client";

import React from "react";

interface HeroAvatarProps {
  defaultUrl: string | null;
}

export default function HeroAvatar({ defaultUrl }: HeroAvatarProps) {
  return (
    <div className="avatar-container">
      <div className="avatar-wrapper">
        {defaultUrl ? (
          <img
            src={defaultUrl}
            alt="Mendez Avatar"
            className="avatar-img"
          />
        ) : (
          <div className="avatar-monogram">M</div>
        )}
      </div>
      <div className="avatar-halo" />
    </div>
  );
}
