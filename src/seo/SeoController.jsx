import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { absoluteUrl } from './siteConfig';
import { stripLocalePath } from './localePaths';
import { getPageMeta, buildHreflangLinks } from './seoControllerMeta';

export default function SeoController() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'en').split('-')[0];
  const logical = stripLocalePath(location.pathname);
  const { title, description } = getPageMeta(logical, lang);
  const canonical = absoluteUrl(location.pathname);
  const hreflangs = buildHreflangLinks(location.pathname);

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      {hreflangs.map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}
    </Helmet>
  );
}
