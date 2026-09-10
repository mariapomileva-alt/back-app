import { Pressable, StyleSheet, View } from 'react-native';

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

  return (
    <View style={styles.list}>
      {countries.map((country) => {
        const isSelected = country.countryCode === selected;

        return (
          <Pressable
            key={country.countryCode}
            accessibilityRole="button"
            accessibilityLabel={country.countryName}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(country.countryCode)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing.sm,
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
});
