import { cn } from "@/lib/cn";

import styles from "./Divider.module.css";

export function Divider({ className }: { className?: string }) {
  return <hr className={cn(styles.divider, className)} />;
}
