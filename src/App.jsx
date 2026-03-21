import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy-load each calculator for performance
const ForwardSIP    = lazy(() => import('./pages/ForwardSIP'));
const ReverseSIP    = lazy(() => import('./pages/ReverseSIP'));
const GoalPlanner   = lazy(() => import('./pages/GoalPlanner'));
const Retirement    = lazy(() => import('./pages/RetirementPlanner'));
const Education     = lazy(() => import('./pages/ChildEducation'));
const Emergency     = lazy(() => import('./pages/EmergencyFund'));
const NetWorth      = lazy(() => import('./pages/NetWorth'));
const HealthScore   = lazy(() => import('./pages/FinancialHealthScore'));
const Salary        = lazy(() => import('./pages/SalaryLifestyle'));
const RentVsBuy     = lazy(() => import('./pages/RentVsBuy'));
const TaxRegime     = lazy(() => import('./pages/TaxRegime'));
const Insurance     = lazy(() => import('./pages/TermInsurance'));
const OnTrack       = lazy(() => import('./pages/OnTrack'));

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-on-surface-var text-sm animate-pulse">Loading…</div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/"           element={<ForwardSIP />} />
            <Route path="/reverse"    element={<ReverseSIP />} />
            <Route path="/goals"      element={<GoalPlanner />} />
            <Route path="/retirement" element={<Retirement />} />
            <Route path="/education"  element={<Education />} />
            <Route path="/emergency"  element={<Emergency />} />
            <Route path="/networth"   element={<NetWorth />} />
            <Route path="/health"     element={<HealthScore />} />
            <Route path="/salary"     element={<Salary />} />
            <Route path="/rent-vs-buy" element={<RentVsBuy />} />
            <Route path="/tax-regime" element={<TaxRegime />} />
            <Route path="/insurance"  element={<Insurance />} />
            <Route path="/on-track"   element={<OnTrack />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
