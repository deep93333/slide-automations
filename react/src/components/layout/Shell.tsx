import { Toast } from "@/components/ui";
import { ActivityView } from "@/features/activity/ActivityView";
import { AutomationModal } from "@/features/automation-modal/AutomationModal";
import { AutomationsView } from "@/features/automations/AutomationsView";
import { SettingsView } from "@/features/settings/SettingsView";
import { useAppDispatch, useAppState } from "@/store/hooks";

import styles from "./Shell.module.css";
import { Sidebar } from "./Sidebar";

export function Shell() {
  const { view, toast } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <>
      <Sidebar />
      <main className={styles.main}>
        {view === "automations" && <AutomationsView />}
        {view === "activity" && <ActivityView />}
        {view === "settings" && <SettingsView />}
      </main>
      <AutomationModal />
      {toast && (
        // Keyed by id so a replacement toast plays its entrance again.
        <Toast
          key={toast.id}
          message={toast.message}
          onUndo={toast.undo ? () => dispatch({ type: "toast/undo" }) : undefined}
        />
      )}
    </>
  );
}
