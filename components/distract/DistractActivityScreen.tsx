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
  scroll?: boolean;
};

export function DistractActivityScreen({ activity, children, scroll = false }: Props) {
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
      scroll={scroll}
      onChangeActivity={changeActivity}
    >
      <View style={scroll ? styles.scrollBody : styles.body}>{children}</View>
    </ActiveSessionScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    minHeight: 0,
  },
  scrollBody: {
    flexGrow: 1,
  },
});

