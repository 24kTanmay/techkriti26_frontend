"use client";

import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/common/Navbar';
import './OrganizerPage.css';

interface Registrant {
  id: string; // Team ID
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  abstractUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

const registrantsMockData: Registrant[] = [
  { id: 'TEAM-101', teamName: 'AeroDynamics', leaderName: 'Mugunthan D.K', leaderEmail: 'mugunthandk@gmail.com', leaderPhone: '+91 98450 12345', abstractUrl: '#', status: 'pending' },
  { id: 'TEAM-102', teamName: 'RoboQuest', leaderName: 'Tejas Vashista', leaderEmail: 'tvashista_be24@thapar.edu', leaderPhone: '+91 70123 45678', abstractUrl: '#', status: 'approved' },
  { id: 'TEAM-103', teamName: 'CyberShield', leaderName: 'Ananya Roy', leaderEmail: 'ananya.roy@iitk.ac.in', leaderPhone: '+91 94441 55223', abstractUrl: '#', status: 'pending' },
  { id: 'TEAM-104', teamName: 'EcoSustain', leaderName: 'Siddharth Jain', leaderEmail: 'sidjain@bits-pilani.ac.in', leaderPhone: '+91 88223 99001', abstractUrl: '#', status: 'rejected' },
];

export default function OrganizerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Registrant[]>(registrantsMockData);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    id: '',
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
  });

  const filtered = data.filter(r => {
    // Global search
    const matchesGlobal = query === '' || 
      r.teamName.toLowerCase().includes(query.toLowerCase()) ||
      r.leaderName.toLowerCase().includes(query.toLowerCase()) ||
      r.leaderEmail.toLowerCase().includes(query.toLowerCase());

    // Column specific filters
    const matchesId = (r.id || '').toLowerCase().includes(columnFilters.id.toLowerCase());
    const matchesTeamName = (r.teamName || '').toLowerCase().includes(columnFilters.teamName.toLowerCase());
    const matchesLeaderName = (r.leaderName || '').toLowerCase().includes(columnFilters.leaderName.toLowerCase());
    const matchesEmail = (r.leaderEmail || '').toLowerCase().includes(columnFilters.leaderEmail.toLowerCase());
    const matchesPhone = (r.leaderPhone || '').toLowerCase().includes(columnFilters.leaderPhone.toLowerCase());

    return matchesGlobal && matchesId && matchesTeamName && matchesLeaderName && matchesEmail && matchesPhone;
  });

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [column]: value }));
  };

  const handleStatusUpdate = (id: string, newStatus: 'approved' | 'rejected') => {
    setData(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    
    const headers = ["#", "Team ID", "Team Name", "Leader Name", "Leader Email", "Leader Phone", "Status"];
    
    const rows = filtered.map((row, index) => [
      (index + 1).toString(),
      row.id,
      row.teamName,
      row.leaderName,
      row.leaderEmail,
      row.leaderPhone,
      row.status
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `techkriti_teams_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    if (document.body.contains(link)) {
        document.body.removeChild(link);
    }
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
      dots.forEach(d => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(var(--color-copper-rgb), 0.4)`;
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!auraRef.current) return;
      
      const x = e.clientX;
      const y = e.clientY;
      
      const relX = x - window.innerWidth / 2;
      const relY = y - window.innerHeight / 2;
      
      auraRef.current.style.transform = `translate(${relX}px, ${relY}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="organizer-body">
      {/* Overlays */}
      <div className="organizer-noise" />
      <div className="organizer-ambient" />
      <div ref={auraRef} className="organizer-aura" />
      <canvas id="organizer-bg-canvas" ref={canvasRef} />

      {/* Nav */}
      <Navbar />

      <main style={{ marginTop: '100px' }}>
        {/* ── Stats ── */}
        <section className="organizer-nexus-container">
          <div style={{ width: '100%', gridColumn: '1 / -1' }}>
             <h2 className="organizer-section-title">
               <span className="title-num">01 //</span> Team <i>Analytics.</i>
             </h2>
          </div>
          <div className="organizer-shard">
            <div className="organizer-shard-sweep" />
            <span className="organizer-shard-label">Total Teams</span>
            <div className="organizer-shard-value">{data.length}</div>
          </div>
        </section>

        {/* ── Data Table ── */}
        <section className="organizer-data-section">
          <h2 className="organizer-section-title">
            <span className="title-num">02 //</span> Management <i>Console.</i>
          </h2>

          <div className="organizer-filter-console">
            <input
              type="text"
              className="organizer-search"
              placeholder="Search by team, leader or email..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="btn btn-primary btn-shine">Execute Search</button>
            <button className="btn btn-secondary" onClick={handleExportCSV}>Export .CSV</button>
          </div>

          <div className="organizer-table-wrap">
            <table className="organizer-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Team ID</th>
                  <th>Team Name</th>
                  <th>Team Leader</th>
                  <th>Contact</th>
                  <th>Leader Email</th>
                  <th>Abstract</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
                <tr className="filter-row">
                  <th />
                  <th><input type="text" className="column-filter" placeholder="ID..." value={columnFilters.id} onChange={(e) => handleColumnFilterChange('id', e.target.value)} /></th>
                  <th><input type="text" className="column-filter" placeholder="Team..." value={columnFilters.teamName} onChange={(e) => handleColumnFilterChange('teamName', e.target.value)} /></th>
                  <th><input type="text" className="column-filter" placeholder="Leader..." value={columnFilters.leaderName} onChange={(e) => handleColumnFilterChange('leaderName', e.target.value)} /></th>
                  <th><input type="text" className="column-filter" placeholder="Phone..." value={columnFilters.leaderPhone} onChange={(e) => handleColumnFilterChange('leaderPhone', e.target.value)} /></th>
                  <th><input type="text" className="column-filter" placeholder="Email..." value={columnFilters.leaderEmail} onChange={(e) => handleColumnFilterChange('leaderEmail', e.target.value)} /></th>
                  <th />
                  <th />
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((row, index) => (
                  <tr key={row.id}>
                    <td className="organizer-id-cell" style={{ opacity: 0.5 }}>{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="organizer-id-cell">{row.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.teamName}</td>
                    <td>{row.leaderName}</td>
                    <td className="organizer-id-cell" style={{ color: 'var(--text-muted)' }}>{row.leaderPhone}</td>
                    <td style={{ fontSize: '0.8rem' }}>{row.leaderEmail}</td>
                    <td>
                      <a href={row.abstractUrl} target="_blank" rel="noopener noreferrer" className="btn-small btn-abstract">View Document</a>
                    </td>
                    <td>
                      <span className={`status-indicator status-${row.status}`}>
                        {row.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                        <div className="organizer-actions" style={{ justifyContent: 'flex-end' }}>
                            <button 
                                className="btn-small btn-approve" 
                                onClick={() => handleStatusUpdate(row.id, 'approved')}
                                disabled={row.status === 'approved'}
                            >
                                Approve
                            </button>
                            <button 
                                className="btn-small btn-reject"
                                onClick={() => handleStatusUpdate(row.id, 'rejected')}
                                disabled={row.status === 'rejected'}
                            >
                                Reject
                            </button>
                        </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px' }}>
                      NO MATCHING RECORDS FOUND
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
