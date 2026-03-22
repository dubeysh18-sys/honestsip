import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import LocaleShell from './components/LocaleShell';
import LearnRedirect from './components/LearnRedirect';

const Home = lazy(() => import('./pages/Home'));
const ForwardSIP = lazy(() => import('./pages/ForwardSIP'));
const ReverseSIP = lazy(() => import('./pages/ReverseSIP'));
const LumpsumCalc = lazy(() => import('./pages/LumpsumCalculator'));
const GoalPlanner = lazy(() => import('./pages/GoalPlanner'));
const Retirement = lazy(() => import('./pages/RetirementPlanner'));
const Education = lazy(() => import('./pages/ChildEducation'));
const Emergency = lazy(() => import('./pages/EmergencyFund'));
const NetWorth = lazy(() => import('./pages/NetWorth'));
const HealthScore = lazy(() => import('./pages/FinancialHealthScore'));
const Salary = lazy(() => import('./pages/SalaryLifestyle'));
const RentVsBuy = lazy(() => import('./pages/RentVsBuy'));
const TaxRegime = lazy(() => import('./pages/TaxRegime'));
const Insurance = lazy(() => import('./pages/TermInsurance'));
const OnTrack = lazy(() => import('./pages/OnTrack'));
const LearnChapter = lazy(() => import('./pages/LearnChapter'));

const Loader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="animate-pulse text-sm text-on-surface-var">Loading…</div>
  </div>
);

const PAGE_ROUTES = [
  { key: 'home', index: true, path: undefined, Component: Home },
  { key: 'sip', path: 'sip', Component: ForwardSIP },
  { key: 'reverse', path: 'reverse', Component: ReverseSIP },
  { key: 'lumpsum', path: 'lumpsum', Component: LumpsumCalc },
  { key: 'goals', path: 'goals', Component: GoalPlanner },
  { key: 'retirement', path: 'retirement', Component: Retirement },
  { key: 'education', path: 'education', Component: Education },
  { key: 'emergency', path: 'emergency', Component: Emergency },
  { key: 'networth', path: 'networth', Component: NetWorth },
  { key: 'health', path: 'health', Component: HealthScore },
  { key: 'salary', path: 'salary', Component: Salary },
  { key: 'rent-vs-buy', path: 'rent-vs-buy', Component: RentVsBuy },
  { key: 'tax-regime', path: 'tax-regime', Component: TaxRegime },
  { key: 'insurance', path: 'insurance', Component: Insurance },
  { key: 'on-track', path: 'on-track', Component: OnTrack },
  { key: 'learn-redirect', path: 'learn', Component: LearnRedirect },
  { key: 'learn-chapter', path: 'learn/:id', Component: LearnChapter },
];

function renderPageRoutes() {
  return PAGE_ROUTES.map(({ key, index, path, Component }) =>
    index ? (
      <Route key={key} index element={<Component />} />
    ) : (
      <Route key={key} path={path} element={<Component />} />
    )
  );
}

export default function App() {
  const baseUrl = import.meta.env.BASE_URL || '/'
  const basename =
    baseUrl === '/' ? undefined : baseUrl.replace(/\/$/, '')

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route
            element={
              <Suspense fallback={<Loader />}>
                <Outlet />
              </Suspense>
            }
          >
            {/* Routes must be direct children of <Route>; a wrapper component breaks RR6 matching. */}
            <Route path="/" element={<LocaleShell lang="en" />}>
              {renderPageRoutes()}
            </Route>
            <Route path="/hi" element={<LocaleShell lang="hi" />}>
              {renderPageRoutes()}
            </Route>
            <Route path="/mr" element={<LocaleShell lang="mr" />}>
              {renderPageRoutes()}
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
