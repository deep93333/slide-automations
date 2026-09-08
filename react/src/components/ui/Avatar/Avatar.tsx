import { cn } from "@/lib/cn";

import styles from "./Avatar.module.css";

interface AvatarProps {
  src: string;
  size?: number;
  className?: string;
}

/** Decorative: the name it sits next to identifies the person. */
export function Avatar({ src, size = 17, className }: AvatarProps) {
  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn(styles.avatar, className)}
      style={{ width: size, height: size }}
    />
  );
}
