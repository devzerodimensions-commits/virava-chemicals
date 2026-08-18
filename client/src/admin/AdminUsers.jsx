import { useEffect, useState } from 'react';
import api from '../api.js';
import './admin.css';

const MIN_PASSWORD = 8;
const blank = { name: '', email: '', password: '' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [notice, setNotice] = useState('');

  const me = JSON.parse(localStorage.getItem('virava_admin') || '{}');

  const load = () => {
    setLoading(true);
    api.get('/admin/users')
      .then((r) => setUsers(r.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openNew = () => { setErr(''); setEditing({ ...blank }); };
  const openEdit = (u) => { setErr(''); setEditing({ ...u, password: '' }); };

  const save = async (e) => {
    e.preventDefault();
    setErr(''); setSaving(true);
    try {
      if (editing.id) {
        const changingOwnPassword = editing.id === me.id && editing.password;
        await api.put(`/admin/users/${editing.id}`, editing);
        setNotice(changingOwnPassword
          ? 'Password updated. Use the new one next time you sign in.'
          : 'User updated.');
      } else {
        await api.post('/admin/users', editing);
        setNotice(`${editing.name} can now sign in with ${editing.email}.`);
      }
      setEditing(null);
      load();
      setTimeout(() => setNotice(''), 6000);
    } catch (e2) {
      setErr(e2.response?.data?.error || 'Could not save this user');
    } finally { setSaving(false); }
  };

  const remove = async (u) => {
    if (!confirm(`Remove ${u.name} (${u.email})? They will lose access immediately.`)) return;
    try {
      await api.delete(`/admin/users/${u.id}`);
      load();
    } catch (e) {
      alert(e.response?.data?.error || 'Could not delete this user');
    }
  };

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—');
  const onlyOne = users.length <= 1;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Users</h1>
          <p>People who can sign in to this dashboard. Everyone has the same access.</p>
        </div>
        <button className="btn btn-navy" onClick={openNew}>+ Add User</button>
      </div>

      {notice && <div className="panel notice-ok">✓ {notice}</div>}

      <div className="panel">
        {loading ? <p className="empty">Loading…</p> : users.length === 0 ? (
          <p className="empty">No users found.</p>
        ) : (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Added</th><th className="ta-right">Actions</th></tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                      {u.is_self && <span className="badge badge-read user-you">you</span>}
                    </td>
                    <td>{u.email}</td>
                    <td className="nowrap">{fmtDate(u.created_at)}</td>
                    <td className="ta-right nowrap">
                      <button className="icon-btn" title="Edit" onClick={() => openEdit(u)}>✏️</button>
                      <button
                        className="icon-btn danger"
                        title={u.is_self ? 'You cannot delete your own account'
                          : onlyOne ? 'At least one user must remain' : 'Delete'}
                        disabled={u.is_self || onlyOne}
                        onClick={() => remove(u)}
                      >🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditing(null)}>×</button>
            <h2>{editing.id ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={save} className="admin-form">
              <div className="af-field af-full">
                <label>Full Name *</label>
                <input required value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="af-field af-full">
                <label>Email *</label>
                <input required type="email" autoComplete="off" value={editing.email}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              </div>
              <div className="af-field af-full">
                <label>
                  Password {editing.id ? '' : '*'}
                  <span className="af-hint">
                    {editing.id
                      ? ` — leave blank to keep the current one, min ${MIN_PASSWORD} characters to change it`
                      : ` — at least ${MIN_PASSWORD} characters`}
                  </span>
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required={!editing.id}
                  minLength={editing.id && !editing.password ? undefined : MIN_PASSWORD}
                  value={editing.password}
                  placeholder={editing.id ? '••••••••  (unchanged)' : ''}
                  onChange={(e) => setEditing({ ...editing, password: e.target.value })}
                />
              </div>

              {err && <p className="af-full form-err">{err}</p>}

              <div className="af-actions af-full">
                <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn btn-navy" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
