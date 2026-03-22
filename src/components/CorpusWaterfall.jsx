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

  const lossPct = ((Math.abs(grossCorpus - realTakeHome) / grossCorpus) * 100).toFixed(1);

  return (
    <>
      {/* Trigger Card: Simple Teaser */}
      <div 
        className="section-card mt-6 border border-[rgba(255,183,125,0.15)] shadow-xl relative overflow-hidden" 
        style={{ background: 'linear-gradient(165deg, #1A1A1A 0%, #2D0A0A 100%)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,183,125,0.15)] to-transparent" />
        <button 
          onClick={() => setIsExpanded(true)}
          className="w-full text-left p-1"
        >
          <div className="flex justify-between items-center group">
            <p className="text-sm text-white/80 leading-relaxed pr-4">
              {t('waterfall.teaser_start')} <strong className="text-white font-semibold">{formatINRLakh(grossCorpus)}</strong> {t('waterfall.teaser_mid')} <strong className="text-white font-semibold">{formatINRLakh(realTakeHome)}</strong> {t('waterfall.teaser_end')} <span className="mango-text group-hover:underline font-semibold ml-1">{t('waterfall.teaser_link')}</span>
            </p>
          </div>
        </button>
      </div>

      {/* Modal Popup */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all animate-fade-in bg-black/45 backdrop-blur-md dark:bg-black/[0.85] dark:backdrop-blur-[8px]"
          onClick={() => setIsExpanded(false)}
        >
          <div 
            className="waterfall-modal-panel w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-outline-var/30 dark:border-white/5">
              <h3 className="font-serif text-2xl text-on-surface">{t('waterfall.title')}</h3>
              <button 
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-full bg-surface-highest flex items-center justify-center text-on-surface-var hover:text-on-surface transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Scrollable Table */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
              <div className="min-w-full inline-block align-middle">
                <table className="w-full text-left text-xs md:text-sm whitespace-nowrap">
                  <thead>
                    <tr className="text-on-surface-var opacity-70 border-b border-outline-var/30 dark:opacity-40 dark:border-white/5">
                      <th className="pb-4 font-medium">{t('waterfall.col_what')}</th>
                      <th className="pb-4 font-medium text-right">{t('waterfall.col_amount')}</th>
                      <th className="pb-4 font-medium text-right">{t('waterfall.col_total')}</th>
                      <th className="pb-4 font-medium text-right">{t('waterfall.col_pct')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-var/25 dark:divide-white/5">
                    {rows.map((r, i) => {
                      const pctNum = (Math.abs(r.amount) / grossCorpus) * 100;
                      const pctStr = pctNum.toFixed(1);
                      const isTotal = r.type === 'header' || r.type === 'subtotal' || r.type === 'final';
                      const isDeduction = r.type === 'deduction';

                      return (
                        <tr key={i} className={isTotal ? 'font-semibold text-on-surface' : 'text-on-surface-var dark:opacity-80'}>
                          <td className="py-4 pr-4">
                            <span className={r.tooltip ? 'border-b border-dashed border-outline-var/50 dark:border-white/20' : ''}>{r.label}</span>
                          </td>
                          <td className={`py-4 text-right font-mono ${isDeduction ? 'text-danger dark:text-red-400/80' : ''}`}>
                            {r.amount === 0 ? '₹0' : formatINR(r.amount)}
                          </td>
                          <td className="py-4 text-right text-on-surface-var opacity-80 dark:opacity-60 font-mono">
                            {r.running !== null ? formatINRLakh(r.running) : '—'}
                          </td>
                          <td className="py-4 text-right text-on-surface-var opacity-60 dark:opacity-40 font-mono">
                            {r.amount === grossCorpus ? '100%' : (r.running === null ? '—' : (pctStr === '0.0' ? '<0.1%' : `${pctStr}%`))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Disclaimer Only */}
              <p className="text-[10px] text-on-surface-var opacity-60 mt-8 pt-4 border-t border-outline-var/30 dark:opacity-30 dark:border-white/5 leading-relaxed">
                {t('waterfall.footer_note')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
