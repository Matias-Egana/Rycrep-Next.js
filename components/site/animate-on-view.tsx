"use client";

import { useEffect, useRef, useState } from "react";

type AnimateOnViewProps = {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
};

export function AnimateOnView({ children, delayMs = 0, className = "" }: AnimateOnViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-[2px]"} ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
