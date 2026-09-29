import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { t } from '@/locales/i18n';
import { serif } from '@/theme/fonts';
import { spacing } from '@/theme/spacing';

type Props = {
  visible: boolean;
};

export function ReadCanvasHint({ visible }: Props) {
  if (!visible) {
    return null;
  }

  return (
    <View
      style={[styles.wrap, styles.noPointer]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <AppText variant="body" style={styles.line}>
        {t('read.firstHintFollow')}
      </AppText>
      <AppText variant="secondary" style={styles.lineSecondary}>
        {t('read.firstHintTap')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.lg,
    alignItems: 'center',
    gap: spacing.xxs,
    opacity: 0.72,
  },
  noPointer: {
    pointerEvents: 'none',
  },
  line: {
    fontFamily: serif,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
  },
  lineSecondary: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
});
