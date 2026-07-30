import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import './admin.css';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('virava_token', data.token);
      localStorage.setItem('virava_admin', JSON.stringify(data.admin));
      nav('/admin');
    } catch (e2) {
      setErr(e2.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="lb-mark"><img src="/img/mark.png" alt="" /></span>
          <span className="lb-text"><b>Virava</b><i>CHEMICALS</i></span>
        </div>
        <h1>Admin Panel</h1>
        <p className="login-sub">Sign in to manage your website</p>
        <form onSubmit={submit} className="login-form">
          <label>Email</label>
          <input required type="email" value={form.email} onChange={set('email')} placeholder="admin@viravachemicals.com" />
          <label>Password</label>
          <input required type="password" value={form.password} onChange={set('password')} placeholder="••••••••" />
          {err && <p className="login-err">{err}</p>}
          <button className="btn btn-navy" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
        </form>
        <a href="/" className="login-back">← Back to website</a>
      </div>
    </div>
  );
}
