export const APP_SCHEME = 'back';

export const HOME_DEEP_LINK = 'back:///';
export const BREATHE_DEEP_LINK = 'back:///breathe';

export function pathForBackUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return '/';
  }

  try {
    const url = new URL(trimmed);
    const isBackScheme = url.protocol === `${APP_SCHEME}:`;
    const host = url.hostname.toLowerCase();
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (isBackScheme || host === 'breathe' || path === '/breathe') {
      if (host === 'breathe' || path === '/breathe') {
        return '/breathe';
      }
      if (isBackScheme) {
        return '/';
      }
    }
  } catch {
    if (/(^|[/:])breathe(\/|$)/i.test(trimmed)) {
      return '/breathe';
    }
  }

  if (/(^|[/:])breathe(\/|$)/i.test(trimmed)) {
    return '/breathe';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}
