import { type ReactNode } from 'react';

import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { t } from '@/locales/i18n';

type Props = {
  title: string;
  onClose: () => void;
  right?: ReactNode;
  closeLabel?: string;
  closeHint?: string;
};

export function ActiveSessionHeader({ title, onClose, right, closeLabel, closeHint }: Props) {
  return (
    <ScreenHeader
      title={title}
      onClose={onClose}
      closeVariant="close"
      closeLabel={closeLabel}
      closeHint={closeHint ?? t('exercise.closeHint')}
      right={right}
    />
  );
}
