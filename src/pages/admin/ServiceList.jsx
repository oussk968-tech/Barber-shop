import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ServiceList({ onEdit }) {
  const { services, setServices, showNotif } = useApp();
  const [search, setSearch]   = useState('');
  const [confirm, setConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = services
    .filter(s =>
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase())
    );

  const handleDelete = async (id) => {
    setDeleting(true);
    const token = localStorage.getItem('token');
    try {
      const { adminAPI } = await import('../../services/api');
      const res = await adminAPI.deleteService(id, token);
      if (res.success) {
        setServices(prev => prev.filter(s => s.id !== id));
        showNotif('success', 'Service supprimé', 'Le service a été retiré de la base de données.');
        setConfirm(null);
      } else {
        showNotif('error', 'Erreur lors de la suppression', res.message || 'Le serveur a refusé la suppression.');
      }
    } catch (err) {
      showNotif('error', 'Erreur réseau', 'Impossible de joindre le serveur.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <span className="section-label">Administration</span>
        <h2 className="section-title" style={{ fontSize: '1.7rem' }}>Gérer les services</h2>
        <div className="section-divider"></div>
      </div>

      {/* Search + filters */}
      <div className="glass-card p-3 mb-3">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="bi bi-search" style={{ color: 'var(--brown)', flexShrink: 0 }}></i>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un service…"
              className="form-control border-0 p-0"
              style={{ boxShadow: 'none !important', background: 'transparent !important', fontSize: '0.9rem' }}
            />
          </div>
        </div>
      </div>

      {/* Count */}
      <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '0.75rem', fontFamily: 'var(--font-body)' }}>
        <i className="bi bi-grid me-1"></i>
        {filtered.length} service{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <p style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>Aucun service trouvé</p>
            <p>Essayez avec d'autres critères</p>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {filtered.map(service => (
            <div
              key={service.id}
              className="glass-card"
              style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
            >
              {/* Image */}
              <div style={{
                width: '54px', height: '54px', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                flexShrink: 0, background: 'var(--ivory-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)',
              }}>
                {service.img ? (
                  <img src={service.img} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                ) : (
                  <i className={`bi ${service.icon || 'bi-scissors'}`} style={{ color: 'var(--brown)', fontSize: '1.3rem' }}></i>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                    {service.title}
                  </span>
                  {service.popular && (
                    <span className="badge-brown" style={{ fontSize: '0.62rem' }}>★ Populaire</span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-mid)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '380px' }}>
                  {service.description}
                </p>
              </div>

              {/* Price + duration */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--brown-dark)', fontWeight: 700 }}>
                  {service.price} <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontFamily: 'var(--font-body)' }}>MAD</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: 'var(--font-body)' }}>
                  <i className="bi bi-clock me-1"></i>{service.duration}
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex gap-2 flex-shrink-0">
                <button className="btn-icon-premium" onClick={() => onEdit(service)} title="Modifier">
                  <i className="bi bi-pencil" style={{ fontSize: '0.82rem' }}></i>
                </button>
                <button
                  className="btn-icon-premium"
                  onClick={() => setConfirm(service.id)}
                  title="Supprimer"
                  style={{ background: 'var(--danger-bg)', color: 'var(--danger)', borderColor: 'rgba(192,57,43,0.2)' }}
                >
                  <i className="bi bi-trash" style={{ fontSize: '0.82rem' }}></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {confirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(44,30,15,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, backdropFilter: 'blur(6px)',
        }}>
          <div className="glass-card p-4" style={{ maxWidth: '360px', width: '90%', textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'var(--danger-bg)', border: '1px solid rgba(192,57,43,0.25)',
              margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="bi bi-exclamation-triangle" style={{ color: 'var(--danger)', fontSize: '1.4rem' }}></i>
            </div>
            <h5 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '0.5rem', fontWeight: 700 }}>
              Supprimer ce service ?
            </h5>
            <p style={{ color: 'var(--text-mid)', fontSize: '0.84rem', marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}>
              Cette action est irréversible. Le service sera définitivement supprimé du catalogue.
            </p>
            <div className="d-flex gap-3">
              <button
                className="btn-danger-premium"
                style={{ flex: 1, justifyContent: 'center', padding: '0.7rem' }}
                onClick={() => handleDelete(confirm)}
                disabled={deleting}
              >
                {deleting
                  ? <><span className="spinner-border spinner-border-sm me-1"></span>Suppression…</>
                  : <><i className="bi bi-trash me-1"></i>Supprimer</>
                }
              </button>
              <button
                className="btn-ghost-premium"
                style={{ flex: 1, justifyContent: 'center', padding: '0.7rem' }}
                onClick={() => setConfirm(null)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
