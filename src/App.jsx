import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import { Events, BookTicket, Bookings, TicketPreview } from './pages/Tickets';
import { GatesView, ParkingView, HelpDesk } from './pages/Operations';
import { ToastProvider } from './context/ToastContext';
import { seedData } from './utils/seedData';

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedData().then(() => setReady(true)).catch(() => setReady(true));
  }, []);

  if (!ready) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/book" element={<BookTicket />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/ticket" element={<TicketPreview />} />
              <Route path="/gates" element={<GatesView />} />
              <Route path="/parking" element={<ParkingView />} />
              <Route path="/help" element={<HelpDesk />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}
