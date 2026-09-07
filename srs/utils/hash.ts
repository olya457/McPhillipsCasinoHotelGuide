const HASH_MODULUS = 2147483647;
const HASH_FACTOR = 16777619;

export const hashString = (value: string) => {
  let hash = 2166136261 % HASH_MODULUS;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index) * HASH_FACTOR) % HASH_MODULUS;
  }
  return hash;
};

export const seededPercent = (value: string) => hashString(value) % 100;

export const createId = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
