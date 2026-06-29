export const safeLoad = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

export const save = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
