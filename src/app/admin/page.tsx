"use client";

import React, { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/common/Navbar';
import './AdminPage.css';

const usersMockData = [
  { id: '#U-1001', name: 'Mugunthan D.K',  email: 'mugunthandk@gmail.com',  phone: '+91 98450 12345', college: 'VSB Engineering College', date: '15/02/2026' },
  { id: '#U-1002', name: 'Tejas Vashista', email: 'tvashista_be24@thapar.edu', phone: '+91 70123 45678', college: 'Thapar Institute of Eng. & Tech.', date: '16/02/2026' },
  { id: '#U-1003', name: 'Ananya Roy',      email: 'ananya.roy@iitk.ac.in', phone: '+91 94441 55223', college: 'IIT Kanpur', date: '18/02/2026' },
  { id: '#U-1004', name: 'Siddharth Jain', email: 'sidjain@bits-pilani.ac.in', phone: '+91 88223 99001', college: 'BITS Pilani', date: '20/02/2026' },
  { id: '#U-1005', name: 'Priya Sharma',   email: 'priya.sharma@nit.ac.in', phone: '+91 91100 88776', college: 'NIT Trichy', date: '22/02/2026' },
];

const registrantsMockData = [
  { id: '#TK-8901', name: 'Mugunthan D.K',  email: 'mugunthandk@gmail.com',  college: 'VSB Engineering College', date: '19/02/2026', phone: '+91 98450 12345' },
  { id: '#TK-8902', name: 'Tejas Vashista', email: 'tvashista_be24@thapar.edu', college: 'Thapar Institute of Eng. & Tech.', date: '22/02/2026', phone: '+91 70123 45678' },
  { id: '#TK-8903', name: 'Ananya Roy',      email: 'ananya.roy@iitk.ac.in', college: 'IIT Kanpur', date: '23/02/2026', phone: '+91 94441 55223' },
  { id: '#TK-8904', name: 'Siddharth Jain', email: 'sidjain@bits-pilani.ac.in', college: 'BITS Pilani', date: '24/02/2026', phone: '+91 88223 99001' },
];

export default function AdminPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
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

  const currentData = activeTab === 'users' ? usersMockData : registrantsMockData;

  const filtered = currentData.filter(r => {
    // Global search
    const matchesGlobal = query === '' || 
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.email.toLowerCase().includes(query.toLowerCase()) ||
      (r as any).college?.toLowerCase().includes(query.toLowerCase());

    // Column specific filters
    const matchesId = (r.id || '').toLowerCase().includes(columnFilters.id.toLowerCase());
    const matchesName = (r.name || '').toLowerCase().includes(columnFilters.name.toLowerCase());
    const matchesEmail = (r.email || '').toLowerCase().includes(columnFilters.email.toLowerCase());
    const matchesPhone = ((r as any).phone || '').toLowerCase().includes(columnFilters.phone.toLowerCase());
    const matchesCollege = ((r as any).college || '').toLowerCase().includes(columnFilters.college.toLowerCase());
    const matchesDate = (r.date || '').toLowerCase().includes(columnFilters.date.toLowerCase());

    return matchesGlobal && matchesId && matchesName && matchesEmail && matchesPhone && matchesCollege && matchesDate;
  });

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [column]: value }));
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    
    const headers = activeTab === 'users' 
      ? ["#", "User ID", "Name", "Email", "Phone", "College", "Joined Date"]
      : ["#", "Reg ID", "Name", "Email", "Phone", "College", "Reg Date"];
    
    const rows = filtered.map((row: any, index) => {
      if (activeTab === 'users') {
        return [
          (index + 1).toString(),
          row.id,
          row.name,
          row.email,
          row.phone,
          row.college,
          row.date
        ];
      } else {
        return [
          (index + 1).toString(),
          row.id,
          row.name,
          row.email,
          row.phone,
          row.college,
          row.date
        ];
      }
    });

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
      // subtle copper-tinted dots
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
    <div className="admin-body">
      {/* Overlays */}
      <div className="admin-noise" />
      <div className="admin-ambient" />
      <div ref={auraRef} className="admin-aura" />
      <canvas id="admin-bg-canvas" ref={canvasRef} />

      {/* Nav */}
      <Navbar />

      <main style={{ marginTop: '100px' }}>
        {/* ── Stats ── */}
        <section className="admin-nexus-container">
          <div style={{ width: '100%', gridColumn: '1 / -1' }}>
             <h2 className="admin-section-title">
               <span className="title-num">01 //</span> Operational <i>Metrics.</i>
             </h2>
          </div>
          <div className="admin-shard">
            <div className="admin-shard-sweep" />
            <span className="admin-shard-label">Total Users</span>
            <div className="admin-shard-value">1,391</div>
          </div>
          <div className="admin-shard">
            <div className="admin-shard-sweep" />
            <span className="admin-shard-label">Total Registration</span>
            <div className="admin-shard-value">1,254</div>
          </div>
        </section>

        {/* ── View Switcher Toggle ── */}
        <div className="admin-toggle-container">
          <div className="admin-toggle-track">
            <button 
              className={`admin-toggle-btn ${activeTab === 'users' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              View Users
            </button>
            <button 
              className={`admin-toggle-btn ${activeTab === 'registrations' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('registrations')}
            >
              View Registrations
            </button>
            <div 
              className="admin-toggle-slider" 
              style={{ transform: `translateX(${activeTab === 'users' ? '0' : '100'}%)` }} 
            />
          </div>
        </div>

        {/* ── Data Table ── */}
        <section className="admin-data-section">
          <h2 className="admin-section-title">
            <span className="title-num">02 //</span> {activeTab === 'users' ? 'Global User Directory' : 'Event Registration Feed'} <i>Node.</i>
          </h2>

          <div className="admin-filter-console">
            <input
              type="text"
              className="admin-search"
              placeholder="Search by name, email or college..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button className="btn btn-primary btn-shine">Execute Search</button>
            <button className="btn btn-secondary" onClick={handleExportCSV}>Export .CSV</button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                {activeTab === 'users' ? (
                  <>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th>User ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Phone</th>
                      <th>Institution</th>
                      <th>Date</th>
                    </tr>
                    <tr className="filter-row">
                      <th />
                      <th><input type="text" className="column-filter" placeholder="ID..." value={columnFilters.id} onChange={(e) => handleColumnFilterChange('id', e.target.value)} /></th>
                      <th><input type="text" className="column-filter" placeholder="Name..." value={columnFilters.name} onChange={(e) => handleColumnFilterChange('name', e.target.value)} /></th>
                      <th><input type="text" className="column-filter" placeholder="Email..." value={columnFilters.email} onChange={(e) => handleColumnFilterChange('email', e.target.value)} /></th>
                      <th><input type="text" className="column-filter" placeholder="Phone..." value={columnFilters.phone} onChange={(e) => handleColumnFilterChange('phone', e.target.value)} /></th>
                      <th><input type="text" className="column-filter" placeholder="College..." value={columnFilters.college} onChange={(e) => handleColumnFilterChange('college', e.target.value)} /></th>
                      <th><input type="text" className="column-filter" placeholder="Date..." value={columnFilters.date} onChange={(e) => handleColumnFilterChange('date', e.target.value)} /></th>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th>Reg ID</th>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Phone</th>
                      <th>Institution</th>
                      <th>Date</th>
                    </tr>
                    <tr className="filter-row">
                      <th />
                      <th><input type="text" className="column-filter" placeholder="ID..." value={columnFilters.id} onChange={(e) => handleColumnFilterChange('id', e.target.value)} /></th>
                      <th><input type="text" className="column-filter" placeholder="Name..." value={columnFilters.name} onChange={(e) => handleColumnFilterChange('name', e.target.value)} /></th>
                      <th><input type="text" className="column-filter" placeholder="Email..." value={columnFilters.email} onChange={(e) => handleColumnFilterChange('email', e.target.value)} /></th>
                      <th><input type="text" className="column-filter" placeholder="Phone..." value={columnFilters.phone} onChange={(e) => handleColumnFilterChange('phone', e.target.value)} /></th>
                      <th><input type="text" className="column-filter" placeholder="College..." value={columnFilters.college} onChange={(e) => handleColumnFilterChange('college', e.target.value)} /></th>
                      <th><input type="text" className="column-filter" placeholder="Date..." value={columnFilters.date} onChange={(e) => handleColumnFilterChange('date', e.target.value)} /></th>
                    </tr>
                  </>
                )}
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((row: any, index) => (
                  <tr key={row.id}>
                    <td className="admin-id-cell" style={{ opacity: 0.5 }}>{(index + 1).toString().padStart(2, '0')}</td>
                    <td className="admin-id-cell">{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td className="admin-id-cell" style={{ color: 'var(--text-muted)' }}>{row.phone}</td>
                    {activeTab === 'users' ? (
                      <>
                        <td>{row.college}</td>
                        <td>{row.date}</td>
                      </>
                    ) : (
                      <>
                        <td>{row.college}</td>
                        <td>{row.date}</td>
                      </>
                    )}
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px' }}>
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
