type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void ? I
  : never;

type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W ? [...UnionToTuple<Exclude<T, W>>, W]
  : Array<T>;

export function isValidPayload<T>(
  payload: T,
  validationArray: UnionToTuple<keyof T>,
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
