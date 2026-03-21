import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SliderField from '../components/SliderField';
import NumberInput from '../components/NumberInput';
import CostOfWaiting from '../components/CostOfWaiting';
import {
  monthlyRate, reverseStepUpSIP, reverseSIP, inflationAdjustedGoal,
  costOfWaiting, formatINR, formatINRLakh,
} from '../lib/ruleEngine';
import { EDUCATION_COURSES } from '../lib/benchmarkData';

export default function ChildEducation() {
  const { t } = useTranslation();
  const [course, setCourse]   = useState('engineering-pvt');
  const [childAge, setChild]  = useState(2);
  const [rate, setRate]       = useState(12);
  const [stepUp, setStepUp]   = useState(10);
  const [lumpSum, setLumpSum] = useState(0);

  const courseInfo = EDUCATION_COURSES.find(c => c.id === course) || EDUCATION_COURSES[0];
  const yearsToGoal = Math.max(1, 18 - childAge);

  const results = useMemo(() => {
    const r = rate / 100;
    const g = stepUp / 100;
    const i = monthlyRate(r);
    const n = yearsToGoal * 12;
    const inf = courseInfo.inflation;

    const inflatedFee = inflationAdjustedGoal(courseInfo.totalFee, inf, yearsToGoal);
    const lumpFV  = lumpSum > 0 ? lumpSum * Math.pow(1 + i, n) : 0;
    const netGoal = Math.max(0, inflatedFee - lumpFV);
    const flatSIP  = netGoal > 0 ? Math.ceil(reverseSIP(netGoal, i, n)) : 0;
    const stepSIP  = netGoal > 0 ? reverseStepUpSIP(netGoal, g, r, yearsToGoal) : 0;
    const cow      = flatSIP > 0 ? costOfWaiting(flatSIP, r, n) : 0;
    const annualInfRate = (courseInfo.inflation * 100).toFixed(0);

    return { inflatedFee: Math.round(inflatedFee), flatSIP, stepSIP, cow, annualInfRate };
  }, [course, childAge, rate, stepUp, lumpSum, yearsToGoal, courseInfo]);

  return (
    <div className="page-section pb-28 md:pb-12">
      <div className="md:col-span-2 grid md:grid-cols-2 gap-8 mb-2">
        <div>
          <p className="label-overline text-on-surface-var mb-2">{t('childEdu.header_overline')}</p>
          <h1 className="font-serif text-4xl text-on-surface mb-3 leading-tight">
            {t('childEdu.header_title1')}<br />
            <em className="italic">{t('childEdu.header_title2')}</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            {t('childEdu.header_desc', { rate: results.annualInfRate })}
          </p>
        </div>

        <div className="section-card">
          <p className="label-overline text-on-surface-var mb-1">{t('childEdu.req_sip')}</p>
          <p className="result-amount animate-result">
            {formatINR(results.flatSIP)}<span className="text-xl text-on-surface-var">/mo</span>
          </p>
          <p className="text-xs text-on-surface-var mt-1 opacity-60">
            {t('childEdu.req_desc', { course: courseInfo.label, years: yearsToGoal })}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">{t('childEdu.with_stepup', { stepup: stepUp })}</p>
              <p className="result-amount-sm mango-text">{formatINR(results.stepSIP)}<span className="text-sm text-on-surface-var">/mo</span></p>
            </div>
            <div className="inner-card">
              <p className="label-overline lavender-text mb-1">{t('childEdu.future_fee', { rate: results.annualInfRate })}</p>
              <p className="result-amount-sm lavender-text">{formatINRLakh(results.inflatedFee)}</p>
            </div>
          </div>
        </div>
      </div>

      <section aria-label="Education Fund Inputs">
        <div className="section-card mb-4 mt-2 md:mt-0">
          <p className="label-overline mb-3">{t('childEdu.select_course')}</p>
          <div className="space-y-2 mb-5">
            {EDUCATION_COURSES.map(c => (
              <button
                key={c.id}
                onClick={() => setCourse(c.id)}
                className="w-full text-left p-3 rounded-xl transition-all flex justify-between items-center"
                style={{
                  background: course === c.id ? 'rgba(255,183,125,0.12)' : '#2a2a2a',
                  border: course === c.id ? '1px solid rgba(255,183,125,0.3)' : '1px solid transparent',
                }}
              >
                <div>
                  <p className="text-sm text-on-surface font-medium">{c.label}</p>
                  <p className="text-xs text-on-surface-var opacity-60 mt-0.5">
                    {c.note || `${c.years}-year program`} • {(c.inflation * 100).toFixed(0)}% education inflation
                  </p>
                </div>
                <p className="text-sm mango-text font-semibold flex-shrink-0 ml-3">
                  {formatINRLakh(c.totalFee)}
                </p>
              </button>
            ))}
          </div>

          <div className="mb-5">
            <p className="label-overline mb-2">{t('childEdu.child_age')}</p>
            <SliderField
              label=""
              value={childAge}
              min={0}
              max={17}
              unit=" yrs"
              onChange={setChild}
            />
            <p className="text-xs text-on-surface-var opacity-50 mt-1">
              {t('childEdu.inv_horizon', { years: yearsToGoal })}
            </p>
          </div>

          <SliderField label={t('childEdu.expected_return')} value={rate} min={1} max={20} unit="%" onChange={setRate} />
          <SliderField label={t('childEdu.annual_stepup')} value={stepUp} min={0} max={25} unit="%" onChange={setStepUp} />

          <NumberInput
            label={t('childEdu.existing_savings')}
            value={lumpSum}
            onChange={setLumpSum}
          />
        </div>
      </section>

      <section aria-label="Education Fund Results">
        <div className="mt-2 md:mt-0">
          <CostOfWaiting delta={results.cow} label={t('childEdu.delay_cost')} />
        </div>

        <div className="inner-card mt-4">
          <p className="text-xs sage-text leading-relaxed">
            {t('childEdu.note')}
          </p>
        </div>

        <p className="text-xs text-on-surface-var opacity-30 mt-6 leading-relaxed">
          {t('childEdu.disclaimer', { years: courseInfo.years })}
        </p>
      </section>
    </div>
  );
}
