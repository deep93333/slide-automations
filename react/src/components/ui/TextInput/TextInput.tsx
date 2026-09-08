import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

import styles from "./TextInput.module.css";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  /** Fixed width in px, for an input set inside a sentence. */
  width?: number;
}

export function TextInput({ fullWidth = false, width, className, style, type = "text", ...rest }: TextInputProps) {
  return (
    <input
      type={type}
      className={cn(styles.input, fullWidth && styles.fullWidth, className)}
      style={{ width, ...style }}
      {...rest}
    />
  );
}
