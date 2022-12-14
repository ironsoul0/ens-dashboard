import { useEffect, useState } from "react";

const DEFAULT_BOUNCE_MS = 500;

export const useDebounce = <T>(value: T, delay?: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedValue(value),
      delay || DEFAULT_BOUNCE_MS
    );

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
