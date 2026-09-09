export type FocusShape = 'circle' | 'square' | 'pill';

export type FocusRound = {
  shape: FocusShape;
  colorKey: 'forest' | 'sage' | 'sand' | 'clay';
  options: Array<{
    shape: FocusShape;
    colorKey: 'forest' | 'sage' | 'sand' | 'clay';
    correct: boolean;
  }>;
};

export const focusRounds: FocusRound[] = [
  {
    shape: 'circle',
    colorKey: 'forest',
    options: [
      { shape: 'circle', colorKey: 'forest', correct: true },
      { shape: 'square', colorKey: 'forest', correct: false },
      { shape: 'circle', colorKey: 'sand', correct: false },
    ],
  },
  {
    shape: 'square',
    colorKey: 'sage',
    options: [
      { shape: 'pill', colorKey: 'sage', correct: false },
      { shape: 'square', colorKey: 'sage', correct: true },
      { shape: 'square', colorKey: 'clay', correct: false },
    ],
  },
  {
    shape: 'pill',
    colorKey: 'sand',
    options: [
      { shape: 'pill', colorKey: 'forest', correct: false },
      { shape: 'circle', colorKey: 'sand', correct: false },
      { shape: 'pill', colorKey: 'sand', correct: true },
    ],
  },
  {
    shape: 'circle',
    colorKey: 'clay',
    options: [
      { shape: 'circle', colorKey: 'clay', correct: true },
      { shape: 'circle', colorKey: 'sage', correct: false },
      { shape: 'square', colorKey: 'clay', correct: false },
    ],
  },
];
