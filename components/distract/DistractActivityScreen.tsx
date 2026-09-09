import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ExerciseShell } from '@/components/exercise/ExerciseShell';
import type { DistractActivityId } from '@/features/distract/activities';
import { useRememberDistractActivity } from '@/features/distract/useRememberActivity';
import { t } from '@/locales/i18n';

type Props = {
  activity: DistractActivityId;
  children: ReactNode;
};

export function DistractActivityScreen({ activity, children }: Props) {
  const router = useRouter();
  useRememberDistractActivity(activity);

  return (
    <ExerciseShell
      title={t('home.tools.distract')}
      onClose={() =>
        router.replace({
          pathname: '/distract',
          params: { choose: '1' },
        })
      }
      closeVariant="back"
      closeLabel={t('distract.menu')}
      closeHint={t('distract.menuHint')}
      scroll={false}
    >
      <View style={styles.body}>{children}</View>
    </ExerciseShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
