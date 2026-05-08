import React from 'react';
import { useApp } from '../context/AppContext';
import BookingTab from './tabs/BookingTab';
import RdvsTab from './tabs/RdvsTab';
import ServicesTab from './tabs/ServicesTab';
import ProfileTab from './tabs/ProfileTab';

const tabs = [
  { id: 'rdvs',     label: 'Mes rendez-vous', icon: 'bi-calendar3' },
  { id: 'booking',  label: 'Réserver',         icon: 'bi-calendar-plus' },
  { id: 'services', label: 'Nos services',      icon: 'bi-grid' },
  { id: 'profile',  label: 'Mon profil',        icon: 'bi-person-circle' },
];

export default function DashboardPage() {
  const { user, dashTab, setDashTab, logout, setPage } = useApp();

  const renderTab = () => {
    switch (dashTab) {
      case 'booking':  return <BookingTab />;
      case 'services': return <ServicesTab />;
      case 'profile':  return <ProfileTab />;
      default:         return <RdvsTab />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory-soft)', paddingTop: '76px' }}>
      <div className="container py-4">
        <div className="row g-4">

          {/* ── SIDEBAR ── */}
          <div className="col-lg-3">
            <div className="glass-card p-4 fade-in" style={{ position: 'sticky', top: '90px' }}>

              {/* Avatar */}
              <div className="text-center mb-4">
                <div className="sidebar-avatar">
                  {user?.prenom?.[0]?.toUpperCase()}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                  {user?.prenom} {user?.nom}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                  {user?.email}
                </div>
                <span className="badge-sky mt-2 d-inline-block">Client premium</span>
              </div>

              <hr style={{ borderColor: 'var(--border)' }} />

              {/* Nav links */}
              <nav className="d-flex flex-column gap-1">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    className={`sidebar-link ${dashTab === t.id ? 'active' : ''}`}
                    onClick={() => setDashTab(t.id)}
                  >
                    <i className={`bi ${t.icon}`} style={{ fontSize: '1rem', minWidth: '18px' }}></i>
                    {t.label}
                  </button>
                ))}
              </nav>

              <hr style={{ borderColor: 'var(--border)' }} />

              <button
                className="sidebar-link w-100"
                onClick={() => setPage('home')}
                style={{ color: 'var(--text-light)' }}
              >
                <i className="bi bi-house" style={{ fontSize: '1rem' }}></i>Accueil
              </button>
              <button
                className="sidebar-link w-100 mt-1"
                onClick={logout}
                style={{ color: 'var(--danger)' }}
              >
                <i className="bi bi-box-arrow-right" style={{ fontSize: '1rem' }}></i>Déconnexion
              </button>
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="col-lg-9">
            <div className="fade-in">
              {renderTab()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
