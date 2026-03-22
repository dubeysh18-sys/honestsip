import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toLocalizedPath } from '../seo/localePaths';

export function useLocalizedPath() {
  const { i18n } = useTranslation();
  return useCallback(
    (logicalPath) => {
      const lng = (i18n.language || 'en').split('-')[0];
      return toLocalizedPath(logicalPath, lng === 'hi' || lng === 'mr' ? lng : 'en');
    },
    [i18n.language]
  );
}
