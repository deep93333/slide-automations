import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "success" | "outline" | "ghost";
/** Text tone, for the ghost variant. */
export type ButtonTone = "default" | "muted" | "danger" | "onDark";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  /** Text size for the ghost variant; the filled and outlined ones are always small. */
  size?: "sm" | "md";
  icon?: ReactNode;
}

const toneClass: Record<ButtonTone, string> = {
  default: styles.toneDefault,
  muted: styles.toneMuted,
  danger: styles.toneDanger,
  onDark: styles.toneOnDark,
};

export function Button({
  variant = "primary",
  tone = "default",
  size = "sm",
  icon,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const ghost = variant === "ghost";
  return (
    <button
      type={type}
      className={cn(
        styles.button,
        styles[variant],
        icon ? styles.withIcon : undefined,
        ghost && toneClass[tone],
        ghost && (size === "sm" ? styles.sizeSm : styles.sizeMd),
        className,
      )}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{children}</span>
    </button>
  );
}
