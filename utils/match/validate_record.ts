export function validateRecord<T>(
  object: T,
  validationArray: Array<keyof T>,
): boolean {
  // Check if length is the same.
  // Either required keys are not present.
  // Or illegal keys have been added.
  if (Object.keys(object).length !== validationArray.length) return false;

  // Check all keys to see if they're legal.
  for (const key in object) {
    if (!validationArray.includes(key)) return false;
  }

  return true;
}
