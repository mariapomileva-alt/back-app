import { pathForBackUrl } from '@/config/deepLinks';

export function redirectSystemPath({ path }: { path: string }): string {
  return pathForBackUrl(path);
}
