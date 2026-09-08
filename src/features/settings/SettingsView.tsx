import { Button, Divider, GlyphSlot, Icon, PageTitle, ProfileLockup, SectionLabel } from "@/components/ui";
import { avatarUrl } from "@/data/avatars";
import type { Account } from "@/domain/types";
import { useAppDispatch, useAppState } from "@/store/hooks";

import styles from "./settings.module.css";

export function SettingsView() {
  const { accounts } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <>
      <PageTitle>Settings</PageTitle>
      <SectionLabel className={styles.sectionLabel}>Accounts</SectionLabel>
      <div className={styles.accounts}>
        {accounts.map((account) => (
          <AccountRow key={account.handle} account={account} />
        ))}
        <Button
          variant="outline"
          className={styles.addAccount}
          icon={<Icon name="plus" size={11} />}
          onClick={() => dispatch({ type: "account/add" })}
        >
          Add account
        </Button>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.session}>
        {/* Signing out is not wired in the prototype. */}
        <Button variant="ghost" size="md">
          Sign out
        </Button>
        <div className={styles.danger}>
          <Button variant="ghost" tone="danger" size="md" onClick={() => dispatch({ type: "account/delete" })}>
            Delete account
          </Button>
          <p className={styles.dangerHint}>Permanently removes your accounts, automations and activity.</p>
        </div>
      </div>
    </>
  );
}

function AccountRow({ account }: { account: Account }) {
  const dispatch = useAppDispatch();
  return (
    <div className={styles.accountRow}>
      <GlyphSlot width={14} color="var(--color-text-secondary)" className={styles.platform}>
        {account.platform === "slack" ? <Icon name="type-slack" size={14} /> : <Icon name="account-x" size={13} />}
      </GlyphSlot>
      <ProfileLockup name={account.name} handle={account.handle} avatarSrc={avatarUrl(account.handle)} verified />
      <span className={styles.spacer} />
      <Button variant="ghost" tone="danger" onClick={() => dispatch({ type: "account/remove", handle: account.handle })}>
        Remove
      </Button>
    </div>
  );
}
