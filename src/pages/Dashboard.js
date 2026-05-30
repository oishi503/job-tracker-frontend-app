import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://job-tracker-backend-q2og.onrender.com';

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const headers = { Authorization: `Bearer ${token}` };

  const d = darkMode;

  useEffect(() => {
    fetchApplications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API}/api/applications`, { headers });
      setApplications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/applications`, { company, role, status, notes }, { headers });
      setCompany(''); setRole(''); setStatus('Applied'); setNotes('');
      setShowForm(false);
      fetchApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/applications/${id}`, { headers });
      fetchApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API}/api/applications/${id}`, { status: newStatus }, { headers });
      fetchApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filtered = filter === 'All' ? applications : applications.filter(a => a.status === filter);

  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    offer: applications.filter(a => a.status === 'Offer').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  const statusConfig = {
    'Applied': { color: '#3b82f6', bg: '#eff6ff' },
    'Interview': { color: '#f59e0b', bg: '#fffbeb' },
    'Offer': { color: '#10b981', bg: '#ecfdf5' },
    'Rejected': { color: '#ef4444', bg: '#fef2f2' }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: d ? '#0f172a' : '#f8fafc', fontFamily: "'Segoe UI', sans-serif", transition: 'all 0.3s' }}>

      {/* Navbar */}
      <div style={{ backgroundColor: '#4f46e5', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: '700' }}>🎯 Job Tracker</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px' }}>👋 Hi, {user?.name}</span>
          <button onClick={() => setDarkMode(!d)} style={{ padding: '7px 14px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            {d ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={handleLogout} style={{ padding: '7px 14px', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total', value: stats.total, color: '#4f46e5' },
            { label: 'Applied', value: stats.applied, color: '#3b82f6' },
            { label: 'Interview', value: stats.interview, color: '#f59e0b' },
            { label: 'Offer', value: stats.offer, color: '#10b981' },
            { label: 'Rejected', value: stats.rejected, color: '#ef4444' },
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: d ? '#1e293b' : 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: `4px solid ${stat.color}` }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: d ? '#94a3b8' : '#64748b', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                backgroundColor: filter === f ? '#4f46e5' : d ? '#1e293b' : 'white',
                color: filter === f ? 'white' : d ? '#94a3b8' : '#64748b',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>{f}</button>
            ))}
          </div>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '9px 20px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
            + Add Application
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div style={{ backgroundColor: d ? '#1e293b' : 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 16px', color: d ? '#f1f5f9' : '#1e293b' }}>Add New Application</h3>
            <form onSubmit={handleAdd}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input style={{ ...inputStyle, backgroundColor: d ? '#0f172a' : 'white', color: d ? '#f1f5f9' : '#1e293b', borderColor: d ? '#334155' : '#e2e8f0' }} placeholder="Company Name" value={company} onChange={e => setCompany(e.target.value)} required />
                <input style={{ ...inputStyle, backgroundColor: d ? '#0f172a' : 'white', color: d ? '#f1f5f9' : '#1e293b', borderColor: d ? '#334155' : '#e2e8f0' }} placeholder="Role / Position" value={role} onChange={e => setRole(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <select style={{ ...inputStyle, backgroundColor: d ? '#0f172a' : 'white', color: d ? '#f1f5f9' : '#1e293b', borderColor: d ? '#334155' : '#e2e8f0' }} value={status} onChange={e => setStatus(e.target.value)}>
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
                <input style={{ ...inputStyle, backgroundColor: d ? '#0f172a' : 'white', color: d ? '#f1f5f9' : '#1e293b', borderColor: d ? '#334155' : '#e2e8f0' }} placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '9px 24px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Save</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 24px', backgroundColor: d ? '#334155' : '#f1f5f9', color: d ? '#94a3b8' : '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div style={{ backgroundColor: d ? '#1e293b' : 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: d ? '#0f172a' : '#f8fafc', borderBottom: `2px solid ${d ? '#334155' : '#e2e8f0'}` }}>
                {['Company', 'Role', 'Date Applied', 'Status', 'Notes', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: d ? '#94a3b8' : '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: '#94a3b8', fontSize: '15px' }}>No applications yet. Add your first one! 🚀</td></tr>
              ) : (
                filtered.map((app, i) => (
                  <tr key={app._id} style={{ borderBottom: `1px solid ${d ? '#334155' : '#f1f5f9'}`, backgroundColor: i % 2 === 0 ? (d ? '#1e293b' : 'white') : (d ? '#172032' : '#fafafa') }}>
                    <td style={{ padding: '14px 16px', fontWeight: '600', color: d ? '#f1f5f9' : '#1e293b' }}>{app.company}</td>
                    <td style={{ padding: '14px 16px', color: d ? '#94a3b8' : '#475569' }}>{app.role}</td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '13px' }}>{new Date(app.dateApplied).toLocaleDateString()}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <select value={app.status} onChange={e => handleStatusChange(app._id, e.target.value)} style={{
                        padding: '5px 10px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                        backgroundColor: statusConfig[app.status]?.bg,
                        color: statusConfig[app.status]?.color
                      }}>
                        <option>Applied</option>
                        <option>Interview</option>
                        <option>Offer</option>
                        <option>Rejected</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px 16px', color: d ? '#94a3b8' : '#64748b', fontSize: '13px' }}>{app.notes || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={() => handleDelete(app._id)} style={{ padding: '5px 12px', backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
  fontSize: '14px', boxSizing: 'border-box', outline: 'none'
};

export default Dashboard;