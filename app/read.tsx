import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ExerciseShell } from '@/components/exercise/ExerciseShell';
import { ReadPlay } from '@/components/read/ReadPlay';
import {
  beginReadSession,
  createReadSession,
  extendReadSession,
  rememberShownId,
} from '@/features/read/attentionEngine';
import { loadReadPack } from '@/features/read/packs';
import { loadReadMemory, saveReadMemory } from '@/features/read/storage';
import type { ReadMemory, ReadSession } from '@/features/read/types';
import { useExerciseClose } from '@/hooks/useExerciseClose';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';

export default function ReadScreen() {
  const close = useExerciseClose('read');
  const { theme } = useTheme();
  const [memory, setMemory] = useState<ReadMemory | null>(null);
  const [session, setSession] = useState<ReadSession | null>(null);
  const [revealedCount, setRevealedCount] = useState(1);
  const shownItems = useRef(new Set<string>());
  const sessionRef = useRef<ReadSession | null>(null);
  const revealedCountRef = useRef(1);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    let cancelled = false;
    void loadReadMemory().then((stored) => {
      if (cancelled) {
        return;
      }
      const nextSession = createReadSession(loadReadPack(), stored);
      const started = beginReadSession(stored, nextSession);
      const first = nextSession.fragments[0];
      shownItems.current = new Set(first ? [first.itemId] : []);
      const withFirst = first ? rememberShownId(started, first.itemId, first.storyId) : started;
      setMemory(withFirst);
      setSession(nextSession);
      revealedCountRef.current = 1;
      setRevealedCount(1);
      void saveReadMemory(withFirst);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const persistItem = useCallback((itemId: string, storyId?: string) => {
    if (shownItems.current.has(itemId)) {
      return;
    }
    shownItems.current.add(itemId);
    setMemory((current) => {
      if (!current) {
        return current;
      }
      const next = rememberShownId(current, itemId, storyId);
      void saveReadMemory(next);
      return next;
    });
  }, []);

  const onReveal = useCallback(() => {
    const liveSession = sessionRef.current;
    const liveMemory = memory;
    if (!liveSession) {
      return;
    }

    const current = revealedCountRef.current;
    let sessionNow = liveSession;
    if (current >= sessionNow.fragments.length - 5 && liveMemory) {
      const extended = extendReadSession(loadReadPack(), liveMemory, sessionNow);
      if (extended.fragments.length > sessionNow.fragments.length) {
        sessionNow = extended;
        sessionRef.current = extended;
        setSession(extended);
      }
    }

    const next = Math.min(current + 1, sessionNow.fragments.length);
    revealedCountRef.current = next;
    const fragment = sessionNow.fragments[next - 1];
    if (fragment) {
      persistItem(fragment.itemId, fragment.storyId);
    }
    setRevealedCount(next);
  }, [memory, persistItem]);

  const fragments = session?.fragments;

  return (
    <ExerciseShell title={t('home.tools.read')} onClose={close} scroll={false}>
      {!session || !memory || !fragments || fragments.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <ReadPlay
          fragments={fragments}
          speed={memory.revealSpeed}
          revealedCount={revealedCount}
          onReveal={onReveal}
          onClose={close}
        />
      )}
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
