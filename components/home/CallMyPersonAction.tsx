import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AppText } from '@/components/typography/AppText';
import { useHaptics } from '@/hooks/useHaptics';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { mixHex } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

type Props = {
  onPress: () => void;
};

export function CallMyPersonAction({ onPress }: Props) {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const label = t('home.callMyPerson');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={t('home.callMyPersonHint')}
      onPress={() => {
        haptics.light();
        onPress();
      }}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.72 : 1 }]}
    >
      <View style={styles.icon} accessible={false}>
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Path
            d="M9 4.4a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2z"
            fill="none"
            stroke={mixHex(theme.colors.textSecondary, theme.colors.text, 0.28)}
            strokeWidth={1.2}
          />
          <Path
            d="M5.2 13.6c.5-2.4 2-3.6 3.8-3.6s3.3 1.2 3.8 3.6"
            fill="none"
            stroke={mixHex(theme.colors.textSecondary, theme.colors.text, 0.28)}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <View style={styles.copy}>
        <AppText
          variant="secondary"
          style={[
            styles.need,
            { color: mixHex(theme.colors.textSecondary, theme.colors.text, 0.36) },
          ]}
        >
          {t('home.callMyPersonNeed')}
        </AppText>
        <AppText variant="secondary" style={styles.action}>
          {t('home.callMyPersonAction')}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: 0,
    paddingHorizontal: spacing.sm,
  },
  icon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 5,
  },
  need: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.15,
    fontWeight: '400',
  },
  action: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.15,
    fontWeight: '600',
  },
});
