/**
 * Official COMSATS Library image assets.
 *
 * All photographs are sourced from the official website:
 *   https://library.comsats.edu.pk/
 *
 * Images are stored locally (not hotlinked) under public/images/library/.
 * Each image has both JPEG and WebP formats available.
 *
 * For images not available from the official site, placeholders are used
 * and clearly marked with the PLACEHOLDER badge.
 */

export interface LibraryImage {
  /** Unique key */
  key: string;
  /** Alt text (accessibility) — generated from VLM analysis */
  alt: string;
  /** Relative path to JPEG (for fallback) */
  src: string;
  /** Relative path to WebP (preferred) */
  srcWebp: string;
  /** Display category */
  category: 'exterior' | 'interior' | 'facilities' | 'floors';
  /** Natural width */
  width: number;
  /** Natural height */
  height: number;
  /** Whether this is a real photo or a placeholder */
  isPlaceholder: boolean;
}

const B = '/images/library';

export const libraryImages: LibraryImage[] = [
  {
    key: 'library-building-front',
    alt: 'Junaid Zaidi Library building exterior with red brick architecture, central entrance with a clock, and campus grounds',
    src: `${B}/exterior/library-building-front.jpg`,
    srcWebp: `${B}/exterior/library-building-front.webp`,
    category: 'exterior',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'library-building-wide',
    alt: 'Junaid Zaidi Library exterior showing the full brick facade, large windows, and clock tower',
    src: `${B}/exterior/library-building-wide.jpg`,
    srcWebp: `${B}/exterior/library-building-wide.webp`,
    category: 'exterior',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'conference-event',
    alt: 'Library conference room used for events and academic gatherings',
    src: `${B}/facilities/conference-event.jpg`,
    srcWebp: `${B}/facilities/conference-event.webp`,
    category: 'facilities',
    width: 1440,
    height: 600,
    isPlaceholder: false,
  },
  {
    key: 'awards-display',
    alt: 'Library lobby display cabinets showcasing awards, plaques, and medals',
    src: `${B}/interior/awards-display.jpg`,
    srcWebp: `${B}/interior/awards-display.webp`,
    category: 'interior',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'circulation-desk',
    alt: 'Library circulation desk area with security gates and service counter',
    src: `${B}/interior/circulation-desk.jpg`,
    srcWebp: `${B}/interior/circulation-desk.webp`,
    category: 'interior',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'reading-corner',
    alt: 'Library reading corner with bookshelves and seating area',
    src: `${B}/interior/reading-corner.jpg`,
    srcWebp: `${B}/interior/reading-corner.webp`,
    category: 'interior',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'social-sciences-section',
    alt: 'Social Sciences and Psychology bookshelves with QR codes for digital catalog access',
    src: `${B}/interior/social-sciences-section.jpg`,
    srcWebp: `${B}/interior/social-sciences-section.webp`,
    category: 'interior',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'main-reading-hall',
    alt: 'Spacious library interior with students studying at tables among rows of bookshelves',
    src: `${B}/interior/main-reading-hall.jpg`,
    srcWebp: `${B}/interior/main-reading-hall.webp`,
    category: 'interior',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'service-desk-computers',
    alt: 'Library service desk area with computer stations and bookshelves',
    src: `${B}/interior/service-desk-computers.jpg`,
    srcWebp: `${B}/interior/service-desk-computers.webp`,
    category: 'interior',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'china-studies-corner',
    alt: 'China Studies Corner featuring specialized bookshelves, red lanterns, and study areas',
    src: `${B}/interior/china-studies-corner.jpg`,
    srcWebp: `${B}/interior/china-studies-corner.webp`,
    category: 'interior',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'hec-digital-kiosk',
    alt: 'HEC Digital Resources kiosk with touchscreen access at the library service desk',
    src: `${B}/facilities/hec-digital-kiosk.jpg`,
    srcWebp: `${B}/facilities/hec-digital-kiosk.webp`,
    category: 'facilities',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'self-service-kiosk',
    alt: 'Self-service drop box machine with touchscreen interface',
    src: `${B}/facilities/self-service-kiosk.jpg`,
    srcWebp: `${B}/facilities/self-service-kiosk.webp`,
    category: 'facilities',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'student-reading',
    alt: 'Student reading a book near wooden library shelves',
    src: `${B}/interior/student-reading.jpg`,
    srcWebp: `${B}/interior/student-reading.webp`,
    category: 'interior',
    width: 1920,
    height: 800,
    isPlaceholder: false,
  },
  {
    key: 'floor-plan-placeholder',
    alt: 'Placeholder: Floor plan image not yet available from the official library website',
    src: `${B}/floors/floor-plan-placeholder.svg`,
    srcWebp: `${B}/floors/floor-plan-placeholder.svg`,
    category: 'floors',
    width: 800,
    height: 450,
    isPlaceholder: true,
  },
];

/** Get images by category */
export function getImagesByCategory(cat: LibraryImage['category']): LibraryImage[] {
  return libraryImages.filter((img) => img.category === cat);
}

/** Get a single image by key */
export function getImage(key: string): LibraryImage | undefined {
  return libraryImages.find((img) => img.key === key);
}

/** Get only real (non-placeholder) images */
export function getRealImages(): LibraryImage[] {
  return libraryImages.filter((img) => !img.isPlaceholder);
}
