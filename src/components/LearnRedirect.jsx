import { Navigate } from 'react-router-dom';
import { useLocalizedPath } from '../hooks/useLocalizedPath';

export default function LearnRedirect() {
  const lp = useLocalizedPath();
  return <Navigate to={lp('/learn/what-is-a-sip')} replace />;
}
