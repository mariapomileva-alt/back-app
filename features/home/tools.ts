import type { Href } from 'expo-router';

import type { HomeToolId } from '@/types';

export type HomeTool = {
  id: HomeToolId;
  href: Href;
};

export const homeTools: HomeTool[] = [
  { id: 'breathe', href: '/breathe' },
  { id: 'distract', href: '/distract' },
  { id: 'ground', href: '/ground' },
  { id: 'move', href: '/move' },
  { id: 'listen', href: '/listen' },
  { id: 'read', href: '/read' },
];
