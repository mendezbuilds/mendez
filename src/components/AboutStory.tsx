"use client";

import React, { useEffect, useState } from "react";
import ScrollReveal from "./ScrollReveal";

interface AboutStoryProps {
  defaultStory: string;
}

export default function AboutStory({ defaultStory }: AboutStoryProps) {
  const [story, setStory] = useState(defaultStory);

  useEffect(() => {
    const isMock = localStorage.getItem("mendez_mock_auth") === "true";
    const localStory = localStorage.getItem("mendez_about_story");
    if (localStory && (isMock || !defaultStory)) {
      setStory(localStory);
    }
  }, [defaultStory]);

  const paragraphs = story.split("\n\n").filter((p) => p.trim() !== "");

  return (
    <div style={{ marginTop: "2.5rem" }}>
      {paragraphs.map((para, index) => (
        <ScrollReveal key={index} delay={index * 150} className="reveal-hidden">
          <p className="body-text about-text-reveal">{para}</p>
        </ScrollReveal>
      ))}
    </div>
  );
}
