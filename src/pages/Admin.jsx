import { useState, useEffect } from 'react';
import { getAllRecords, STORES } from '../db/indexedDB';

export function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    revenue: 1250400,
    fraudBlocked: 452,
    activeUsers: 8902,
    transfers: 1241
  });

  useEffect(() => {
    // Mock loading delay
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="section-fade-in">
      <div className="page-header" style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px' }}>ADMIN PANEL</h1>
        <p style={{ color: 'var(--text-dim)', letterSpacing: '2px', fontWeight: '600' }}>GLOBAL SYSTEM OVERSIGHT</p>
      </div>

      {/* Analytics Grid */}
      <div className="stats-grid">
        {[
          { label: 'TOTAL REVENUE', value: `₹${data.revenue.toLocaleString()}`, color: 'var(--primary)', icon: '󰒟' },
          { label: 'FRAUD BLOCKED', value: data.fraudBlocked, color: 'var(--error)', icon: '󰈙' },
          { label: 'ACTIVE USERS', value: data.activeUsers.toLocaleString(), color: 'var(--accent)', icon: '󰕒' },
          { label: 'SECURE TRANSFERS', value: data.transfers, color: 'var(--success)', icon: '󰒓' }
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: '32px', position: 'relative' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px', color: stat.color }}>{stat.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900' }}>{stat.value}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: '800', letterSpacing: '1px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="responsive-split-grid">
        <div className="glass-card" style={{ padding: '40px' }}>
          <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '32px' }}>TICKET VELOCITY</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', height: '240px', paddingBottom: '20px' }}>
            {[40, 70, 45, 90, 65, 80, 50, 85, 95, 60].map((h, i) => (
              <div key={i} style={{ flex: 1, position: 'relative' }}>
                <div style={{ 
                  height: `${h}%`, background: i % 2 === 0 ? 'var(--primary-gradient)' : 'var(--secondary)', 
                  borderRadius: '8px 8px 0 0', transition: 'height 1s ease' 
                }}></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px', fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: '800' }}>
            <span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>16:00</span><span>18:00</span><span>20:00</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '40px' }}>
          <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: 'var(--text-dim)', marginBottom: '32px' }}>IDENTITY STATUS</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { label: 'AADHAAR LINKED', value: 92, color: 'var(--success)' },
              { label: 'PENDING VERIFICATION', value: 5, color: 'var(--warning)' },
              { label: 'FLAGGED ACCOUNTS', value: 3, color: 'var(--error)' }
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${item.value}%`, background: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Re-exporting Events from Tickets if needed, but the requirements mentioned "Events" as a separate app section.
// However, currently routing points to /events -> Events from Admin.jsx? 
// Let's check App.jsx again.
// Route path="/events" element={<Events />} /> where Events is from Admin.
// But I just put Events in Tickets.jsx. I should probably move it or update App.jsx.