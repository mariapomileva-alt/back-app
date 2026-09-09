import { homeTools, type HomeTool } from '@/features/home/tools';
import type { HomeToolId } from '@/types';

/** Three other Home tools — never the one the user is leaving. */
export function alternativeTools(current?: HomeToolId | null, count = 3): HomeTool[] {
  return homeTools.filter((tool) => tool.id !== current).slice(0, count);
}
