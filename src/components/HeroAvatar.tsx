"use client";

import React, { useEffect, useState } from "react";

interface HeroAvatarProps {
  defaultUrl: string | null;
}

export default function HeroAvatar({ defaultUrl }: HeroAvatarProps) {
  const [url, setUrl] = useState<string | null>(defaultUrl);

  useEffect(() => {
    // Retrieve mock avatar from localStorage if mock auth is active
    const isMock = localStorage.getItem("mendez_mock_auth") === "true";
    const localAvatar = localStorage.getItem("mendez_mock_avatar");
    if (localAvatar && (isMock || !defaultUrl)) {
      setUrl(localAvatar);
    }
  }, [defaultUrl]);

  return (
    <div className="avatar-container">
      <div className="avatar-wrapper">
        {url ? (
          <img
            src={url}
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
