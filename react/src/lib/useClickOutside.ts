import { useEffect, type RefObject } from "react";

/**
 * Calls `onOutside` when a pointer goes down outside `ref`. Listens on
 * pointerdown rather than click so a menu closes before the click lands
 * on whatever is underneath it.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
  active = true,
) {
  useEffect(() => {
    if (!active) return;
    const onPointerDown = (event: PointerEvent) => {
      const element = ref.current;
      if (element && event.target instanceof Node && !element.contains(event.target)) {
        onOutside();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [ref, onOutside, active]);
}
