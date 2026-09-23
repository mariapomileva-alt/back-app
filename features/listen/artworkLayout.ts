import type { ListenSoundId } from '@/features/listen/sounds';

/** Runtime trim targets — see `assets/listen-art/runtime/manifest.json`. */
export const LISTEN_ART_MAX_WIDTH = 460;
export const LISTEN_ART_HORIZONTAL_INSET = 12;
export const LISTEN_ART_MIN_HEIGHT = 140;
export const LISTEN_ART_MAX_HEIGHT = 420;
/** Full computed size — slot height + flex spacer keep transport clear of the loop. */
export const LISTEN_ART_DISPLAY_SCALE = 1;
/** Inset inside the art band so trimmed loops keep soft margins visible (each edge). */
export const LISTEN_ART_CONTENT_INSET = 0.035;

const ART_ASPECT_BY_SOUND: Partial<Record<ListenSoundId, number>> = {
  rain: 1.6667,
  ocean: 1.9565,
  stream: 1.6901,
  forest: 1.6667,
  birds: 1.6667,
  fan: 1.7609,
  brown: 1.6701,
  white: 2.2925,
};

const DEFAULT_ART_ASPECT = 1.667;

export function listenArtAspectRatio(soundId: ListenSoundId): number {
  return ART_ASPECT_BY_SOUND[soundId] ?? DEFAULT_ART_ASPECT;
}

export type ListenArtworkSize = {
  width: number;
  height: number;
};

export function computeListenArtworkSize(
  screenWidth: number,
  soundId: ListenSoundId,
  options?: { minHeight?: number; maxHeight?: number },
): ListenArtworkSize {
  const aspect = listenArtAspectRatio(soundId);
  const minHeight = options?.minHeight ?? LISTEN_ART_MIN_HEIGHT;
  const maxHeight = options?.maxHeight ?? LISTEN_ART_MAX_HEIGHT;

  const maxWidth = Math.min(
    Math.max(0, screenWidth - LISTEN_ART_HORIZONTAL_INSET),
    LISTEN_ART_MAX_WIDTH,
  );
  let width = maxWidth;
  let height = width / aspect;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspect;
  }

  const trialWidth = minHeight * aspect;
  if (height < minHeight && trialWidth <= maxWidth) {
    height = minHeight;
    width = trialWidth;
  }

  width = Math.min(width, maxWidth);
  height = width / aspect;

  width = Math.round(width * LISTEN_ART_DISPLAY_SCALE);
  height = Math.round(height * LISTEN_ART_DISPLAY_SCALE);

  return { width, height };
}

/** Play row + volume label + slider (no status line under title). */
export const LISTEN_CONTROLS_MIN_HEIGHT = 152;

export function listenLayoutGaps(compact: boolean) {
  return {
    /** Space between art bottom and transport — keep play/volume off the loop. */
    artToPlayback: compact ? 10 : 12,
    playbackToVolume: compact ? 16 : 18,
  };
}

/** Fallback art height before stage layout (no title — art-first layout). */
export function listenArtMinHeightForScreen(windowHeight: number, compact: boolean): number {
  const ratio = compact ? 0.58 : 0.66;
  return Math.round(windowHeight * ratio);
}

/** @deprecated Use listenArtMinHeightForScreen — kept for QA scripts. */
export function listenArtMaxHeightForScreen(
  windowHeight: number,
  compact: boolean,
): number {
  return listenArtMinHeightForScreen(windowHeight, compact);
}
