import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ActiveSessionScreen } from '@/components/session/ActiveSessionScreen';
import type { DistractActivityId } from '@/features/distract/activities';
import { useRememberDistractActivity } from '@/features/distract/useRememberActivity';
import { beginInternalSessionNavigation } from '@/features/session/activeSession';
import { t } from '@/locales/i18n';

type Props = {
  activity: DistractActivityId;
  children: ReactNode;
};

export function DistractActivityScreen({ activity, children }: Props) {
  const router = useRouter();
  useRememberDistractActivity(activity);

  const changeActivity = () => {
    beginInternalSessionNavigation();
    router.replace({
      pathname: '/distract',
      params: { choose: '1' },
    });
  };

  return (
    <ActiveSessionScreen
      tool="distract"
      title={t('home.tools.distract')}
      scroll={false}
      onChangeActivity={changeActivity}
    >
      <View style={styles.body}>{children}</View>
    </ActiveSessionScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
