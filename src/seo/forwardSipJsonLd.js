import { SITE_ORIGIN } from './siteConfig';

/** SoftwareApplication + FinancialProduct (TER, STT, Budget 2024 LTCG, inflation) for Forward SIP. */
export function buildForwardSipJsonLd() {
  const base = SITE_ORIGIN.replace(/\/$/, '');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'HonestSIP Forward SIP Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        url: `${base}/sip`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      },
      {
        '@type': 'FinancialProduct',
        name: 'SIP maturity projection with Indian fund costs and tax',
        feesAndCommissionsSpecification:
          'Mutual fund expense ratio (TER) as annual drag on gross returns; Securities Transaction Tax (STT) on equity fund redemptions; Budget 2024 long-term capital gains tax on listed equity at 12.5% on gains above the ₹1.25 lakh exemption; stamp duty on purchase flows; optional scheme exit load; inflation erosion of real purchasing power versus nominal corpus.',
      },
    ],
  };
}
