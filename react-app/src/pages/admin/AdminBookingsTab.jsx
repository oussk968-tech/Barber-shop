import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AdminBookingsTab() {
  const { rdvs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRdvs = rdvs.filter(rdv => {
    const isConfirmed = rdv.status === 'confirmé' || rdv.status === 'confirmed';
    const matchSearch = searchTerm === '' ||
      rdv.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rdv.barber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rdv.clientName && rdv.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    return isConfirmed && matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <span className="section-label">Gestion</span>
        <h2 className="section-title" style={{ fontSize: '1.7rem' }}>Liste des rendez-vous</h2>
        <div className="section-divider"></div>
      </div>

      {/* Search */}
      <div className="glass-card p-3 mb-4">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-search" style={{ color: 'var(--brown)', fontSize: '1rem' }}></i>
          <input
            className="form-control border-0 shadow-none p-0"
            type="text"
            placeholder="Rechercher par client, service ou coiffeur..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ background: 'transparent !important', boxShadow: 'none !important', fontSize: '0.9rem' }}
          />
          {searchTerm && (
            <button
              className="btn-icon-premium"
              onClick={() => setSearchTerm('')}
              style={{ width: '28px', height: '28px', flexShrink: 0 }}
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {filteredRdvs.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-calendar-x"></i>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-dark)' }}>Aucun rendez-vous trouvé</p>
            <p style={{ fontSize: '0.82rem' }}>
              {searchTerm ? 'Essayez avec d\'autres termes de recherche' : 'Aucun rendez-vous confirmé pour le moment'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table-premium">
              <thead>
                <tr>
                  <th><i className="bi bi-person me-1"></i>Client</th>
                  <th><i className="bi bi-scissors me-1"></i>Service</th>
                  <th><i className="bi bi-person-badge me-1"></i>Coiffeur</th>
                  <th><i className="bi bi-calendar3 me-1"></i>Date</th>
                  <th><i className="bi bi-clock me-1"></i>Heure</th>
                  <th><i className="bi bi-tag me-1"></i>Prix</th>
                </tr>
              </thead>
              <tbody>
                {filteredRdvs.map((rdv, idx) => (
                  <tr key={rdv.id || idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                          width: '30px', height: '30px', borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--brown), var(--brown-light))',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.72rem', fontWeight: 700, color: 'var(--white)',
                          flexShrink: 0,
                        }}>
                          {(rdv.clientName || 'C')[0].toUpperCase()}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-dark)', lineHeight: 1.2 }}>{rdv.clientName || 'Client'}</span>
                          {rdv.clientPhone && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                              <i className="bi bi-telephone me-1" style={{ fontSize: '0.7rem' }}></i>{rdv.clientPhone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{rdv.service}</td>
                    <td style={{ color: 'var(--text-mid)' }}>{rdv.barber}</td>
                    <td style={{ color: 'var(--text-mid)' }}>{rdv.booking_date || rdv.date || '—'}</td>
                    <td style={{ color: 'var(--text-mid)' }}>{rdv.booking_time || rdv.time || '—'}</td>
                    <td>
                      <span className="badge-brown">
                        {rdv.price ? `${rdv.price} MAD` : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer count */}
      {filteredRdvs.length > 0 && (
        <div className="text-center mt-3" style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
          <i className="bi bi-info-circle me-1"></i>
          {filteredRdvs.length} rendez-vous confirmé{filteredRdvs.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
