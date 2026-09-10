import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Ellipse } from 'react-native-svg';

import { SupportCard } from '@/components/cards/SupportCard';
import { PaperGrain } from '@/components/home/PaperGrain';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { isHomeToolId } from '@/features/session/activeSession';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function SessionOutcomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { tool } = useLocalSearchParams<{ tool?: string }>();
  const closedTool = isHomeToolId(tool) ? tool : undefined;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PaperGrain />
      <ScreenContainer style={styles.transparent}>
        <ScreenHeader title={t('app.name')} onClose={() => router.replace('/')} />
        <View
          style={styles.mark}
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Svg width={72} height={44} viewBox="0 0 72 44">
            <Ellipse cx="36" cy="34" rx="18" ry="7" fill={theme.colors.muted} opacity={0.7} />
            <Ellipse cx="36" cy="23" rx="13" ry="6" fill={theme.colors.secondaryGreen} opacity={0.45} />
            <Ellipse cx="36" cy="13" rx="9" ry="5" fill={theme.colors.primary} opacity={0.28} />
          </Svg>
        </View>
        <AppText style={styles.title}>{t('session.outcome')}</AppText>
        <View style={styles.list}>
          <SupportCard
            title={t('session.better')}
            onPress={() =>
              router.replace({
                pathname: '/session/alternatives',
                params: { feeling: 'better', ...(closedTool ? { tool: closedTool } : {}) },
              })
            }
          />
          <SupportCard
            title={t('session.same')}
            onPress={() =>
              router.replace({
                pathname: '/session/alternatives',
                params: { feeling: 'same', ...(closedTool ? { tool: closedTool } : {}) },
              })
            }
          />
          <SupportCard
            title={t('session.worse')}
            onPress={() =>
              router.replace({
                pathname: '/session/alternatives',
                params: { feeling: 'worse', ...(closedTool ? { tool: closedTool } : {}) },
              })
            }
          />
        </View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  mark: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: serif,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '500',
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  list: {
    gap: spacing.md,
  },
});
