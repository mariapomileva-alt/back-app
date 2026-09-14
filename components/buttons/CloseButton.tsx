import { useNavigation, useRouter } from 'expo-router';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { QuietIconButton } from '@/components/session/QuietIconButton';
import { useTheme } from '@/hooks/useTheme';
import { t } from '@/locales/i18n';

type Props = {
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  variant?: 'close' | 'back';
};

export function CloseButton({ onPress, accessibilityLabel, accessibilityHint, variant = 'close' }: Props) {
  const router = useRouter();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const color = theme.colors.icon;
  const isBack = variant === 'back';

  const goBackOrHome = () => {
    if (router.canGoBack() && navigation.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  };

  return (
    <QuietIconButton
      accessibilityLabel={accessibilityLabel ?? (isBack ? t('common.back') : t('common.close'))}
      accessibilityHint={accessibilityHint ?? t('common.closeHint')}
      onPress={onPress ?? goBackOrHome}
    >
      <View accessible={false}>
        <Svg width={22} height={22} viewBox="0 0 22 22">
          {isBack ? (
            <Path
              d="M14 4 L6 11 L14 18"
              stroke={color}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : (
            <Path
              d="M4 4 L18 18 M18 4 L4 18"
              stroke={color}
              strokeWidth={1.8}
              strokeLinecap="round"
              fill="none"
            />
          )}
        </Svg>
      </View>
    </QuietIconButton>
  );
}
