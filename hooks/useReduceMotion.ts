import { useTheme } from '@/hooks/useTheme';

export function useReduceMotion(): boolean {
  const { reduceMotion } = useTheme();
  return reduceMotion;
}
