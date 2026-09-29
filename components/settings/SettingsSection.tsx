import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { spacing } from '@/theme/spacing';

type Props = {
  title: string;
  children: ReactNode;
  first?: boolean;
};

export function SettingsSection({ title, children, first = false }: Props) {
  return (
    <View style={[styles.section, first ? styles.first : null]}>
      <AppText variant="secondary" tone="secondary" style={styles.label}>
        {title}
      </AppText>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: spacing.lg,
  },
  first: {
    marginTop: spacing.xs,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.35,
    marginBottom: spacing.xs,
  },
});
