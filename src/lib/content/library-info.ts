/**
 * Core library information — sourced from the official COMSATS University Islamabad
 * Junaid Zaidi Library website: https://library.comsats.edu.pk/
 *
 * ⚠️  Only information verified from the official website belongs here.
 *     Demo/application-specific data lives elsewhere.
 */

export const libraryInfo = {
  /** Full official name */
  name: 'Junaid Zaidi Library',

  /** Official page title from the website */
  title: 'Library & Information Center',

  /** Official tagline displayed in the site header */
  tagline: 'Knowledge in Your Hands',

  /** Parent institution */
  university: 'COMSATS University Islamabad',

  /** Campus */
  campus: 'Islamabad Campus',

  /** Official meta description from the website */
  description:
    'Access digital resources, HEC digital library, research journals, e-books, catalog (OPAC), and academic support services at COMSATS University Islamabad Library.',

  /** Short description for cards and previews */
  shortDescription:
    'The central academic library of COMSATS University Islamabad, providing access to extensive academic resources, research support, and modern study spaces.',

  /** Full mailing address as listed on the website */
  address: {
    building: 'Junaid Zaidi Library',
    institution: 'COMSATS University Islamabad',
    street: 'Park Road, Tarlai Kalan',
    city: 'Islamabad',
    postcode: '45550',
    country: 'Pakistan',
    /** Formatted single-line address */
    formatted: 'Junaid Zaidi Library, COMSATS University Islamabad, Park Road, Tarlai Kalan, Islamabad 45550, Pakistan',
  },

  /** Contact details from the website */
  contact: {
    /** Phone number displayed in the website header and footer */
    phone: '051-90495065',
    /** Phone formatted for display */
    phoneFormatted: '+92-51-9049-5065',
  },

  /** SEO keywords from the website */
  keywords: [
    'COMSATS library',
    'CUI library portal',
    'HEC digital library COMSATS',
    'online catalog OPAC CUI',
    'academic journals Islamabad',
    'research resources COMSATS',
  ],
} as const;

/** Type export for consumer components */
export type LibraryInfo = typeof libraryInfo;
