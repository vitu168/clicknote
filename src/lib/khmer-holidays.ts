export type HolidayType = 'public' | 'buddhist' | 'royal' | 'cultural' | 'international';

export interface KhmerHoliday {
  date: string;       // "YYYY-MM-DD"
  name: string;       // English name
  nameKh: string;     // Khmer script
  type: HolidayType;
  description?: string;
}

export const KHMER_HOLIDAYS: KhmerHoliday[] = [
  // ── Fixed-date holidays (2025) ──
  { date: '2025-01-01', name: 'International New Year', nameKh: 'ទិវាចូលឆ្នាំអ្នកលោក', type: 'international', description: 'Gregorian New Year celebration' },
  { date: '2025-01-07', name: 'Victory Day', nameKh: 'ទិវាជ័យជំនះ', type: 'public', description: 'Commemorates the fall of the Khmer Rouge regime in 1979' },
  { date: '2025-03-08', name: 'International Women\'s Day', nameKh: 'ទិវាស្ត្រីអន្តរជាតិ', type: 'international' },
  { date: '2025-04-13', name: 'Khmer New Year – Day 1', nameKh: 'ទិវាចូលឆ្នាំខ្មែរ ថ្ងៃទី១', type: 'cultural', description: 'Khmer New Year – Maha Sangkranta' },
  { date: '2025-04-14', name: 'Khmer New Year – Day 2', nameKh: 'ទិវាចូលឆ្នាំខ្មែរ ថ្ងៃទី២', type: 'cultural', description: 'Khmer New Year – Virak Wanabat' },
  { date: '2025-04-15', name: 'Khmer New Year – Day 3', nameKh: 'ទិវាចូលឆ្នាំខ្មែរ ថ្ងៃទី៣', type: 'cultural', description: 'Khmer New Year – Virak Leung Sak' },
  { date: '2025-05-01', name: 'International Labour Day', nameKh: 'ទិវាពលកម្ម', type: 'international' },
  { date: '2025-05-14', name: 'King Norodom Sihamoni\'s Birthday', nameKh: 'ព្រះរាជសម្ភព', type: 'royal', description: 'Birthday of His Majesty Norodom Sihamoni' },
  { date: '2025-06-01', name: 'International Children\'s Day', nameKh: 'ទិវាកុមារអន្តរជាតិ', type: 'international' },
  { date: '2025-06-18', name: 'HM Queen Mother\'s Birthday', nameKh: 'ព្រះរាជជន្មទិន', type: 'royal', description: 'Birthday of Her Majesty Queen Mother Norodom Monineath Sihanouk' },
  { date: '2025-09-24', name: 'Constitution Day', nameKh: 'ទិវារដ្ឋធម្មនុញ្ញ', type: 'public', description: 'Commemorates the 1993 Constitution of Cambodia' },
  { date: '2025-10-23', name: 'Paris Peace Agreements Day', nameKh: 'ទិវារំឭកសន្ធិសញ្ញាសន្តិភាព', type: 'public', description: 'Commemorates the 1991 Paris Peace Agreements' },
  { date: '2025-10-29', name: 'King Norodom Sihamoni\'s Coronation Day', nameKh: 'ព្រះរាជាភិសេក', type: 'royal', description: 'Coronation anniversary of His Majesty Norodom Sihamoni' },
  { date: '2025-11-09', name: 'Independence Day', nameKh: 'ទិវាឯករាជ្យ', type: 'public', description: 'Commemorates independence from France in 1953' },
  { date: '2025-12-10', name: 'Human Rights Day', nameKh: 'ទិវាសិទ្ធិមនុស្ស', type: 'international' },

  // ── Fixed-date holidays (2026) ──
  { date: '2026-01-01', name: 'International New Year', nameKh: 'ទិវាចូលឆ្នាំអ្នកលោក', type: 'international', description: 'Gregorian New Year celebration' },
  { date: '2026-01-07', name: 'Victory Day', nameKh: 'ទិវាជ័យជំនះ', type: 'public', description: 'Commemorates the fall of the Khmer Rouge regime in 1979' },
  { date: '2026-03-08', name: 'International Women\'s Day', nameKh: 'ទិវាស្ត្រីអន្តរជាតិ', type: 'international' },
  { date: '2026-04-13', name: 'Khmer New Year – Day 1', nameKh: 'ទិវាចូលឆ្នាំខ្មែរ ថ្ងៃទី១', type: 'cultural', description: 'Khmer New Year – Maha Sangkranta' },
  { date: '2026-04-14', name: 'Khmer New Year – Day 2', nameKh: 'ទិវាចូលឆ្នាំខ្មែរ ថ្ងៃទី២', type: 'cultural', description: 'Khmer New Year – Virak Wanabat' },
  { date: '2026-04-15', name: 'Khmer New Year – Day 3', nameKh: 'ទិវាចូលឆ្នាំខ្មែរ ថ្ងៃទី៣', type: 'cultural', description: 'Khmer New Year – Virak Leung Sak' },
  { date: '2026-05-01', name: 'International Labour Day', nameKh: 'ទិវាពលកម្ម', type: 'international' },
  { date: '2026-05-14', name: 'King Norodom Sihamoni\'s Birthday', nameKh: 'ព្រះរាជសម្ភព', type: 'royal', description: 'Birthday of His Majesty Norodom Sihamoni' },
  { date: '2026-06-01', name: 'International Children\'s Day', nameKh: 'ទិវាកុមារអន្តរជាតិ', type: 'international' },
  { date: '2026-06-18', name: 'HM Queen Mother\'s Birthday', nameKh: 'ព្រះរាជជន្មទិន', type: 'royal', description: 'Birthday of Her Majesty Queen Mother Norodom Monineath Sihanouk' },
  { date: '2026-09-24', name: 'Constitution Day', nameKh: 'ទិវារដ្ឋធម្មនុញ្ញ', type: 'public', description: 'Commemorates the 1993 Constitution of Cambodia' },
  { date: '2026-10-23', name: 'Paris Peace Agreements Day', nameKh: 'ទិវារំឭកសន្ធិសញ្ញាសន្តិភាព', type: 'public', description: 'Commemorates the 1991 Paris Peace Agreements' },
  { date: '2026-10-29', name: 'King Norodom Sihamoni\'s Coronation Day', nameKh: 'ព្រះរាជាភិសេក', type: 'royal', description: 'Coronation anniversary of His Majesty Norodom Sihamoni' },
  { date: '2026-11-09', name: 'Independence Day', nameKh: 'ទិវាឯករាជ្យ', type: 'public', description: 'Commemorates independence from France in 1953' },
  { date: '2026-12-10', name: 'Human Rights Day', nameKh: 'ទិវាសិទ្ធិមនុស្ស', type: 'international' },

  // ── Lunar-based holidays (2025) ──
  { date: '2025-02-12', name: 'Meak Bochea', nameKh: 'មាឃបូជា', type: 'buddhist', description: 'Buddhist holy day commemorating the last teaching of the Buddha' },
  { date: '2025-05-12', name: 'Visak Bochea', nameKh: 'វិសាខបូជា', type: 'buddhist', description: 'Celebrates the birth, enlightenment, and death of the Buddha' },
  { date: '2025-05-22', name: 'Royal Ploughing Ceremony', nameKh: 'ព្រះរាជពិធីច្រូតព្រៃ', type: 'royal', description: 'Traditional ceremony marking the beginning of the rice-growing season' },
  { date: '2025-09-24', name: 'Pchum Ben – Day 1', nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ ថ្ងៃទី១', type: 'buddhist', description: 'Ancestors\' Day – day to pay respect to deceased relatives' },
  { date: '2025-09-25', name: 'Pchum Ben – Day 2', nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ ថ្ងៃទី២', type: 'buddhist', description: 'Ancestors\' Day – day to pay respect to deceased relatives' },
  { date: '2025-09-26', name: 'Pchum Ben – Day 3', nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ ថ្ងៃទី៣', type: 'buddhist', description: 'Ancestors\' Day – day to pay respect to deceased relatives' },
  { date: '2025-11-05', name: 'Water Festival – Day 1', nameKh: 'បុណ្យអុំទូក ថ្ងៃទី១', type: 'cultural', description: 'Bon Om Touk – boat racing festival celebrating the reversal of the Tonle Sap River' },
  { date: '2025-11-06', name: 'Water Festival – Day 2', nameKh: 'បុណ្យអុំទូក ថ្ងៃទី២', type: 'cultural', description: 'Bon Om Touk – boat racing festival' },
  { date: '2025-11-07', name: 'Water Festival – Day 3', nameKh: 'បុណ្យអុំទូក ថ្ងៃទី៣', type: 'cultural', description: 'Bon Om Touk – boat racing festival' },

  // ── Lunar-based holidays (2026) ──
  { date: '2026-03-03', name: 'Meak Bochea', nameKh: 'មាឃបូជា', type: 'buddhist', description: 'Buddhist holy day commemorating the last teaching of the Buddha' },
  { date: '2026-05-01', name: 'Visak Bochea', nameKh: 'វិសាខបូជា', type: 'buddhist', description: 'Celebrates the birth, enlightenment, and death of the Buddha' },
  { date: '2026-05-11', name: 'Royal Ploughing Ceremony', nameKh: 'ព្រះរាជពិធីច្រូតព្រៃ', type: 'royal', description: 'Traditional ceremony marking the beginning of the rice-growing season' },
  { date: '2026-10-03', name: 'Pchum Ben – Day 1', nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ ថ្ងៃទី១', type: 'buddhist', description: 'Ancestors\' Day – day to pay respect to deceased relatives' },
  { date: '2026-10-04', name: 'Pchum Ben – Day 2', nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ ថ្ងៃទី២', type: 'buddhist', description: 'Ancestors\' Day – day to pay respect to deceased relatives' },
  { date: '2026-10-05', name: 'Pchum Ben – Day 3', nameKh: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ ថ្ងៃទី៣', type: 'buddhist', description: 'Ancestors\' Day – day to pay respect to deceased relatives' },
  { date: '2026-11-24', name: 'Water Festival – Day 1', nameKh: 'បុណ្យអុំទូក ថ្ងៃទី១', type: 'cultural', description: 'Bon Om Touk – boat racing festival celebrating the reversal of the Tonle Sap River' },
  { date: '2026-11-25', name: 'Water Festival – Day 2', nameKh: 'បុណ្យអុំទូក ថ្ងៃទី២', type: 'cultural', description: 'Bon Om Touk – boat racing festival' },
  { date: '2026-11-26', name: 'Water Festival – Day 3', nameKh: 'បុណ្យអុំទូក ថ្ងៃទី៣', type: 'cultural', description: 'Bon Om Touk – boat racing festival' },
];

/**
 * Returns all holidays that fall on the given date.
 */
export function getHolidaysForDate(date: Date): KhmerHoliday[] {
  const yyyy = date.getFullYear();
  const mm   = String(date.getMonth() + 1).padStart(2, '0');
  const dd   = String(date.getDate()).padStart(2, '0');
  const key  = `${yyyy}-${mm}-${dd}`;
  return KHMER_HOLIDAYS.filter((h) => h.date === key);
}

/**
 * Returns a Map of day-of-month → holidays for a given year/month (1-based month).
 */
export function getHolidaysForMonth(year: number, month: number): Map<number, KhmerHoliday[]> {
  const yyyy = String(year);
  const mm   = String(month).padStart(2, '0');
  const prefix = `${yyyy}-${mm}-`;

  const map = new Map<number, KhmerHoliday[]>();
  for (const holiday of KHMER_HOLIDAYS) {
    if (holiday.date.startsWith(prefix)) {
      const day = parseInt(holiday.date.slice(8), 10);
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(holiday);
    }
  }
  return map;
}
