import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { BackWordmark } from '@/components/brand/BackWordmark';
import { ToolCard } from '@/components/cards/ToolCard';
import { CallMyPersonAction } from '@/components/home/CallMyPersonAction';
import { HomeCardVisual } from '@/components/home/HomeCardVisual';
import { HomeSettingsButton } from '@/components/home/HomeSettingsButton';
import { PaperGrain } from '@/components/home/PaperGrain';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { AppText } from '@/components/typography/AppText';
import { homeCardBorder } from '@/features/home/surfaces';
import { homeTools } from '@/features/home/tools';
import { openBackPlusPaywall } from '@/features/subscription/openBackPlusPaywall';
import { useBackPlusAccess } from '@/features/subscription/useBackPlusAccess';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing, touch } from '@/theme/spacing';

const toolRows = [
  homeTools.slice(0, 2),
  homeTools.slice(2, 4),
  homeTools.slice(4, 6),
];

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { accessState, hasPaidAccess } = useBackPlusAccess();

  const openTool = (href: (typeof homeTools)[number]['href']) => {
    if (accessState === 'loading') {
      return;
    }
    if (!hasPaidAccess) {
      openBackPlusPaywall(router);
      return;
    }
    router.push(href);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <PaperGrain opacity={0.12} />
      <ScreenContainer scroll={false} style={styles.transparent} contentStyle={styles.content}>
        <View style={styles.top}>
          <BackWordmark
            size={22}
            variant="theme"
            accessibilityRole="header"
            accessibilityLabel={t('app.name')}
          />
          <HomeSettingsButton onPress={() => router.push('/settings')} />
        </View>

        <View style={styles.hero}>
          <AppText variant="hero" style={styles.heroTitle}>
            {t('home.hero')}
          </AppText>
          <AppText tone="secondary" style={styles.prompt}>
            {t('home.prompt')}
          </AppText>
        </View>

        <View style={styles.grid}>
          {toolRows.map((row) => (
            <View key={row.map((tool) => tool.id).join('-')} style={styles.row}>
              {row.map((tool) => (
                <ToolCard
                  key={tool.id}
                  label={t(`home.tools.${tool.id}`)}
                  visual={<HomeCardVisual id={tool.id} />}
                  onPress={() => openTool(tool.href)}
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderColor: homeCardBorder(theme),
                  }}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <CallMyPersonAction onPress={() => router.push('/support')} />
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
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  top: {
    minHeight: touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hero: {
    marginTop: spacing.sm,
    marginBottom: 18,
    maxWidth: 300,
  },
  heroTitle: {
    fontFamily: serif,
    fontWeight: '500',
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -0.6,
  },
  prompt: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.2,
    fontWeight: '400',
  },
  grid: {
    flex: 1,
    gap: 10,
    width: '100%',
    minHeight: 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    minHeight: 0,
  },
  footer: {
    marginTop: 6,
  },
});
