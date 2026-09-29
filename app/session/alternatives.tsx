import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { SecondaryButton } from '@/components/buttons/SecondaryButton';
import { ToolCard } from '@/components/cards/ToolCard';
import { ToolIcon } from '@/components/icons/ToolIcons';
import { PaperGrain } from '@/components/home/PaperGrain';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { AppText } from '@/components/typography/AppText';
import { isHomeToolId } from '@/features/session/activeSession';
import { shareBack } from '@/features/session/shareBack';
import { alternativesForIntent } from '@/features/session/suggestions';
import { openBackPlusPaywall } from '@/features/subscription/openBackPlusPaywall';
import { useBackPlusAccess } from '@/features/subscription/useBackPlusAccess';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function SessionAlternativesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [shareUnavailable, setShareUnavailable] = useState(false);
  const { feeling, tool, intent } = useLocalSearchParams<{
    feeling?: string;
    tool?: string;
    intent?: string | string[];
  }>();
  const currentTool = isHomeToolId(tool) ? tool : undefined;
  const intentValue = Array.isArray(intent) ? intent[0] : intent;
  const { hasPaidAccess } = useBackPlusAccess();
  const suggestions = alternativesForIntent(intentValue, currentTool);

  const openSuggestion = (href: (typeof suggestions)[number]['href']) => {
    if (!hasPaidAccess) {
      openBackPlusPaywall(router);
      return;
    }
    router.replace(href);
  };

  const title =
    feeling === 'better'
      ? t('session.betterBody')
      : feeling === 'worse'
        ? t('session.worseBody')
        : t('session.sameBody');

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PaperGrain />
      <ScreenContainer style={styles.transparent}>
        <ScreenHeader title={t('app.name')} onClose={() => router.replace('/')} />
        <AppText style={styles.title}>{title}</AppText>
        {feeling === 'worse' ? (
          <View style={styles.actions}>
            <PrimaryButton label={t('session.callPerson')} onPress={() => router.push('/support')} />
            <SecondaryButton
              label={t('session.emergency')}
              onPress={() => router.push('/settings/emergency')}
            />
            <SecondaryButton label={t('session.returnTools')} onPress={() => router.replace('/')} />
          </View>
        ) : feeling === 'better' ? (
          <View style={styles.actions}>
            <PrimaryButton label={t('session.done')} onPress={() => router.replace('/')} />
            <SecondaryButton
              label={t('session.share')}
              accessibilityHint={t('session.shareHint')}
              onPress={() => {
                void shareBack().then((result) => {
                  setShareUnavailable(result === 'unavailable');
                });
              }}
            />
            {shareUnavailable ? (
              <AppText variant="secondary" tone="secondary">
                {t('session.shareUnavailable')}
              </AppText>
            ) : null}
          </View>
        ) : (
          <View style={styles.grid}>
            {suggestions.map((tool) => (
              <ToolCard
                key={tool.id}
                label={t(`home.tools.${tool.id}`)}
                icon={<ToolIcon name={tool.id} size={28} />}
                onPress={() => openSuggestion(tool.href)}
              />
            ))}
          </View>
        )}
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
  title: {
    fontFamily: serif,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '500',
    marginBottom: spacing.xl,
    maxWidth: 340,
  },
  actions: {
    gap: spacing.md,
  },
  grid: {
    gap: spacing.sm,
  },
});
