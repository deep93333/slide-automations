import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import styles from "./GlyphSlot.module.css";

interface GlyphSlotProps {
  /** Fixed width, so glyphs of different shapes line their neighbours up in one column. */
  width: number;
  color?: string;
  className?: string;
  children: ReactNode;
}

export function GlyphSlot({ width, color, className, children }: GlyphSlotProps) {
  return (
    <span className={cn(styles.slot, className)} style={{ width, color }}>
      {children}
    </span>
  );
}
