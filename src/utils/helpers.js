// Generate unique IDs
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Generate a unique ticket number: EVT-XXXXXX-XXXX
export function generateTicketNumber(eventId) {
  const prefix = 'EVT';
  const mid = eventId.substring(0, 6).toUpperCase();
  const suffix = Math.random().toString(36).substr(2, 4).toUpperCase();
  const seq = Date.now().toString(36).substr(-4).toUpperCase();
  return `${prefix}-${mid}-${suffix}${seq}`;
}

// Generate QR value from ticket number
export function generateQRValue(ticketNumber) {
  const token = btoa(`${ticketNumber}::${Date.now()}::${Math.random().toString(36).substr(2)}`);
  return token;
}

// Format date for display
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format time
export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

// Get status color class
export function getStatusColor(status) {
  const map = {
    active: 'status-active',
    confirmed: 'status-confirmed',
    cancelled: 'status-cancelled',
    pending: 'status-pending',
    completed: 'status-completed',
    open: 'status-active',
    closed: 'status-cancelled',
    resolved: 'status-completed',
    full: 'status-cancelled',
    available: 'status-active',
  };
  return map[status?.toLowerCase()] || 'status-default';
}

// Event type icons/emojis
export function getEventTypeEmoji(type) {
  const map = {
    concert: '🎵',
    ipl: '🏏',
    play: '🎭',
    dance: '💃',
    performance: '🎪',
    band: '🎸',
    summit: '🏔️',
    gathering: '🤝',
    festival: '🎉',
    conference: '📢',
    sports: '⚽',
    other: '🎫',
  };
  return map[type?.toLowerCase()] || '🎫';
}

// Slot time ranges
export const SLOT_TIMES = [
  { id: 'slot-1', label: '09:00 AM – 11:00 AM', start: '09:00', end: '11:00' },
  { id: 'slot-2', label: '11:00 AM – 01:00 PM', start: '11:00', end: '13:00' },
  { id: 'slot-3', label: '01:00 PM – 03:00 PM', start: '13:00', end: '15:00' },
  { id: 'slot-4', label: '03:00 PM – 05:00 PM', start: '15:00', end: '17:00' },
  { id: 'slot-5', label: '05:00 PM – 07:00 PM', start: '17:00', end: '19:00' },
  { id: 'slot-6', label: '07:00 PM – 09:00 PM', start: '19:00', end: '21:00' },
];

// Parking zones
export const PARKING_ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D'];

// Event types
export const EVENT_TYPES = [
  'Concert', 'IPL', 'Play', 'Dance', 'Performance',
  'Band', 'Summit', 'Gathering', 'Festival', 'Conference', 'Sports', 'Other'
];

// Categories
export const TICKET_CATEGORIES = [
  { id: 'general', name: 'General', price: 500 },
  { id: 'vip', name: 'VIP', price: 2000 },
  { id: 'vvip', name: 'VVIP', price: 5000 },
  { id: 'platinum', name: 'Platinum', price: 10000 },
];
