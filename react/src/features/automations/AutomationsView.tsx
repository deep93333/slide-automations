import { PageTitle } from "@/components/ui";
import { useAppState } from "@/store/hooks";
import { selectAutomationsFor } from "@/store/selectors";

import { AccountGroup } from "./AccountGroup";
import styles from "./automations.module.css";

export function AutomationsView() {
  const state = useAppState();

  return (
    <>
      <PageTitle>Automations</PageTitle>
      <div className={styles.groups}>
        {state.accounts.map((account) => (
          <AccountGroup
            key={account.handle}
            account={account}
            automations={selectAutomationsFor(state, account.handle)}
          />
        ))}
      </div>
      {state.accounts.length === 0 && (
        <p className={styles.noAccounts}>No accounts connected. Add one in Settings.</p>
      )}
    </>
  );
}
