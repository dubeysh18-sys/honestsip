import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatINRLakh } from '../lib/ruleEngine';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="mango-text mb-1 font-semibold">Year {label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {formatINRLakh(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function GrowthChartInner({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="label-overline mb-3 text-on-surface-var">Year-by-Year Growth</p>
      <div style={{ minHeight: '220px', width: '100%' }}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffb77d" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ffb77d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#cebefa" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#cebefa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgb(var(--color-surface-high))" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: '#ddc1ae', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v) => formatINRLakh(v)}
              tick={{ fill: '#ddc1ae', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="invested"
              name="Invested"
              stroke="#cebefa"
              strokeWidth={1.5}
              fill="url(#investedGrad)"
              strokeDasharray="4 2"
            />
            <Area
              type="monotone"
              dataKey="corpus"
              name="Corpus"
              stroke="#ffb77d"
              strokeWidth={2}
              fill="url(#corpusGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
