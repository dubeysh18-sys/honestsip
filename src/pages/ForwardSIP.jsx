import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SliderField from '../components/SliderField';
import NumberInput from '../components/NumberInput';
import Select from '../components/Select';
import CostOfWaiting from '../components/CostOfWaiting';
import GrowthChart from '../components/GrowthChart';
import RealWorldTranslation from '../components/RealWorldTranslation';
import FinancialTwin from '../components/FinancialTwin';
import CorpusWaterfall from '../components/CorpusWaterfall';
import {
  monthlyRate, sipFV, stepUpSIPFV, lumpSumFV,
  costOfWaiting, yearByYearGrowth, taxEngine,
  totalInvestedFlat, totalInvestedStepUp, computeWaterfall,
  inflationAdjustedGoal, formatINR, formatINRLakh, selfTest,
} from '../lib/ruleEngine';

const ASSET_CLASSES = [
  { value: 'equity',      label: 'Equity Mutual Funds', rateDirect: 13, rateRegular: 12 },
  { value: 'gold',        label: 'Gold / SGB / ETFs',   rateDirect: 9,  rateRegular: 8 },
  { value: 'real-estate', label: 'Real Estate / REITs', rateDirect: 10, rateRegular: 9 },
  { value: 'oil',         label: 'Oil / Commodities',   rateDirect: 8,  rateRegular: 7 },
  { value: 'bitcoin',     label: 'Bitcoin / Crypto',    rateDirect: 30, rateRegular: 30 },
];

const FUND_TYPES = [
  { value: 'direct',  label: 'Direct Plan',  ter: 0.005 },
  { value: 'regular', label: 'Regular Plan', ter: 0.015 },
];

const SLAB_RATES = [
  { label: '0% (No tax)', value: 0    },
  { label: '5%',          value: 0.05 },
  { label: '10%',         value: 0.10 },
  { label: '15%',         value: 0.15 },
  { label: '20%',         value: 0.20 },
  { label: '30%',         value: 0.30 },
];

