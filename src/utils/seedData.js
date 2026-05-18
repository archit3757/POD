import { addRecord, getAllRecords, putRecord, STORES, getByIndex } from '../db/indexedDB';
import { generateId, SLOT_TIMES, PARKING_ZONES } from './helpers';

// Sample events for testing
const SAMPLE_EVENTS = [
  {
    id: 'evt-ipl-2026',
    name: 'INDIAN CRICKET FANS & VIRAT KOHLI - STAND UP COMEDY BY AAKASH GUPTA',
    type: 'Performance',
    date: '2026-05-15',
    venue: 'Wankhede Stadium, Mumbai',
    status: 'active',
    description: 'Stand-up comedy special for Indian Cricket Fans & Virat Kohli fans by Aakash Gupta.',
    categories: ['general', 'vip', 'vvip', 'platinum'],
    totalCapacity: 800,
    image: 'ipl',
    price: 1500,
  },
  {
    id: 'evt-arijit-2026',
    name: 'get-on-stage-perform-standup-comedy by SamMELAnam',
    type: 'Performance',
    date: '2026-06-20',
    venue: 'NSCI Dome, Mumbai',
    status: 'active',
    description: 'SamMELAnam presents Season 21 of Open Mic Stand-Up Comedy and Performances.',
    categories: ['general', 'vip', 'vvip'],
    totalCapacity: 600,
    image: 'concert',
    price: 999,
  },
  {
    id: 'evt-techsummit-2026',
    name: 'RCB vs CSK - IPL 18 May 2026',
    type: 'Sports',
    date: '2026-05-18',
    venue: 'Pragati Maidan, Delhi',
    status: 'active',
    description: 'Special screening/event for the electrifying IPL clash between RCB and CSK.',
    categories: ['general', 'vip'],
    totalCapacity: 500,
    image: 'summit',
    price: 2299,
  },
  {
    id: 'evt-dandiya-2026',
    name: 'SOCIAL SAILOR - TRIPPY ART - MIND.BEND.ART',
    type: 'Art',
    date: '2026-10-02',
    venue: 'GMDC Ground, Ahmedabad',
    status: 'active',
    description: 'Experience unique visual trippy art and immersive musical journey by Social Sailor.',
    categories: ['general', 'vip', 'vvip'],
    totalCapacity: 1000,
    image: 'dance',
    price: 999,
  },
  {
    id: 'evt-comedy-2026',
    name: 'Sunidhi Chauhan - I AM HOME INDIA TOUR 2025-26',
    type: 'Concert',
    date: '2026-08-05',
    venue: 'Canvas Laugh Club, Mumbai',
    status: 'active',
    description: 'Watch the legendary Sunidhi Chauhan live on her mega I AM HOME India Tour.',
    categories: ['general', 'vip'],
    totalCapacity: 300,
    image: 'performance',
    price: 3000,
  },
];

function createGatesForEvent(eventId, totalCapacity) {
  const gateNames = ['Gate A – North Entry', 'Gate B – East Entry', 'Gate C – South Entry', 'Gate D – West Entry'];
  const perGateCapacity = Math.ceil(totalCapacity / gateNames.length);

  return gateNames.map((name, idx) => {
    const capacityBySlot = {};
    const currentBookingsBySlot = {};
    SLOT_TIMES.forEach(slot => {
      capacityBySlot[slot.id] = Math.ceil(perGateCapacity / SLOT_TIMES.length);
      currentBookingsBySlot[slot.id] = 0;
    });

    return {
      id: `${eventId}-gate-${idx}`,
      eventId,
      name,
      capacityBySlot,
      currentBookingsBySlot,
      status: 'open',
    };
  });
}

function createParkingForEvent(eventId, totalCapacity) {
  const parkingPerZone = Math.ceil(totalCapacity / PARKING_ZONES.length / 2);

  return PARKING_ZONES.map((zone, idx) => ({
    id: `${eventId}-parking-${idx}`,
    eventId,
    zone,
    capacity: parkingPerZone,
    assignedBookingIds: [],
  }));
}

export async function seedData() {
  const existingEvents = await getAllRecords(STORES.events);
  if (existingEvents.length > 0) {
    // Always sync the updated sample event names/details in the database
    for (const event of SAMPLE_EVENTS) {
      await putRecord(STORES.events, event);
    }
    return;
  }

  for (const event of SAMPLE_EVENTS) {
    await addRecord(STORES.events, event);

    const gates = createGatesForEvent(event.id, event.totalCapacity);
    for (const gate of gates) {
      await addRecord(STORES.gates, gate);
    }

    const parking = createParkingForEvent(event.id, event.totalCapacity);
    for (const slot of parking) {
      await addRecord(STORES.parkingSlots, slot);
    }
  }

  // Add sample bookings
  const sampleBookings = [
    {
      id: generateId(),
      eventId: 'evt-ipl-2026',
      userName: 'Rahul Sharma',
      phone: '9876543210',
      category: 'vip',
      gate: 'evt-ipl-2026-gate-0',
      slot: 'slot-1',
      parkingZone: 'evt-ipl-2026-parking-0',
      ticketNumber: 'EVT-IPLDMO-XYZW',
      qrValue: btoa('EVT-IPLDMO-XYZW::sample::token'),
      wristbandStatus: 'inactive',
      assistanceRequired: false,
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      eventId: 'evt-arijit-2026',
      userName: 'Priya Patel',
      phone: '9123456789',
      category: 'general',
      gate: 'evt-arijit-2026-gate-1',
      slot: 'slot-5',
      parkingZone: 'evt-arijit-2026-parking-1',
      ticketNumber: 'EVT-ARIJIT-ABCD',
      qrValue: btoa('EVT-ARIJIT-ABCD::sample::token'),
      wristbandStatus: 'inactive',
      assistanceRequired: true,
      assistanceNote: 'Wheelchair access required',
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
    },
  ];

  for (const booking of sampleBookings) {
    await addRecord(STORES.bookings, booking);
    // Update gate count
    const gate = await import('../db/indexedDB').then(m => m.getRecord(STORES.gates, booking.gate));
    if (gate) {
      gate.currentBookingsBySlot[booking.slot] = (gate.currentBookingsBySlot[booking.slot] || 0) + 1;
      await putRecord(STORES.gates, gate);
    }
    // Update parking
    const parking = await import('../db/indexedDB').then(m => m.getRecord(STORES.parkingSlots, booking.parkingZone));
    if (parking) {
      parking.assignedBookingIds.push(booking.id);
      await putRecord(STORES.parkingSlots, parking);
    }
  }
}
