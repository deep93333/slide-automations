import { motion, useReducedMotion } from "motion/react";
import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { enterMenu } from "@/lib/motion";
import { useClickOutside } from "@/lib/useClickOutside";

import { Icon } from "../Icon/Icon";
import styles from "./Menu.module.css";

/*
 * A dropdown in three parts: MenuRoot anchors the menu to its trigger and
 * closes it on an outside click or Escape; MenuTrigger is the control; Menu
 * is the list, with MenuItem rows that show a check for their state.
 */

interface MenuRootProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
}

export function MenuRoot({ open, onClose, className, children }: MenuRootProps) {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose, open);
  return (
    <div
      ref={ref}
      className={cn(styles.root, className)}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
}

interface MenuTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  open: boolean;
  /** `chip` is the bordered control inside a sentence; `text` is the quiet filter above a list. */
  variant?: "chip" | "text";
}

export function MenuTrigger({ label, open, variant = "chip", className, ...rest }: MenuTriggerProps) {
  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      className={cn(styles.trigger, variant === "chip" ? styles.chip : styles.text, className)}
      {...rest}
    >
      <span>{label}</span>
      <Icon name="chevron-down" size={10} className={styles.chevron} />
    </button>
  );
}

interface MenuProps {
  open: boolean;
  label: string;
  /** Which edge of the trigger the menu hangs from. */
  align?: "start" | "end";
  /** Gap between trigger and menu, in px. */
  offset?: number;
  minWidth?: number;
  /** Stacks above a modal panel. */
  elevated?: boolean;
  children: ReactNode;
}

export function Menu({
  open,
  label,
  align = "start",
  offset = 8,
  minWidth = 176,
  elevated = false,
  children,
}: MenuProps) {
  const reducedMotion = useReducedMotion();
  if (!open) return null;
  return (
    <motion.div
      role="menu"
      aria-label={label}
      className={cn(styles.menu, align === "end" ? styles.alignEnd : styles.alignStart, elevated && styles.elevated)}
      style={{
        top: `calc(100% + ${offset}px)`,
        minWidth,
        transformOrigin: align === "end" ? "top right" : "top left",
      }}
      initial={reducedMotion ? { opacity: 0.9 } : { opacity: 0.9, y: -2, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={enterMenu}
    >
      {children}
    </motion.div>
  );
}

interface MenuItemProps {
  checked: boolean;
  onSelect: () => void;
  /** `menuitemradio` for a pick-one menu, `menuitemcheckbox` for a multi-select. */
  role?: "menuitemradio" | "menuitemcheckbox";
  children: ReactNode;
}

export function MenuItem({ checked, onSelect, role = "menuitemradio", children }: MenuItemProps) {
  return (
    <button type="button" role={role} aria-checked={checked} className={styles.item} onClick={onSelect}>
      <span className={styles.itemLabel}>{children}</span>
      <span className={styles.check} data-checked={checked || undefined}>
        <Icon name="check" size={13} />
      </span>
    </button>
  );
}
