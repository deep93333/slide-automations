import { useCallback, useLayoutEffect, useRef } from "react";

import type { AutomationDraft } from "@/domain/types";
import type { DraftPatch } from "@/store/reducer";

type Field = "message" | "reply";

/**
 * One chip row serves both message boxes. A token goes into the box that was
 * last in use, at its caret, and falls back to the message — the box that
 * must be filled.
 */
export function useTokenInsertion(draft: AutomationDraft, patch: (patch: DraftPatch) => void) {
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);
  const lastFocused = useRef<Field>("message");
  const pendingCaret = useRef<{ element: HTMLTextAreaElement; position: number } | null>(null);

  // Put the caret after the token once the new value has rendered.
  useLayoutEffect(() => {
    const pending = pendingCaret.current;
    if (!pending) return;
    pendingCaret.current = null;
    pending.element.focus();
    pending.element.setSelectionRange(pending.position, pending.position);
  });

  const trackFocus = useCallback((field: Field) => {
    lastFocused.current = field;
  }, []);

  const insertToken = useCallback(
    (token: string) => {
      const toReply = draft.kind === "keyword" && lastFocused.current === "reply" && replyRef.current !== null;
      const element = toReply ? replyRef.current : messageRef.current;
      const current = toReply && draft.kind === "keyword" ? draft.reply : draft.message;
      const start = element?.selectionStart ?? current.length;
      const end = element?.selectionEnd ?? start;
      const next = current.slice(0, start) + token + current.slice(end);
      patch(toReply ? { reply: next } : { message: next });
      if (element) pendingCaret.current = { element, position: start + token.length };
    },
    [draft, patch],
  );

  return { messageRef, replyRef, trackFocus, insertToken };
}
