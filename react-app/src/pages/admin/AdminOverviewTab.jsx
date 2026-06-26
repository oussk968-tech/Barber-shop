import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { adminAPI } from '../../services/api';

export default function AdminOverviewTab() {
  const { showNotif } = useApp();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    today_bookings_count: 0,
    today_revenue: 0,
    today_bookings: [],
    stats: {
      total_bookings: 0,
      total_revenue: 0,
      total_barbers: 0,
      total_services: 0,
      total_clients: 0
    },
    status_counts: {
      'confirmé': 0,
      'en_attente': 0,
      'annulé': 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await adminAPI.getDashboardStats(token);
        if (res.success) {
          setData(res.data);
        } else {
          showNotif('error', 'Erreur', res.message || 'Impossible de charger les statistiques.');
        }
      } catch (err) {
        showNotif('error', 'Erreur réseau', 'Erreur lors de la récupération des statistiques.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showNotif]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-brown" role="status" style={{ color: 'var(--brown)' }}>
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'confirmé' || s === 'confirmed') return 'badge-success';
    if (s === 'en_attente' || s === 'pending') return 'badge-warning';
    if (s === 'annulé' || s === 'cancelled' || s === 'canceled') return 'badge-danger';
    return 'badge-brown';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <span className="section-label">Aperçu</span>
        <h2 className="section-title" style={{ fontSize: '1.7rem' }}>Tableau de bord</h2>
        <div className="section-divider"></div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {/* Rendez-vous du jour */}
        <div className="col-md-6 col-lg-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <p className="text-muted mb-1" style={{ fontSize: '0.82rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-light)' }}>
                Rendez-vous du jour
              </p>
              <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--text-dark)' }}>
                {data.today_bookings_count}
              </h3>
            </div>
            <div style={{
              width: '45px', height: '45px', borderRadius: 'var(--radius-md)',
              background: 'rgba(167, 146, 119, 0.15)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--brown-dark)'
            }}>
              <i className="bi bi-calendar-check" style={{ fontSize: '1.4rem' }}></i>
            </div>
          </div>
        </div>

        {/* Revenus du jour */}
        <div className="col-md-6 col-lg-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <p className="text-muted mb-1" style={{ fontSize: '0.82rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-light)' }}>
                Revenus du jour
              </p>
              <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--success)' }}>
                {data.today_revenue} MAD
              </h3>
            </div>
            <div style={{
              width: '45px', height: '45px', borderRadius: 'var(--radius-md)',
              background: 'var(--success-bg)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--success)'
            }}>
              <i className="bi bi-cash-coin" style={{ fontSize: '1.4rem' }}></i>
            </div>
          </div>
        </div>

        {/* Total Clients */}
        <div className="col-md-6 col-lg-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <p className="text-muted mb-1" style={{ fontSize: '0.82rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-light)' }}>
                Clients enregistrés
              </p>
              <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--text-dark)' }}>
                {data.stats.total_clients}
              </h3>
            </div>
            <div style={{
              width: '45px', height: '45px', borderRadius: 'var(--radius-md)',
              background: 'rgba(167, 146, 119, 0.1)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--brown)'
            }}>
              <i className="bi bi-people" style={{ fontSize: '1.4rem' }}></i>
            </div>
          </div>
        </div>

        {/* Revenus Globaux */}
        <div className="col-md-6 col-lg-3">
          <div className="stat-card d-flex align-items-center justify-content-between">
            <div>
              <p className="text-muted mb-1" style={{ fontSize: '0.82rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-light)' }}>
                Revenus totaux
              </p>
              <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--brown-dark)' }}>
                {data.stats.total_revenue} MAD
              </h3>
            </div>
            <div style={{
              width: '45px', height: '45px', borderRadius: 'var(--radius-md)',
              background: 'var(--ivory-deep)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--brown-dark)'
            }}>
              <i className="bi bi-piggy-bank" style={{ fontSize: '1.4rem' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Bookings List */}
      <div className="glass-card p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
            <i className="bi bi-calendar-event me-2 text-brown"></i>
            Rendez-vous de la journée
          </h4>
          <span className="badge-premium">
            Aujourd'hui
          </span>
        </div>

        {data.today_bookings.length === 0 ? (
          <div className="empty-state py-4">
            <i className="bi bi-calendar-x" style={{ fontSize: '2rem' }}></i>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-dark)' }}>
              Aucun rendez-vous aujourd'hui
            </p>
            <p style={{ fontSize: '0.82rem' }}>
              Les rendez-vous programmés pour aujourd'hui apparaîtront ici.
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
                  <th><i className="bi bi-clock me-1"></i>Heure</th>
                  <th><i className="bi bi-tag me-1"></i>Prix</th>
                  <th><i className="bi bi-info-circle me-1"></i>Statut</th>
                </tr>
              </thead>
              <tbody>
                {data.today_bookings.map((rdv, idx) => (
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
                    <td style={{ color: 'var(--text-mid)', fontWeight: 500 }}>{rdv.booking_time || rdv.time}</td>
                    <td>
                      <span className="badge-brown">
                        {rdv.price_at_booking || rdv.price} MAD
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(rdv.status)}>
                        {rdv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
