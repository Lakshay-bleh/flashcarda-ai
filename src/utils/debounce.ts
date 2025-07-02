export function debounce<T extends (...args: unknown[]) => void>(func: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: unknown[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  } as T;
}
