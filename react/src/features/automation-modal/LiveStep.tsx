import { Button } from "@/components/ui";
import { liveConfirmationCopy } from "@/domain/format";
import type { AutomationId } from "@/domain/types";
import { useAppDispatch, useAppState } from "@/store/hooks";

import styles from "./modal.module.css";

interface LiveStepProps {
  automationId: AutomationId;
  onCancel: () => void;
}

export function LiveStep({ automationId, onCancel }: LiveStepProps) {
  const { automations } = useAppState();
  const dispatch = useAppDispatch();
  const automation = automations.find((candidate) => candidate.id === automationId);

  return (
    <>
      <h2 className={styles.liveTitle}>Set it live?</h2>
      <p className={styles.liveCopy}>{automation ? liveConfirmationCopy(automation) : ""}</p>
      <div className={styles.liveActions}>
        <Button variant="ghost" tone="muted" size="md" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="success" onClick={() => dispatch({ type: "automation/confirmLive" })}>
          Set live
        </Button>
      </div>
    </>
  );
}
