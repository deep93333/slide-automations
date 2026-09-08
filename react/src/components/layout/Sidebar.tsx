import { Icon, type IconName } from "@/components/ui";
import type { View } from "@/domain/types";
import { cn } from "@/lib/cn";
import { useAppDispatch, useAppState } from "@/store/hooks";

import styles from "./Sidebar.module.css";

const NAV: ReadonlyArray<{ view: View; label: string; icon: IconName }> = [
  { view: "automations", label: "Automations", icon: "nav-automations" },
  { view: "activity", label: "Activity", icon: "nav-activity" },
];

export function Sidebar() {
  const { view } = useAppState();
  const dispatch = useAppDispatch();
  const go = (next: View) => dispatch({ type: "view/set", view: next });

  return (
    <>
      <button type="button" className={styles.logo} onClick={() => go("automations")}>
        slide
      </button>
      <nav className={cn(styles.nav, styles.navTop)} aria-label="Primary">
        {NAV.map((item) => (
          <NavItem key={item.view} {...item} active={view === item.view} onClick={() => go(item.view)} />
        ))}
      </nav>
      <nav className={cn(styles.nav, styles.navBottom)} aria-label="Account">
        <NavItem
          label="Settings"
          icon="nav-settings"
          active={view === "settings"}
          onClick={() => go("settings")}
        />
      </nav>
    </>
  );
}

interface NavItemProps {
  label: string;
  icon: IconName;
  active: boolean;
  onClick: () => void;
}

function NavItem({ label, icon, active, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      className={cn(styles.item, active && styles.active)}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
    >
      <Icon name={icon} size={15} />
      <span>{label}</span>
    </button>
  );
}
