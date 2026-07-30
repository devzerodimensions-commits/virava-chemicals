import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import api from '../api.js';

const SettingsContext = createContext({});
export const useSettings = () => useContext(SettingsContext);

export default function PublicLayout() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/settings').then((r) => setSettings(r.data)).catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      <Navbar settings={settings} />
      <main><Outlet /></main>
      <Footer settings={settings} />
    </SettingsContext.Provider>
  );
}
