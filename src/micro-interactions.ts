import { animate } from "motion/mini";

// Entrance transitions only. Nothing moves in response to the cursor —
// buttons, rows and cards all announce hover by changing colour instead,
// so no element shifts under the pointer.
const softEase: [number, number, number, number] = [0.22, 1, 0.36, 1];
const settleTransition = { duration: 0.16, ease: softEase };

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const entered = new WeakSet<HTMLElement>();

const animateOpacity = (element: HTMLElement, from: number, duration = 0.14) => {
  animate(element, { opacity: [from, 1] }, { duration, ease: softEase });
};

const enterToast = (toast: HTMLElement) => {
  if (entered.has(toast)) return;
  entered.add(toast);
  animateOpacity(toast, 0.88, 0.15);

  if (reducedMotion.matches) return;
  const baseTransform = toast.style.transform || "translateX(-50%)";
  animate(
    toast,
    {
      transform: [
        `${baseTransform} translateY(3px) scale(0.995)`,
        `${baseTransform} translateY(0px) scale(1)`,
      ],
    },
    settleTransition,
  );
};

const enterModal = (overlay: HTMLElement) => {
  if (entered.has(overlay)) return;
  entered.add(overlay);
  animateOpacity(overlay, 0.92, 0.14);

  const panel = overlay.firstElementChild;
  if (!(panel instanceof HTMLElement) || reducedMotion.matches) return;
  animate(
    panel,
    {
      opacity: [0.92, 1],
      transform: [
        "translateY(4px) scale(0.995)",
        "translateY(0px) scale(1)",
      ],
    },
    settleTransition,
  );
};

const enterMenu = (menu: HTMLElement) => {
  if (entered.has(menu)) return;
  entered.add(menu);
  menu.style.transformOrigin = "top right";
  animateOpacity(menu, 0.9, 0.12);

  if (reducedMotion.matches) return;
  animate(
    menu,
    {
      transform: [
        "translateY(-2px) scale(0.995)",
        "translateY(0px) scale(1)",
      ],
    },
    { duration: 0.14, ease: softEase },
  );
};

const enhanceElement = (element: HTMLElement) => {
  const style = element.style;

  if (
    style.position === "fixed" &&
    style.left === "50%" &&
    style.bottom === "28px" &&
    style.zIndex === "40"
  ) {
    enterToast(element);
  } else if (
    style.position === "fixed" &&
    (style.zIndex === "10" || style.zIndex === "20") &&
    (style.inset === "0px" ||
      (style.top === "0px" &&
        style.right === "0px" &&
        style.bottom === "0px" &&
        style.left === "0px"))
  ) {
    enterModal(element);
  } else if (
    style.position === "absolute" &&
    (style.zIndex === "6" || style.zIndex === "25")
  ) {
    enterMenu(element);
  }

};

const enhanceTree = (root: ParentNode) => {
  if (root instanceof HTMLElement) enhanceElement(root);
  root.querySelectorAll<HTMLElement>("*").forEach(enhanceElement);
};

const observer = new MutationObserver((records) => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node instanceof Element) enhanceTree(node);
    }
  }
});

enhanceTree(document);
observer.observe(document, { childList: true, subtree: true });
