"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

export default function ScrollReveal({
  children,
  className = "reveal-hidden",
  activeClassName = "reveal-visible",
  threshold = 0.15,
  rootMargin = "0px 0px -50px 0px",
  delay = 0,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (element) {
                element.classList.add(activeClassName);
              }
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [activeClassName, delay, rootMargin, threshold]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
