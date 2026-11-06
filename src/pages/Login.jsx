import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { backend } from '../data';
import { authErrorMsg, useAuth } from '../auth';
import Shell from '../components/Shell';
import { Btn, Card, Eyebrow, Field, Input, PageLoader } from '../components/ui';

export default function Login() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) nav(isAdmin ? '/admin' : '/mi-plan', { replace: true });
  }, [user, isAdmin, nav]);

  if (loading) return <PageLoader />;
  if (user) return <Navigate to={isAdmin ? '/admin' : '/mi-plan'} replace />;

  const entrar = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg({ type: '', text: '' });
    try {
      await backend.signIn(email.trim(), pass);
    } catch (err) {
      setMsg({ type: 'error', text: authErrorMsg(err) });
      setBusy(false);
    }
  };

  const olvide = async () => {
    if (!email.trim()) return setMsg({ type: 'error', text: 'Escribe primero tu correo y vuelve a tocar "Olvidé mi contraseña".' });
    try {
      await backend.resetPassword(email.trim());
      setMsg({ type: 'ok', text: 'Si el correo está registrado, te enviamos un enlace para crear una nueva contraseña. Revisa también tu carpeta de spam.' });
    } catch (err) {
      setMsg({ type: 'error', text: authErrorMsg(err) });
    }
  };

  return (
    <Shell>
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-salvia shadow-sm">
            <Lock size={22} />
          </div>
          <Eyebrow className="mb-2">Zona de clientas</Eyebrow>
          <h1 className="font-editorial text-3xl text-tinta md:text-4xl">
            Ingresa a <span className="font-light italic text-salvia">tu plan</span>
          </h1>
        </div>

        <Card>
          <form onSubmit={entrar} className="space-y-5">
            <Field label="Correo">
              <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required />
            </Field>
            <Field label="Contraseña">
              <Input type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" required />
            </Field>

            {msg.text && (
              <p className={`rounded-xl px-4 py-3 text-xs leading-relaxed ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>{msg.text}</p>
            )}

            <Btn type="submit" size="lg" className="w-full" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</Btn>
            <button type="button" onClick={olvide} className="block w-full text-center text-xs text-musgo underline-offset-4 hover:underline">
              Olvidé mi contraseña
            </button>
          </form>
        </Card>

        <p className="mt-6 text-center text-xs text-musgo/70">
          ¿Aún no tienes acceso? Escríbele a Nakary por WhatsApp o Instagram y te lo creamos.
        </p>

        {backend.mode === 'demo' && (
          <Card className="mt-6 border-amber-200! bg-amber-50! text-xs leading-relaxed text-amber-900">
            <p className="mb-2 font-bold uppercase tracking-widest">Modo demostración</p>
            <p>Firebase aún no está conectado, así que nada se guarda en internet. Para probar:</p>
            <ul className="mt-2 space-y-1">
              <li>• Clienta: <b>clienta@demo.com</b> / demo1234</li>
              <li>• Administradora: <b>admin@demo.com</b> / demo1234</li>
            </ul>
          </Card>
        )}
      </div>
    </Shell>
  );
}
