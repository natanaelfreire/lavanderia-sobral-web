import { useRef } from "react";

export default function useDebounce(fn: Function, delay: number) {
  const timeoutRef = useRef<number | null>(null);

  function debounceFn(...args: any) {
    if (timeoutRef.current)
      window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      fn(...args);
    }, delay)
  }

  return debounceFn;
}