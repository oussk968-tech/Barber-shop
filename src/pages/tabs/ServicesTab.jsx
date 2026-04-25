import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ServicesTab() {
  const { setDashTab, services } = useApp();
  const filtered = services;

  return (
    <div>
      <div className="mb-4">
        <span className="section-label">Catalogue</span>
        <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Liste des services</h2>
        <div className="section-divider"></div>
      </div>


      {/* Services grid */}
      <div className="row g-4">
        {filtered.map(s => (
          <div key={s.title} className="col-md-6 col-xl-4">
            <div className="team-card h-100 d-flex flex-column" style={{ cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              {/* Image */}
              <div style={{ height: '170px', overflow: 'hidden', position: 'relative' }}>
                <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
                {/* Popular badge */}
                {s.popular && (
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'var(--brown)', color: 'var(--white)',
                    borderRadius: 'var(--radius-pill)', padding: '3px 10px',
                    fontSize: '0.65rem', fontWeight: 700, fontFamily: 'var(--font-body)',
                  }}>★ Populaire</div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 d-flex flex-column" style={{ flex: 1 }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-dark)', margin: 0, fontWeight: 600 }}>
                    {s.title}
                  </h5>
                </div>
                <p style={{ color: 'var(--text-mid)', fontSize: '0.83rem', lineHeight: 1.65, marginBottom: '1rem', fontFamily: 'var(--font-body)' }}>
                  {s.description || s.desc}
                </p>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--brown-dark)', fontWeight: 700 }}>{s.price}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: '4px', fontFamily: 'var(--font-body)' }}>MAD</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-mid)', fontFamily: 'var(--font-body)' }}>
                    <i className="bi bi-clock me-1" style={{ color: 'var(--brown-light)' }}></i>{s.duration}
                  </span>
                </div>
                <button className="btn-sky w-100 mt-auto" style={{ padding: '0.65rem', fontSize: '0.82rem', justifyContent: 'center' }} onClick={() => setDashTab('booking')}>
                  <i className="bi bi-calendar-plus me-1"></i>Réserver ce service
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-grid"></i>
          <p>Aucun service dans cette catégorie</p>
        </div>
      )}
    </div>
  );
}
