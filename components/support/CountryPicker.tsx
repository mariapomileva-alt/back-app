import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { listEmergencyCountries } from '@/features/emergency/numbers';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  onSelect: (countryCode: string) => void;
  selectedCountryCode?: string | null;
};

export function CountryPicker({ onSelect, selectedCountryCode }: Props) {
  const { theme } = useTheme();
  const countries = listEmergencyCountries();
  const selected = selectedCountryCode?.toUpperCase() ?? null;
  const scrollRef = useRef<ScrollView>(null);
  const selectedOffset = useRef<number | null>(null);

  const scrollToLastCountry = () => {
    const offset = selectedOffset.current;
    if (offset == null) {
      return;
    }
    scrollRef.current?.scrollTo({ y: Math.max(0, offset - spacing.md), animated: false });
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.list}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      onContentSizeChange={scrollToLastCountry}
    >
      {countries.map((country) => {
        const isSelected = country.countryCode === selected;

        return (
          <Pressable
            key={country.countryCode}
            accessibilityRole="button"
            accessibilityLabel={country.countryName}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(country.countryCode)}
            onLayout={(event) => {
              if (isSelected) {
                selectedOffset.current = event.nativeEvent.layout.y;
              }
            }}
            style={({ pressed }) => [
              styles.row,
              {
                borderBottomColor: theme.colors.border,
                opacity: pressed ? 0.72 : 1,
              },
            ]}
          >
            <AppText variant="body" style={styles.name}>
              {country.countryName}
            </AppText>
            {isSelected ? (
              <AppText variant="secondary" tone="secondary" accessibilityElementsHidden>
                {t('common.selected')}
              </AppText>
            ) : null}
          </Pressable>
        );
      })}
      <View style={styles.bottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    minHeight: 0,
    marginTop: spacing.sm,
  },
  content: {
    paddingBottom: spacing.lg,
  },
  row: {
    minHeight: touch.min,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm,
  },
  name: {
    flex: 1,
  },
  bottom: {
    height: spacing.md,
  },
});
