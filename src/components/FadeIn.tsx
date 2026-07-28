"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Below-fold reveal only. Content stays visible until JS opts into motion
 * and the element is not yet in view — never hides SSR/no-JS content.
 */
export function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  /** false only after mount when motion is allowed and not yet intersecting */
  const [hiddenForMotion, setHiddenForMotion] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHiddenForMotion(false);
      setVisible(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    const alreadyInView =
      rect.top < window.innerHeight * 0.92 && rect.bottom > 0;

    if (alreadyInView) {
      setHiddenForMotion(false);
      setVisible(true);
      return;
    }

    setHiddenForMotion(true);
    setVisible(false);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const show = !hiddenForMotion || visible;

  return (
    <div
      ref={ref}
      className={`fade-in-motion ${className}`}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(6px)",
        transition: show
          ? `opacity var(--duration-slow, 280ms) var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1)) ${delay}ms, transform var(--duration-slow, 280ms) var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1)) ${delay}ms`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}
