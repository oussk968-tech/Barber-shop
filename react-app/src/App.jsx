import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';
import './styles/global.css';
import AOS from 'aos';

import { AppProvider, useApp } from './context/AppContext';
import Navbar       from './components/Navbar';
import Notification from './components/Notification';
import HomePage     from './pages/HomePage';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage   from './pages/DashboardPage';
import AdminDashboard  from './pages/admin/AdminDashboard';

/**
 * Router
 * ──────
 * - Si page === 'dashboard' ET role === 'admin' → AdminDashboard
 * - Si page === 'dashboard' ET role === 'client' → DashboardPage
 * - Sinon → navigation normale (login, register, home)
 */
function Router() {
  const { user, page } = useApp();

  // Admin connecté ET page dashboard → AdminDashboard
  if (user?.role === 'admin' && page === 'dashboard') {
    return <><Navbar /><AdminDashboard /></>;
  }

  // Client connecté ET page dashboard → DashboardPage
  if (user?.role === 'client' && page === 'dashboard') {
    return <><Navbar /><DashboardPage /></>;
  }

  // Routes publiques (admin et client peuvent naviguer à la home)
  if (page === 'login')     return <><Navbar /><LoginPage /></>;
  if (page === 'register')  return <><Navbar /><RegisterPage /></>;
  if (page === 'dashboard') return <><Navbar /><DashboardPage /></>;
  return <><Navbar /><HomePage /></>;
}

export default function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: false, offset: 100 });
  }, []);

  return (
    <AppProvider>
      <Router />
      <Notification />
    </AppProvider>
  );
}
