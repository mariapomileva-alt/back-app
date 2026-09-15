import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Ellipse } from 'react-native-svg';

import { hideFromA11yTree } from '@/components/accessibility/hideFromA11y';
import { SupportCard } from '@/components/cards/SupportCard';
import { PaperGrain } from '@/components/home/PaperGrain';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { isHomeToolId } from '@/features/session/activeSession';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { saveSessionOutcome } from '@/storage/history';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';
import type { SessionOutcome } from '@/types';

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function SessionOutcomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ tool?: string; durationMs?: string; sessionId?: string }>();
  const toolParam = firstParam(params.tool);
  const closedTool = isHomeToolId(toolParam) ? toolParam : undefined;
  const sessionId = firstParam(params.sessionId);
  const durationMs = Number(firstParam(params.durationMs));

  const chooseOutcome = (outcome: SessionOutcome) => {
    void saveSessionOutcome(
      sessionId,
      outcome,
      closedTool && Number.isFinite(durationMs) ? { tool: closedTool, durationMs } : undefined,
    );
    router.replace({
      pathname: '/session/alternatives',
      params: { feeling: outcome, ...(closedTool ? { tool: closedTool } : {}) },
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PaperGrain />
      <ScreenContainer style={styles.transparent}>
        <ScreenHeader title={t('app.name')} onClose={() => router.replace('/')} />
        <View {...hideFromA11yTree()} style={styles.mark}>
          <Svg width={72} height={44} viewBox="0 0 72 44">
            <Ellipse cx="36" cy="34" rx="18" ry="7" fill={theme.colors.muted} opacity={0.7} />
            <Ellipse cx="36" cy="23" rx="13" ry="6" fill={theme.colors.secondaryGreen} opacity={0.45} />
            <Ellipse cx="36" cy="13" rx="9" ry="5" fill={theme.colors.primary} opacity={0.28} />
          </Svg>
        </View>
        <AppText style={styles.title}>{t('session.outcome')}</AppText>
        <View style={styles.list}>
          <SupportCard title={t('session.better')} onPress={() => chooseOutcome('better')} />
          <SupportCard title={t('session.same')} onPress={() => chooseOutcome('same')} />
          <SupportCard title={t('session.worse')} onPress={() => chooseOutcome('worse')} />
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
