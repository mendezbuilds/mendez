"use client";

import { useEffect, useState, useRef } from "react";

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export default function CountUp({ end, duration = 2000, prefix = "", suffix = "" }: CountUpProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          startAnimation();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    const startAnimation = () => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Cubic Easing Out: f(t) = 1 - (1 - t)^3
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeProgress * end);

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      requestAnimationFrame(animate);
    };

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [end, duration]);

  return (
    <span ref={elementRef} className="mono-text">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
