import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { getAllRecords, getRecord, addRecord, putRecord, clearStore, STORES } from '../db/indexedDB';
import { generateId, formatDate } from '../utils/helpers';
import { useToast } from '../context/ToastContext';

import imgIpl from '../assets/maxresdefault.jpg';
import imgConcert from '../assets/et00495970-gsdpdcwpeh-landscape.avif';
import imgSummit from '../assets/images.jpeg';
import imgDance from '../assets/media-mobile-trippy-art-date-mumbai-2026-2-12-t-14-2-22.avif';
import imgHero from '../assets/ffe7da85cf0ecf4cb6a301c569034b901761804449108402_original.jpeg';

const EVENT_IMAGES = {
  ipl: imgIpl,
  concert: imgConcert,
  summit: imgSummit,
  dance: imgDance,
  performance: imgHero
};

const getEventPrice = (event) => {
  if (!event) return 1500;
  if (event.price !== undefined) return event.price;
  const prices = {
    'evt-arijit-2026': 999,
    'evt-comedy-2026': 3000,
    'evt-dandiya-2026': 999,
    'evt-techsummit-2026': 2299,
    'evt-ipl-2026': 1500
  };
  return prices[event.id] || 1500;
};

// --- Constants ---
const ADDONS = [
  { id: 'guide', name: 'Guide to Seat', desc: 'Personal assistance to your seat', price: 250, free: false },
  { id: 'wheelchair', name: 'Wheelchair', desc: 'Complimentary mobility support', price: 0, free: true },
  { id: 'priority', name: 'Priority Entry', desc: 'Skip the main queue', price: 500, free: false },
  { id: 'refreshments', name: 'Refreshments Pack', desc: 'Pre-booked snacks & drinks', price: 750, free: false },
];

const GATES = ['GATE A1', 'GATE A2', 'GATE B1', 'GATE B2', 'GATE C1'];

const PARKING_ZONES = [
  { id: 'far-1', name: 'Zone P-9 (Remote)', dist: '1.2 km', price: 0, base: true },
  { id: 'mid-1', name: 'Zone P-4 (Standard)', dist: '600 m', price: 200, base: false },
  { id: 'near-1', name: 'Zone P-1 (Premium)', dist: '150 m', price: 500, base: false },
  { id: 'vip-1', name: 'VIP Deck', dist: '50 m', price: 1000, base: false },
];

const MOCK_PEOPLE = [
  { id: 'p1', name: 'Archit Jain', aadhaar: 'XXXXXXXX1234', verified: true },
];

