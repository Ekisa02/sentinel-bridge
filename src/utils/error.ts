export function toSafeError(e: unknown) {
  if (e instanceof Error) return { message: e.message, name: e.name };
  return { message: String(e) };
}
