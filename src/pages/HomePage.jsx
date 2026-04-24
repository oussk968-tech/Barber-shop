import React from 'react';
import { useApp } from '../context/AppContext';

const HERO_BG = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1800&auto=format&fit=crop&q=80';

const gallery = [
  { src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&q=80', label: 'Coupe fade', large: true },
  { src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&q=80', label: 'Finition rasoir' },
  { src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&q=80', label: 'Taille de barbe' },
  { src: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&q=80', label: 'Ambiance salon' },
  { src: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&auto=format&q=80', label: 'Style moderne' },
];

const team = [
  { img: '/images/hicham.png', name: 'Hicham', role: 'Fondateur · Master Barber', exp: '15+ ans' },
  { img: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&auto=format&q=80', name: 'Youssef', role: 'Spécialiste Barbe', exp: '8 ans' },
  { img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&q=80', name: 'Amine', role: 'Styliste & Coloration', exp: '5 ans' },
];

export default function HomePage() {
  const { user, setPage, setDashTab, services } = useApp();
  const [selectedImg, setSelectedImg] = React.useState(null);

  const goBook = () => {
    if (user) { setPage('dashboard'); setDashTab('booking'); }
    else setPage('login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--brown-deeper)' }}>
      <div style={{ flex: 1 }}>
        {/* ══════════════════════════ HERO ══════════════════════════ */}
        <section id="home" style={{ minHeight: '80vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          {/* Background photo - Centered */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center center' }} />
          {/* Softer overlay - more transparent on the right to show the shop */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, rgba(20,12,5,0.92) 0%, rgba(20,12,5,0.6) 60%, rgba(20,12,5,0.2) 100%)' }} />
          {/* Bottom accent line — warm brown */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, var(--brown-light), var(--brown), transparent)' }} />

          <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '90px', paddingBottom: '4rem' }}>
            <div className="row align-items-center">

              {/* Left  */}
              <div className="col-lg-7" data-aos="fade-up">
                {/* Label pill */}
                <div className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-2"
                  style={{ background: 'rgba(196,174,152,0.15)', border: '1px solid rgba(196,174,152,0.35)', borderRadius: 'var(--radius-pill)' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--brown-light)', display: 'inline-block', boxShadow: '0 0 8px rgba(196,174,152,0.6)' }}></span>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--brown-light)', fontWeight: 700, fontFamily: 'var(--font-body)' }}>
                    Salon de coiffure premium — Casablanca
                  </span>
                </div>

                {/* Headline */}
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem,5vw,3.5rem)', lineHeight: 1.06, fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>
                  L'art de la coupe,<br />la précision de{' '}
                  <span style={{ color: 'var(--brown-light)', fontStyle: 'italic' }}>la barbe</span>
                </h1>

                <p style={{ color: 'rgba(255,242,225,0.7)', fontSize: '0.95rem', lineHeight: 1.8, maxWidth: '500px', marginBottom: '2.5rem', fontWeight: 300, fontFamily: 'var(--font-body)' }}>
                  Depuis plus de 15 ans, Hicham et son équipe vous accueillent dans un espace dédié à l'élégance masculine.
                </p>

                <div className="d-flex flex-wrap gap-3 mb-5">
                  <button className="btn-sky" onClick={goBook} style={{ fontSize: '0.9rem', padding: '0.8rem 2rem' }}>
                    <i className="bi bi-calendar-check me-2"></i>Réserver maintenant
                  </button>
                  <button className="btn-sky-outline" style={{ fontSize: '0.9rem', padding: '0.78rem 2rem', borderColor: 'rgba(196,174,152,0.5)', color: 'var(--brown-light)' }}
                    onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
                    onMouseEnter={e => { e.target.style.background = 'rgba(196,174,152,0.15)'; }}
                    onMouseLeave={e => { e.target.style.background = 'transparent'; }}
                  >
                    <i className="bi bi-grid me-2"></i>Nos services
                  </button>
                </div>

                {/* Stats */}
                <div className="row g-3" style={{ maxWidth: '420px' }}>
                  {[
                    { icon: 'bi-award', n: '15+', l: "Ans d'exp." },
                    { icon: 'bi-people', n: '3K+', l: 'Clients' },
                    { icon: 'bi-star-fill', n: '5.0', l: 'Avis Google' },
                  ].map(s => (
                    <div key={s.l} className="col-4">
                      <div style={{ borderTop: '2px solid rgba(196,174,152,0.3)', paddingTop: '0.85rem' }}>
                        <i className={`bi ${s.icon} d-block mb-1`} style={{ color: 'var(--brown-light)', fontSize: '1rem' }}></i>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff', lineHeight: 1 }}>{s.n}</div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,242,225,0.4)', marginTop: '2px', fontWeight: 500, fontFamily: 'var(--font-body)' }}>{s.l}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — float card */}
              <div className="col-lg-5 d-none d-lg-flex justify-content-end" data-aos="fade-left" data-aos-delay="200">
                <div className="hero-float-card">
                  <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=80" alt="Hicham"
                    style={{ width: '100%', height: '190px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem', boxShadow: 'var(--shadow-md)' }} />
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--text-dark)', fontWeight: 700 }}>Hicham</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem', fontFamily: 'var(--font-body)' }}>
                    Fondateur · Master Barber
                  </div>
                  <div style={{ color: 'var(--brown)', letterSpacing: '2px', fontSize: '0.85rem' }}>★★★★★</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '2px', fontFamily: 'var(--font-body)' }}>15+ ans d'expérience</div>
                </div>
              </div>

            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ position: 'absolute', bottom: '2rem', left: '50%', animation: 'bounce 2s infinite', opacity: 0.5 }}>
            <i className="bi bi-chevron-down" style={{ color: 'var(--brown-light)', fontSize: '1.4rem' }}></i>
          </div>
        </section>

        {/* ══════════════════════════ SERVICES ══════════════════════════ */}
        <section id="services" style={{ background: 'var(--ivory-soft)', padding: '3.5rem 0' }}>
          <div className="container">
            <div className="text-center mb-3" data-aos="fade-up">
              <span className="section-label">Ce que nous offrons</span>
              <h2 className="section-title">Nos services</h2>
              <div className="section-divider mx-auto" />
            </div>
            <div className="row g-4">
              {services.map((s, idx) => (
                <div key={s.title} className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={idx * 100}>
                  <div className="team-card h-100 overflow-hidden d-flex flex-column">
                    {s.popular && (
                      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, background: 'var(--brown)', color: 'var(--white)', fontSize: '0.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-body)' }}>
                        ★ Populaire
                      </div>
                    )}
                    <div style={{ height: '150px', overflow: 'hidden', position: 'relative' }}>
                      <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                    </div>
                    <div className="p-4 d-flex flex-column" style={{ flex: 1 }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', color: 'var(--text-dark)', margin: 0, fontWeight: 600 }}>{s.title}</h5>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-auto pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                        <div>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--brown-dark)', fontWeight: 700 }}>{s.price}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: '4px', fontFamily: 'var(--font-body)' }}>MAD</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-mid)', fontFamily: 'var(--font-body)' }}>
                          <i className="bi bi-clock me-1" style={{ color: 'var(--brown-light)' }}></i>{s.duration}
                        </div>
                      </div>
                      <button className="btn-sky w-100 mt-3" style={{ padding: '0.65rem', fontSize: '0.82rem', justifyContent: 'center' }} onClick={goBook}>
                        <i className="bi bi-calendar-plus me-1"></i>Réserver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" style={{ background: 'var(--white)', padding: '3rem 0' }}>
          <div className="container">
            <div className="text-center mb-3" data-aos="fade-up">
              <span className="section-label">Notre travail</span>
              <h2 className="section-title">Galerie</h2>
              <div className="section-divider mx-auto" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridTemplateRows: 'repeat(2,160px)', gap: '12px' }}>
              {gallery.map((p, i) => (
                <div key={p.label} data-aos="zoom-in" data-aos-delay={i * 50} style={{
                  gridRow: p.large ? 'span 2' : 'span 1',
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                  position: 'relative', cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                  onClick={() => setSelectedImg(p)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                >
                  <img src={p.src} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(20,12,5,0.72))', padding: '1.2rem 0.85rem 0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--ivory)', fontWeight: 700, fontFamily: 'var(--font-body)' }}>{p.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIGHTBOX MODAL */}
        {selectedImg && (
          <div 
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(20,12,5,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem', backdropFilter: 'blur(10px)',
              cursor: 'zoom-out',
              animation: 'fadeIn 0.3s ease'
            }}
            onClick={() => setSelectedImg(null)}
          >
            <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
              <img 
                src={selectedImg.src} 
                alt={selectedImg.label} 
                style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '85vh', borderRadius: 'var(--radius-md)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} 
              />
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>{selectedImg.label}</h3>
                <span style={{ color: 'var(--brown-light)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Salon Barber Shop — Excellence</span>
              </div>
              <button 
                style={{ position: 'absolute', top: '-40px', right: '-40px', background: 'transparent', border: 'none', color: '#fff', fontSize: '2rem', cursor: 'pointer' }}
                onClick={() => setSelectedImg(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        )}

        {/*TEAM*/} 
        <section style={{ background: 'var(--ivory)', padding: '6rem 0' }}>
          <div className="container">
            <div className="text-center mb-5" data-aos="fade-up">
              <span className="section-label">Notre équipe</span>
              <h2 className="section-title">Les artisans</h2>
              <div className="section-divider mx-auto" />
            </div>
            <div className="row g-4 justify-content-center">
              {team.map((m, idx) => (
                <div key={m.name} className="col-md-4" data-aos="fade-up" data-aos-delay={idx * 100}>
                  <div className="team-card overflow-hidden">
                    <div style={{ height: '280px', overflow: 'hidden', position: 'relative' }}>
                      <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      />
                      {/* Warm gradient overlay */}
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(44,30,15,0.82) 0%, transparent 55%)' }} />
                      <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#fff', fontWeight: 600 }}>{m.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(255,242,225,0.6)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>{m.role}</div>
                      </div>
                    </div>
                    <div className="p-3 d-flex justify-content-between align-items-center" style={{ background: 'var(--white)' }}>
                      <span className="badge-brown"><i className="bi bi-clock me-1"></i>{m.exp}</span>
                      <div style={{ color: 'var(--brown)', fontSize: '0.82rem', letterSpacing: '2px' }}>★★★★★</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/*CONTACT*/}
        <section id="contact" style={{ background: 'var(--brown-deeper)', padding: '6rem 0' }}>
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6">
                <span className="section-label" style={{ color: 'var(--brown-light)' }}>Contact</span>
                <h2 className="section-title" style={{ color: 'var(--white)' }}>Nous contacter</h2>
                <div className="section-divider" style={{ background: 'linear-gradient(90deg, var(--brown-light), var(--brown-mist))' }} />
                {[
                  { icon: 'bi-geo-alt-fill', l: 'Adresse', v: 'Salon Barber Shop, Casablanca', s: null },
                  { icon: 'bi-telephone-fill', l: 'Téléphone', v: '+212 621 032 529', s: null },
                  { icon: 'bi-clock-fill', l: 'Horaires', v: 'Lun – Dimanche : 9h00 – 22h00'},
                ].map(item => (
                  <div key={item.l} className="d-flex gap-3 align-items-start mb-4">
                    <div style={{ width: '44px', height: '44px', minWidth: '44px', background: 'rgba(196,174,152,0.15)', border: '1px solid rgba(196,174,152,0.25)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`bi ${item.icon}`} style={{ color: 'var(--brown-light)', fontSize: '1rem' }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(255,242,225,0.4)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px', fontWeight: 700, fontFamily: 'var(--font-body)' }}>{item.l}</div>
                      <div style={{ color: 'rgba(255,242,225,0.9)', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>{item.v}</div>
                      {item.s && <div style={{ fontSize: '0.8rem', color: 'rgba(255,242,225,0.45)', fontFamily: 'var(--font-body)' }}>{item.s}</div>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-lg-6">
                <div style={{ background: 'rgba(255,242,225,0.06)', border: '1px solid rgba(196,174,152,0.2)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                  <i className="bi bi-scissors d-block mb-3" style={{ color: 'var(--brown-light)', fontSize: '2.5rem' }}></i>
                  <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', marginBottom: '0.75rem', fontWeight: 700 }}>
                    Réservez votre créneau
                  </h4>
                  <p style={{ color: 'rgba(255,242,225,0.55)', fontSize: '0.9rem', marginBottom: '1.75rem', fontWeight: 300, fontFamily: 'var(--font-body)' }}>
                    Créez un compte ou connectez-vous pour réserver votre prochain rendez-vous en quelques clics.
                  </p>
                  <button className="btn-sky" onClick={goBook} style={{ fontSize: '0.9rem', padding: '0.8rem 2rem' }}>
                    <i className="bi bi-calendar-check me-2"></i>Réserver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      {/*FOOTER*/}
      <footer style={{ background: 'var(--brown-deeper)', padding: '0', minHeight: '75px', display: 'flex', alignItems: 'center', marginTop: 'auto', overflow: 'hidden' }}>
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 py-3 py-md-0">
          <img
            src="/images/ChatGPT Image 21 avr. 2026, 19_06_32.png"
            alt="Barber Shop"
            style={{ height: '70px', width: 'auto', cursor: 'pointer', transform: 'scale(1.7)' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          <span style={{ color: 'rgba(255,242,225,0.3)', fontSize: '0.78rem', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
            © 2026 Salon Barber Shop — Tous droits réservés
          </span>
          <span style={{ color: 'rgba(255,242,225,0.3)', fontSize: '0.78rem', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
            <i className="bi bi-heart-fill me-1" style={{ color: 'var(--brown-light)', fontSize: '0.7rem' }}></i>Développé au Maroc
          </span>
        </div>
      </footer>
    </div>
  );
}
