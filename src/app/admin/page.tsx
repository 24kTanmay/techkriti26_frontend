"use client";

import React, { useEffect, useRef, useState } from 'react';
import './AdminPage.css';

const mockData = [
  { id: '#TK-8901', name: 'Mugunthan D.K',  email: 'mugunthandk@gmail.com',         college: 'VSB Engineering College',          date: '19/02/2026' },
  { id: '#TK-8902', name: 'Tejas Vashista',  email: 'tvashista_be24@thapar.edu',      college: 'Thapar Institute of Eng. & Tech.', date: '22/02/2026' },
  { id: '#TK-8903', name: 'Ananya Roy',       email: 'ananya.roy@iitk.ac.in',          college: 'IIT Kanpur',                       date: '23/02/2026' },
  { id: '#TK-8904', name: 'Siddharth Jain',  email: 'sidjain@bits-pilani.ac.in',      college: 'BITS Pilani',                      date: '24/02/2026' },
  { id: '#TK-8905', name: 'Priya Sharma',    email: 'priya.sharma@nit.ac.in',         college: 'NIT Trichy',                       date: '24/02/2026' },
  { id: '#TK-8906', name: 'Rahul Menon',     email: 'rahul.m@srm.edu.in',             college: 'SRM Institute of Technology',      date: '25/02/2026' },
];

export default function AdminPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [query, setQuery] = useState('');

  const filtered = mockData.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.email.toLowerCase().includes(query.toLowerCase()) ||
    r.college.toLowerCase().includes(query.toLowerCase())
  );

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

          {/* Central dial */}
          <div className="admin-hub-dial">
            <svg className="admin-dial-svg" width="320" height="320">
              <circle className="admin-dial-track" cx="160" cy="160" r="148" />
              <circle className="admin-dial-fill"  cx="160" cy="160" r="148" />
            </svg>
            <div className="admin-dial-value">1,391</div>
            <div className="admin-dial-label">Total Syncs</div>
          </div>

          {/* Right shards */}
          <div className="admin-shard-col">
            <div className="admin-shard">
              <span className="admin-shard-label">Active Events</span>
              <div className="admin-shard-value">42</div>
            </div>
            <div className="admin-shard">
              <span className="admin-shard-label">Transmission Latency</span>
              <div className="admin-shard-value">12ms</div>
            </div>
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

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Node ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>College / Institution</th>
                  <th>Sync Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map(row => (
                  <tr key={row.id}>
                    <td className="admin-id-cell">{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>{row.college}</td>
                    <td>{row.date}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#8b8b99', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '2px' }}>
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
