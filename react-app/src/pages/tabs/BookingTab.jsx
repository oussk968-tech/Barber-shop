import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { barberAPI } from '../../services/api';

const barbers = ['1-Hicham — Master Barber', '2-Youssef — Spécialiste barbe', '3-Amine — Coupe & style'];

const STEPS = ['Service', 'Coiffeur & Date', 'Confirmation'];

export default function BookingTab() {
  const { addRdv, showNotif, services } = useApp();
  const servicesList = services.map(s => ({ id: s.id, label: s.title, price: s.price, duration: s.duration }));
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [sel, setSel] = useState({ service: null, barber: '', date: new Date().toISOString().split('T')[0], time: null, note: '' });
  const [apiSlots, setApiSlots] = useState([]);

  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  useEffect(() => {
    const fetchSlots = async () => {
      if (!sel.service || !sel.barber || !sel.date) return;
      setLoadingSlots(true);
      const barberId = parseInt(sel.barber.split('-')[0]);
      try {
        const res = await barberAPI.slots(barberId, sel.date, sel.service.id);
        if (res.success && res.data) {
          setApiSlots(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch slots', err);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [sel.barber, sel.date, sel.service]);

  const getAvailableSlots = () => {
    return apiSlots.filter(s => {
      if (!s.available) return false;
      if (sel.date === today) return s.time > currentTime;
      return true;
    });
  };
  const availableSlots = getAvailableSlots();
  const canNext0 = !!sel.service;
  const canNext1 = sel.barber && sel.date && sel.time;

  const confirm = async () => {
    if (loading) return;
    setLoading(true);
    const serviceId  = sel.service?.id;
    const serviceName = sel.service?.label || sel.service?.name || '';
    const barberParts = sel.barber.split('-');
    const barberId    = parseInt(barberParts[0]) || null;
    const barberName  = barberParts.slice(1).join('-').split('—')[0].trim() || '';
    try {
      await addRdv({ service_id: serviceId, barber_id: barberId, service: serviceName, barber: barberName, date: sel.date, time: sel.time, price: sel.service?.price, note: sel.note || null });
      setSel({ service: null, barber: '', date: today, time: null, note: '' });
      setStep(0);
    } catch (error) {
      showNotif('error', 'Erreur', 'Impossible de créer le rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const [y, m, d] = sel.date.split('-');
  const fmtDate = sel.date ? `${d}/${m}/${y}` : '';

  const stepCircleStyle = (i) => ({
    width: '34px', height: '34px', borderRadius: '50%',
    background: i <= step ? 'var(--brown)' : 'var(--ivory-deep)',
    border: `2px solid ${i <= step ? 'var(--brown)' : 'var(--border)'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.8rem', fontWeight: 700,
    color: i <= step ? 'var(--white)' : 'var(--text-light)',
    transition: 'var(--ease)',
    flexShrink: 0,
  });

  return (
    <div>
      <div className="mb-4">
        <span className="section-label">Réservation</span>
        <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Prendre un rendez-vous</h2>
        <div className="section-divider"></div>
      </div>

      {/* Progress steps */}
      <div className="d-flex align-items-center gap-0 mb-5">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="d-flex align-items-center gap-2">
              <div style={stepCircleStyle(i)}>
                {i < step ? <i className="bi bi-check" style={{ fontSize: '0.9rem' }}></i> : i + 1}
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: i === step ? 'var(--brown-dark)' : 'var(--text-light)', fontFamily: 'var(--font-body)', whiteSpace: 'nowrap' }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: i < step ? 'var(--brown)' : 'var(--border)', margin: '0 0.75rem', transition: 'background 0.3s' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── STEP 0: Choose service ── */}
      {step === 0 && (
        <div className="fade-in">
          <h5 style={{ color: 'var(--text-dark)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            Choisissez votre service
          </h5>
          <div className="row g-3 mb-4">
            {servicesList.map(s => (
              <div key={s.label} className="col-md-6 col-lg-4">
                  <div
                    className={`service-card h-100 d-flex flex-column ${sel.service?.label === s.label ? 'selected' : ''}`}
                    onClick={() => setSel({ ...sel, service: s })}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '0.6rem', fontWeight: 600 }}>
                        {s.label}
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--brown-dark)', fontWeight: 700 }}>
                          {s.price} <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: 'var(--font-body)', fontWeight: 400 }}>MAD</span>
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-mid)', fontFamily: 'var(--font-body)' }}>
                          <i className="bi bi-clock me-1" style={{ color: 'var(--brown-light)' }}></i>{s.duration}
                        </span>
                      </div>
                      {sel.service?.label === s.label && (
                        <div className="mt-2">
                          <i className="bi bi-check-circle-fill" style={{ color: 'var(--brown)', fontSize: '0.9rem' }}></i>
                          <span style={{ fontSize: '0.75rem', color: 'var(--brown)', marginLeft: '0.4rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Sélectionné</span>
                        </div>
                      )}
                    </div>
                  </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn-sky" style={{ padding: '0.7rem 2rem' }} disabled={!canNext0} onClick={() => setStep(1)}>
              Suivant <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 1: Barber, date, time ── */}
      {step === 1 && (
        <div className="fade-in">
          <h5 style={{ color: 'var(--text-dark)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            Choisissez votre coiffeur et votre créneau
          </h5>
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <label className="form-label">Coiffeur</label>
              <select className="form-select" value={sel.barber} onChange={e => setSel({ ...sel, barber: e.target.value })}>
                <option value="">Choisir un coiffeur</option>
                {barbers.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" value={sel.date} min={today} onChange={e => setSel({ ...sel, date: e.target.value, time: null })} />
            </div>
          </div>

          <label className="form-label mb-2">Créneau horaire</label>
          <div className="d-flex flex-wrap gap-2 mb-4" style={{ minHeight: '100px' }}>
            {!sel.barber ? (
              <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontStyle: 'italic', padding: '1rem' }}>
                Veuillez choisir un coiffeur pour voir les créneaux disponibles.
              </div>
            ) : loadingSlots ? (
              <div className="d-flex align-items-center gap-2" style={{ color: 'var(--brown)', padding: '1rem' }}>
                <span className="spinner-border spinner-border-sm"></span> Chargement des créneaux...
              </div>
            ) : availableSlots.length === 0 ? (
              <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', padding: '1rem' }}>
                Aucun créneau disponible pour cette date.
              </div>
            ) : (
              availableSlots.map(s => (
                <button
                  key={s.time}
                  onClick={() => setSel({ ...sel, time: s.time })}
                  className={`time-slot ${sel.time === s.time ? 'selected' : ''}`}
                >
                  {s.time}
                </button>
              ))
            )}
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn-ghost-premium" style={{ padding: '0.7rem 1.5rem' }} onClick={() => setStep(0)}>
              <i className="bi bi-arrow-left me-2"></i>Retour
            </button>
            <button className="btn-sky" style={{ padding: '0.7rem 2rem' }} disabled={!canNext1} onClick={() => setStep(2)}>
              Suivant <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Confirmation ── */}
      {step === 2 && (
        <div className="fade-in">
          <h5 style={{ color: 'var(--text-dark)', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
            Confirmez votre rendez-vous
          </h5>

          <div className="glass-card p-4 mb-4">
            <div className="row g-3">
              {[
                { icon: 'bi-scissors',  label: 'Service',  val: sel.service?.label || 'N/A' },
                { icon: 'bi-tag',       label: 'Prix',     val: `${sel.service?.price || 0} MAD` },
                { icon: 'bi-clock',     label: 'Durée',    val: sel.service?.duration || 'N/A' },
                { icon: 'bi-person',    label: 'Coiffeur', val: sel.barber ? sel.barber.split('-').slice(1).join('-').split('—')[0].trim() : 'N/A' },
                { icon: 'bi-calendar3', label: 'Date',     val: fmtDate },
                { icon: 'bi-alarm',     label: 'Heure',    val: sel.time || 'N/A' },
              ].map(item => (
                <div key={item.label} className="col-6 col-md-4">
                  <div style={{
                    background: 'var(--ivory-soft)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem',
                  }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', fontWeight: 700, fontFamily: 'var(--font-body)' }}>
                      <i className={`bi ${item.icon} me-1`} style={{ color: 'var(--brown-light)' }}></i>{item.label}
                    </div>
                    <div style={{ color: 'var(--brown-dark)', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>
                      {item.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn-ghost-premium" style={{ padding: '0.7rem 1.5rem' }} onClick={() => setStep(1)} disabled={loading}>
              <i className="bi bi-arrow-left me-2"></i>Retour
            </button>
            <button className="btn-sky" style={{ padding: '0.7rem 2rem', fontSize: '0.9rem' }} onClick={confirm} disabled={loading}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Chargement...</>
                : <><i className="bi bi-check-circle me-2"></i>Confirmer le rendez-vous</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
