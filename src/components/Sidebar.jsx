import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const MENU_ITEMS = [
  { path: '/', label: 'DASHBOARD' },
  { path: '/events', label: 'EVENTS' },
  { path: '/bookings', label: 'MY BOOKINGS' },
  { path: '/help', label: 'HELP DESK' },
];

export default function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`sidebar glass-card ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">FL</div>
          <span className="brand-name">FANLOCK</span>
        </div>

        <nav className="sidebar-nav">
          {MENU_ITEMS.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <style>{`
        .sidebar {
          width: 280px;
          height: calc(100vh - 40px);
          margin: 20px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 20px;
          z-index: 100;
          padding: 24px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mobile-toggle {
          display: none;
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          width: 48px;
          height: 48px;
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 14px;
          box-shadow: var(--shadow-soft);
          font-size: 1.2rem;
          cursor: pointer;
        }

        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.1);
          backdrop-filter: blur(4px);
          z-index: 95;
          animation: fadeIn 0.3s ease;
        }

        @media (max-width: 1024px) {
          .sidebar {
            position: fixed;
            left: -320px;
            top: 0;
            margin: 0;
            height: 100vh;
            border-radius: 0;
            z-index: 1001;
            box-shadow: 20px 0 50px rgba(0,0,0,0.1);
          }
          .sidebar.open {
            left: 0;
          }
          .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          margin-bottom: 40px;
        }

        .brand-logo {
          width: 36px;
          height: 36px;
          background: var(--primary-gradient);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.2rem;
        }

        .brand-name {
          font-weight: 800;
          letter-spacing: 2px;
          font-size: 1rem;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 16px;
          text-decoration: none;
          color: var(--text-dim);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s ease;
        }

        .nav-item:hover {
          background: rgba(0,0,0,0.02);
          color: var(--text-primary);
        }

        .nav-item.active {
          background: white;
          color: var(--primary);
          box-shadow: var(--shadow-soft);
        }

        .nav-icon {
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid rgba(0,0,0,0.05);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: #E5E5E0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .user-name {
          font-weight: 700;
          font-size: 0.85rem;
        }

        .user-role {
          font-size: 0.7rem;
          color: var(--text-dim);
        }

        .notification-dot {
          position: absolute;
          top: 0;
          right: 0;
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
          border: 2px solid white;
        }
      `}</style>
    </>
  );
}
