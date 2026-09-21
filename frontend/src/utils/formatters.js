// Currency (PKR), duration, and date formatters used across the app

export function formatPKR(amount) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return mins === 0 ? `${hrs}h` : `${hrs}h ${mins}m`;
}

export function formatDate(dateInput, options = { day: 'numeric', month: 'short', year: 'numeric' }) {
  return new Date(dateInput).toLocaleDateString('en-PK', options);
}
