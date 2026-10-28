import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentSession, getDashboardPath } from '../data/authStorage';

export default function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation();
  const session = getCurrentSession();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!allowedRoles.includes(session.role)) {
    return <Navigate to={getDashboardPath(session.role)} replace />;
  }

  return children;
}
