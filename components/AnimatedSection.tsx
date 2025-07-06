"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: "fade-in" | "fade-in-up" | "fade-in-down" | "scale-in";
  threshold?: number;
}

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  animation = "fade-in-up",
  threshold = 0.1,
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        }
      },
      {
        threshold,
        rootMargin: "50px",
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold, hasAnimated]);

  const getAnimationClass = () => {
    if (!isVisible) return "opacity-0";

    switch (animation) {
      case "fade-in":
        return "animate-fade-in";
      case "fade-in-up":
        return "animate-fade-in-up";
      case "fade-in-down":
        return "animate-fade-in-down";
      case "scale-in":
        return "animate-scale-in";
      default:
        return "animate-fade-in-up";
    }
  };

  return (
    <div
      ref={elementRef}
      className={`${className} ${getAnimationClass()} transition-opacity duration-300`}
    >
      {children}
    </div>
  );
}
