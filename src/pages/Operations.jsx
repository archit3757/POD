import { useState, useEffect } from 'react';
import { getAllRecords, putRecord, STORES } from '../db/indexedDB';
import { SLOT_TIMES } from '../utils/helpers';
import { useToast } from '../context/ToastContext';

// --- GatesView ---
export function GatesView() {
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRecords(STORES.gates).then(data => {
      setGates(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="section-fade-in">
      <div className="page-header" style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px' }}>GATE CONTROL</h1>
        <p style={{ color: 'var(--text-dim)', letterSpacing: '2px', fontWeight: '600' }}>REAL-TIME ENTRY MONITORING</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
        {gates.map(gate => {
          const totalCap = Object.values(gate.capacityBySlot).reduce((a, b) => a + b, 0);
          const totalBooked = Object.values(gate.currentBookingsBySlot).reduce((a, b) => a + b, 0);
          const pct = Math.round((totalBooked / totalCap) * 100);

          return (
            <div key={gate.id} className="glass-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>🚪 {gate.name.toUpperCase()}</h3>
                <div className={`verified-badge ${gate.status === 'open' ? '' : 'error-badge'}`} 
                     style={{ color: gate.status === 'open' ? 'var(--success)' : 'var(--error)' }}>
                  {gate.status.toUpperCase()}
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>
                  <span>CURRENT LOAD</span>
                  <span>{pct}%</span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }}></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {SLOT_TIMES.slice(0, 4).map(slot => (
                  <div key={slot.id} style={{ background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: '800' }}>{slot.label}</div>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{gate.currentBookingsBySlot[slot.id] || 0} / {gate.capacityBySlot[slot.id]}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- ParkingView ---
export function ParkingView() {
  const [parking, setParking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRecords(STORES.parkingSlots).then(data => {
      setParking(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="section-fade-in">
      <div className="page-header" style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px' }}>PARKING LOGS</h1>
        <p style={{ color: 'var(--text-dim)', letterSpacing: '2px', fontWeight: '600' }}>ZONE ALLOCATION PROTOCOLS</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
        {parking.map(z => {
          const used = z.assignedBookingIds.length;
          const pct = Math.round((used / z.capacity) * 100);
          return (
            <div key={z.id} className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🅿️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '8px' }}>ZONE {z.zone}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '700', marginBottom: '24px' }}>{z.capacity} TOTAL CAPACITY</p>
              
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="2" />
                  <circle cx="18" cy="18" r="16" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray={`${pct}, 100`} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.2rem' }}>
                  {pct}%
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: pct > 80 ? 'var(--error)' : 'var(--success)' }}>
                {z.capacity - used} SLOTS AVAILABLE
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- HelpDesk ---
export function HelpDesk() {
  const [faqs] = useState([
    { q: 'How does Aadhaar verification work?', a: 'FanLock uses secure Aadhaar API mocks to link your ticket to your unique identity, preventing unauthorized transfers.' },
    { q: 'Can I transfer my ticket?', a: 'Yes, but only via the FanLock secure transfer protocol which re-verifies the new holder.' },
    { q: 'What if my phone battery dies?', a: 'Visit the FanLock physical help desk at the venue with your Aadhaar card for instant verification.' }
  ]);
  const [activeFaq, setActiveFaq] = useState(null);

  return (
    <div className="section-fade-in">
      <div className="page-header" style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px' }}>HELP DESK</h1>
        <p style={{ color: 'var(--text-dim)', letterSpacing: '2px', fontWeight: '600' }}>OPERATIONAL SUPPORT CENTER</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '60px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '32px' }}>FREQUENTLY ASKED</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <button 
                  style={{ 
                    width: '100%', padding: '24px', background: 'none', border: 'none', textAlign: 'left', 
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
                  }}
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <span style={{ fontWeight: '700', fontSize: '1rem' }}>{faq.q}</span>
                  <span style={{ transform: activeFaq === i ? 'rotate(180deg)' : 'none', transition: 'all 0.3s ease' }}>▼</span>
                </button>
                {activeFaq === i && (
                  <div style={{ padding: '0 24px 24px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="glass-card" style={{ padding: '40px', background: 'var(--primary-gradient)', color: 'white' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '16px' }}>LIVE SUPPORT</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '32px', opacity: 0.9 }}>Connect with our system moderators for immediate assistance.</p>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.2)', 
              padding: '14px 20px', 
              borderRadius: 'var(--radius-md)', 
              textAlign: 'center', 
              fontWeight: '800', 
              fontSize: '1.25rem', 
              letterSpacing: '1px',
              border: '1px solid rgba(255, 255, 255, 0.3)' 
            }}>
              📞 +91 1311 22 1311
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: '32px', marginTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--success)' }}></div>
              <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>MODERATORS ONLINE</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '600' }}>ESTIMATED WAIT: 2 MINUTES</p>
          </div>
        </div>
      </div>
    </div>
  );
}