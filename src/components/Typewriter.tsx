"use client";

import { useEffect, useState } from "react";

export default function Typewriter({ text, speed = 120 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        const charToAdd = text.charAt(index);
        setDisplayedText((prev) => prev + charToAdd);
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      <span className="typewriter-cursor" />
    </span>
  );
}
