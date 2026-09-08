import { useMemo, useRef, type Ref } from "react";

import { segmentMessage } from "@/domain/format";

import styles from "./MessageField.module.css";

export interface MessageFieldProps {
  value: string;
  onChange: (value: string) => void;
  /** Accessible name — the field has no visible label of its own. */
  label: string;
  height: number;
  placeholder?: string;
  autoFocus?: boolean;
  onFocus?: () => void;
  ref?: Ref<HTMLTextAreaElement>;
}

/** A message editor that highlights the {tokens} it will fill in. */
export function MessageField({ value, onChange, label, height, placeholder, autoFocus, onFocus, ref }: MessageFieldProps) {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const segments = useMemo(() => segmentMessage(value), [value]);

  return (
    <div className={styles.box}>
      <div className={styles.stack} style={{ height }}>
        <div ref={mirrorRef} className={styles.mirror} aria-hidden="true">
          {segments.map((segment, index) => (
            <span key={index} className={segment.token ? styles.token : undefined}>
              {segment.text}
            </span>
          ))}
        </div>
        <textarea
          ref={ref}
          className={styles.textarea}
          value={value}
          placeholder={placeholder}
          aria-label={label}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onChange={(event) => onChange(event.target.value)}
          onScroll={(event) => {
            if (mirrorRef.current) mirrorRef.current.scrollTop = event.currentTarget.scrollTop;
          }}
        />
      </div>
    </div>
  );
}
