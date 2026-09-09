import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ToolCard } from '@/components/cards/ToolCard';
import { DistractActivityMark } from '@/components/distract/ActivityMarks';
import { ExerciseShell } from '@/components/exercise/ExerciseShell';
import { AppText } from '@/components/typography/AppText';
import {
  distractActivityHref,
  distractActivityIds,
  isDistractActivityId,
  wantsDistractChooser,
} from '@/features/distract/activities';
import { homeCardBorder } from '@/features/home/surfaces';
import { useExerciseClose } from '@/hooks/useExerciseClose';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { loadLastDistractActivity, saveLastDistractActivity } from '@/storage/preferences';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function DistractMenuScreen() {
  const close = useExerciseClose('distract');
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ choose?: string | string[] }>();
  const [ready, setReady] = useState(false);
  const choose = wantsDistractChooser(params.choose);

  useEffect(() => {
    let cancelled = false;

    void loadLastDistractActivity().then((stored) => {
      if (cancelled) {
        return;
      }
      if (!choose && isDistractActivityId(stored)) {
        router.replace(distractActivityHref(stored));
        return;
      }
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [choose, router]);

  if (!ready) {
    return (
      <ExerciseShell title={t('home.tools.distract')} onClose={close} scroll={false}>
        <View style={styles.body} />
      </ExerciseShell>
    );
  }

  const rows = [distractActivityIds.slice(0, 2), distractActivityIds.slice(2, 4)];

  return (
    <ExerciseShell title={t('home.tools.distract')} onClose={close}>
      <AppText style={styles.choose}>{t('distract.choose')}</AppText>
      <View style={styles.grid}>
        {rows.map((row) => (
          <View key={row.join('-')} style={styles.row}>
            {row.map((id) => (
              <ToolCard
                key={id}
                label={t(`distract.activities.${id}`)}
                visual={
                  <View pointerEvents="none" style={styles.mark} accessible={false}>
                    <DistractActivityMark id={id} />
                  </View>
                }
                onPress={() => {
                  void saveLastDistractActivity(id);
                  router.replace(distractActivityHref(id));
                }}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: homeCardBorder(theme),
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  choose: {
    fontFamily: serif,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '500',
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  grid: {
    gap: 10,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  mark: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
});
