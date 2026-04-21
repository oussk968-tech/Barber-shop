import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, bookingAPI, userAPI, serviceAPI } from '../services/api';

const AppContext = createContext(null);

// ─── Services partagés (lus par HomePage, ServicesTab, AdminDashboard) ────────
const DEMO_SERVICES = [
  { id: 1, img: 'https://images.unsplash.com/photo-1599351431613-7f9c5ecd1ac4?w=600&auto=format&fit=crop&q=80', icon: 'bi-scissors', title: 'Coupe classique', description: 'Coupe homme précise et personnalisée. Finition soignée au rasoir.', price: 80, duration: '30 min', category: 'Coupe', popular: false },
  { id: 2, img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80', icon: 'bi-person-badge', title: 'Taille de barbe', description: 'Rasage et modelage au rasoir droit. Technique traditionnelle premium.', price: 60, duration: '20 min', category: 'Barbe', popular: false },
  { id: 3, img: 'https://images.unsplash.com/photo-1585271669519-6f4ee6e583d7?w=600&auto=format&fit=crop&q=80', icon: 'bi-stars', title: 'Coupe + Barbe', description: 'Le combo complet pour un look impeccable. Notre offre la plus populaire.', price: 120, duration: '50 min', category: 'Pack', popular: true },
  { id: 4, img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80', icon: 'bi-droplet-half', title: 'Soin cuir chevelu', description: 'Traitement nourrissant et massage relaxant pour un cuir chevelu sain.', price: 100, duration: '40 min', category: 'Soin', popular: false },
  { id: 5, img: 'https://images.unsplash.com/photo-1605286827860-eaf675ba2b13?w=600&auto=format&fit=crop&q=80', icon: 'bi-palette', title: 'Coloration', description: 'Coloration naturelle ou tendance avec des produits professionnels.', price: 150, duration: '60 min', category: 'Coloration', popular: false },
  { id: 6, img: 'https://images.unsplash.com/photo-1599351431613-7f9c5ecd1ac4?w=600&auto=format&fit=crop&q=80', icon: 'bi-emoji-smile', title: 'Coupe enfant', description: "Coupe douce pour les enfants jusqu'à 12 ans dans une ambiance détendue.", price: 50, duration: '25 min', category: 'Enfant', popular: false },
];


const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    prenom: user.prenom || user.first_name || user.name || '',
    nom: user.nom || user.last_name || '',
    email: user.email || user.email_address || '',
    phone: user.phone || user.telephone || user.phone_number || '',
  };
};

