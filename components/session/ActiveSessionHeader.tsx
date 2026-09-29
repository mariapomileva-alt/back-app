import { type ReactNode } from 'react';

import { ScreenHeader } from '@/components/navigation/ScreenHeader';
import { t } from '@/locales/i18n';

type Props = {
  title: string;
  onClose: () => void;
  showClose?: boolean;
  right?: ReactNode;
  closeLabel?: string;
  closeHint?: string;
  onBack?: () => void;
  backLabel?: string;
  backHint?: string;
};

export function ActiveSessionHeader({
  title,
  onClose,
  showClose = false,
  right,
  closeLabel,
  closeHint,
  onBack,
  backLabel,
  backHint,
}: Props) {
  const resolvedCloseLabel = closeLabel ?? t('exercise.closeSession');
  const resolvedCloseHint = closeHint ?? t('exercise.closeHint');

  return (
    <ScreenHeader
      title={title}
      showClose={showClose}
      onClose={onClose}
      closeVariant="close"
      closeLabel={resolvedCloseLabel}
      closeHint={resolvedCloseHint}
      onBack={onBack}
      backLabel={backLabel}
      backHint={backHint}
      right={right}
    />
  );
}
