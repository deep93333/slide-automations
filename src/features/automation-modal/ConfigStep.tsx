import { useCallback } from "react";

import { Button, Menu, MenuItem, MenuRoot, MenuTrigger, MessageField, TextInput, TokenChip } from "@/components/ui";
import { SLACK_CHANNELS } from "@/data/seed";
import { DELAY_OPTIONS, canSubmitDraft, delayPhrase } from "@/domain/format";
import type { AutomationDraft, ConfigMenu } from "@/domain/types";
import { useAppDispatch, useAppState } from "@/store/hooks";
import type { DraftPatch } from "@/store/reducer";
import { selectAccountName } from "@/store/selectors";

import styles from "./modal.module.css";
import { TriggerSentence } from "./TriggerSentence";
import { useTokenInsertion } from "./useTokenInsertion";

interface ConfigStepProps {
  draft: AutomationDraft;
  menu: ConfigMenu | null;
}

const PLACEHOLDERS: Record<AutomationDraft["kind"], string> = {
  dm: "Hey there 👋 Thanks for following!",
  keyword: "Hey there 👋 Here’s the link you asked for",
  slack: "New post is live {link}",
};

export function ConfigStep({ draft, menu }: ConfigStepProps) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const patch = useCallback((next: DraftPatch) => dispatch({ type: "draft/patch", patch: next }), [dispatch]);
  const setMenu = (next: ConfigMenu | null) => dispatch({ type: "modal/setMenu", menu: next });
  const { messageRef, replyRef, trackFocus, insertToken } = useTokenInsertion(draft, patch);

  const isSlack = draft.kind === "slack";
  const isKeyword = draft.kind === "keyword";
  const editing = draft.id !== null;
  const chipOpen = menu === "chip";

  // One chip serves both types: a delay for messages, a channel for Slack.
  const chipLabel = draft.kind === "slack" ? draft.channel : delayPhrase(draft.delay);
  const thenCopy = isSlack
    ? "receives this message:"
    : draft.delay === 0
      ? "send this message:"
      : "then send this message:";
  const tokens = isSlack ? ["{link}", "{username}"] : ["{name}", "{username}"];

  return (
    <>
      <TriggerSentence
        draft={draft}
        accountName={selectAccountName(state, draft.account)}
        menu={menu}
        onMenu={setMenu}
        onPatch={patch}
      />

      {draft.kind === "keyword" && draft.scope === "post" && (
        <div className={styles.postUrl}>
          <TextInput
            fullWidth
            value={draft.postUrl}
            placeholder={`https://x.com/${draft.account.slice(1)}/status/…`}
            aria-label="Post link"
            onChange={(event) => patch({ postUrl: event.target.value })}
          />
        </div>
      )}

      <div className={styles.chipRow}>
        <MenuRoot open={chipOpen} onClose={() => setMenu(null)}>
          <MenuTrigger label={chipLabel} open={chipOpen} onClick={() => setMenu(chipOpen ? null : "chip")} />
          <Menu open={chipOpen} elevated label={isSlack ? "Slack channel" : "Delay"}>
            {draft.kind === "slack"
              ? SLACK_CHANNELS.map((channel) => (
                  <MenuItem
                    key={channel}
                    checked={draft.channel === channel}
                    onSelect={() => {
                      patch({ channel });
                      setMenu(null);
                    }}
                  >
                    {channel}
                  </MenuItem>
                ))
              : DELAY_OPTIONS.map((delay) => (
                  <MenuItem
                    key={delay}
                    checked={draft.delay === delay}
                    onSelect={() => {
                      patch({ delay });
                      setMenu(null);
                    }}
                  >
                    {delayPhrase(delay)}
                  </MenuItem>
                ))}
          </Menu>
        </MenuRoot>
        <span>{thenCopy}</span>
      </div>

      <div className={styles.composer}>
        <MessageField
          ref={messageRef}
          label="Message"
          value={draft.message}
          placeholder={PLACEHOLDERS[draft.kind]}
          height={88}
          autoFocus={!isKeyword}
          onFocus={() => trackFocus("message")}
          onChange={(message) => patch({ message })}
        />
      </div>

      <div className={styles.tokens}>
        {tokens.map((token) => (
          <TokenChip key={token} token={token} onInsert={insertToken} />
        ))}
      </div>

      {draft.kind === "keyword" && (
        <>
          <div className={styles.replyLine}>
            <span>and reply to their reply:</span>
            <span className={styles.optional}>(optional)</span>
          </div>
          <div className={styles.replyComposer}>
            <MessageField
              ref={replyRef}
              label="Public reply"
              value={draft.reply}
              placeholder="DM sent! Check your inbox 📩"
              height={44}
              onFocus={() => trackFocus("reply")}
              onChange={(reply) => patch({ reply })}
            />
          </div>
        </>
      )}

      <div className={styles.footer}>
        {editing && (
          <Button variant="ghost" tone="danger" size="md" onClick={() => dispatch({ type: "automation/delete" })}>
            Delete
          </Button>
        )}
        <span className={styles.spacer} />
        <Button disabled={!canSubmitDraft(draft)} onClick={() => dispatch({ type: "automation/submit" })}>
          {editing ? "Save" : "Add"}
        </Button>
      </div>
    </>
  );
}
