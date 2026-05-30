import { useEffect, useRef } from 'react';

export function useIdleLogout(onTimeout, enabled = true, timeoutMs = 30 * 60 * 1000) {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const resetTimer = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(onTimeout, timeoutMs);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((eventName) => window.addEventListener(eventName, resetTimer));
    resetTimer();

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      events.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
    };
  }, [enabled, onTimeout, timeoutMs]);
}