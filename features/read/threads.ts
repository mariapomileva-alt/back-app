import type { CuriousItem, ObservationItem, WordItem } from './types';

export type ReadThread = {
  id: string;
  topics: string[];
  word: string;
  wordHint: string;
  lookAround: string;
  recall: string;
  observe: string[];
  fact: string[];
};

export const readThreads: ReadThread[] = [
  {
    id: 'water',
    topics: ['water', 'coast'],
    word: 'LAKE',
    wordHint: 'Notice how wide the A sits.',
    lookAround: 'If anything nearby can hold a reflection, rest your eyes there.',
    recall: 'Keep the water from a moment ago, even if you look away.',
    observe: ['Let this word sit like still water.', 'LAKE'],
    fact: ['A lake can be so still', 'it holds the sky without becoming it.'],
  },
  {
    id: 'coast',
    topics: ['coast', 'water'],
    word: 'TIDE',
    wordHint: 'In. Out. The letters stay.',
    lookAround: 'Find an edge — a rim, a frame, a shoreline of some kind.',
    recall: 'The tide from a moment ago can go on without you.',
    observe: ['Follow this word in and out once.', 'TIDE'],
    fact: ['A tide is the sea', 'remembering the moon.'],
  },
  {
    id: 'forest',
    topics: ['forest', 'plants', 'nature'],
    word: 'PINE',
    wordHint: 'Notice the I standing in the middle.',
    lookAround: 'Find a leaf-shape, even in a pattern, a print, or a shadow.',
    recall: 'Keep one tree from a moment ago.',
    observe: ['Let this word stand like a trunk.', 'PINE'],
    fact: ['Some trees share messages', 'through the soil, quietly.'],
  },
  {
    id: 'plants',
    topics: ['plants', 'forest', 'nature'],
    word: 'MOSS',
    wordHint: 'Notice how little it needs.',
    lookAround: 'Now find something green around you.',
    recall: 'The green from a moment ago can stay in the corner of your eye.',
    observe: ['A small word. Let it sit.', 'MOSS'],
    fact: ['Moss can dry almost completely', 'and then drink itself back.'],
  },
  {
    id: 'paper',
    topics: ['paper'],
    word: 'PAGE',
    wordHint: 'Notice the open A.',
    lookAround: 'Notice one piece of paper or cardboard near you.',
    recall: 'The unfinished sentence can wait.',
    observe: ['Let this word be a place, not a demand.', 'PAGE'],
    fact: ['Paper was once', 'mostly cloth rags.'],
  },
  {
    id: 'room',
    topics: ['room', 'home', 'quiet', 'objects'],
    word: 'WINDOW',
    wordHint: 'Count the letters without naming them.',
    lookAround: 'Look at one still object near you.',
    recall: 'The room from a moment ago is still doing its quiet work.',
    observe: ['Follow this word as it settles.', 'still'],
    fact: ['A window is a thin agreement', 'between inside and outside.'],
  },
  {
    id: 'sky',
    topics: ['sky', 'weather', 'night'],
    word: 'CLOUD',
    wordHint: 'Follow the curve of the C.',
    lookAround: 'Look up, even if only as far as the ceiling.',
    recall: 'Keep a little of that sky behind the next lines.',
    observe: ['Let this word drift once.', 'CLOUD'],
    fact: ['A cloud can drift for days', 'without landing.'],
  },
  {
    id: 'light',
    topics: ['light', 'night'],
    word: 'LAMP',
    wordHint: 'Let it sit.',
    lookAround: 'Notice where the light is coming from.',
    recall: 'The small circle of light can stay.',
    observe: ['Watch this word as if it were light leaving.', 'dusk'],
    fact: ['A shadow is only', 'the absence of light.'],
  },
  {
    id: 'stone',
    topics: ['stone', 'earth', 'objects'],
    word: 'STONE',
    wordHint: 'Notice the weight of the O.',
    lookAround: 'Find something with a little texture.',
    recall: 'The stone from a moment ago does not need you to carry it.',
    observe: ['Let this word have weight.', 'STONE'],
    fact: ['River stones get round', 'by patience, not by plan.'],
  },
];

export function threadMatches(topics: string[], thread: ReadThread): boolean {
  return topics.some((topic) => thread.topics.includes(topic) || topic === thread.id);
}

export function threadWordItem(thread: ReadThread): WordItem {
  return {
    id: `thread-${thread.id}-word`,
    type: 'word',
    fragments: [`Look at the word ${thread.word}.`, thread.word, thread.wordHint],
    topics: [thread.id, ...thread.topics],
    difficulty: 1,
  };
}

export function threadObserveItem(thread: ReadThread): ObservationItem {
  return {
    id: `thread-${thread.id}-observe`,
    type: 'observation',
    fragments: thread.observe,
    topics: [thread.id, ...thread.topics],
    difficulty: 1,
  };
}

export function threadLookItem(thread: ReadThread): ObservationItem {
  return {
    id: `thread-${thread.id}-look`,
    type: 'observation',
    fragments: [thread.lookAround],
    topics: [thread.id, ...thread.topics],
    difficulty: 1,
  };
}

export function threadFactItem(thread: ReadThread): CuriousItem {
  return {
    id: `thread-${thread.id}-fact`,
    type: 'curious',
    fragments: thread.fact,
    topics: [thread.id, ...thread.topics],
    difficulty: 1,
  };
}
