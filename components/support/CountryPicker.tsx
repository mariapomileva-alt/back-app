import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/typography/AppText';
import { useTheme } from '@/hooks/useTheme';
import { listEmergencyCountries } from '@/features/emergency/numbers';
import { spacing, touch } from '@/theme/spacing';

type Props = {
  onSelect: (countryCode: string) => void;
};

export function CountryPicker({ onSelect }: Props) {
  const { theme } = useTheme();
  const countries = listEmergencyCountries();

  return (
    <View style={styles.list}>
      {countries.map((country) => (
        <Pressable
          key={country.countryCode}
          accessibilityRole="button"
          accessibilityLabel={country.countryName}
          onPress={() => onSelect(country.countryCode)}
          style={({ pressed }) => [
            styles.row,
            {
              borderBottomColor: theme.colors.border,
              opacity: pressed ? 0.72 : 1,
            },
          ]}
        >
          <AppText variant="body">{country.countryName}</AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing.sm,
  },
  row: {
    minHeight: touch.min,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.sm,
  },
});
