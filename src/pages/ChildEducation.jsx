import React, { useState, useMemo } from 'react';
import SliderField from '../components/SliderField';
import NumberInput from '../components/NumberInput';
import CostOfWaiting from '../components/CostOfWaiting';
import {
  monthlyRate, reverseStepUpSIP, reverseSIP, inflationAdjustedGoal,
  costOfWaiting, formatINR, formatINRLakh,
} from '../lib/ruleEngine';
import { EDUCATION_COURSES } from '../lib/benchmarkData';

export default function ChildEducation() {
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

    // Total 4-year fee inflated to when child starts college
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
      <section aria-label="Education Fund Inputs">
        <div className="mb-8">
          <p className="label-overline text-on-surface-var mb-2">Education Legacy</p>
          <h1 className="font-serif text-4xl text-on-surface mb-3 leading-tight">
            Child's Education<br />
            <em className="italic">Fund Planner</em>
          </h1>
          <p className="text-sm text-on-surface-var leading-relaxed">
            Course-specific defaults with {results.annualInfRate}% education inflation. Every year of delay compounds the gap.
          </p>
        </div>

        <div className="section-card mb-4">
          <p className="label-overline mb-3">Select Course</p>
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
            <p className="label-overline mb-2">Child's Current Age</p>
            <SliderField
              label=""
              value={childAge}
              min={0}
              max={17}
              unit=" yrs"
              onChange={setChild}
            />
            <p className="text-xs text-on-surface-var opacity-50 mt-1">
              Investment horizon: {yearsToGoal} years (until age 18)
            </p>
          </div>

          <SliderField label="Expected Return" value={rate} min={1} max={20} unit="%" onChange={setRate} />
          <SliderField label="Annual Step-Up" value={stepUp} min={0} max={25} unit="%" onChange={setStepUp} />

          <NumberInput
            label="Existing Savings for Education"
            value={lumpSum}
            onChange={setLumpSum}
          />
        </div>
      </section>

      <section aria-label="Education Fund Results">
        <div className="section-card mb-4">
          <p className="label-overline text-on-surface-var mb-1">Required Monthly SIP</p>
          <p className="result-amount animate-result">
            {formatINR(results.flatSIP)}<span className="text-xl text-on-surface-var">/mo</span>
          </p>
          <p className="text-xs text-on-surface-var mt-1 opacity-60">
            For {courseInfo.label} starting in {yearsToGoal} years
          </p>

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="inner-card">
              <p className="label-overline text-on-surface-var mb-1">With {stepUp}% Step-Up</p>
              <p className="result-amount-sm mango-text">{formatINR(results.stepSIP)}<span className="text-sm text-on-surface-var">/mo</span></p>
            </div>
            <div className="inner-card">
              <p className="label-overline lavender-text mb-1">Future Fee ({results.annualInfRate}% inf)</p>
              <p className="result-amount-sm lavender-text">{formatINRLakh(results.inflatedFee)}</p>
            </div>
          </div>
        </div>

        <CostOfWaiting delta={results.cow} label="Every month you delay costs your child" />

        <div className="inner-card mt-4">
          <p className="text-xs sage-text leading-relaxed">
            📌 Education inflation in India is 10–11% (EY-CII Report 2023). This calculator uses course-specific rates,
            not the generic 6%. MBBS private college uses 12% — healthcare inflation (IRDAI 2024).
          </p>
        </div>

        <p className="text-xs text-on-surface-var opacity-30 mt-6 leading-relaxed">
          Full {courseInfo.years}-year program fee used. Covers all years, not just Year 1. For educational purposes only.
        </p>
      </section>
    </div>
  );
}
