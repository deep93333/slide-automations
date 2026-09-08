import styles from "./TokenChip.module.css";

interface TokenChipProps {
  token: string;
  onInsert: (token: string) => void;
}

/** Inserts a {token} into whichever message box was last in use. */
export function TokenChip({ token, onInsert }: TokenChipProps) {
  return (
    <button
      type="button"
      className={styles.chip}
      // Keep focus (and the caret) in the box the token is going into.
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onInsert(token)}
    >
      {token}
    </button>
  );
}
