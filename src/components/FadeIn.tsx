"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Below-fold reveal only.
 * SSR / no-JS: always visible.
 * Motion: may hide only after mount if below fold, then reveal on intersect.
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
  const [show, setShow] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cancelled = false;
    let obs: IntersectionObserver | null = null;

    const frame = requestAnimationFrame(() => {
      if (cancelled) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setShow(true);
        setAnimate(false);
        return;
      }

      const rect = el.getBoundingClientRect();
      const alreadyInView =
        rect.top < window.innerHeight * 0.92 && rect.bottom > 0;

      if (alreadyInView) {
        setShow(true);
        setAnimate(true);
        return;
      }

      setAnimate(true);
      setShow(false);

      obs = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setShow(true);
            obs?.disconnect();
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
      );
      obs.observe(el);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      obs?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`fade-in-motion ${className}`}
      style={
        animate
          ? {
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(6px)",
              transition: show
                ? `opacity var(--duration-slow, 280ms) var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1)) ${delay}ms, transform var(--duration-slow, 280ms) var(--ease-out, cubic-bezier(0.22, 1, 0.36, 1)) ${delay}ms`
                : undefined,
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
