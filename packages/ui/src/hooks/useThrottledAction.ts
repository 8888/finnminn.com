import { useState, useCallback, useRef } from 'react';

interface ThrottledActionOptions {
  /**
   * Minimum time between executions in milliseconds.
   */
  cooldown?: number;
}

/**
 * A hook to wrap an async action, preventing it from being executed again
 * if it's already pending or if the cooldown period hasn't elapsed.
 * This implements a leading-edge throttle/lockout pattern.
 */
export function useThrottledAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
  options: ThrottledActionOptions = {}
) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const lastCallRef = useRef<number>(0);
  const { cooldown = 0 } = options;

  const cooldownRef = useRef(cooldown);
  cooldownRef.current = cooldown;

  const execute = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
      const now = Date.now();

      if (isPending || now - lastCallRef.current < cooldownRef.current) {
        return undefined;
      }

      setIsPending(true);
      setError(null);
      lastCallRef.current = now;

      try {
        return await action(...args);
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        setError(err);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [action, isPending]
  );

  return {
    execute,
    isPending,
    error,
    resetError: () => setError(null),
  };
}
