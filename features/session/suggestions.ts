import { homeTools, type HomeTool } from '@/features/home/tools';
import type { HomeToolId } from '@/types';

export const MOVE_UNCOMFORTABLE_INTENT = 'moveUncomfortable';

/** Ground, Distract, Listen — not the first three Home tools. */
export const moveUncomfortableOffer = ['ground', 'distract', 'listen'] as const satisfies readonly HomeToolId[];

export function toolsInOrder(ids: readonly HomeToolId[]): HomeTool[] {
  const byId = new Map(homeTools.map((tool) => [tool.id, tool]));
  return ids.flatMap((id) => {
    const tool = byId.get(id);
    return tool ? [tool] : [];
  });
}

/** Three other Home tools — never the one the user is leaving. */
export function alternativeTools(current?: HomeToolId | null, count = 3): HomeTool[] {
  return homeTools.filter((tool) => tool.id !== current).slice(0, count);
}

export function alternativesForIntent(
  intent: string | undefined,
  current?: HomeToolId | null,
): HomeTool[] {
  if (intent === MOVE_UNCOMFORTABLE_INTENT) {
    return toolsInOrder(moveUncomfortableOffer);
  }
  return alternativeTools(current);
}
