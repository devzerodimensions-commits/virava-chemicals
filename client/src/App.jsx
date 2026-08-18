import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useScrollTop } from './hooks.js';

import PublicLayout from './components/PublicLayout.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import ProductFinder, { CategoryRedirect } from './pages/ProductFinder.jsx';
import Industries from './pages/Industries.jsx';
import Contact from './pages/Contact.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import PrincipalDetail from './pages/PrincipalDetail.jsx';
import GodrejSolution from './pages/GodrejSolution.jsx';
import ProductDetail from './pages/ProductDetail.jsx';

import AdminLogin from './admin/Login.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard.jsx';
import Enquiries from './admin/Enquiries.jsx';
import AdminProducts from './admin/AdminProducts.jsx';
import AdminCategories from './admin/AdminCategories.jsx';
import AdminIndustries from './admin/AdminIndustries.jsx';
import AdminPrincipals from './admin/AdminPrincipals.jsx';
import AdminHero from './admin/AdminHero.jsx';
import AdminBlogs from './admin/AdminBlogs.jsx';
import AdminSolutions from './admin/AdminSolutions.jsx';
import AdminHighlights from './admin/AdminHighlights.jsx';
import AdminFaqs from './admin/AdminFaqs.jsx';
import AdminSettings from './admin/AdminSettings.jsx';
import RequireAuth from './admin/RequireAuth.jsx';

const HOME_ONLY = import.meta.env.VITE_HOME_ONLY === 'true';

export default function App() {
  useScrollTop();

  // Home-only preview: disable all link/button navigation.
  useEffect(() => {
    if (!HOME_ONLY) return;
    const block = (e) => {
      const a = e.target.closest('a');
      if (a) { e.preventDefault(); e.stopPropagation(); }
    };
    document.addEventListener('click', block, true);
    return () => document.removeEventListener('click', block, true);
  }, []);

  if (HOME_ONLY) {
    return (
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<ProductFinder />} />
        {/* the old per-category page is now the finder pre-filtered by category */}
        <Route path="/products/:slug" element={<CategoryRedirect />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/industries" element={<Industries />} />
        {/* Godrej gets a page per product solution; both must precede the generic
            :slug route below, which still serves the other three principals. */}
        <Route path="/principals/godrej-industries-limited"
          element={<Navigate to="/principals/godrej-industries-limited/oleochemicals" replace />} />
        <Route path="/principals/godrej-industries-limited/:solution" element={<GodrejSolution />} />
        <Route path="/principals/:slug" element={<PrincipalDetail />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={<RequireAuth><AdminLayout /></RequireAuth>}
      >
        <Route index element={<Dashboard />} />
        <Route path="enquiries" element={<Enquiries />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="industries" element={<AdminIndustries />} />
        <Route path="principals" element={<AdminPrincipals />} />
        <Route path="hero" element={<AdminHero />} />
        <Route path="solutions" element={<AdminSolutions />} />
        <Route path="highlights" element={<AdminHighlights />} />
        <Route path="why" element={<AdminFaqs />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