// --- Events ---
export function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const data = await getAllRecords(STORES.events);
      setEvents(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = events.filter(e => {
    if (filter !== 'all' && e.type.toLowerCase() !== filter) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="section-fade-in">
      <div className="page-header">
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px' }}>EXPLORE EVENTS</h1>
        <p style={{ color: 'var(--text-dim)', letterSpacing: '2px', fontWeight: '600' }}>SELECT YOUR NEXT EXPERIENCE</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '60px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: '1 1 300px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>🔍</span>
          <input 
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', flex: 1, outline: 'none', fontWeight: '600' }}
            placeholder="Search events..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="filter-tabs" style={{ flexWrap: 'wrap' }}>
          {['all', 'concert', 'sports', 'festival'].map(f => (
            <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
        {filtered.map(ev => (
          <div key={ev.id} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '240px', background: ev.image && EVENT_IMAGES[ev.image] ? `url(${EVENT_IMAGES[ev.image]}) center/contain no-repeat` : 'var(--primary-gradient)', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>
            </div>
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.3' }}>{ev.name.toUpperCase()}</h3>
                <div style={{ display: 'flex' }}>
                  <span className="verified-badge" style={{ background: 'rgba(255, 95, 109, 0.1)', color: 'var(--primary)' }}>
                    {ev.type.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  <span>📅</span> {formatDate(ev.date)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  <span>📍</span> {ev.venue}
                </div>
                <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.2rem' }}>₹{getEventPrice(ev)}</div>
              </div>
              <button className="btn-premium" style={{ width: '100%' }} onClick={() => navigate('/book', { state: { eventId: ev.id } })}>BOOK ACCESS</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- BookTicket ---
export function BookTicket() {
  const [step, setStep] = useState(1);
  const [people, setPeople] = useState(MOCK_PEOPLE);
  const [selectedPeopleIds, setSelectedPeopleIds] = useState([]);
  const [newPerson, setNewPerson] = useState({ name: '', aadhaar: '', verifying: false, otp: '', otpSent: false });
  
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedGate, setSelectedGate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  
  const [parking, setParking] = useState(null); 
  const [selectedAddons, setSelectedAddons] = useState([]);
  
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getAllRecords(STORES.events).then(setEvents);
  }, []);

  const event = useMemo(() => events.find(e => e.id === selectedEventId), [events, selectedEventId]);

  const bill = useMemo(() => {
    const count = selectedPeopleIds.length;
    if (!event) {
      return { base: 0, parkExtra: 0, addonsTotal: 0, taxes: 0, total: 0 };
    }
    const base = getEventPrice(event) * count;
    const parkExtra = parking?.price || 0;
    const addonsTotal = selectedAddons.reduce((sum, id) => {
      const addon = ADDONS.find(a => a.id === id);
      if (!addon) return sum;
      const price = addon.id === 'refreshments' ? addon.price * count : addon.price;
      return sum + price;
    }, 0);
    const subtotal = base + parkExtra + addonsTotal;
    const taxes = Math.round(subtotal * 0.08);
    return { base, parkExtra, addonsTotal, taxes, total: subtotal + taxes };
  }, [event, selectedPeopleIds, parking, selectedAddons]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleAddPerson = () => {
    if (people.length >= 10) return;
    setNewPerson({ name: '', aadhaar: '', verifying: true, otp: '', otpSent: false });
  };

  const verifyPerson = () => {
    if (newPerson.otp === '123456') {
      const verified = {
        id: generateId(),
        name: newPerson.name,
        aadhaar: 'XXXXXXXX ' + newPerson.aadhaar.replace(/\s/g, '').slice(-4),
        verified: true
      };
      setPeople([...people, verified]);
      setSelectedPeopleIds([...selectedPeopleIds, verified.id]);
      setNewPerson({ name: '', aadhaar: '', verifying: false, otp: '', otpSent: false });
      addToast('Identity Verified Successfully', 'success');
    } else {
      addToast('Invalid OTP. Use 123456', 'error');
    }
  };

  const togglePerson = (id) => {
    if (selectedPeopleIds.includes(id)) {
      setSelectedPeopleIds(selectedPeopleIds.filter(i => i !== id));
    } else {
      if (selectedPeopleIds.length < 5) setSelectedPeopleIds([...selectedPeopleIds, id]);
      else addToast('Maximum 5 people per booking', 'warning');
    }
  };

  const handleGateSelect = (g) => {
    setSelectedGate(g);
    const baseParking = PARKING_ZONES.find(p => p.base);
    setParking(baseParking);
  };

  const finalizeBooking = async () => {
    const id = generateId();
    const ticketNumber = `FL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Minified Stateless data object for smaller QR density
    const minifiedData = {
      i: id.slice(0, 8),
      t: ticketNumber,
      en: event.name,
      ev: event.venue,
      ed: event.date,
      p: people.filter(p => selectedPeopleIds.includes(p.id)).map(p => ({ n: p.name, a: p.aadhaar })),
      s: selectedSeats,
      g: selectedGate,
      sl: selectedSlot,
      pk: { n: parking?.name, d: parking?.dist },
      ad: selectedAddons,
      tt: bill.total,
      ba: new Date().toISOString()
    };

    // Robust Base64 Encoding (UTF-8 compatible)
    const encodedData = btoa(unescape(encodeURIComponent(JSON.stringify(minifiedData))));
    const ticketUrl = `${window.location.origin}/ticket?data=${encodedData}`;

    const newBooking = {
      id,
      ticketNumber,
      eventId: selectedEventId,
      status: 'confirmed',
      bookedAt: minifiedData.ba,
      qrValue: ticketUrl,
      encodedData,
      selectedPeople: minifiedData.p.map(p => ({ name: p.n, aadhaar: p.a })),
      selectedGate,
      selectedSlot,
      parking,
      selectedAddons,
      selectedSeats,
      bill,
      eventName: event.name,
      eventVenue: event.venue,
      eventDate: event.date
    };

    await addRecord(STORES.bookings, newBooking);
    addToast('Booking Initialized Successfully', 'success');
    navigate(`/ticket?data=${encodedData}`);
  };

  return (
    <div className="section-fade-in" style={{ paddingBottom: '120px' }}>
      <div className="step-indicator" style={{ display: 'flex', gap: '12px', marginBottom: '40px', justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5, 6].map(s => (
          <div key={s} className={`step-dot ${step >= s ? 'active' : ''}`} style={{ 
            width: '12px', height: '12px', borderRadius: '50%', 
            background: step >= s ? 'var(--primary)' : 'rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}></div>
        ))}
      </div>

      <div className={`booking-container ${step === 7 ? 'full-width' : ''}`}>
        <div className="glass-card" style={{ padding: '40px' }}>
          
          {step === 1 && (
            <div className="section-fade-in">
              <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '8px' }}>IDENTITY SELECTION</h2>
              <p style={{ color: 'var(--text-dim)', marginBottom: '32px' }}>Select verified attendees for this mission. (Max 5)</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {people.map((p, i) => (
                  <div 
                    key={p.id} 
                    className={`glass-card ${selectedPeopleIds.includes(p.id) ? 'active-border' : ''}`} 
                    style={{ 
                      display: 'flex', alignItems: 'center', padding: '16px 24px', background: 'white', 
                      cursor: 'pointer', border: selectedPeopleIds.includes(p.id) ? '1px solid var(--primary)' : '1px solid rgba(0,0,0,0.05)'
                    }}
                    onClick={() => togglePerson(p.id)}
                  >
                    <span style={{ width: '30px', fontWeight: '800', color: 'var(--text-dim)' }}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700' }}>{p.name.toUpperCase()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '1px' }}>{p.aadhaar}</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={selectedPeopleIds.includes(p.id)} 
                      onChange={(e) => { e.stopPropagation(); togglePerson(p.id); }}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                    />
                  </div>
                ))}

                {newPerson.verifying && (
                  <div className="glass-card section-fade-in" style={{ padding: '24px', border: '1px dashed var(--primary)', background: 'rgba(255,95,109,0.02)' }}>
                    {!newPerson.otpSent ? (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input className="premium-input" placeholder="FULL NAME" value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} />
                        <input 
                          className="premium-input" 
                          placeholder="0000 0000 0000" 
                          maxLength={14} 
                          value={newPerson.aadhaar} 
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '');
                            const formatted = val.replace(/(.{4})/g, '$1 ').trim();
                            setNewPerson({...newPerson, aadhaar: formatted});
                          }} 
                        />
                        {newPerson.aadhaar.replace(/\s/g, '').length === 12 && newPerson.name.length > 2 && (
                          <button className="btn-premium" onClick={() => setNewPerson({...newPerson, otpSent: true})}>VERIFY</button>
                        )}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '12px' }}>MOCK OTP SENT TO LINKED MOBILE</div>
                        <input 
                          className="premium-input" 
                          style={{ textAlign: 'center', letterSpacing: '8px', maxWidth: '200px', margin: '0 auto 16px' }} 
                          placeholder="000000" 
                          maxLength={6}
                          value={newPerson.otp} 
                          onChange={e => setNewPerson({...newPerson, otp: e.target.value.replace(/\D/g, '')})} 
                        />
                        <button 
                          className="btn-premium" 
                          disabled={newPerson.otp.length !== 6} 
                          onClick={verifyPerson}
                        >
                          CONFIRM IDENTITY
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!newPerson.verifying && (
                <button className="glass-card" style={{ width: '100%', padding: '20px', border: '1px dashed rgba(0,0,0,0.1)', cursor: 'pointer' }} onClick={handleAddPerson}>
                  <span style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>+</span>
                </button>
              )}

              <button className="btn-premium" style={{ width: '100%', marginTop: '40px' }} disabled={selectedPeopleIds.length === 0} onClick={nextStep}>CONTINUE TO EVENTS</button>
            </div>
          )}

          {step === 2 && (
            <div className="section-fade-in">
              <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '32px' }}>SELECT MISSION</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {events.map(ev => (
                  <div key={ev.id} className={`glass-card ${selectedEventId === ev.id ? 'active-border' : ''}`} style={{ 
                    padding: '0', overflow: 'hidden', cursor: 'pointer', border: selectedEventId === ev.id ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.05)'
                  }} onClick={() => setSelectedEventId(ev.id)}>
                    <div style={{ height: '140px', background: ev.image && EVENT_IMAGES[ev.image] ? `url(${EVENT_IMAGES[ev.image]}) center/contain no-repeat` : 'var(--primary-gradient)' }}></div>
                    <div style={{ padding: '20px' }}>
                      <div style={{ fontWeight: '800', fontSize: '1rem' }}>{ev.name.toUpperCase()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>{ev.venue} • ₹{getEventPrice(ev)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <button className="action-btn" style={{ flex: 1 }} onClick={prevStep}>BACK</button>
                <button className="btn-premium" style={{ flex: 1 }} disabled={!selectedEventId} onClick={nextStep}>CONFIRM EVENT</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="section-fade-in seating-container">
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div className="stage-bar"></div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '4px', color: 'var(--text-dim)', fontWeight: '800' }}>STAGE</div>
              </div>

              <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.2rem' }}>♿</span>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>Accessible seating</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>(wheelchair · ramp access)</div>
                  </div>
                </div>
              </div>

              <div className="seat-grid-new">
                {['A', 'B', 'C', 'D'].map(row => (
                  <div key={row} style={{ display: 'contents' }}>
                    <div className="seat-row-label">{row}</div>
                    {Array.from({ length: 8 }).map((_, i) => {
                      const seatId = `${row}${i + 1}`;
                      const isTaken = (row === 'A' && (i === 2 || i === 3)) || (row === 'B' && i === 5) || (row === 'C' && (i === 1 || i === 6)) || (row === 'D' && (i === 0 || i === 4));
                      const isAccessible = (row === 'A' && (i === 0 || i === 7)) || (row === 'D' && (i === 1 || i === 7));
                      const isSelected = selectedSeats.includes(seatId);

                      return (
                        <div 
                          key={seatId}
                          className={`seat-new ${isTaken ? 'taken' : ''} ${isAccessible ? 'accessible' : ''} ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            if (isTaken) return;
                            const s = [...selectedSeats];
                            if (isSelected) s.splice(s.indexOf(seatId), 1);
                            else if (s.length < selectedPeopleIds.length) s.push(seatId);
                            setSelectedSeats(s);
                          }}
                        >
                          {i + 1}
                          {isAccessible && <span className="seat-icon-top">♿</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '48px', flexWrap: 'wrap' }}>
                <div className="legend-item"><div className="legend-dot" style={{ background: '#FEF9F0', border: '1px solid #FFA50033' }}></div> Available</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: '#FFF0F0', border: '1px solid #FF5F6D33' }}></div> Accessible</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: '#FFA500' }}></div> Selected</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: '#E5E5E0' }}></div> Taken</div>
              </div>

              <div className="emergency-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '1.2rem', color: '#288041' }}>🏛️</span>
                  <div style={{ fontWeight: '900', fontSize: '1rem', color: '#1A1A1A' }}>Emergency exits & medical aid</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                  <div className="exit-chip">🏛️ Exit A — Row A left</div>
                  <div className="exit-chip">🏛️ Exit B — Row A right</div>
                  <div className="exit-chip">🏛️ Exit C — Row D left</div>
                  <div className="exit-chip">🏛️ Exit D — Row D right</div>
                </div>
                <div style={{ display: 'flex', gap: '12px', padding: '0 8px' }}>
                  <span style={{ color: '#FF5F6D' }}>❤️</span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Step-free medical aid station near Exit C. Trained first-responders on standby for medically unfit guests.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '60px' }}>
                <button className="action-btn" style={{ flex: 1 }} onClick={prevStep}>BACK</button>
                <button className="btn-premium" style={{ flex: 1 }} disabled={selectedSeats.length !== selectedPeopleIds.length} onClick={nextStep}>SECURE SEATS</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="section-fade-in">
              <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '32px' }}>ENTRY LOGISTICS</h2>
              
              <h3 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px' }}>SELECT ARRIVAL GATE</h3>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
                {GATES.map(g => (
                  <button key={g} className={`action-btn ${selectedGate === g ? 'active-btn' : ''}`} style={{ 
                    flex: '1 1 120px', borderColor: selectedGate === g ? 'var(--primary)' : 'rgba(0,0,0,0.05)',
                    background: selectedGate === g ? 'rgba(255,95,109,0.05)' : 'white'
                  }} onClick={() => handleGateSelect(g)}>{g}</button>
                ))}
              </div>

              {selectedGate && (
                <div className="section-fade-in">
                  <h3 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px' }}>SELECT ARRIVAL SLOT (30 MIN INTERVALS)</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {['17:00 - 17:30', '17:30 - 18:00', '18:00 - 18:30', '18:30 - 19:00', '19:00 - 19:30', '19:30 - 20:00'].map((slot, idx) => {
                      const gateIdx = GATES.indexOf(selectedGate);
                      const base = (gateIdx + 1) * 3;
                      const occupied = Math.min(28, base + (idx * 2) + (gateIdx * 2) + 2);
                      const pct = Math.round((occupied / 30) * 100);
                      
                      return (
                        <button key={slot} className="glass-card" style={{ 
                          padding: '16px', textAlign: 'left', border: selectedSlot === slot ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.05)',
                          background: selectedSlot === slot ? 'rgba(255,95,109,0.05)' : 'white'
                        }} onClick={() => setSelectedSlot(slot)}>
                          <div style={{ fontWeight: '700' }}>{slot}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{occupied} / 30 SLOTS OCCUPIED</div>
                          <div className="progress-bar-container" style={{ marginTop: '8px', height: '4px' }}>
                            <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct > 80 ? 'var(--error)' : pct > 50 ? 'var(--warning)' : 'var(--success)' }}></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <button className="action-btn" style={{ flex: 1 }} onClick={prevStep}>BACK</button>
                <button className="btn-premium" style={{ flex: 1 }} disabled={!selectedSlot} onClick={nextStep}>CONFIRM LOGISTICS</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="section-fade-in">
              <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '32px' }}>ENHANCEMENTS</h2>
              
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px' }}>PARKING DEPLOYMENT</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {PARKING_ZONES.map(p => (
                    <div key={p.id} className="glass-card" style={{ 
                      display: 'flex', alignItems: 'center', padding: '16px 24px', background: 'white',
                      border: parking?.id === p.id ? '2px solid var(--primary)' : '1px solid rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700' }}>{p.name} {p.base && '(ASSIGNED)'}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{p.dist} FROM GATE • {p.price === 0 ? 'FREE' : `+ ₹${p.price}`}</div>
                      </div>
                      <button className={parking?.id === p.id ? 'btn-premium' : 'action-btn'} style={{ padding: '8px 16px', fontSize: '0.7rem' }} onClick={() => setParking(p)}>
                        {parking?.id === p.id ? 'SELECTED' : 'UPGRADE'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <h3 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '16px' }}>MISSION ADD-ONS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {ADDONS.map(a => (
                  <div 
                    key={a.id} 
                    className={`glass-card ${selectedAddons.includes(a.id) ? 'active-border' : ''}`} 
                    style={{ 
                      padding: '20px', background: 'white', cursor: 'pointer',
                      border: selectedAddons.includes(a.id) ? '1px solid var(--primary)' : '1px solid rgba(0,0,0,0.05)'
                    }}
                    onClick={() => {
                      if (selectedAddons.includes(a.id)) setSelectedAddons(selectedAddons.filter(i => i !== a.id));
                      else setSelectedAddons([...selectedAddons, a.id]);
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{a.name}</div>
                      <input 
                        type="checkbox" 
                        checked={selectedAddons.includes(a.id)}
                        onChange={(e) => e.stopPropagation()}
                        style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
                      />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '12px' }}>{a.desc}</div>
                    <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.85rem' }}>
                      {a.price === 0 ? 'FREE' : (a.id === 'refreshments' ? `₹${a.price * Math.max(1, selectedPeopleIds.length)} (₹${a.price} x ${Math.max(1, selectedPeopleIds.length)})` : `₹${a.price}`)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <button className="action-btn" style={{ flex: 1 }} onClick={prevStep}>BACK</button>
                <button className="btn-premium" style={{ flex: 1 }} onClick={nextStep}>REVIEW BILL</button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="section-fade-in" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '24px' }}>󰄬</div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px' }}>READY FOR THE EVENT</h2>
              <p style={{ color: 'var(--text-dim)', marginBottom: '40px' }}>Review your final statement and initialize the secure pass.</p>
              
              <div className="glass-card" style={{ padding: '32px', textAlign: 'left', background: 'white', marginBottom: '40px' }}>
                <div style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '800' }}>EVENT</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{event?.name}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: '800' }}>ATTENDEES</div>
                    <div style={{ fontWeight: '700' }}>{selectedPeopleIds.length} Persons</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: '800' }}>SEATS</div>
                    <div style={{ fontWeight: '700' }}>{selectedSeats.join(', ')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: '800' }}>LOGISTICS</div>
                    <div style={{ fontWeight: '700' }}>{selectedGate} • {selectedSlot}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: '800' }}>PARKING</div>
                    <div style={{ fontWeight: '700' }}>{parking?.name}</div>
                  </div>
                </div>
              </div>

              <button className="btn-premium" style={{ width: '100%', fontSize: '1.1rem' }} onClick={finalizeBooking}>FINALIZE BILL & PAY ₹{bill.total}</button>
            </div>
          )}

        </div>

        <aside style={{ position: 'sticky', top: '40px', height: 'fit-content' }}>
          <div className="glass-card" style={{ padding: '32px', background: 'white' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', marginBottom: '24px', borderBottom: '2px solid var(--primary)', paddingBottom: '12px' }}>MISSION INVOICE</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Base Ticket (x{selectedPeopleIds.length})</span>
                <span style={{ fontWeight: '700' }}>₹{bill.base}</span>
              </div>
              {parking?.price > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Parking Upgrade</span>
                  <span style={{ fontWeight: '700' }}>₹{bill.parkExtra}</span>
                </div>
              )}
              {selectedAddons.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Add-ons</span>
                  <span style={{ fontWeight: '700' }}>₹{bill.addonsTotal}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>GST (8%)</span>
                <span style={{ fontWeight: '700' }}>₹{bill.taxes}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '16px', marginTop: '16px' }}>
              <span style={{ fontWeight: '900', fontSize: '1.2rem' }}>TOTAL</span>
              <span style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--primary)' }}>₹{bill.total}</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', marginTop: '20px', background: 'rgba(255,95,109,0.05)', border: '1px solid var(--primary)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '800', letterSpacing: '1px' }}>SECURITY STATUS</div>
            <div style={{ fontWeight: '700', fontSize: '0.85rem', marginTop: '4px' }}>AADHAAR VERIFIED PROTOCOL ACTIVE</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// --- Bookings ---
