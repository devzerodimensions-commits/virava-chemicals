import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import BackToTop from './BackToTop.jsx';
import { useReveal } from '../hooks.js';
import api from '../api.js';

const SettingsContext = createContext({});
export const useSettings = () => useContext(SettingsContext);

export default function PublicLayout() {
  const [settings, setSettings] = useState({});
  const { pathname } = useLocation();

  useEffect(() => {
    api.get('/settings').then((r) => setSettings(r.data)).catch(() => {});
  }, []);

  /* Baseline reveal coverage for every public page, re-run on navigation.
     Pages used to opt in individually and Contact never did — so arriving there
     from another page left its heading permanently invisible: html.js-anim was
     already set by the previous page, but nothing was observing Contact's
     elements to reveal them. Pages that load data still call useReveal
     themselves to re-scan once their content arrives; a second observer adding
     the same class is harmless. */
  useReveal([pathname]);

  return (
    <SettingsContext.Provider value={settings}>
      <Navbar settings={settings} />
      <main><Outlet /></main>
      <Footer settings={settings} />
      {/* sits outside main so it is never clipped by a page's own overflow */}
      <BackToTop />
    </SettingsContext.Provider>
  );
}
