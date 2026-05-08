import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const statusConfig = {
  confirmé:  { cls: 'badge-success', icon: 'bi-check-circle-fill', label: 'Confirmé' },
  confirmed: { cls: 'badge-success', icon: 'bi-check-circle-fill', label: 'Confirmé' },
  annulé:    { cls: 'badge-danger',  icon: 'bi-x-circle-fill',     label: 'Annulé'   },
};

export default function RdvsTab() {
  const { rdvs, cancelRdv, formatDate, setDashTab } = useApp();
  const [confirmId, setConfirmId] = useState(null);
  const [loading, setLoading] = useState(rdvs.length === 0);

  const handleCancel = async (id) => { await cancelRdv(id); setConfirmId(null); };

  useEffect(() => { setLoading(false); }, [rdvs]);

  const filtered = rdvs.filter(r => r.status === 'confirmé' || r.status === 'confirmed');

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <span className="section-label">Mon espace</span>
          <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Mes rendez-vous</h2>
          <div className="section-divider"></div>
        </div>
        <button className="btn-sky" style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem' }} onClick={() => setDashTab('booking')}>
          <i className="bi bi-plus-circle me-2"></i>Nouveau RDV
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: 'var(--brown)', width: '2.5rem', height: '2.5rem', borderWidth: '3px' }}></div>
          <p style={{ color: 'var(--text-mid)', marginTop: '1rem', fontFamily: 'var(--font-body)' }}>Chargement…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <i className="bi bi-calendar-x"></i>
            <p style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.5rem', fontSize: '1rem' }}>Aucun rendez-vous trouvé</p>
            <p style={{ marginBottom: '1.5rem' }}>Vous n'avez pas encore de rendez-vous confirmé</p>
            <button className="btn-sky" onClick={() => setDashTab('booking')}>
              <i className="bi bi-plus me-2"></i>Prendre un RDV
            </button>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map(rdv => {
            const sc = statusConfig[rdv.status] || statusConfig['confirmé'];
            const canCancel = rdv.status === 'confirmé' || rdv.status === 'confirmed';
            const svcName = typeof rdv.service === 'object' ? rdv.service?.name : rdv.service;
            const brbName = typeof rdv.barber  === 'object' ? rdv.barber?.name  : rdv.barber;
            const date    = rdv.booking_date ? formatDate(rdv.booking_date) : formatDate(rdv.date);
            const time    = rdv.booking_time || rdv.time;
            const price   = rdv.price_at_booking || rdv.price;

            return (
              <div key={rdv.id} className="glass-card p-4">
                <div className="row align-items-center g-3">

                  {/* Left — service info */}
                  <div className="col-md-7">
                    <div className="d-flex align-items-start gap-3">
                      <div style={{
                        width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, rgba(167,146,119,0.15), rgba(167,146,119,0.08))',
                        border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <i className="bi bi-scissors" style={{ color: 'var(--brown)', fontSize: '1.2rem' }}></i>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-dark)', fontWeight: 600, marginBottom: '6px' }}>
                          {svcName}
                        </div>
                        <div className="d-flex flex-wrap gap-3">
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-mid)', fontFamily: 'var(--font-body)' }}>
                            <i className="bi bi-person me-1" style={{ color: 'var(--brown-light)' }}></i>{brbName}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-mid)', fontFamily: 'var(--font-body)' }}>
                            <i className="bi bi-calendar3 me-1" style={{ color: 'var(--brown-light)' }}></i>{date}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-mid)', fontFamily: 'var(--font-body)' }}>
                            <i className="bi bi-clock me-1" style={{ color: 'var(--brown-light)' }}></i>{time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right — price, status, cancel */}
                  <div className="col-md-5">
                    <div className="d-flex justify-content-md-end align-items-center gap-3 flex-wrap">
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--brown-dark)', fontWeight: 700 }}>
                        {price}<span style={{ fontSize: '0.78rem', marginLeft: '4px', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>MAD</span>
                      </div>

                      <span className={sc.cls}>
                        <i className={`bi ${sc.icon} me-1`}></i>{sc.label}
                      </span>

                      {canCancel && (
                        confirmId === rdv.id ? (
                          <div className="d-flex gap-2">
                            <button className="btn-danger-premium" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }} onClick={() => handleCancel(rdv.id)}>
                              Confirmer
                            </button>
                            <button className="btn-ghost-premium" style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }} onClick={() => setConfirmId(null)}>
                              Non
                            </button>
                          </div>
                        ) : (
                          <button className="btn-danger-premium" style={{ fontSize: '0.75rem', padding: '0.38rem 0.9rem' }} onClick={() => setConfirmId(rdv.id)}>
                            <i className="bi bi-x-circle me-1"></i>Annuler
                          </button>
                        )
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
