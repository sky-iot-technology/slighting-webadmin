export function parseIsoDate(isoString: string): string {
  const normalized = isoString.replace(/\.(\d{3})\d*(Z|$)/, '.$1$2');
  const date = new Date(normalized);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
