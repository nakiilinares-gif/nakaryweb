import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth';
import { PageLoader } from './components/ui';
import Home from './pages/Home';
import Nutricion from './pages/Nutricion';
import Entrenamiento from './pages/Entrenamiento';
import Evolucion from './pages/Evolucion';
import Login from './pages/Login';
import Portal from './pages/Portal';
import Admin from './pages/admin/Admin';

function ScrollToHash() {
  const { hash, pathname, key } = useLocation();
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [hash, pathname, key]);
  return null;
}

function Private({ admin = false, children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/ingresar" replace />;
  if (admin && !isAdmin) return <Navigate to="/mi-plan" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nutricion" element={<Nutricion />} />
        <Route path="/entrenamiento" element={<Entrenamiento />} />
        <Route path="/evolucion" element={<Evolucion />} />
        <Route path="/ingresar" element={<Login />} />
        <Route path="/mi-plan" element={<Private><Portal /></Private>} />
        <Route path="/admin" element={<Private admin><Admin /></Private>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
