import { Button, EmptyPlaceholder, Icon, ProfileLockup } from "@/components/ui";
import { avatarUrl } from "@/data/avatars";
import type { Account, Automation } from "@/domain/types";
import { useAppDispatch } from "@/store/hooks";

import { AutomationRow } from "./AutomationRow";
import styles from "./automations.module.css";

interface AccountGroupProps {
  account: Account;
  automations: Automation[];
}

/**
 * One section per account. An account with nothing yet still gets its header
 * and Add button — hide it and there is no way to create its first automation.
 */
export function AccountGroup({ account, automations }: AccountGroupProps) {
  const dispatch = useAppDispatch();
  const add = () => dispatch({ type: "modal/openTypePicker", account: account.handle });

  return (
    <section aria-label={`${account.name} automations`}>
      <div className={styles.groupHeader}>
        <ProfileLockup name={account.name} handle={account.handle} avatarSrc={avatarUrl(account.handle)} verified />
        <span className={styles.spacer} />
        <Button icon={<Icon name="plus" size={11} />} onClick={add}>
          Add automation
        </Button>
      </div>
      {automations.length > 0 ? (
        <div className={styles.rows}>
          {automations.map((automation) => (
            <AutomationRow key={automation.id} automation={automation} />
          ))}
        </div>
      ) : (
        <EmptyPlaceholder className={styles.empty} onClick={add}>
          No automations yet
        </EmptyPlaceholder>
      )}
    </section>
  );
}
