import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useSite } from '../hooks';
import { backend } from '../data';
import { useAuth } from '../auth';
import { Btn } from './ui';

// Cabecera para las zonas privadas (login, portal, admin)
export default function Shell({ children, wide = false }) {
  const { logo } = useSite();
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-crema">
      <header className="sticky top-0 z-50 border-b border-borde bg-crema/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Ir al inicio">
            <img src={logo} alt="Nakary Linares" className="h-8 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <Btn as={Link} to="/" variant="soft" size="sm">Ver sitio</Btn>
            {user && (
              <Btn variant="soft" size="sm" onClick={() => backend.signOut()}>
                <LogOut size={13} /> Salir
              </Btn>
            )}
          </div>
        </div>
      </header>
      <main className={`mx-auto px-4 py-8 sm:px-6 md:py-12 ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>{children}</main>
    </div>
  );
}
