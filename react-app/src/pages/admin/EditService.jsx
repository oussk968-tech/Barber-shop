import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';


export default function EditService({ service, onDone }) {
  const { setServices, showNotif } = useApp();
  const [form, setForm]   = useState({ title:'', description:'', price:'', duration:'', category:'Coupe', icon:'bi-scissors', img:'', popular:false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();

  useEffect(() => {
    if (!service) return;
    setForm({
      title:       service.title       || '',
      description: service.description || '',
      price:       String(service.price ?? ''),
      duration:    service.duration    || '',
      img:         service.img         || '',
      popular:     service.popular     || false,
    });

  }, [service]);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErrors(p => ({ ...p, img: 'Fichier image requis' })); return; }
    if (file.size > 5 * 1024 * 1024)    { setErrors(p => ({ ...p, img: 'Image trop lourde (max 5 Mo)' })); return; }
    const reader = new FileReader();
    reader.onload = ev => set('img', ev.target.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Titre requis';
    if (!form.description.trim()) e.description = 'Description requise';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Prix valide requis';
    if (!form.duration.trim())    e.duration    = 'Durée requise';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    const payload = { name: form.title, description: form.description, price: Number(form.price), duration_minutes: parseInt(form.duration), photo: form.img };
    try {
      const { adminAPI } = await import('../../services/api');
      const res = await adminAPI.updateService(service.id, payload, token);
      if (res.success) {
        const updated = { ...res.data, title: res.data.name, img: res.data.photo, duration: res.data.duration, popular: form.popular };
        setServices(prev => prev.map(s => s.id === service.id ? updated : s));
        showNotif('success', 'Service modifié !', `"${updated.title}" a été mis à jour.`);
        onDone();
      } else {
        showNotif('error', 'Erreur lors de la modification', res.message || 'Le serveur a refusé la modification.');
      }
    } catch (err) {
      showNotif('error', 'Erreur réseau', 'Impossible de joindre le serveur.');
    } finally {
      setLoading(false);
    }
  };

  const FieldError = ({ field }) => errors[field]
    ? <small style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}><i className="bi bi-exclamation-circle me-1"></i>{errors[field]}</small>
    : null;

  return (
    <div>
      <div className="mb-4">
        <span className="section-label">Administration</span>
        <h2 className="section-title" style={{ fontSize: '1.7rem' }}>Modifier le service</h2>
        <div className="section-divider"></div>
      </div>

      <div className="glass-card p-4">
        {/* Card header */}
        <div className="d-flex align-items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--brown-dark), var(--brown))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(167,146,119,0.3)',
          }}>
            <i className="bi bi-pencil-square" style={{ color: 'var(--white)', fontSize: '1.1rem' }}></i>
          </div>
          <div>
            <h5 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', margin: 0, fontWeight: 700 }}>
              Modifier le service
            </h5>
            <p style={{ color: 'var(--text-mid)', fontSize: '0.8rem', margin: 0, fontFamily: 'var(--font-body)' }}>
              Édition de : <strong style={{ color: 'var(--brown-dark)' }}>"{service?.title}"</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">

            <div className="col-12">
              <label className="form-label">Titre du service *</label>
              <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Titre du service" />
              <FieldError field="title" />
            </div>

            <div className="col-12">
              <label className="form-label">Description *</label>
              <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} rows={3} style={{ resize: 'vertical', lineHeight: 1.65 }} />
              <FieldError field="description" />
            </div>

            <div className="col-sm-6">
              <label className="form-label">Prix (MAD) *</label>
              <div style={{ position: 'relative' }}>
                <input className="form-control" type="number" min="1" value={form.price} onChange={e => set('price', e.target.value)} style={{ paddingRight: '3.2rem' }} />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--brown)', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--font-body)' }}>MAD</span>
              </div>
              <FieldError field="price" />
            </div>

            <div className="col-sm-6">
              <label className="form-label">Durée *</label>
              <input className="form-control" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="30 min" />
              <FieldError field="duration" />
            </div>


            {/* Image */}
            <div className="col-12">
              <label className="form-label">Image du service</label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${form.img ? 'var(--brown)' : 'var(--border-dark)'}`,
                  borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'center',
                  cursor: 'pointer', background: 'var(--ivory-soft)', transition: 'var(--ease)',
                }}
              >
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                {form.img ? (
                  <p style={{ color: 'var(--success)', fontSize: '0.82rem', margin: 0, fontWeight: 600 }}>
                    <i className="bi bi-check-circle me-2"></i>Image chargée — cliquer pour changer
                  </p>
                ) : (
                  <>
                    <i className="bi bi-cloud-upload" style={{ fontSize: '1.8rem', color: 'var(--brown-light)', display: 'block', marginBottom: '0.5rem' }}></i>
                    <p style={{ color: 'var(--text-mid)', fontSize: '0.82rem', margin: 0 }}>Cliquer pour choisir une image</p>
                  </>
                )}
              </div>

              {form.img && (
                <div style={{ marginTop: '0.75rem', position: 'relative', display: 'inline-block' }}>
                  <img src={form.img} alt="preview"
                    style={{ height: '90px', width: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'block', boxShadow: 'var(--shadow-sm)' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <button type="button" onClick={() => set('img', '')}
                    style={{ position: 'absolute', top: '-8px', right: '-8px', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--danger)', border: 'none', color: '#fff', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ×
                  </button>
                </div>
              )}
            </div>


            <div className="col-12 d-flex gap-3 mt-1">
              <button type="submit" className="btn-sky" disabled={loading} style={{ flex: 1, justifyContent: 'center', padding: '0.85rem' }}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Enregistrement…</>
                  : <><i className="bi bi-check-lg me-2"></i>Enregistrer les modifications</>
                }
              </button>
              <button type="button" className="btn-ghost-premium" onClick={onDone} style={{ padding: '0.85rem 1.5rem' }}>
                Annuler
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
