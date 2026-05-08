import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const BG = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1400&auto=format&q=80';

export default function RegisterPage() {
  const { register, setPage } = useApp();
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const ch = e => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = ['Le prénom est requis.'];
    if (!form.nom.trim())    e.nom    = ['Le nom est requis.'];
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) e.email = ['L\'email est requis.'];
    else if (!emailRegex.test(form.email)) e.email = ['Format d\'email invalide.'];

    if (form.phone && form.phone.length < 10) e.phone = ['Le numéro de téléphone est trop court.'];

    if (!form.password) e.password = ['Le mot de passe est requis.'];
    else if (form.password.length < 6) e.password = ['Le mot de passe doit faire au moins 6 caractères.'];

    if (form.password !== form.confirm) e.confirm = ['Les mots de passe ne correspondent pas.'];

    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validate()) return;

    setLoading(true);
    const result = await register({
      first_name: form.prenom, // Backend expects first_name
      last_name:  form.nom,    // Backend expects last_name
      email:      form.email,
      phone:      form.phone,
      password:   form.password,
      password_confirmation: form.confirm // Backend expects password_confirmation
    });

    if (result && !result.success) {
      if (result.errors) {
        setFieldErrors(result.errors);
        setError('Veuillez corriger les erreurs ci-dessous.');
      } else {
        setError(result.message || 'Erreur lors de la création du compte.');
      }
    }
    setLoading(false);
  };

  const fields = [
    { name: 'prenom',   label: 'Prénom',        type: 'text',     placeholder: 'Votre prénom',       half: true  },
    { name: 'nom',      label: 'Nom',            type: 'text',     placeholder: 'Votre nom',          half: true  },
    { name: 'email',    label: 'Adresse email',  type: 'email',    placeholder: 'votre@email.com',    half: false },
    { name: 'phone',    label: 'Téléphone',      type: 'tel',      placeholder: '+212 6XX XXX XXX',   half: false },
    { name: 'password', label: 'Mot de passe',   type: 'password', placeholder: '••••••••',           half: true  },
    { name: 'confirm',  label: 'Confirmer',      type: 'password', placeholder: '••••••••',           half: true  },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: '75px', paddingBottom: '2rem' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `url(${BG})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.07) saturate(0.3)', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, background: 'linear-gradient(135deg, rgba(255,242,225,0.93), rgba(245,230,204,0.90))', zIndex: 0 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-7 col-lg-6">
            <div className="fade-in">



              <div className="auth-card">
                <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '0.4rem', textAlign: 'center', fontWeight: 700, fontSize: '1.7rem' }}>
                  Créer un compte
                </h4>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}>
                  Rejoignez le Salon Barber Shop
                </p>

                <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, var(--brown), var(--brown-light))', margin: '0 auto 1.5rem', borderRadius: '2px' }} />

                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" style={{ fontSize: '0.84rem' }}>
                    <i className="bi bi-exclamation-circle-fill"></i>{error}
                  </div>
                )}

                <form onSubmit={submit}>
                  <div className="row g-3">
                    {fields.map(f => (
                      <div key={f.name} className={f.half ? 'col-6' : 'col-12'}>
                        <label className="form-label">{f.label}</label>
                        <input
                          className="form-control"
                          type={f.type}
                          name={f.name}
                          placeholder={f.placeholder}
                          value={form[f.name]}
                          onChange={ch}
                          required
                          style={fieldErrors[f.name] ? { borderColor: 'var(--danger) !important' } : {}}
                        />
                        {fieldErrors[f.name] && (
                          <small style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {fieldErrors[f.name][0]}
                          </small>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="btn-sky w-100 mt-4"
                    style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', justifyContent: 'center' }}
                    disabled={loading}
                  >
                    {loading
                      ? <><span className="spinner-border spinner-border-sm me-2"></span>Création...</>
                      : <><i className="bi bi-person-check me-2"></i>Créer mon compte</>
                    }
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span style={{ color: 'var(--text-mid)', fontSize: '0.85rem', fontFamily: 'var(--font-body)' }}>Déjà un compte ? </span>
                  <button
                    className="btn btn-link p-0 border-0"
                    style={{ color: 'var(--brown)', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-body)' }}
                    onClick={() => setPage('login')}
                  >
                    Se connecter
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
