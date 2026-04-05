// US Holidays + Pi Day, Easter, and Black Friday with dates hardcoded through 2030.
// Fixed-date holidays use 'MM-DD' format; variable holidays use 'YYYY-MM-DD'.

const HOLIDAYS = [
  {
    id: 'new-years-day',
    name: "New Year's Day",
    emoji: '🎆',
    // Fixed: January 1
    dates: ['01-01'],
  },
  {
    id: 'mlk-day',
    name: 'Martin Luther King Jr. Day',
    emoji: '✊',
    // 3rd Monday of January
    dates: ['2025-01-20', '2026-01-19', '2027-01-18', '2028-01-17', '2029-01-15', '2030-01-21'],
  },
  {
    id: 'presidents-day',
    name: "Presidents' Day",
    emoji: '🎩',
    // 3rd Monday of February
    dates: ['2025-02-17', '2026-02-16', '2027-02-15', '2028-02-21', '2029-02-19', '2030-02-18'],
  },
  {
    id: 'pi-day',
    name: 'Pi Day',
    emoji: 'π',
    // Fixed: March 14
    dates: ['03-14'],
  },
  {
    id: 'easter',
    name: 'Easter',
    emoji: '🐣',
    // Variable Sunday
    dates: ['2025-04-20', '2026-04-05', '2027-03-28', '2028-04-16', '2029-04-01', '2030-04-21'],
  },
  {
    id: 'memorial-day',
    name: 'Memorial Day',
    emoji: '🎖️',
    // Last Monday of May
    dates: ['2025-05-26', '2026-05-25', '2027-05-31', '2028-05-29', '2029-05-28', '2030-05-27'],
  },
  {
    id: 'juneteenth',
    name: 'Juneteenth',
    emoji: '✊',
    // Fixed: June 19
    dates: ['06-19'],
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    emoji: '🎇',
    // Fixed: July 4
    dates: ['07-04'],
  },
  {
    id: 'labor-day',
    name: 'Labor Day',
    emoji: '🔨',
    // 1st Monday of September
    dates: ['2025-09-01', '2026-09-07', '2027-09-06', '2028-09-04', '2029-09-03', '2030-09-02'],
  },
  {
    id: 'columbus-day',
    name: 'Columbus Day',
    emoji: '⚓',
    // 2nd Monday of October
    dates: ['2025-10-13', '2026-10-12', '2027-10-11', '2028-10-09', '2029-10-14', '2030-10-14'],
  },
  {
    id: 'veterans-day',
    name: 'Veterans Day',
    emoji: '🎗️',
    // Fixed: November 11
    dates: ['11-11'],
  },
  {
    id: 'thanksgiving',
    name: 'Thanksgiving',
    emoji: '🦃',
    // 4th Thursday of November
    dates: ['2025-11-27', '2026-11-26', '2027-11-25', '2028-11-23', '2029-11-22', '2030-11-28'],
  },
  {
    id: 'black-friday',
    name: 'Black Friday',
    emoji: '🛍️',
    // Day after Thanksgiving
    dates: ['2025-11-28', '2026-11-27', '2027-11-26', '2028-11-24', '2029-11-23', '2030-11-29'],
  },
  {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    // Fixed: December 25
    dates: ['12-25'],
  },
];

/**
 * Returns the holiday object for today, or null if today is not a holiday.
 */
export function getTodaysHoliday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const fullDate = `${year}-${month}-${day}`;
  const shortDate = `${month}-${day}`;

  return HOLIDAYS.find(h =>
    h.dates.includes(fullDate) || h.dates.includes(shortDate)
  ) || null;
}

export default HOLIDAYS;
