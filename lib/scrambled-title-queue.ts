type ScrambledTitleQueueOptions = {
  title: string;
  candidates: string[];
  shuffle: <T>(items: T[]) => T[];
};

export function createScrambledTitleQueue({
  title,
  candidates,
  shuffle,
}: ScrambledTitleQueueOptions) {
  const source = candidates.length > 0 ? candidates : [title];
  let queue = shuffle([...source]);
  let lastTarget = title;

  const refill = () => {
    queue = shuffle([...source]);
  };

  return {
    next() {
      if (queue.length === 0) {
        refill();
      }

      const firstDifferentIndex = queue.findIndex((candidate) => candidate !== lastTarget);

      if (firstDifferentIndex >= 0) {
        const [firstDifferent] = queue.splice(firstDifferentIndex, 1);
        lastTarget = firstDifferent ?? title;
        return lastTarget;
      }

      lastTarget = queue.shift() ?? title;
      return lastTarget;
    },
  };
}
