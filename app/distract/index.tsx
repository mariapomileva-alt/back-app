import { StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { ToolCard } from '@/components/cards/ToolCard';
import { DistractActivityMark } from '@/components/distract/ActivityMarks';
import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import { AppText } from '@/components/typography/AppText';
import { distractActivityHref, distractActivityIds } from '@/features/distract/activities';
import { homeCardBorder } from '@/features/home/surfaces';
import { beginInternalSessionNavigation } from '@/features/session/activeSession';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { loadLastDistractActivity, saveLastDistractActivity } from '@/storage/preferences';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function DistractMenuScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [lastActivity, setLastActivity] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadLastDistractActivity().then((stored) => {
      if (!cancelled) {
        setLastActivity(stored);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const openActivity = (id: (typeof distractActivityIds)[number]) => {
    void saveLastDistractActivity(id);
    beginInternalSessionNavigation();
    router.replace(distractActivityHref(id));
  };

  const rows = [distractActivityIds.slice(0, 2), distractActivityIds.slice(2, 4)];

  return (
    <ActiveSessionScreen tool="distract" title={t('home.tools.distract')} showSessionActions={false}>
      <AppText style={styles.choose}>{t('distract.choose')}</AppText>
      <View style={styles.grid}>
        {rows.map((row) => (
          <View key={row.join('-')} style={styles.row}>
            {row.map((id) => (
              <ToolCard
                key={id}
                label={t(`distract.activities.${id}`)}
                selected={id === lastActivity}
                visual={
                  <View accessible={false} style={[styles.mark, { pointerEvents: 'none' }]}>
                    <DistractActivityMark id={id} />
                  </View>
                }
                onPress={() => openActivity(id)}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: id === lastActivity ? theme.colors.primary : homeCardBorder(theme),
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </ActiveSessionScreen>
  );
}

const styles = StyleSheet.create({
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
