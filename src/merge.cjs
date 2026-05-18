const fs = require('fs');
const path = require('path');

const srcDir = '/Users/architjain/Desktop/POD_maybe/src/pages';

function merge(files, outName) {
  let allCode = [];
  
  for (const file of files) {
    let content = fs.readFileSync(path.join(srcDir, file), 'utf8');
    // Remove imports
    content = content.replace(/^import.*$/gm, '');
    // Change default export
    content = content.replace(/export default function/g, 'export function');
    allCode.push(`// --- ${file.replace('.jsx', '')} ---\n${content.trim()}`);
  }

  return allCode.join('\n\n');
}

const ticketsCode = merge(['BookTicket.jsx', 'Bookings.jsx', 'TicketPreview.jsx'], 'Tickets.jsx');
const opsCode = merge(['GatesView.jsx', 'ParkingView.jsx', 'HelpDesk.jsx'], 'Operations.jsx');
const adminCode = merge(['AdminPanel.jsx', 'Events.jsx'], 'Admin.jsx');

const ticketsImports = `import { useState, useEffect } from 'react';\nimport { useNavigate, useParams } from 'react-router-dom';\nimport { QRCodeSVG } from 'qrcode.react';\nimport { getAllRecords, addRecord, putRecord, getRecord, deleteRecord, STORES } from '../db/indexedDB';\nimport { generateId, generateTicketNumber, generateQRValue, SLOT_TIMES, TICKET_CATEGORIES, formatDate } from '../utils/helpers';\nimport { useToast } from '../context/ToastContext';\n\n`;

const opsImports = `import { useState, useEffect } from 'react';\nimport { getAllRecords, addRecord, putRecord, STORES } from '../db/indexedDB';\nimport { SLOT_TIMES, generateId } from '../utils/helpers';\nimport { useToast } from '../context/ToastContext';\n\n`;

const adminImports = `import { useState, useEffect } from 'react';\nimport { getAllRecords, putRecord, addRecord, deleteRecord, STORES, clearStore } from '../db/indexedDB';\nimport { SLOT_TIMES, TICKET_CATEGORIES, formatDate, getEventTypeEmoji, getStatusColor, generateId, EVENT_TYPES } from '../utils/helpers';\nimport { seedData } from '../utils/seedData';\nimport { useToast } from '../context/ToastContext';\n\n`;

fs.writeFileSync(path.join(srcDir, 'Tickets.jsx'), ticketsImports + ticketsCode);
fs.writeFileSync(path.join(srcDir, 'Operations.jsx'), opsImports + opsCode);
fs.writeFileSync(path.join(srcDir, 'Admin.jsx'), adminImports + adminCode);

// Remove old files
const oldFiles = [
  'BookTicket.jsx', 'Bookings.jsx', 'TicketPreview.jsx',
  'GatesView.jsx', 'ParkingView.jsx', 'HelpDesk.jsx',
  'AdminPanel.jsx', 'Events.jsx'
];
for (const file of oldFiles) {
  fs.unlinkSync(path.join(srcDir, file));
}
console.log('Merged successfully.');
