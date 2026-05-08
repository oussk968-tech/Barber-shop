import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const BG = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1400&auto=format&fit=crop&q=80';

export default function LoginAdmin() {
  const { login, setPage } = useApp();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const ch = e => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true);
    const ok = await login(form.email, form.password);
    setLoading(false);
    if (!ok) setError('Email ou mot de passe incorrect.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', background: 'var(--ivory)' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url(${BG})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.08) saturate(0.4)', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, rgba(255,242,225,0.92), rgba(245,230,204,0.88))', zIndex: 0 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="fade-in">

              <div className="text-center mb-4">
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', color: 'var(--text-dark)', marginBottom: '0.25rem', cursor: 'pointer', fontWeight: 700 }} onClick={() => setPage('home')}>
                  <i className="bi bi-scissors me-2" style={{ color: 'var(--brown)' }}></i>Barber Shop
                </div>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.82rem', margin: 0, fontFamily: 'var(--font-body)' }}>Salon de coiffure premium · Casablanca</p>
              </div>

              <div className="auth-card">
                {/* Admin badge */}
                <div className="text-center mb-3">
                  <span className="badge-admin">
                    <i className="bi bi-shield-lock-fill"></i> ESPACE ADMINISTRATEUR
                  </span>
                </div>

                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '0.4rem', textAlign: 'center', fontWeight: 700, fontSize: '1.6rem' }}>
                  Connexion Admin
                </h4>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.84rem', textAlign: 'center', marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}>
                  Accédez au panneau de gestion
                </p>

                <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, var(--brown), var(--brown-light))', margin: '0 auto 1.5rem', borderRadius: '2px' }} />

                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" style={{ fontSize: '0.82rem' }}>
                    <i className="bi bi-exclamation-circle-fill"></i>{error}
                  </div>
                )}

                <form onSubmit={submit}>
                  <div className="mb-3">
                    <label className="form-label">Adresse email</label>
                    <input className="form-control" type="email" name="email" placeholder="admin@salon.ma" value={form.email} onChange={ch} autoComplete="email" required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Mot de passe</label>
                    <div style={{ position: 'relative' }}>
                      <input className="form-control" type={showPwd ? 'text' : 'password'} name="password" placeholder="••••••••" value={form.password} onChange={ch} autoComplete="current-password" style={{ paddingRight: '3rem' }} required />
                      <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                        <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-sky w-100" style={{ padding: '0.85rem', justifyContent: 'center', fontSize: '0.9rem' }} disabled={loading}>
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2"></span>Connexion…</>
                      : <><i className="bi bi-shield-check me-2"></i>Accéder au panneau</>
                    }
                  </button>
                </form>

                {/* Demo hint */}
                <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: 'var(--ivory-soft)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '0.78rem', color: 'var(--text-mid)', fontFamily: 'var(--font-body)' }}>
                  <i className="bi bi-info-circle me-2" style={{ color: 'var(--brown)' }}></i>
                  <strong style={{ color: 'var(--text-dark)' }}>Démo :</strong> admin@demo.ma / admin123
                </div>

                <div className="text-center mt-3">
                  <button className="btn btn-link p-0 border-0" style={{ color: 'var(--text-light)', fontSize: '0.82rem', textDecoration: 'none', fontFamily: 'var(--font-body)' }} onClick={() => setPage('home')}>
                    <i className="bi bi-arrow-left me-1"></i>Retour à l'accueil
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