export default function ForwardSIP() {
  const { t } = useTranslation();
  const [sip, setSip]           = useState(5000);
  const [years, setYears]       = useState(10);
  const [rate, setRate]         = useState(13);
  const [stepUp, setStepUp]     = useState(0);
  const [lumpSum, setLumpSum]   = useState(0);
  const [freq, setFreq]         = useState('monthly');
  const [inflation, setInflation] = useState(6);
  const [showInflation, setShowInflation] = useState(true);
  
  const [assetClass, setAssetClass] = useState('equity');
  const [fundType, setFundType]     = useState('direct');
  const [slabRate, setSlabRate] = useState(0.20);

  useEffect(() => {
    const ac = ASSET_CLASSES.find(a => a.value === assetClass);
    if (ac) {
      setRate(fundType === 'direct' ? ac.rateDirect : ac.rateRegular);
    }
  }, [assetClass, fundType]);

  const results = useMemo(() => {
    const r = rate / 100;
    const inf = inflation / 100;
    const g = stepUp / 100;
    const n = freq === 'quarterly' ? years * 4 : years * 12;
    const i = freq === 'quarterly'
      ? Math.pow(1 + r, 1 / 4) - 1
      : monthlyRate(r);

    let fvSIP;
    if (g > 0) {
      fvSIP = stepUpSIPFV(sip, g, r, years);
    } else {
      fvSIP = sipFV(sip, i, n);
    }

    const fvLump = lumpSum > 0 ? lumpSumFV(lumpSum, i, n) : 0;
    const fvGross = fvSIP + fvLump;

    const totalInvested = g > 0
      ? totalInvestedStepUp(sip, g, years) + lumpSum
      : totalInvestedFlat(sip, n) + lumpSum;

    const gains = Math.max(0, fvGross - totalInvested);
    
    const fund = FUND_TYPES.find(f => f.value === fundType) || FUND_TYPES[0];
    const { tax, fvNet } = taxEngine(fvGross, totalInvested, assetClass, years, slabRate);

    const waterfallData = computeWaterfall({
      sipAmount: sip,
      durationYears: years,
      expectedNetReturn: r,
      expectedGrossReturn: r + fund.ter,
      inflationRate: inf,
      assetClass: assetClass,
      lumpSum: lumpSum,
      stepUpRate: g,
      exitLoadPct: years > 1 ? 0 : 0.01,
      taxSlabRate: slabRate,
      income: 1500000 
    });

    const fvReal = fvGross / Math.pow(1 + inf, years);
    const cow = costOfWaiting(sip, r, years * 12, g);
    const chartData = yearByYearGrowth(sip, r, years, g, lumpSum);

    return {
      fvGross: Math.round(fvGross),
      fvReal:  Math.round(fvReal),
      fvNet:   Math.round(fvNet),
      totalInvested: Math.round(totalInvested),
      gains:   Math.round(gains),
      tax:     Math.round(tax),
      cow:     Math.round(cow),
      waterfallData,
      chartData,
    };
  }, [sip, years, rate, stepUp, lumpSum, freq, inflation, assetClass, fundType, slabRate]);

  useEffect(() => {
    if (import.meta.env.DEV) selfTest();
  }, []);

  const selectedAsset = ASSET_CLASSES.find(x => x.value === assetClass) || ASSET_CLASSES[0];

  return (
    <div className="page-section pb-28 md:pb-12">
      <div className="md:col-span-2 grid md:grid-cols-2 gap-8 mb-4">
        <div>
          <p className="label-overline text-on-surface-var mb-2">{t('forwardSIP.header_overline')}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-on-surface mb-3 leading-tight">
            {t('forwardSIP.header_title1')}<br />
            <em className="italic">{t('forwardSIP.header_title2')}</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            {t('forwardSIP.header_desc')}
          </p>
        </div>

        <div className="cta-card">
          <p className="label-overline mb-2 opacity-90 text-white">{t('forwardSIP.res_maturity')}</p>
          <p className="result-amount animate-result">{formatINR(results.fvGross, true)}</p>
          <p className="text-xs text-on-surface-var mt-1 opacity-60">
            {t('forwardSIP.res_nominal', { years, rate })}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">{t('forwardSIP.res_invested')}</p>
              <p className="result-amount-sm">{formatINRLakh(results.totalInvested)}</p>
            </div>
            <div className="inner-card">
              <p className="label-overline sage-text mb-1">{t('forwardSIP.res_gains')}</p>
              <p className="result-amount-sm sage-text">{formatINRLakh(results.gains)}</p>
            </div>
            {showInflation && (
              <div className="inner-card">
                <p className="label-overline lavender-text mb-1">{t('forwardSIP.res_real', { inflation })}</p>
                <p className="result-amount-sm lavender-text">{formatINRLakh(results.fvReal)}</p>
              </div>
            )}
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">{t('forwardSIP.res_post_tax', { taxType: selectedAsset.label })}</p>
              <p className="result-amount-sm">{formatINRLakh(results.fvNet)}</p>
            </div>
          </div>

          {results.tax > 0 && (
            <p className="text-xs text-on-surface-var opacity-50 mt-3">
              {t('forwardSIP.res_tax', { tax: formatINR(results.tax) })}
            </p>
          )}
        </div>
      </div>

      <section aria-label="SIP Calculator Inputs">
        <div className="section-card mb-4 mt-2 md:mt-0">
          <NumberInput
            label={t('forwardSIP.inputs_title')}
            value={sip}
            onChange={setSip}
            hint={t('forwardSIP.inputs_hint')}
          />
          <div className="flex gap-2 mb-5">
            <button
              className={`freq-btn ${freq === 'monthly' ? 'active' : 'inactive'}`}
              onClick={() => setFreq('monthly')}
            >
              {t('forwardSIP.monthly')}
            </button>
            <button
              className={`freq-btn ${freq === 'quarterly' ? 'active' : 'inactive'}`}
              onClick={() => setFreq('quarterly')}
            >
              {t('forwardSIP.quarterly')}
            </button>
          </div>
          <SliderField
            label={t('forwardSIP.duration')}
            value={years}
            min={1}
            max={40}
            unit=" yrs"
            onChange={setYears}
          />
          <SliderField
            label={t('forwardSIP.return')}
            value={rate}
            min={1}
            max={40}
            unit="%"
            onChange={setRate}
          />
          <SliderField
            label={t('forwardSIP.stepup')}
            value={stepUp}
            min={0}
            max={30}
            unit="%"
            onChange={setStepUp}
          />
        </div>

        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-4">{t('forwardSIP.config_title')}</p>
          <NumberInput
            label={t('forwardSIP.lumpsum')}
            value={lumpSum}
            onChange={setLumpSum}
            hint={t('forwardSIP.lumpsum_hint')}
          />
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="label-overline">{t('forwardSIP.inflation')}</p>
              <p className="text-xs text-on-surface-var opacity-60 mt-0.5">
                {t('forwardSIP.inflation_desc')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="mango-text text-sm">{inflation}%</span>
              <button
                className={`toggle-track ${showInflation ? 'active' : ''}`}
                onClick={() => setShowInflation(!showInflation)}
                aria-label={`Inflation adjustment ${showInflation ? 'on' : 'off'}`}
              >
                <span className="toggle-thumb" />
              </button>
            </div>
          </div>
          {showInflation && (
            <SliderField
              label={t('forwardSIP.inflation')}
              value={inflation}
              min={1}
              max={15}
              unit="%"
              onChange={setInflation}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Asset Class"
              value={assetClass}
              onChange={setAssetClass}
              options={ASSET_CLASSES.map(x => ({ value: x.value, label: x.label }))}
            />
            <Select
              label="Fund Type"
              value={fundType}
              onChange={setFundType}
              options={FUND_TYPES.map(x => ({ value: x.value, label: x.label }))}
            />
          </div>

          {(assetClass !== 'equity' && assetClass !== 'bitcoin') && (
            <div className="mt-4">
              <Select
                label={t('forwardSIP.tax_slab')}
                value={slabRate}
                onChange={(v) => setSlabRate(Number(v))}
                options={SLAB_RATES.map(s => ({ value: s.value, label: s.label }))}
              />
            </div>
          )}
        </div>
      </section>

      <section aria-label="SIP Calculator Results">
        <CorpusWaterfall waterfallData={results.waterfallData} assetClass={assetClass} />
        <CostOfWaiting delta={results.cow} />
        <div className="section-card mt-4">
          <GrowthChart data={results.chartData} />
        </div>
        <div className="section-card mt-4">
          <RealWorldTranslation
            corpus={results.fvNet}
            yearsFromNow={years}
            monthlyExpense={50000}
            inflationRate={inflation / 100}
          />
        </div>
        <FinancialTwin sipAmount={sip} context="monthly SIP" />
        <p className="text-xs text-on-surface-var opacity-30 mt-6 leading-relaxed">
          {t('forwardSIP.disclaimer')}
        </p>
      </section>
    </div>
  );
}
