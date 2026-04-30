const MIN_DELAY_MS = 10000;
const MAX_DELAY_MS = 20000;

export function getScrambledTitleDelayMs(randomValue = Math.random()) {
  return MIN_DELAY_MS + randomValue * (MAX_DELAY_MS - MIN_DELAY_MS);
}
