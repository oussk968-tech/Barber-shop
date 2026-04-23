import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const BG = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1400&auto=format&q=80';

export default function LoginPage() {
  const { login, setPage } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    login(form.email, form.password);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: '75px', paddingBottom: '2rem' }}>
      {/* Background image */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `url(${BG})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.08) saturate(0.4)',
        zIndex: 0,
      }} />
      {/* Warm gradient overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(135deg, rgba(255,242,225,0.92), rgba(245,230,204,0.88))',
        zIndex: 0,
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="fade-in">



              {/* Card */}
              <div className="auth-card">
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '0.4rem', textAlign: 'center', fontWeight: 700, fontSize: '1.7rem' }}>
                  Connexion
                </h4>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.75rem', fontFamily: 'var(--font-body)' }}>
                  Accédez à votre espace personnel
                </p>

                {/* Decorative line */}
                <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, var(--brown), var(--brown-light))', margin: '0 auto 1.75rem', borderRadius: '2px' }} />

                <form onSubmit={submit}>
                  <div className="mb-3">
                    <label className="form-label">Adresse email</label>
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      placeholder="votre@email.com"
                      value={form.email}
                      onChange={ch}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Mot de passe</label>
                    <input
                      className="form-control"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={ch}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-sky w-100"
                    style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', justifyContent: 'center' }}
                    disabled={loading}
                  >
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Connexion...</>
                      : <><i className="bi bi-box-arrow-in-right me-2"></i>Se connecter</>
                    }
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span style={{ color: 'var(--text-mid)', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>Pas encore de compte ? </span>
                  <button
                    className="btn btn-link p-0 border-0"
                    style={{ color: 'var(--brown)', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-body)' }}
                    onClick={() => setPage('register')}
                  >
                    S'inscrire
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
