const DB_NAME = 'EventGatewayDB';
const DB_VERSION = 1;

const STORES = {
  events: 'events',
  bookings: 'bookings',
  gates: 'gates',
  parkingSlots: 'parkingSlots',
  helpRequests: 'helpRequests',
};

let dbInstance = null;

function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains(STORES.events)) {
        const eventStore = db.createObjectStore(STORES.events, { keyPath: 'id' });
        eventStore.createIndex('status', 'status', { unique: false });
        eventStore.createIndex('date', 'date', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.bookings)) {
        const bookingStore = db.createObjectStore(STORES.bookings, { keyPath: 'id' });
        bookingStore.createIndex('eventId', 'eventId', { unique: false });
        bookingStore.createIndex('ticketNumber', 'ticketNumber', { unique: true });
        bookingStore.createIndex('status', 'status', { unique: false });
        bookingStore.createIndex('phone', 'phone', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.gates)) {
        const gateStore = db.createObjectStore(STORES.gates, { keyPath: 'id' });
        gateStore.createIndex('eventId', 'eventId', { unique: false });
        gateStore.createIndex('status', 'status', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.parkingSlots)) {
        const parkingStore = db.createObjectStore(STORES.parkingSlots, { keyPath: 'id' });
        parkingStore.createIndex('eventId', 'eventId', { unique: false });
        parkingStore.createIndex('zone', 'zone', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.helpRequests)) {
        const helpStore = db.createObjectStore(STORES.helpRequests, { keyPath: 'id' });
        helpStore.createIndex('bookingId', 'bookingId', { unique: false });
        helpStore.createIndex('status', 'status', { unique: false });
      }
    };

    request.onsuccess = (e) => {
      dbInstance = e.target.result;
      resolve(dbInstance);
    };

    request.onerror = (e) => {
      reject(e.target.error);
    };
  });
}

// Generic CRUD operations

async function dbOp(storeName, mode, operation) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    const request = operation(store);
    request.onsuccess = () => resolve(request.result !== undefined ? request.result : true);
    request.onerror = (e) => reject(e.target.error);
  });
}

export const addRecord = (storeName, data) => dbOp(storeName, 'readwrite', s => s.add(data)).then(() => data);
export const putRecord = (storeName, data) => dbOp(storeName, 'readwrite', s => s.put(data)).then(() => data);
export const getRecord = (storeName, id) => dbOp(storeName, 'readonly', s => s.get(id));
export const getAllRecords = (storeName) => dbOp(storeName, 'readonly', s => s.getAll()).then(res => res || []);
export const deleteRecord = (storeName, id) => dbOp(storeName, 'readwrite', s => s.delete(id));
export const getByIndex = (storeName, indexName, value) => dbOp(storeName, 'readonly', s => s.index(indexName).getAll(value)).then(res => res || []);
export const clearStore = (storeName) => dbOp(storeName, 'readwrite', s => s.clear());

export { STORES, openDB };
