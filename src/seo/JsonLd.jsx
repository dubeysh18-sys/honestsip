import React from 'react';
import { Helmet } from 'react-helmet-async';

/** Injects JSON-LD for crawlers; not visible in the UI. */
export default function JsonLd({ data }) {
  const json = Array.isArray(data) ? { '@context': 'https://schema.org', '@graph': data } : data;
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(json)}</script>
    </Helmet>
  );
}
