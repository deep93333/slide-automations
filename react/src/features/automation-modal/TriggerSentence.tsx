import { Menu, MenuItem, MenuRoot, MenuTrigger, ProfileLockup, TextInput } from "@/components/ui";
import { avatarUrl } from "@/data/avatars";
import type { AutomationDraft, ConfigMenu, PostScope } from "@/domain/types";
import type { DraftPatch } from "@/store/reducer";

import styles from "./modal.module.css";

interface TriggerSentenceProps {
  draft: AutomationDraft;
  accountName: string;
  menu: ConfigMenu | null;
  onMenu: (menu: ConfigMenu | null) => void;
  onPatch: (patch: DraftPatch) => void;
}

const SCOPES: ReadonlyArray<{ value: PostScope; label: string }> = [
  { value: "any", label: "any" },
  { value: "post", label: "a specific" },
];

const LEAD: Record<AutomationDraft["kind"], string> = {
  dm: "When someone new follows",
  keyword: "When someone replies with",
  slack: "When",
};

/** The trigger, read as a sentence, with its parameters set inline. */
export function TriggerSentence({ draft, accountName, menu, onMenu, onPatch }: TriggerSentenceProps) {
  const scopeOpen = menu === "scope";

  return (
    <div className={styles.sentence}>
      <span className={styles.clause}>
        <span>{LEAD[draft.kind]}</span>
        {draft.kind === "keyword" && (
          <TextInput
            value={draft.keyword}
            width={104}
            placeholder="keyword"
            aria-label="Keyword"
            // The keyword takes first focus when there is one.
            autoFocus
            onChange={(event) => onPatch({ keyword: event.target.value })}
          />
        )}
      </span>
      <span className={styles.clause}>
        {draft.kind === "keyword" && (
          <>
            <span>on</span>
            <MenuRoot open={scopeOpen} onClose={() => onMenu(null)}>
              <MenuTrigger
                label={SCOPES.find((scope) => scope.value === draft.scope)?.label ?? "any"}
                open={scopeOpen}
                onClick={() => onMenu(scopeOpen ? null : "scope")}
              />
              <Menu open={scopeOpen} elevated label="Which posts">
                {SCOPES.map((scope) => (
                  <MenuItem
                    key={scope.value}
                    checked={draft.scope === scope.value}
                    onSelect={() => {
                      onPatch({ scope: scope.value });
                      onMenu(null);
                    }}
                  >
                    {scope.label}
                  </MenuItem>
                ))}
              </Menu>
            </MenuRoot>
          </>
        )}
        <ProfileLockup name={accountName} handle={draft.account} avatarSrc={avatarUrl(draft.account)} verified />
        {draft.kind === "keyword" && <span>post</span>}
        {draft.kind === "slack" && <span>publishes a post</span>}
      </span>
    </div>
  );
}
