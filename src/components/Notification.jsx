import React from 'react';
import { useApp } from '../context/AppContext';

export default function Notification() {
  const { notif } = useApp();

  const isError   = notif?.type === 'error';
  const isWarning = notif?.type === 'warning';
  const isSuccess = !isError && !isWarning;

  const accentColor = isError ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--success)';
  const bgColor     = isError ? 'var(--danger-bg)' : isWarning ? 'var(--warning-bg)' : 'var(--success-bg)';
  const icon        = isError ? 'bi-x-circle-fill' : isWarning ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill';

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem', right: '1.5rem',
      background: 'var(--white)',
      border: `1px solid var(--border)`,
      borderLeft: `4px solid ${accentColor}`,
      borderRadius: 'var(--radius-lg)',
      color: 'var(--text-dark)',
      padding: '1rem 1.25rem',
      zIndex: 9999,
      transform: notif ? 'translateY(0)' : 'translateY(130px)',
      opacity: notif ? 1 : 0,
      transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      maxWidth: '340px',
      minWidth: '280px',
      pointerEvents: notif ? 'auto' : 'none',
      boxShadow: notif ? 'var(--shadow-xl)' : 'none',
    }}>
      <div className="d-flex align-items-start gap-3">
        {/* Icon */}
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
          background: bgColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <i className={`bi ${icon}`} style={{ color: accentColor, fontSize: '1.05rem' }}></i>
        </div>
        {/* Text */}
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '0.9rem', marginBottom: '2px', fontFamily: 'var(--font-body)' }}>
            {notif?.title}
          </div>
          <div style={{ color: 'var(--text-mid)', fontSize: '0.82rem', lineHeight: 1.5, fontFamily: 'var(--font-body)' }}>
            {notif?.msg}
          </div>
        </div>
      </div>
    </div>
  );
}
