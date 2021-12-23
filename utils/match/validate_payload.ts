export function isValidPayload<T>(
  payload: T,
  validationArray: (keyof T)[],
): boolean {
  // Check if length is the same.
  // Either required keys are not present.
  // Or illegal keys have been added.
  const keys = Object.keys(payload) as Array<keyof T>;
  if (keys.length !== validationArray.length) return false;

  // Check all keys to see if they're legal.
  for (const key of keys) {
    if (!validationArray.includes(key)) return false;
  }

  return true;
}
