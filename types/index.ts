export type HomeToolId = 'breathe' | 'distract' | 'ground' | 'move' | 'listen' | 'read';

export type ToolId = HomeToolId | 'call';

export type SessionOutcome = 'better' | 'same' | 'worse';

export type SessionRecord = {
  id: string;
  startedAt: string;
  durationMs: number;
  tool: ToolId;
  outcome: SessionOutcome | null;
};

export type SupportContact = {
  id: string;
  name: string;
  phoneNumber?: string;
};
