import { format as fnsFormat } from 'date-fns';

/**
 * Safely convert any date-like value to a JS Date object.
 * Handles: Firestore Timestamp, JS Date, ISO string, epoch ms number.
 */
export function toJSDate(val) {
  if (!val) return null;
  if (val instanceof Date) return val;
  if (typeof val === 'string') return new Date(val);
  if (typeof val === 'number') return new Date(val);
  if (typeof val.toDate === 'function') return val.toDate(); // Firestore Timestamp
  if (val.seconds != null) return new Date(val.seconds * 1000); // Firestore-like
  return new Date(val);
}

/**
 * Safely format a date-like value using date-fns format.
 * Returns fallback string if the value is falsy or invalid.
 */
export function formatDate(val, pattern = 'MMM d, h:mm a', fallback = '') {
  const d = toJSDate(val);
  if (!d || isNaN(d.getTime())) return fallback;
  try {
    return fnsFormat(d, pattern);
  } catch {
    return fallback;
  }
}

export { formatDate as format };

/**
 * Get relative time string like "2 hours ago", "3 days ago", "just now"
 */
export function timeAgo(val) {
  const d = toJSDate(val);
  if (!d || isNaN(d.getTime())) return '';
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(val, 'MMM d');
}
