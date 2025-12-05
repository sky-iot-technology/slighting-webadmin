export const formatDateTimeString = (
  dateTimeString?: string | null
): string => {
  if (!dateTimeString) return '-';
  const date = new Date(dateTimeString);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');

  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');

  const space = '\u00A0\u00A0';
  return `${d}/${m}/${y} ${space} ${Number(h)}:${min}`;
};
