import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { BackWordmark } from '@/components/brand/BackWordmark';
import { ToolCard } from '@/components/cards/ToolCard';
import { CallMyPersonAction } from '@/components/home/CallMyPersonAction';
import { HomeCardVisual } from '@/components/home/HomeCardVisual';
import { HomeNamePrompt } from '@/components/home/HomeNamePrompt';
import { HomeSettingsButton } from '@/components/home/HomeSettingsButton';
import { ThemedAppShell } from '@/components/layout/ThemedAppShell';
import { HomeHeroLine } from '@/components/home/HomeHeroLine';
import { AppText } from '@/components/typography/AppText';
import { homeCardBorder } from '@/features/home/surfaces';
import { homeTools } from '@/features/home/tools';
import { openBackPlusPaywall } from '@/features/subscription/openBackPlusPaywall';
import { useBackPlusAccess } from '@/features/subscription/useBackPlusAccess';
import { useHomeFitLayout } from '@/hooks/useHomeFitLayout';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { dismissHomeNamePrompt, isHomeNamePromptDismissed } from '@/storage/homeNamePrompt';
import { loadLocalProfile, profileSalutation } from '@/storage/profile';
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
  const [salutation, setSalutation] = useState<string | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const homeLayout = useHomeFitLayout(showNamePrompt, Boolean(salutation));

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        const profile = await loadLocalProfile();
        const name = profileSalutation(profile);
        const dismissed = await isHomeNamePromptDismissed();
        if (!active) {
          return;
        }
        setSalutation(name);
        setShowNamePrompt(!name && !dismissed);
      })();
      return () => {
        active = false;
      };
    }, []),
  );

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
    <ThemedAppShell scroll={false} contentStyle={styles.content}>
        <View style={styles.top}>
          <BackWordmark
            size={homeLayout.wordmarkSize}
            variant="theme"
            accessibilityRole="header"
            accessibilityLabel={t('app.name')}
          />
          <HomeSettingsButton onPress={() => router.push('/settings')} />
        </View>

        {showNamePrompt ? (
          <HomeNamePrompt
            onDismiss={() => {
              void dismissHomeNamePrompt();
              setShowNamePrompt(false);
            }}
          />
        ) : null}

        <View
          style={[
            styles.hero,
            {
              marginTop: homeLayout.heroMarginTop,
              marginBottom: salutation
                ? homeLayout.heroMarginBottomNamed
                : homeLayout.heroMarginBottom,
            },
          ]}
        >
          <HomeHeroLine salutation={salutation} layout={homeLayout} />
          <AppText
            tone="secondary"
            maxFontSizeMultiplier={homeLayout.maxFontSizeMultiplier}
            style={[
              styles.prompt,
              {
                fontSize: homeLayout.promptFontSize,
                lineHeight: homeLayout.promptLineHeight,
              },
            ]}
          >
            {t('home.prompt')}
          </AppText>
        </View>

        <View style={[styles.grid, { gap: homeLayout.gridGap }]}>
          {toolRows.map((row) => (
            <View key={row.map((tool) => tool.id).join('-')} style={[styles.row, { gap: homeLayout.gridGap }]}>
              {row.map((tool) => (
                <ToolCard
                  key={tool.id}
                  label={t(`home.tools.${tool.id}`)}
                  visual={<HomeCardVisual id={tool.id} />}
                  density={homeLayout.cardDensity}
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
    </ThemedAppShell>
  );
}

const styles = StyleSheet.create({
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
    maxWidth: 300,
  },
  prompt: {
    marginTop: 6,
    letterSpacing: 0.2,
    fontWeight: '400',
  },
  grid: {
    flex: 1,
    width: '100%',
    minHeight: 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    minHeight: 0,
  },
  footer: {
    marginTop: 6,
  },
});
