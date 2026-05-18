import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRecords, STORES } from '../db/indexedDB';
import { formatDate } from '../utils/helpers';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="section-fade-in" style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      textAlign: 'center'
    }}>
      {/* Refined Hero Section */}
      <section className="hero-section" style={{ display: 'block', maxWidth: '800px' }}>
        <div className="hero-content" style={{ paddingRight: '0' }}>
          <h1 style={{ fontSize: '5rem', fontWeight: '900', lineHeight: '1', marginBottom: '24px', letterSpacing: '-3px' }}>
            Real Fans.<br /><span style={{ color: 'var(--primary)' }}>Real Tickets.</span>
          </h1>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', marginBottom: '48px', lineHeight: '1.6', margin: '0 auto 48px' }}>
            FanLock uses Aadhaar-verified identities to ensure every ticket belongs to a real human. No bots, no scalpers, just pure fan experiences.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button className="btn-premium" style={{ padding: '20px 60px', fontSize: '1.2rem' }} onClick={() => navigate('/book')}>BOOK TICKETS</button>
          </div>
        </div>
      </section>

      <div style={{ marginTop: '80px', opacity: 0.5, fontSize: '0.8rem', fontWeight: '800', letterSpacing: '4px', color: 'var(--text-dim)' }}>
        SECURED BY AADHAAR IDENTITY PROTOCOL
      </div>
    </div>
  );
}
