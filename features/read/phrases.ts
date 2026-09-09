const MAX_FALLBACK_PHRASES = 8;

export function splitPhrases(text: string, prepared?: string[]): string[] {
  const fromPrepared = (prepared ?? []).map((part) => part.trim()).filter((part) => part.length > 0);
  if (fromPrepared.length > 0) {
    return fromPrepared;
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return [''];
  }

  const punctuated = trimmed
    .split(/(?<=[,.!?…])\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  if (punctuated.length >= 2) {
    return punctuated.slice(0, MAX_FALLBACK_PHRASES);
  }

  const words = trimmed.split(/\s+/);
  if (words.length <= 5) {
    return [trimmed];
  }

  const chunk = Math.ceil(words.length / Math.min(3, Math.max(2, Math.ceil(words.length / 5))));
  const phrases: string[] = [];
  for (let index = 0; index < words.length; index += chunk) {
    phrases.push(words.slice(index, index + chunk).join(' '));
  }
  return phrases.slice(0, MAX_FALLBACK_PHRASES);
}
