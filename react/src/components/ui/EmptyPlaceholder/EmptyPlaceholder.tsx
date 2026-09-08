import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import styles from "./EmptyPlaceholder.module.css";

interface EmptyPlaceholderProps {
  onClick: () => void;
  className?: string;
  children: ReactNode;
}

/** A dashed slot where content will go, doubling as the way to create it. */
export function EmptyPlaceholder({ onClick, className, children }: EmptyPlaceholderProps) {
  return (
    <button type="button" className={cn(styles.placeholder, className)} onClick={onClick}>
      {children}
    </button>
  );
}
