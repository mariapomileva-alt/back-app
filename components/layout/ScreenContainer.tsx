import { type ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/theme/spacing';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  /** Match Home / session phone column on wide web previews. */
  phoneWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function ScreenContainer({
  children,
  scroll = true,
  padded = true,
  phoneWidth = false,
  style,
  contentStyle,
}: Props) {
  const { theme } = useTheme();

  const body = (
    <View
      style={[
        styles.body,
        padded && styles.padded,
        !scroll && styles.bodyFill,
        phoneWidth && styles.phoneWidth,
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.colors.background }, style]}
      edges={['top', 'bottom']}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {body}
        </ScrollView>
      ) : (
        <View style={styles.fill}>{body}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  fill: {
    flex: 1,
    minHeight: 0,
  },
  body: {
    flexGrow: 1,
  },
  bodyFill: {
    flex: 1,
    minHeight: 0,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  phoneWidth: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
  },
});
