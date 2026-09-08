import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { enterOverlay, enterPanel } from "@/lib/motion";

import styles from "./Modal.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  width?: number;
  children: ReactNode;
}

export function Modal({ open, onClose, label, width = 560, children }: ModalProps) {
  const reducedMotion = useReducedMotion();
  // A drag that starts inside the panel and ends on the overlay is a text
  // selection, not a request to close.
  const pressedOverlay = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <motion.div
      className={styles.overlay}
      onPointerDown={(event) => {
        pressedOverlay.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && pressedOverlay.current) onClose();
      }}
      initial={{ opacity: 0.92 }}
      animate={{ opacity: 1 }}
      transition={enterOverlay}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={styles.panel}
        style={{ width }}
        initial={reducedMotion ? { opacity: 0.92 } : { opacity: 0.92, y: 4, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={enterPanel}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}
