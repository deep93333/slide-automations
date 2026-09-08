import { Toggle } from "@/components/ui";
import { AUTOMATION_TYPE_NAMES, automationPreview } from "@/domain/format";
import type { Automation } from "@/domain/types";
import { cn } from "@/lib/cn";
import { useAppDispatch } from "@/store/hooks";

import { AutomationKindGlyph } from "./AutomationKindGlyph";
import styles from "./automations.module.css";

export function AutomationRow({ automation }: { automation: Automation }) {
  const dispatch = useAppDispatch();
  const title = AUTOMATION_TYPE_NAMES[automation.kind];

  return (
    <div className={styles.row}>
      <button type="button" className={styles.edit} onClick={() => dispatch({ type: "modal/edit", id: automation.id })}>
        <AutomationKindGlyph kind={automation.kind} />
        <span className={styles.text}>
          <span className={styles.title}>{title}</span>
          <span className={styles.preview}>{automationPreview(automation)}</span>
        </span>
      </button>
      <span className={cn(styles.live, automation.active && styles.liveOn)} aria-hidden={!automation.active}>
        Live
      </span>
      <Toggle
        className={styles.toggle}
        checked={automation.active}
        label={`${title} is ${automation.active ? "live" : "paused"}`}
        onChange={() => dispatch({ type: "automation/toggle", id: automation.id })}
      />
    </div>
  );
}
