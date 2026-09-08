import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import styles from "./Typography.module.css";

export function PageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h1 className={cn(styles.pageTitle, className)}>{children}</h1>;
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn(styles.sectionLabel, className)}>{children}</h2>;
}
