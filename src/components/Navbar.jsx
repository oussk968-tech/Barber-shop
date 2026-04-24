import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { user, page, setPage, setDashTab, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const go = (id) => {
    setOpen(false);
    if (page !== 'home') { setPage('home'); setTimeout(() => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' }), 100); }
    else document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Accueil', action: () => go('#home') },
    { label: 'Services', action: () => go('#services') },
    { label: 'Galerie', action: () => go('#gallery') },
    { label: 'Contact', action: () => go('#contact') },
  ];

  const navBg = page !== 'home'
    ? 'rgba(255,255,255,0.99)'
    : scrolled
      ? 'rgba(255,242,225,0.97)'
      : 'rgba(255,242,225,0.82)';

  return (
    <nav
      className="navbar navbar-expand-lg fixed-top"
      style={{
        background: navBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        boxShadow: scrolled || page !== 'home' ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        padding: '0',
        minHeight: '65px',
        transition: 'var(--ease)',
      }}
    >
      <div className="container d-flex align-items-center" style={{ minHeight: '65px' }}>
        {/* Logo */}
        <div className="navbar-brand d-flex align-items-center" style={{ zIndex: 10, padding: 0, margin: 0 }}>
          <img
            src="/public/ChatGPT Image 24 avr. 2026, 21_19_10.png"
            alt="Barber Shop Logo"
            style={{
              height: '50px',
              width: 'auto',
              objectFit: 'contain',
              cursor: 'pointer',
              transform: 'scale(1.7) translateY(5px)',
              transformOrigin: 'left center',
            }}
            onClick={() => setPage('home')}
          />
        </div>

        {/* Mobile toggle */}
        <button
          className="border-0 ms-auto d-lg-none"
          style={{
            background: open ? 'var(--ivory-deep)' : 'transparent',
            color: 'var(--text-dark)',
            fontSize: '1.25rem',
            padding: '0.35rem 0.6rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'var(--ease)',
          }}
          onClick={() => setOpen(!open)}
        >
          <i className={`bi bi-${open ? 'x-lg' : 'list'}`}></i>
        </button>

        {/* Nav content */}
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1 mb-2 mb-lg-0">
            {navLinks.map(l => (
              <li key={l.label} className="nav-item">
                <button
                  className="nav-link btn btn-link border-0 text-decoration-none px-3 py-2"
                  style={{
                    color: 'var(--text-mid)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    fontFamily: 'var(--font-body)',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'var(--ease)',
                  }}
                  onClick={() => { setOpen(false); l.action(); }}
                  onMouseEnter={e => { e.target.style.color = 'var(--brown-dark)'; e.target.style.background = 'rgba(167,146,119,0.08)'; }}
                  onMouseLeave={e => { e.target.style.color = 'var(--text-mid)'; e.target.style.background = 'transparent'; }}
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2 ms-lg-3 mt-2 mt-lg-0">
            {user ? (
              <>
                <button
                  className="btn-sky-outline px-3 py-2"
                  style={{ fontSize: '0.82rem', borderRadius: 'var(--radius-md)' }}
                  onClick={() => { setOpen(false); setPage('dashboard'); setDashTab('rdvs'); }}
                >
                  <i className="bi bi-person-circle me-1"></i>{user.prenom}
                </button>
                <button
                  className="btn btn-link border-0 p-2"
                  style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}
                  onClick={logout}
                  title="Déconnexion"
                >
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-sky-outline px-4 py-2"
                  style={{ fontSize: '0.82rem' }}
                  onClick={() => { setOpen(false); setPage('login'); }}
                >
                  Connexion
                </button>
                <button
                  className="btn-sky px-4 py-2"
                  style={{ fontSize: '0.82rem' }}
                  onClick={() => { setOpen(false); setPage('register'); }}
                >
                  S'inscrire
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
