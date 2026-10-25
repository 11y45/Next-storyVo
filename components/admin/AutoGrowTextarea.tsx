// components/admin/AutoGrowTextarea.tsx
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { TextareaHTMLAttributes } from "react";

type AutoGrowTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value" | "rows"
> & { value: string };

/**
 * A textarea whose height always matches its content: no inner scrollbar,
 * no manual resizing. It re-measures when the text changes and when the
 * window is resized (because wrapping changes with the width).
 */
export function AutoGrowTextarea({
  value,
  className = "",
  ...props
}: AutoGrowTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto"; // reset first so it can also shrink
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useLayoutEffect(() => {
    fit();
  }, [value, fit]);

  useEffect(() => {
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      className={`${className} resize-none overflow-hidden`}
      {...props}
    />
  );
}
