import { useCallback } from "react";

import { Modal } from "@/components/ui";
import { useAppDispatch, useAppState } from "@/store/hooks";

import { ConfigStep } from "./ConfigStep";
import { LiveStep } from "./LiveStep";
import { TypeStep } from "./TypeStep";

const LABELS = {
  type: "Choose an automation",
  config: "Configure automation",
  live: "Set it live?",
} as const;

/** One dialog for the three steps of an automation's life: pick a type, configure it, set it live. */
export function AutomationModal() {
  const { modal } = useAppState();
  const dispatch = useAppDispatch();
  const close = useCallback(() => dispatch({ type: "modal/close" }), [dispatch]);

  return (
    <Modal
      open={modal !== null}
      onClose={close}
      width={modal?.step === "live" ? 400 : 560}
      label={modal ? LABELS[modal.step] : LABELS.config}
    >
      {modal?.step === "type" && <TypeStep />}
      {modal?.step === "config" && <ConfigStep draft={modal.draft} menu={modal.menu} />}
      {modal?.step === "live" && <LiveStep automationId={modal.automationId} onCancel={close} />}
    </Modal>
  );
}
