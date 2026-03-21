import React, { useState } from 'react';
import { formatINRLakh, formatINR } from '../lib/ruleEngine';
import { useTranslation } from 'react-i18next';

export default function CorpusWaterfall({ 
  waterfallData,
  assetClass = 'equity',
  income = 1000000 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  if (!waterfallData) return null;

  const {
    grossCorpus, stampDuty, terDrag, corpusAfterFundCosts,
    stt, exitLoad, totalInvested, grossGains, rawTax,
    cess, surcharge, postTaxCorpus, inflationErosion, realTakeHome,
    isLTCG, isEquity
  } = waterfallData;

  const rows = [
    { label: t('waterfall.rows.gross.title'), amount: grossCorpus, running: grossCorpus, type: 'header', tooltip: t('waterfall.rows.gross.tip') },
    { label: t('waterfall.rows.stamp.title'), amount: -stampDuty, running: grossCorpus - stampDuty, type: 'deduction', tooltip: t('waterfall.rows.stamp.tip') },
    { label: t('waterfall.rows.ter.title'), amount: -terDrag, running: corpusAfterFundCosts, type: 'deduction', tooltip: t('waterfall.rows.ter.tip') },
    { label: t('waterfall.rows.corpus_fund.title'), amount: corpusAfterFundCosts, running: corpusAfterFundCosts, type: 'subtotal', tooltip: t('waterfall.rows.corpus_fund.tip') },
  ];

  if (isEquity) {
    rows.push({ label: t('waterfall.rows.stt.title'), amount: -stt, running: corpusAfterFundCosts - stt, type: 'deduction', tooltip: t('waterfall.rows.stt.tip') });
  }

  if (exitLoad > 0) {
    rows.push({ label: t('waterfall.rows.exit_load.title'), amount: -exitLoad, running: corpusAfterFundCosts - stt - exitLoad, type: 'deduction', tooltip: t('waterfall.rows.exit_load.tip') });
  }

  rows.push(
    { label: t('waterfall.rows.invested.title'), amount: totalInvested, running: null, type: 'info', tooltip: t('waterfall.rows.invested.tip') },
    { label: t('waterfall.rows.gains.title'), amount: grossGains, running: null, type: 'info', tooltip: t('waterfall.rows.gains.tip') }
  );

  let taxLabelKey = 'tax_slab';
  if (isEquity) {
    taxLabelKey = isLTCG ? 'tax_ltcg' : 'tax_stcg';
  } else if (assetClass === 'bitcoin') {
    taxLabelKey = 'tax_crypto';
  } else if (isLTCG) {
    taxLabelKey = 'tax_ltcg';
  }

  rows.push({ label: t(`waterfall.rows.${taxLabelKey}.title`), amount: -rawTax, running: postTaxCorpus + cess + surcharge, type: 'deduction', tooltip: t(`waterfall.rows.${taxLabelKey}.tip`) });
  rows.push({ label: t('waterfall.rows.cess.title'), amount: -cess, running: postTaxCorpus + surcharge, type: 'deduction', tooltip: t('waterfall.rows.cess.tip') });
  
  if (surcharge > 0) {
    rows.push({ label: t('waterfall.rows.surcharge.title'), amount: -surcharge, running: postTaxCorpus, type: 'deduction', tooltip: t('waterfall.rows.surcharge.tip') });
  }

  rows.push({ label: t('waterfall.rows.post_tax.title'), amount: postTaxCorpus, running: postTaxCorpus, type: 'subtotal', tooltip: t('waterfall.rows.post_tax.tip') });
  rows.push({ label: t('waterfall.rows.inflation.title'), amount: -inflationErosion, running: realTakeHome, type: 'deduction', tooltip: t('waterfall.rows.inflation.tip') });
  rows.push({ label: t('waterfall.rows.real_takehome.title'), amount: realTakeHome, running: realTakeHome, type: 'final', tooltip: t('waterfall.rows.real_takehome.tip') });

  // Optimisation Engine
  let tip = '';
  if (inflationErosion > (grossCorpus * 0.4)) {
    tip = t('waterfall.tips.inflation');
  } else if (terDrag > (grossCorpus * 0.15)) {
    tip = t('waterfall.tips.ter', { terDrag: formatINRLakh(terDrag) });
  } else if (isEquity && !isLTCG && rawTax > 0) {
    tip = t('waterfall.tips.tax');
  } else if (surcharge > 0) {
    tip = t('waterfall.tips.surcharge');
  } else {
    tip = t('waterfall.tips.good');
  }

  return (
    <div className="section-card mt-6 border border-[rgba(255,183,125,0.2)]" style={{ background: 'rgba(28,27,27,0.5)' }}>
      {!isExpanded ? (
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-full text-left"
        >
          <div className="flex justify-between items-center group">
            <p className="text-sm text-on-surface-var leading-relaxed pr-4">
              {t('waterfall.teaser_start')} <strong className="text-on-surface">{formatINRLakh(grossCorpus)}</strong> {t('waterfall.teaser_mid')} <strong className="text-on-surface">{formatINRLakh(realTakeHome)}</strong> {t('waterfall.teaser_end')} <span className="mango-text group-hover:underline">{t('waterfall.teaser_link')}</span>
            </p>
          </div>
        </button>
      ) : (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6 border-b border-[rgba(255,255,255,0.05)] pb-4">
            <h3 className="font-serif text-2xl text-on-surface">{t('waterfall.title')}</h3>
            <button onClick={() => setIsExpanded(false)} className="text-xs text-on-surface-var hover:text-on-surface">
              {t('waterfall.collapse')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-on-surface-var opacity-50 border-b border-[rgba(255,255,255,0.05)]">
                  <th className="pb-3 font-medium">{t('waterfall.col_what')}</th>
                  <th className="pb-3 font-medium text-right">{t('waterfall.col_amount')}</th>
                  <th className="pb-3 font-medium text-right">{t('waterfall.col_total')}</th>
                  <th className="pb-3 font-medium text-right">{t('waterfall.col_pct')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const pct = ((Math.abs(r.amount) / grossCorpus) * 100).toFixed(1);
                  const isDeduction = r.type === 'deduction';
                  const isTotal = r.type === 'header' || r.type === 'subtotal' || r.type === 'final';
                  
                  return (
                    <tr key={i} className={`border-b border-[rgba(255,255,255,0.02)] ${isTotal ? 'font-semibold text-on-surface' : 'text-on-surface-var'}`}>
                      <td className="py-3 pr-4 relative group cursor-help">
                        {r.tooltip ? (
                          <span className="border-b border-dashed border-[rgba(255,255,255,0.2)] pb-0.5">{r.label}</span>
                        ) : (
                          <span>{r.label}</span>
                        )}
                        {r.tooltip && (
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-surface-high text-xs text-on-surface rounded-lg shadow-2xl z-10 whitespace-normal border border-outline-var/20 leading-relaxed">
                            {r.tooltip}
                          </div>
                        )}
                      </td>
                      <td className={`py-3 text-right ${isDeduction ? 'text-red-400 opacity-80' : ''}`}>
                        {r.amount === 0 ? '₹0' : formatINR(r.amount)}
                      </td>
                      <td className="py-3 text-right font-mono text-xs opacity-70">
                        {r.running !== null ? formatINRLakh(r.running) : '—'}
                      </td>
                      <td className="py-3 text-right opacity-50">
                        {r.amount === grossCorpus ? '100%' : (r.running === null ? '—' : (pct === '0.0' ? '<0.1%' : `${pct}%`))}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[rgba(255,183,125,0.05)] border border-[rgba(255,183,125,0.1)]">
            <p className="label-overline mango-text mb-2">{t('waterfall.opt_tip')}</p>
            <p className="text-xs text-on-surface-var leading-relaxed">{tip}</p>
          </div>
          <p className="text-[10px] text-on-surface-var opacity-30 mt-4 leading-relaxed">
            {t('waterfall.footer_note')}
          </p>
        </div>
      )}
    </div>
  );
}
