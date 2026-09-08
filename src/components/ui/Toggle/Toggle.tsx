import { cn } from "@/lib/cn";

import styles from "./Toggle.module.css";

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  /** Accessible name — the switch itself shows no text. */
  label: string;
  className?: string;
}

export function Toggle({ checked, onChange, label, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      data-on={checked || undefined}
      className={cn(styles.track, className)}
      onClick={onChange}
    >
      <span className={styles.knob} />
    </button>
  );
}