export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const loadBookings = async () => {
    const b = await getAllRecords(STORES.bookings);
    setBookings(b.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)));
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to delete all past booking history? This cannot be undone.')) {
      await clearStore(STORES.bookings);
      setBookings([]);
      addToast('All booking records cleared', 'success');
    }
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="section-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
        <div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-1px' }}>MY BOOKINGS</h1>
          <p style={{ color: 'var(--text-dim)', letterSpacing: '2px', fontWeight: '600' }}>YOUR SECURE RESERVATIONS</p>
        </div>
        {bookings.length > 0 && (
          <button className="action-btn" style={{ borderColor: 'var(--error)', color: 'var(--error)' }} onClick={handleClear}>
            CLEAR ALL HISTORY
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {bookings.map(b => (
          <div key={b.id} className="glass-card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-dim)', letterSpacing: '1px' }}>{b.ticketNumber}</span>
              <span className="verified-badge">{b.status.toUpperCase()}</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>{b.eventName || '---'}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>{b.eventVenue} • {formatDate(b.eventDate)}</p>
            <button className="action-btn" style={{ width: '100%' }} onClick={() => navigate(`/ticket?data=${b.encodedData}`)}>VIEW DIGITAL PASS</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- TicketPreview ---
export function TicketPreview() {
  const [searchParams] = useSearchParams();
  const dataParam = searchParams.get('data');
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (dataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(dataParam))));
        
        // Map minified keys back to original names
        const mappedData = {
          id: decoded.i,
          ticketNumber: decoded.t,
          eventName: decoded.en,
          eventVenue: decoded.ev,
          eventDate: decoded.ed,
          people: decoded.p.map(p => ({ name: p.n, aadhaar: p.a })),
          seats: decoded.s,
          gate: decoded.g,
          slot: decoded.sl,
          parking: { name: decoded.pk.n, dist: decoded.pk.d },
          addons: decoded.ad,
          total: decoded.tt,
          bookedAt: decoded.ba
        };
        
        setTicketData(mappedData);
      } catch (e) {
        console.error('Decoding failed', e);
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [dataParam]);

  if (error) return (
    <div className="section-fade-in" style={{ textAlign: 'center', padding: '100px' }}>
      <h1 style={{ fontSize: '5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '20px' }}>404</h1>
      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px' }}>VERIFICATION FAILED</h2>
      <p style={{ color: 'var(--text-dim)', marginBottom: '40px' }}>The ticket data is missing, corrupted, or invalid.</p>
      <button className="btn-premium" onClick={() => navigate('/')}>RETURN HOME</button>
    </div>
  );

  if (!ticketData) return <div className="loader"><div className="spinner" /></div>;

  return (
    <div className="section-fade-in" style={{ padding: '40px 0', maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <div className="verified-badge" style={{ marginBottom: '16px', background: 'rgba(255,165,0,0.1)', color: 'orange' }}>
          󰄬 SECURE STATELESS PROTOCOL ACTIVE
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px' }}>DIGITAL PASS</h1>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', background: 'white', marginBottom: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', border: 'none' }}>
        {/* Futuristic Header */}
        <div style={{ padding: '60px 40px', background: 'var(--primary-gradient)', color: 'white', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '24px', right: '40px', fontSize: '0.7rem', fontWeight: '800', opacity: 0.8, letterSpacing: '4px' }}>
            ID: {ticketData.ticketNumber}
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '2px', opacity: 0.9, marginBottom: '8px' }}>OFFICIAL EVENT PASS</div>
          <h2 style={{ fontSize: '4rem', fontWeight: '900', lineHeight: '1', marginBottom: '20px', letterSpacing: '-2px' }}>{ticketData.eventName?.toUpperCase()}</h2>
          <div style={{ display: 'flex', gap: '30px', fontSize: '1rem', fontWeight: '700' }}>
            <span>📅 {formatDate(ticketData.eventDate)}</span>
            <span>📍 {ticketData.eventVenue?.toUpperCase()}</span>
          </div>
          <div style={{ position: 'absolute', bottom: '-15px', right: '40px', width: '30px', height: '30px', background: 'white', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-15px', left: '40px', width: '30px', height: '30px', background: 'white', borderRadius: '50%' }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1px', background: 'rgba(0,0,0,0.05)' }}>
          {/* Detailed Info */}
          <div style={{ padding: '50px 40px', background: 'white' }}>
            <div style={{ marginBottom: '50px' }}>
              <h3 style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '3px', fontWeight: '900', marginBottom: '24px' }}>VERIFIED ATTENDEES</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {ticketData.people?.map((p, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', background: 'var(--bg-primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--primary)', fontSize: '1.1rem' }}>
                      {p.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '800', fontSize: '1.05rem' }}>{p.name.toUpperCase()}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '1px' }}>{p.aadhaar}</div>
                    </div>
                    <div className="verified-badge" style={{ fontSize: '0.65rem' }}>󰄬 IDENTITY SECURED</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '50px' }}>
              <div>
                <h3 style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '2px', fontWeight: '900', marginBottom: '10px' }}>ASSIGNED SEATS</h3>
                <div style={{ fontWeight: '900', fontSize: '1.8rem', color: 'var(--primary)', letterSpacing: '-1px' }}>{ticketData.seats?.join(', ')}</div>
              </div>
              <div>
                <h3 style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '2px', fontWeight: '900', marginBottom: '10px' }}>GATE & LOGISTICS</h3>
                <div style={{ fontWeight: '900', fontSize: '1.8rem', letterSpacing: '-1px' }}>{ticketData.gate}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: '700', marginTop: '4px' }}>SLOT: {ticketData.slot}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <h3 style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '2px', fontWeight: '900', marginBottom: '10px' }}>PARKING ZONE</h3>
                <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{ticketData.parking?.name?.toUpperCase()}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '600' }}>{ticketData.parking?.dist} WALK TO GATE</div>
              </div>
              {ticketData.addons?.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '2px', fontWeight: '900', marginBottom: '10px' }}>EXPERIENCE ADD-ONS</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {ticketData.addons.map(aid => (
                      <span key={aid} style={{ fontSize: '0.65rem', background: 'var(--bg-primary)', padding: '6px 12px', borderRadius: '8px', fontWeight: '800', border: '1px solid rgba(0,0,0,0.03)' }}>
                        {ADDONS.find(a => a.id === aid)?.name.toUpperCase() || aid.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Scan Panel */}
          <div style={{ padding: '50px 40px', background: 'rgba(0,0,0,0.015)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderLeft: '2px dashed rgba(0,0,0,0.05)' }}>
            <div className="floating" style={{ background: 'white', padding: '24px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', marginBottom: '30px' }}>
              <QRCodeSVG value={`${window.location.origin}/ticket?data=${dataParam}`} size={240} level="M" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '900', fontSize: '0.8rem', letterSpacing: '3px', color: 'var(--text-dim)', marginBottom: '8px' }}>AUTHENTIC PASS</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', opacity: 0.5, fontWeight: '700' }}>PROTOCOL v2.5-STLS</div>
            </div>
          </div>
        </div>

        {/* Dynamic Payment Footer */}
        <div style={{ padding: '40px', background: '#fdfdfd', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: '900', letterSpacing: '1px' }}>PAYMENT STATUS</div>
            <div style={{ fontWeight: '900', fontSize: '1.1rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)' }}></span>
              ₹{ticketData.total?.toLocaleString()} PAID
            </div>
          </div>
          <button className="btn-premium" style={{ padding: '16px 40px' }} onClick={() => window.print()}>GENERATE PDF PASS</button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '12px', color: 'var(--primary)' }}>SECURITY CLEARANCE REQUIRED</h3>
        <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          This pass is protected by biometric identity verification. The QR contains a stateless encrypted token. 
          Physical Aadhaar cards must be presented by all listed attendees for final gate entry.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '60px' }}>
        <button className="action-btn" style={{ padding: '14px 40px', fontSize: '0.9rem' }} onClick={() => navigate('/')}>RETURN TO DASHBOARD</button>
      </div>
    </div>
  );
}