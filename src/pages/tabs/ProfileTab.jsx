import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const EyeToggle = ({ show, onToggle }) => (
  <button type="button" onClick={onToggle} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', fontSize: '1rem' }}>
    <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`}></i>
  </button>
);

export default function ProfileTab() {
  const { user, updateProfile, changePassword, showNotif } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    prenom: user?.prenom || '', nom: user?.nom || '', email: user?.email || '', phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    const result = await updateProfile(profileForm);
    setProfileLoading(false);
    if (result.success) showNotif('success', 'Profil mis à jour', 'Vos informations ont été sauvegardées.');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    const result = await changePassword(passwordForm);
    setPasswordLoading(false);
    if (result.success) setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const tabStyle = (id) => ({
    flex: 1, padding: '0.9rem 1rem', background: 'transparent', border: 'none',
    color: activeTab === id ? 'var(--brown-dark)' : 'var(--text-mid)',
    fontWeight: activeTab === id ? 700 : 500, fontSize: '0.875rem', cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    borderBottom: `2px solid ${activeTab === id ? 'var(--brown)' : 'transparent'}`,
    transition: 'var(--ease)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
  });

  return (
    <div>
      <div className="mb-4">
        <span className="section-label">Compte</span>
        <h2 className="section-title" style={{ fontSize: '1.7rem' }}>Mon profil</h2>
        <div className="section-divider"></div>
      </div>

      <div className="glass-card mb-4" style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setActiveTab('profile')} style={tabStyle('profile')}>
            <i className="bi bi-person"></i>Mes informations
          </button>
          <button onClick={() => setActiveTab('password')} style={tabStyle('password')}>
            <i className="bi bi-key"></i>Mot de passe
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="glass-card p-4">
          <form onSubmit={handleProfileSubmit}>
            <div className="row g-3">
              {[
                { name: 'prenom', label: 'Prénom',   type: 'text',  col: 'col-md-6' },
                { name: 'nom',    label: 'Nom',       type: 'text',  col: 'col-md-6' },
                { name: 'email',  label: 'Email',     type: 'email', col: 'col-md-6' },
                { name: 'phone',  label: 'Téléphone', type: 'tel',   col: 'col-md-6' },
              ].map(f => (
                <div key={f.name} className={f.col}>
                  <label className="form-label">{f.label}</label>
                  <input className="form-control" type={f.type} name={f.name} value={profileForm[f.name]}
                    onChange={e => setProfileForm({ ...profileForm, [e.target.name]: e.target.value })}
                    required={f.name !== 'phone'} />
                </div>
              ))}
              <div className="col-12 d-flex gap-2 mt-2">
                <button type="submit" className="btn-sky" style={{ borderRadius: 'var(--radius-md)', padding: '0.65rem 1.8rem' }} disabled={profileLoading}>
                  <i className="bi bi-check2 me-2"></i>{profileLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button type="button" className="btn-ghost-premium" style={{ padding: '0.65rem 1.4rem' }}
                  onClick={() => setProfileForm({ prenom: user?.prenom || '', nom: user?.nom || '', email: user?.email || '', phone: user?.phone || '' })}>
                  Annuler
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="glass-card p-4">
          <form onSubmit={handlePasswordSubmit}>
            <div className="row g-3">
              {[
                { key: 'currentPassword', label: 'Mot de passe actuel',      showKey: 'current' },
                { key: 'newPassword',     label: 'Nouveau mot de passe',     showKey: 'new' },
                { key: 'confirmPassword', label: 'Confirmer mot de passe',   showKey: 'confirm' },
              ].map(f => (
                <div key={f.key} className="col-12">
                  <label className="form-label">{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    <input className="form-control" type={showPasswords[f.showKey] ? 'text' : 'password'}
                      name={f.key} value={passwordForm[f.key]}
                      onChange={e => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })}
                      required style={{ paddingRight: '2.75rem' }} />
                    <EyeToggle show={showPasswords[f.showKey]}
                      onToggle={() => setShowPasswords({ ...showPasswords, [f.showKey]: !showPasswords[f.showKey] })} />
                  </div>
                </div>
              ))}
              <div className="col-12 d-flex gap-2 mt-2">
                <button type="submit" className="btn-sky" style={{ padding: '0.65rem 1.8rem' }} disabled={passwordLoading}>
                  <i className="bi bi-check2 me-1"></i>{passwordLoading ? 'Chargement...' : 'Valider'}
                </button>
                <button type="button" className="btn-ghost-premium" style={{ padding: '0.65rem 1.2rem' }}
                  onClick={() => setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })}>
                  Annuler
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
