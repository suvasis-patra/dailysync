interface LenisInstance {
  scrollTo: (
    target: HTMLElement | string | number,
    options?: { offset?: number; [key: string]: unknown },
  ) => void;
}

export type TChannel = {
  label: string;
  value: string;
};

declare global {
  interface Window {
    __lenis?: LenisInstance;
  }
}

/**
 * Smoothly scrolls to a DOM element by its ID.
 * Accounts for a potential global Lenis scroll controller.
 */
export function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -80 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
