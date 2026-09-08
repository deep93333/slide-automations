import { motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";

import { enterToast } from "@/lib/motion";

import { Button } from "../Button/Button";
import styles from "./Toast.module.css";

interface ToastProps {
  message: string;
  onUndo?: () => void;
}

export function Toast({ message, onUndo }: ToastProps) {
  const reducedMotion = useReducedMotion();
  return createPortal(
    <motion.div
      role="status"
      className={styles.toast}
      initial={reducedMotion ? { opacity: 0.88, x: "-50%" } : { opacity: 0.88, x: "-50%", y: 3, scale: 0.995 }}
      animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
      transition={enterToast}
    >
      <span>{message}</span>
      {onUndo && (
        <Button variant="ghost" tone="onDark" onClick={onUndo}>
          Undo
        </Button>
      )}
    </motion.div>,
    document.body,
  );
}
