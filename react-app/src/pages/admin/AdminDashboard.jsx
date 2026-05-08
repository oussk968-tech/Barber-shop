import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import AdminBookingsTab from './AdminBookingsTab';
import AdminProfileTab from './AdminProfileTab';
import ServiceList from './ServiceList';
import AddService from './AddService';
import EditService from './EditService';

const TABS = [
  { id: 'bookings', label: 'Liste des rendez-vous', icon: 'bi-calendar3' },
  { id: 'list',     label: 'Gérer les services',    icon: 'bi-list-ul' },
  { id: 'add',      label: 'Ajouter un service',    icon: 'bi-plus-circle' },
  { id: 'profile',  label: 'Mon profil',            icon: 'bi-person-circle' },
];

export default function AdminDashboard() {
  const { user, logout, setPage } = useApp();
  const [tab, setTab] = useState('bookings');
  const [editTarget, setEditTarget] = useState(null);

  const handleEdit = (service) => { setEditTarget(service); setTab('edit'); };
  const handleDone = () => { setEditTarget(null); setTab('list'); };

  const renderContent = () => {
    switch (tab) {
      case 'bookings': return <AdminBookingsTab />;
      case 'list':     return <ServiceList onEdit={handleEdit} />;
      case 'add':      return <AddService onDone={() => setTab('list')} />;
      case 'edit':     return editTarget ? <EditService service={editTarget} onDone={handleDone} /> : null;
      case 'profile':  return <AdminProfileTab />;
      default:         return <AdminBookingsTab />;
    }
  };

  const currentTabs = [
    ...TABS,
    ...(tab === 'edit' ? [{ id: 'edit', label: 'Modifier service', icon: 'bi-pencil-square' }] : []),
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ivory-soft)', paddingTop: '85px' }}>
      <div className="container py-4">
        <div className="row g-4">

          {/* ── SIDEBAR ── */}
          <div className="col-lg-3" data-aos="fade-right">
            <div className="glass-card p-4" style={{ position: 'sticky', top: '90px' }}>

              {/* Avatar admin */}
              <div className="text-center mb-4">
                <div className="sidebar-avatar">
                  {user?.prenom?.[0]?.toUpperCase() || 'A'}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-dark)', fontWeight: 600 }}>
                  {user?.prenom} {user?.nom}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                  {user?.email}
                </div>
                <span className="badge-admin mt-2 d-inline-block">
                  <i className="bi bi-shield-check"></i> Administrateur
                </span>
              </div>

              <hr style={{ borderColor: 'var(--border)' }} />

              {/* Nav */}
              <nav className="d-flex flex-column gap-1">
                {currentTabs.map(t => (
                  <button
                    key={t.id}
                    className={`sidebar-link ${tab === t.id ? 'active' : ''}`}
                    onClick={() => { if (t.id !== 'edit') setEditTarget(null); setTab(t.id); }}
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
          <div className="col-lg-9" data-aos="fade-left">
            <div>
              {renderContent()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
