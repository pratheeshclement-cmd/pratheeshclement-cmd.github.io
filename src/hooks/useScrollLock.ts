import { useEffect, useRef } from 'react';

/**
 * Custom hook to lock body & Lenis smooth scrolling whenever a modal or overlay is open.
 * Prevents background mouse wheel, touch scroll, and keyboard scroll (Space, Arrows, PageUp/Down).
 * Restores exact previous scroll position and Lenis scrolling when modal closes.
 */
export function useScrollLock(isLocked: boolean, modalRef?: React.RefObject<HTMLElement | null>) {
  const scrollPosRef = useRef<number>(0);

  useEffect(() => {
    if (!isLocked) return;

    // Save exact scroll position
    scrollPosRef.current = window.scrollY;

    // 1. Pause Lenis smooth scroll
    const lenis = (window as any).__lenis__;
    if (lenis && typeof lenis.stop === 'function') {
      lenis.stop();
    }

    // 2. Lock body overflow & padding shift compensation
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // 3. Helper to check if event target is inside the scrollable modal container
    const isInsideModal = (target: Node | null): boolean => {
      if (!modalRef || !modalRef.current) return false;
      return modalRef.current.contains(target);
    };

    // 4. Wheel & Touchmove event listener (Prevent background scroll)
    const handleScrollEvent = (e: WheelEvent | TouchEvent) => {
      const target = e.target as Node | null;

      if (!isInsideModal(target)) {
        e.preventDefault();
        return;
      }

      // Check if inside modal and at scroll boundaries
      if (modalRef && modalRef.current) {
        const el = modalRef.current;
        const isWheel = 'deltaY' in e;
        const deltaY = isWheel ? (e as WheelEvent).deltaY : 0;

        const atTop = el.scrollTop <= 0 && deltaY < 0;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && deltaY > 0;

        if (atTop || atBottom) {
          e.preventDefault();
        }
      }
    };

    // 5. Keydown listener for scrolling keys (Space, Arrows, PageUp/Down, Home, End)
    const SCROLL_KEYS = [' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];
    const handleKeyDown = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.includes(e.key)) {
        const activeEl = document.activeElement;
        const isTextInput = activeEl && (
          activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true'
        );

        if (!isTextInput && !isInsideModal(activeEl)) {
          e.preventDefault();
        }
      }
    };

    // Attach listeners with passive: false to allow e.preventDefault()
    window.addEventListener('wheel', handleScrollEvent, { passive: false });
    window.addEventListener('touchmove', handleScrollEvent, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Restore body styles
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.body.style.touchAction = originalTouchAction;

      // Resume Lenis smooth scroll
      if (lenis && typeof lenis.start === 'function') {
        lenis.start();
      }

      // Remove listeners
      window.removeEventListener('wheel', handleScrollEvent);
      window.removeEventListener('touchmove', handleScrollEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLocked, modalRef]);
}
