
function assertNotNull<T>(value: T | null | undefined, msg = 'Expected non-null'): asserts value is T {
  if (value == null) throw new Error(msg);
}
