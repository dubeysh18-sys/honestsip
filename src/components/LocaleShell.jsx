import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

export default function LocaleShell({ lang }) {
  useEffect(() => {
    const target = lang === 'hi' ? 'hi' : lang === 'mr' ? 'mr' : 'en';
    if (i18n.language?.split('-')[0] !== target) {
      i18n.changeLanguage(target);
    }
  }, [lang]);

  return <Outlet />;
}
