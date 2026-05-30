import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Applied');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get('https://job-tracker-backend-q2og.onrender.com/api/applications', { headers });
      setApplications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://job-tracker-backend-q2og.onrender.com/api/applications', { company, role, status, notes }, { headers });
      setCompany(''); setRole(''); setStatus('Applied'); setNotes('');
      setShowForm(false);
      fetchApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://job-tracker-backend-q2og.onrender.com/api/applications/${id}`, { headers });
      fetchApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`https://job-tracker-backend-q2og.onrender.com/api/applications/${id}`, { status: newStatus }, { headers });
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

  const statusColor = { 'Applied': '#3b82f6', 'Interview': '#f59e0b', 'Offer': '#10b981', 'Rejected': '#ef4444' };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Job Tracker</h2>
        <div>
          <span style={styles.welcome}>Hi, {user?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.controls}>
        <div>
          {['All', 'Applied', 'Interview', 'Offer', 'Rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ ...styles.filterBtn, backgroundColor: filter === f ? '#4f46e5' : '#e5e7eb', color: filter === f ? 'white' : 'black' }}>{f}</button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>+ Add Application</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} style={styles.form}>
          <input style={styles.input} placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} required />
          <input style={styles.input} placeholder="Role" value={role} onChange={e => setRole(e.target.value)} required />
          <select style={styles.input} value={status} onChange={e => setStatus(e.target.value)}>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <input style={styles.input} placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
          <button type="submit" style={styles.addBtn}>Save</button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th>Company</th>
            <th>Role</th>
            <th>Date Applied</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No applications yet</td></tr>
          ) : (
            filtered.map(app => (
              <tr key={app._id} style={styles.tableRow}>
                <td style={styles.td}>{app.company}</td>
                <td style={styles.td}>{app.role}</td>
                <td style={styles.td}>{new Date(app.dateApplied).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <select value={app.status} onChange={e => handleStatusChange(app._id, e.target.value)} style={{ ...styles.statusBadge, backgroundColor: statusColor[app.status] }}>
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </td>
                <td style={styles.td}>{app.notes}</td>
                <td style={styles.td}>
                  <button onClick={() => handleDelete(app._id)} style={styles.deleteBtn}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: { maxWidth: '1100px', margin: '0 auto', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  welcome: { marginRight: '12px', fontSize: '14px' },
  logoutBtn: { padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  filterBtn: { padding: '6px 12px', marginRight: '8px', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  addBtn: { padding: '8px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  tableHeader: { backgroundColor: '#4f46e5', color: 'white' },
  tableRow: { borderBottom: '1px solid #e5e7eb' },
  td: { padding: '12px 16px', fontSize: '14px' },
  statusBadge: { padding: '4px 8px', borderRadius: '4px', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px' },
  deleteBtn: { padding: '4px 10px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }
};

export default Dashboard;