// Générer une date future réaliste (dans les prochains 30 jours)
const generateFutureDate = () => {
  const today = new Date();
  const daysOffset = Math.floor(Math.random() * 30) + 1; // 1 à 30 jours
  const futureDate = new Date(today.setDate(today.getDate() + daysOffset));
  const year = futureDate.getFullYear();
  const month = String(futureDate.getMonth() + 1).padStart(2, '0');
  const day = String(futureDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeRdv = (rdv) => {
  if (!rdv) return null;
  // تأكد من أن جميع الحقول النصية ليست objects
  const serviceName = typeof rdv.service === 'object'
    ? rdv.service?.name || 'Service'
    : rdv.service || 'Service';
  const barberName = typeof rdv.barber === 'object'
    ? rdv.barber?.name || 'Coiffeur'
    : rdv.barber || 'Coiffeur';
  
  // Extraire le nom du client (utilise clientName si fourni par le backend)
  let clientFullName = rdv.clientName || '';
  if (!clientFullName) {
    const clientFirstName = rdv.client?.first_name || rdv.user?.prenom || rdv.user?.first_name || rdv.prenom || rdv.first_name || 'Client';
    const clientLastName = rdv.client?.last_name || rdv.user?.nom || rdv.user?.last_name || rdv.nom || rdv.last_name || '';
    clientFullName = `${clientFirstName} ${clientLastName}`.trim();
  }
  
  // Générer date future si pas de date ou date passée
  let bookingDate = rdv.booking_date || rdv.date;
  if (!bookingDate) {
    bookingDate = generateFutureDate();
  }
  
  // Garder seulement "Confirmé" ou "Annulé", défaut à "Confirmé"
  let status = rdv.status || 'confirmé';
  if (status && typeof status === 'string') {
    status = status.toLowerCase();
    if (status !== 'annulé' && status !== 'canceled' && status !== 'cancelled') {
      status = 'confirmé';
    } else if (status === 'canceled' || status === 'cancelled') {
      status = 'annulé';
    }
  } else {
    status = 'confirmé';
  }
  
  return {
    id: rdv.id,
    service: serviceName,
    barber: barberName,
    clientName: clientFullName,
    booking_date: bookingDate,
    booking_time: rdv.booking_time || rdv.time || '10:00',
    date: bookingDate,
    time: rdv.booking_time || rdv.time || '10:00',
    price: rdv.price || rdv.price_at_booking || 100,
    status: status
  };
};

const DEMO_USER = { id: 1, prenom: 'Mohammed', nom: 'Alami', email: 'demo@titsiouine.ma', phone: '+212 661 234 567' };

const loadRdvs = async (user, token) => {
  try {
    let response;
    
    if (user?.role === 'admin') {
      //  Admin → tous les RDV
      response = await bookingAPI.adminGetAll(null, token);
    } else {
      //  Client → ses propres RDV
      response = await bookingAPI.list(token);
    }
    
    if (response.success) {
      let data = response.data?.data || response.data || [];
      if (Array.isArray(data)) {
        const normalized = data.map(normalizeRdv);
        console.log('Bookings fetched and normalized:', normalized.length);
        return normalized;
      }
    } else {
      console.warn(' Bookings fetch failed:', response.message);
    }
  } catch (err) {
    console.error('Erreur chargement RDV:', err);
  }
  return [];
};

// ── Normaliser les services (backend format → frontend format) ──
const normalizeService = (service) => {
  if (!service) return null;
  
  return {
    id: service.id,
    title: service.title || service.name || 'Service',
    description: service.description || '',
    price: service.price ?? 80,
    duration: service.duration || '30 min',
    img: service.img || service.photo || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    category: service.category || 'Coupe',
    icon: service.icon || 'bi-scissors',
    popular: service.popular || false,
  };
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('home');     // home | login | register | dashboard
  const [dashTab, setDashTab] = useState('rdvs'); // rdvs | booking | services | profile (client) OR bookings | services_manage | add_service | profile (admin)
  const [rdvs, setRdvs] = useState([]);
  const [services, setServices] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem('services')); return (s && s.length) ? s : DEMO_SERVICES; } catch { return DEMO_SERVICES; }
  });
  const [notif, setNotif] = useState(null);
  const notifTimer = React.useRef(null);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedRdvs = JSON.parse(localStorage.getItem('rdvs'));
      
      console.log(' AppContext init - token:', token ? 'YES' : 'NO', 'user:', storedUser ? 'YES' : 'NO', 'rdvs:', storedRdvs?.length || 0);
      
      if (storedUser) {
        setUser(normalizeUser(storedUser));
      }
      if (storedRdvs && Array.isArray(storedRdvs)) {
        console.log(' Loading rdvs from localStorage:', storedRdvs.length);
        setRdvs(storedRdvs);
      }
      
      if (!token) return;
      // Skip /auth/me call for demo token
      if (token === 'demo_admin_token') {
        if (storedUser) { 
          setUser(normalizeUser(storedUser));
          // Load demo admin bookings
          console.log(' Loading demo admin bookings...');
          const demoAdmin = normalizeUser(storedUser);
          const rdvsData = await loadRdvs(demoAdmin, token);
          setRdvs(rdvsData);
          localStorage.setItem('rdvs', JSON.stringify(rdvsData));
          setPage('dashboard');
        }
        return;
      }
      try {
        const res = await authAPI.me(token);
        if (res.success && res.data?.user) {
          const normalized = normalizeUser(res.data.user);
          setUser(normalized);
          localStorage.setItem('user', JSON.stringify(normalized));
          setPage('dashboard');
          
          console.log(' Fetching bookings from backend...');
          const rdvsData = await loadRdvs(normalized, token);
          setRdvs(rdvsData);
          localStorage.setItem('rdvs', JSON.stringify(rdvsData));
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    };
    init();
  }, []);

  // ── Charger les services du serveur au démarrage ──
  useEffect(() => {
    const loadServices = async () => {
      console.log(' Loading services from server...');
      try {
        const response = await serviceAPI.list();
        if (response.success && Array.isArray(response.data)) {
          const normalized = response.data.map(normalizeService);
          console.log(' Services loaded from server:', normalized.length);
          setServices(normalized);
          localStorage.setItem('services', JSON.stringify(normalized));
        } else {
          console.warn(' Services response invalid, using DEMO_SERVICES');
          setServices(DEMO_SERVICES);
        }
      } catch (err) {
        console.warn(' Failed to load services from server:', err.message);
        setServices(DEMO_SERVICES);
      }
    };
    loadServices();
  }, []);

  const showNotif = (type, title, msg) => {
    if (notifTimer.current) clearTimeout(notifTimer.current);
    setNotif({ type, title, msg });
    notifTimer.current = setTimeout(() => setNotif(null), 4500);
  };

  const login = async (email, password) => {
    // ── Mode démo admin (sans backend) ─────────────────────────────────
    if (email === 'admin@demo.ma' && password === 'admin123') {
      const demoAdmin = { id: 0, prenom: 'Admin', nom: 'Démo', first_name: 'Admin', last_name: 'Démo', email, role: 'admin' };
      const normalizedAdmin = normalizeUser(demoAdmin);
      setUser(normalizedAdmin);
      localStorage.setItem('token', 'demo_admin_token');
      localStorage.setItem('user', JSON.stringify(normalizedAdmin));
      
      // Load demo admin bookings
      console.log(' Loading demo admin bookings...');
      const rdvsData = await loadRdvs(normalizedAdmin, 'demo_admin_token');
      setRdvs(rdvsData);
      localStorage.setItem('rdvs', JSON.stringify(rdvsData));
      
      setPage('dashboard');
      showNotif('success', 'Bienvenue Admin !', 'Mode démonstration activé.');
      return true;
    }
    // ───────────────────────────────────────────────────────────────────
    const res = await authAPI.login({ email, password });
    if (res.success) {
      const normalizedUser = normalizeUser(res.data.user);
      setUser(normalizedUser);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      setPage('dashboard');
      // Fetch user's bookings from Backend
      console.log(' Login successful, fetching bookings...');
      try {
        const rdvsData = await loadRdvs(normalizedUser, res.data.token);
        console.log(' Bookings loaded and normalized:', rdvsData.length);
        setRdvs(rdvsData);
        localStorage.setItem('rdvs', JSON.stringify(rdvsData));
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setRdvs([]);
      }
      showNotif('success', 'Bienvenue !', `Connecté en tant que ${normalizedUser.prenom || normalizedUser.email}`);
      return true;
    }
    showNotif('error', 'Erreur', res.message);
    return false;
  };

  const register = async (data) => {
    try {
      const res = await authAPI.register({
        first_name: data.prenom,
        last_name: data.nom,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.confirm,
      });

      if (res.success) {
        const normalizedUser = normalizeUser(res.data.user);
        setUser(normalizedUser);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setPage('dashboard');
        setRdvs([]);
        showNotif('success', 'Compte créé !', `Bienvenue ${normalizedUser.prenom || normalizedUser.email} !`);
        return { success: true };
      } else {
        return { success: false, errors: res.errors, message: res.message };
      }
    } catch (err) {
      return { success: false, message: 'Impossible de contacter le serveur.' };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await authAPI.logout(token);
      } catch (e) {
        // نكمل حتى لو فشل الطلب
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rdvs');
    setUser(null);
    setRdvs([]);
    setPage('home');
    showNotif('success', 'Déconnecté', 'À bientôt !');
  };

  const addRdv = async (rdv) => {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    if (!token) {
      showNotif('error', 'Erreur', 'Vous devez être connecté');
      return;
    }
    
    console.log(' Creating booking with data:', rdv);
    
    try {
      const payload = {
        service_id: rdv.service_id,
        barber_id: rdv.barber_id,
        booking_date: rdv.date,
        booking_time: rdv.time,
        note: rdv.note || '',
      };
      
      console.log(' Sending payload to Backend:', payload);
      const res = await bookingAPI.create(payload, token);
      console.log(' Backend response:', res);
      
      if (res.success) {
        // Normalize the booking data from Backend
        const newRdv = normalizeRdv(res.data)||normalizeRdv({
          id: Date.now(),
          service: rdv.service,
          barber: rdv.barber,
          booking_date: rdv.date,
          booking_time: rdv.time,
          price: rdv.price,
          status: 'confirmé'
        });
        
        setRdvs(prev => {
          const updated = [newRdv, ...prev];
          localStorage.setItem('rdvs', JSON.stringify(updated));
          return updated;
        });
        
        // Reload bookings pour admin pour voir immédiatement
        if (currentUser?.role === 'admin') {
          console.log(' Admin detected - reloading all bookings...');
          const adminRdvs = await loadRdvs(currentUser, token);
          setRdvs(adminRdvs);
          localStorage.setItem('rdvs', JSON.stringify(adminRdvs));
        }
        
        showNotif('success', 'Rendez-vous confirmé !', `${rdv.service} le ${formatDate(rdv.date)} à ${rdv.time}`);
        setDashTab('rdvs');
      } else {
        console.warn('Backend error:', res.message);
        if (res.errors) {
          const firstError = Object.values(res.errors)[0]?.[0] || res.message;
          showNotif('error', 'Erreur', firstError);
        } else {
          showNotif('error', 'Erreur', res.message || 'Impossible de créer le rendez-vous');
        }
      }
    } catch (error) {
      console.error(' Exception during booking:', error);
      showNotif('error', 'Erreur', 'Impossible de créer le rendez-vous');
    }
  };

  const cancelRdv = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotif('error', 'Erreur', 'Vous devez être connecté');
      return;
    }
    try {
      const res = await bookingAPI.cancel(id, token);
      if (res.success) {
        setRdvs(prev => {
          const updated = prev.map(r => r.id === id ? { ...r, status: 'annulé' } : r);
          localStorage.setItem('rdvs', JSON.stringify(updated));
          return updated;
        });
        showNotif('success', 'Rendez-vous annulé', 'Votre rendez-vous a bien été annulé.');
      } else {
        showNotif('error', 'Erreur', res.message || 'Impossible d\'annuler le rendez-vous');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      showNotif('error', 'Erreur', 'Impossible d\'annuler le rendez-vous');
    }
  };

  const updateProfile = async (data) => {
    const token = localStorage.getItem('token');
    console.log(' Token for updateProfile:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
    console.log(' Token length:', token?.length);
    if (!token) {
      showNotif('error', 'Erreur', 'Vous devez être connecté pour modifier votre profil.');
      return { success: false };
    }

    // Convert field names to match backend expectations
    const payload = {
      first_name: data.prenom,
      last_name: data.nom,
      email: data.email,
      phone: data.phone,
    };

    console.log(' Sending updateProfile request with payload:', payload);
    try {
      const res = await userAPI.update(payload, token);
      console.log(' updateProfile response:', res);
      if (res.success) {
        const normalizedUser = normalizeUser(res.data.user || res.data);
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        showNotif('success', 'Profil mis à jour', 'Vos informations ont été sauvegardées.');
        return { success: true };
      }

      showNotif('error', 'Erreur', res.message || 'Impossible de mettre à jour le profil.');
      return { success: false, message: res.message };
    } catch (err) {
      console.error(' Exception in updateProfile:', err);
      showNotif('error', 'Erreur', 'Impossible de mettre à jour le profil.');
      return { success: false, message: err.message };
    }
  };

  const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showNotif('error', 'Erreur', 'Vous devez être connecté pour changer le mot de passe.');
      return { success: false };
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      showNotif('error', 'Erreur', 'Veuillez remplir tous les champs.');
      return { success: false };
    }

    if (newPassword !== confirmPassword) {
      showNotif('error', 'Erreur', 'Le nouveau mot de passe et la confirmation ne correspondent pas.');
      return { success: false };
    }

    try {
      console.log('Sending changePassword with correct field names');
      const res = await userAPI.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      }, token);

      console.log('📥 changePassword response:', res);
      if (res.success) {
        showNotif('success', 'Mot de passe changé', 'Votre mot de passe a été mis à jour avec succès.');
        return { success: true };
      }

      if (res.errors) {
        const firstError = Object.values(res.errors)[0]?.[0] || res.message;
        showNotif('error', 'Erreur', firstError);
        return { success: false, errors: res.errors, message: res.message };
      }
      
      showNotif('error', 'Erreur', res.message || 'Impossible de changer le mot de passe.');
      return { success: false, message: res.message };
    } catch (err) {
      console.error('❌ Exception in changePassword:', err);
      showNotif('error', 'Erreur', 'Impossible de changer le mot de passe.');
      return { success: false, message: err.message };
    }
  };


  const formatDate = (d) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  };

  // ── Rafraîchir les services depuis le serveur ──
  const refreshServices = async () => {
    console.log(' Refreshing services...');
    try {
      const response = await serviceAPI.list();
      if (response.success && Array.isArray(response.data)) {
        const normalized = response.data.map(normalizeService);
        console.log(' Services refreshed:', normalized.length);
        setServices(normalized);
        localStorage.setItem('services', JSON.stringify(normalized));
      }
    } catch (err) {
      console.warn(' Failed to refresh services:', err.message);
    }
  };

  return (
    <AppContext.Provider value={{
      user, page, setPage, dashTab, setDashTab,
      rdvs, notif, login, register, logout, addRdv, cancelRdv, updateProfile, changePassword, showNotif, formatDate,
      services, setServices, refreshServices,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
