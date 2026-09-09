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
import { homeTools } from '@/features/home/tools';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

export default function SessionAlternativesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { feeling } = useLocalSearchParams<{ feeling?: string }>();
  const suggestions = homeTools.slice(0, 3);

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
            <PrimaryButton
              label={t('extraSupport.title')}
              onPress={() => router.push('/settings/emergency')}
            />
            <SecondaryButton label={t('session.returnTools')} onPress={() => router.replace('/')} />
          </View>
        ) : feeling === 'better' ? (
          <View style={styles.actions}>
            <PrimaryButton label={t('session.done')} onPress={() => router.replace('/')} />
          </View>
        ) : (
          <View style={styles.grid}>
            {suggestions.map((tool) => (
              <ToolCard
                key={tool.id}
                label={t(`home.tools.${tool.id}`)}
                icon={<ToolIcon name={tool.id} size={28} />}
                onPress={() => router.replace(tool.href)}
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
