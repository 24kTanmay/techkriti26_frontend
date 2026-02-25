"use client";

import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import './AdminPage.css';

import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

export default function AdminPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [query, setQuery] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    id: '',
    name: '',
    email: '',
    phone: '',
    college: '',
    date: ''
  });
  const [activeTab, setActiveTab] = useState<'users' | 'registrations'>('users');

  const [users, setUsers] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersError, setUsersError] = useState<string|null>(null);
  const [registrationsError, setRegistrationsError] = useState<string|null>(null);
  const { currentUser } = useAuth();
  
  const [selectedCompetition, setSelectedCompetition] = useState('All');
  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchData = async () => {
        if (!currentUser) return;
        setLoading(true);

        try {
            const usersSnap = await getDocs(collection(db, "users"));
            const userList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);
            setUsersError(null);
        } catch (error: any) {
            setUsersError(error.message);
        }

        try {
            const regSnap = await getDocs(collection(db, "registrations"));
            const regList = regSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRegistrations(regList);
            setRegistrationsError(null);
        } catch (error: any) {
            setRegistrationsError(error.message);
        }
        setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  const userMap = users.reduce((acc: any, user: any) => {
    acc[user.id] = user;
    return acc;
  }, {});

  const uniqueCompetitions = ['All', ...Array.from(new Set(registrations.map(r => r.eventName || r.eventId).filter(Boolean)))];

  const formatDate = (date: any) => {
    if (!date) return '-';
    if (date.toDate) return date.toDate().toLocaleDateString('en-GB'); 
    return new Date(date).toLocaleDateString('en-GB');
  };

  const handleSort = (key: string) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
      setSortConfig({ key, direction });
  };

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [column]: value }));
  };

  const currentData = activeTab === 'users' ? users : registrations;

  const filtered = currentData.filter((r: any) => {
    // Competition View Filter for Registrations
    if (activeTab === 'registrations' && selectedCompetition !== 'All') {
        if (r.eventName !== selectedCompetition && r.eventId !== selectedCompetition) return false;
    }

    // Global search
    let globalStr = '';
    if (activeTab === 'users') {
        globalStr = `${r.fullName || ''} ${r.email || ''} ${r.college || ''}`;
    } else {
        const u = userMap[r.userId] || {};
        globalStr = `${r.eventName || r.eventId || ''} ${r.teamId || ''} ${u.fullName || ''} ${u.email || ''}`;
    }
    const matchesGlobal = query === '' || globalStr.toLowerCase().includes(query.toLowerCase());

    // Column specific filters
    const matchesColumn = (colRawValue: any, filterVal: string) => {
        if (!filterVal) return true;
        return (String(colRawValue || '').toLowerCase().includes(filterVal.toLowerCase()));
    };

    let allColsMatch = true;
    if (activeTab === 'users') {
      allColsMatch = matchesColumn(r.fullName, columnFilters.name) &&
                     matchesColumn(r.email, columnFilters.email) &&
                     matchesColumn(r.phone, columnFilters.phone) &&
                     matchesColumn(r.college, columnFilters.college) &&
                     matchesColumn(formatDate(r.createdAt), columnFilters.date) &&
                     matchesColumn(r.referralCode, columnFilters.id); // Re-labeling ID to Ref Code
    } else {
      const u = userMap[r.userId] || {};
      allColsMatch = matchesColumn(r.eventName || r.eventId, columnFilters.id) &&
                     matchesColumn(u.fullName, columnFilters.name) &&
                     matchesColumn(u.email, columnFilters.email) &&
                     matchesColumn(r.role, columnFilters.phone) && // Re-using phone col for Role conceptually
                     matchesColumn(r.status, columnFilters.college) && // Re-using college col for Status
                     matchesColumn(formatDate(r.registeredAt), columnFilters.date);
    }

    return matchesGlobal && allColsMatch;
  });

  if (sortConfig.key) {
      filtered.sort((a: any, b: any) => {
          let aValue = a[sortConfig.key as string];
          let bValue = b[sortConfig.key as string];

          if (activeTab === 'registrations') {
              if (sortConfig.key === 'user.fullName') {
                  aValue = userMap[a.userId]?.fullName;
                  bValue = userMap[b.userId]?.fullName;
              } else if (sortConfig.key === 'user.email') {
                   aValue = userMap[a.userId]?.email;
                   bValue = userMap[b.userId]?.email;
              } else if (sortConfig.key === 'event') {
                   aValue = a.eventName || a.eventId;
                   bValue = b.eventName || b.eventId;
              }
          }

          const isDateKey = ['createdAt', 'registeredAt', 'date'].includes(sortConfig.key as string);

          if (isDateKey) {
              if (aValue && typeof aValue === 'object' && aValue.toDate) aValue = aValue.toDate();
              else if (aValue && (typeof aValue === 'string' || typeof aValue === 'number')) aValue = new Date(aValue);
              
              if (bValue && typeof bValue === 'object' && bValue.toDate) bValue = bValue.toDate();
              else if (bValue && (typeof bValue === 'string' || typeof bValue === 'number')) bValue = new Date(bValue);
          } else {
              if (typeof aValue === 'string') aValue = aValue.toLowerCase();
              if (typeof bValue === 'string') bValue = bValue.toLowerCase();
          }

          if (!aValue) return 1;
          if (!bValue) return -1;
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
      });
  }

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    
    let headers: string[];
    let rows: any[][];
    
    if (activeTab === 'users') {
      headers = ["Full Name", "Email", "Phone", "College", "Reference Code", "Profile Completed", "Joined At"];
      rows = filtered.map((user: any) => [
          user.fullName || '',
          user.email || '',
          user.phone || '',
          user.college || '',
          user.referralCode || '',
          user.profileCompleted ? 'Yes' : 'No',
          formatDate(user.createdAt)
      ]);
    } else {
      headers = ["Event/Comp", "Team ID", "Type", "User Name", "User Email", "Role", "Status", "Registered At"];
      rows = filtered.map((r: any) => {
          const u = userMap[r.userId] || {};
          return [
              r.eventName || r.eventId || '',
              r.teamId || '-',
              r.type || (r.teamId ? 'team' : 'individual'),
              u.fullName || r.userId || '',
              u.email || '',
              r.role || '-',
              r.status || '',
              formatDate(r.registeredAt)
          ];
      });
    }

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `techkriti_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSortIcon = (key: string) => {
      if (sortConfig.key === key) {
          return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
      }
      return ' ↕';
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    type Dot = { x: number; y: number; vx: number; vy: number; r: number };
    let dots: Dot[] = [];
    let rafId: number;

    const init = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      dots = Array.from({ length: 60 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.2 + 0.3,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // subtle copper-tinted dots
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(203, 163, 129, 0.4)`;
        ctx.fill();
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
      });
      rafId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', init);
    init();
    draw();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="admin-body">
      {/* Overlays */}
      <div className="admin-noise" />
      <div className="admin-ambient" />
      <canvas id="admin-bg-canvas" ref={canvasRef} />

      {/* Nav */}
      <nav className="admin-nav">
        <div className="admin-nav-brand">
          TECHKRITI&nbsp;<span>26</span>&nbsp;// COMMAND
        </div>
        <div className="admin-nav-right">
          <div className="admin-status">
            <div className="admin-pulse" />
            Singularity_Core: Online
          </div>
          <button className="admin-btn">Export .XLSX</button>
        </div>
      </nav>

      <main>
        {/* ── Stats & Dialer ── */}
        <section className="admin-nexus-container">

          {/* Left shards */}
          <div className="admin-shard-col">
            <div className="admin-shard">
              <span className="admin-shard-label">Total Registrants</span>
              <div className="admin-shard-value">1,254</div>
            </div>
            <div className="admin-shard">
              <span className="admin-shard-label">Node Efficiency</span>
              <div className="admin-shard-value">98.4%</div>
            </div>
          </div>
          <div className="admin-shard">
            <div className="admin-shard-sweep" />
            <span className="admin-shard-label">Total Users</span>
            <div className="admin-shard-value">{usersError ? <span style={{fontSize: '14px', color: 'red'}}>Error</span> : users.length}</div>
          </div>
          <div className="admin-shard">
            <div className="admin-shard-sweep" />
            <span className="admin-shard-label">Total Registration</span>
            <div className="admin-shard-value">{registrationsError ? <span style={{fontSize: '14px', color: 'red'}}>Error</span> : registrations.length}</div>
          </div>
          <div className="admin-shard" style={{ borderTop: activeTab === 'registrations' ? '1px solid var(--accent)' : '' }}>
            <div className="admin-shard-sweep" />
            <span className="admin-shard-label">{activeTab === 'users' ? 'Users in View' : 'Registrations in View'}</span>
            <div className="admin-shard-value">{filtered.length}</div>
          </div>
        </section>

        {/* ── Data Table ── */}
        <section className="admin-data-section">
          <p className="admin-section-label">Registrant Feed</p>

          <div className="admin-filter-console">
            <input
              type="text"
              className="admin-search"
              placeholder="Search by name, email or college..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="admin-btn">Execute Search</button>
          </div>

          {activeTab === 'registrations' && (
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Filter Competition:</span>
                  <select 
                      value={selectedCompetition}
                      onChange={e => setSelectedCompetition(e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '4px' }}
                  >
                      {uniqueCompetitions.map((c: any) => (
                          <option key={c} value={c}>{c}</option>
                      ))}
                  </select>
              </div>
          )}
          <div className="admin-table-wrap">
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#8b8b99' }}>SYNCING WITH MAINFRAME...</div>
            ) : (
             <table className="admin-table">
               <thead>
                 {activeTab === 'users' ? (
                   <>
                     <tr>
                       <th style={{ width: '50px' }}>#</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('referralCode')}>Ref Code {getSortIcon('referralCode')}</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('fullName')}>Full Name {getSortIcon('fullName')}</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>Email Address {getSortIcon('email')}</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('phone')}>Phone {getSortIcon('phone')}</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('college')}>Institution {getSortIcon('college')}</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>Joined Date {getSortIcon('createdAt')}</th>
                     </tr>
                     <tr className="filter-row">
                       <th />
                       <th><input type="text" className="column-filter" placeholder="Ref..." value={columnFilters.id || ''} onChange={(e) => handleColumnFilterChange('id', e.target.value)} /></th>
                       <th><input type="text" className="column-filter" placeholder="Name..." value={columnFilters.name || ''} onChange={(e) => handleColumnFilterChange('name', e.target.value)} /></th>
                       <th><input type="text" className="column-filter" placeholder="Email..." value={columnFilters.email || ''} onChange={(e) => handleColumnFilterChange('email', e.target.value)} /></th>
                       <th><input type="text" className="column-filter" placeholder="Phone..." value={columnFilters.phone || ''} onChange={(e) => handleColumnFilterChange('phone', e.target.value)} /></th>
                       <th><input type="text" className="column-filter" placeholder="College..." value={columnFilters.college || ''} onChange={(e) => handleColumnFilterChange('college', e.target.value)} /></th>
                       <th><input type="text" className="column-filter" placeholder="Date..." value={columnFilters.date || ''} onChange={(e) => handleColumnFilterChange('date', e.target.value)} /></th>
                     </tr>
                   </>
                 ) : (
                   <>
                     <tr>
                       <th style={{ width: '50px' }}>#</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('event')}>Event {getSortIcon('event')}</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('user.fullName')}>Full Name {getSortIcon('user.fullName')}</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('user.email')}>Email Address {getSortIcon('user.email')}</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('role')}>Role {getSortIcon('role')}</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>Status {getSortIcon('status')}</th>
                       <th style={{ cursor: 'pointer' }} onClick={() => handleSort('registeredAt')}>Reg Date {getSortIcon('registeredAt')}</th>
                     </tr>
                     <tr className="filter-row">
                       <th />
                       <th><input type="text" className="column-filter" placeholder="Event..." value={columnFilters.id || ''} onChange={(e) => handleColumnFilterChange('id', e.target.value)} /></th>
                       <th><input type="text" className="column-filter" placeholder="Name..." value={columnFilters.name || ''} onChange={(e) => handleColumnFilterChange('name', e.target.value)} /></th>
                       <th><input type="text" className="column-filter" placeholder="Email..." value={columnFilters.email || ''} onChange={(e) => handleColumnFilterChange('email', e.target.value)} /></th>
                       <th><input type="text" className="column-filter" placeholder="Role..." value={columnFilters.phone || ''} onChange={(e) => handleColumnFilterChange('phone', e.target.value)} /></th>
                       <th><input type="text" className="column-filter" placeholder="Status..." value={columnFilters.college || ''} onChange={(e) => handleColumnFilterChange('college', e.target.value)} /></th>
                       <th><input type="text" className="column-filter" placeholder="Date..." value={columnFilters.date || ''} onChange={(e) => handleColumnFilterChange('date', e.target.value)} /></th>
                     </tr>
                   </>
                 )}
               </thead>
               <tbody>
                 {filtered.length > 0 ? filtered.map((row: any, index) => {
                     const u = activeTab === 'users' ? row : (userMap[row.userId] || {});
                     return (
                   <tr key={row.id}>
                     <td className="admin-id-cell" style={{ opacity: 0.5 }}>{(index + 1).toString().padStart(2, '0')}</td>
                     <td className="admin-id-cell">{activeTab === 'users' ? (row.referralCode || '-') : (row.eventName || row.eventId)}</td>
                     <td>{activeTab === 'users' ? row.fullName : u.fullName}</td>
                     <td>{activeTab === 'users' ? row.email : u.email}</td>
                     <td className="admin-id-cell" style={{ color: 'var(--text-muted)' }}>{activeTab === 'users' ? row.phone : (row.role || '-')}</td>
                     <td>{activeTab === 'users' ? row.college : row.status}</td>
                     <td>{formatDate(activeTab === 'users' ? row.createdAt : row.registeredAt)}</td>
                   </tr>
                 )}) : (
                   <tr>
                     <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#8b8b99', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px' }}>
                       NO MATCHING RECORDS FOUND
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
