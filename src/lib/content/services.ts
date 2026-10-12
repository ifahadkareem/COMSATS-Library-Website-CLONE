/**
 * Library services — sourced from the official COMSATS Junaid Zaidi Library
 * website: https://library.comsats.edu.pk/
 *
 * Services listed under "Explore Resources" and "Find" sections.
 * Descriptions are based on official website text, summarized for a modern redesign.
 */

export type ServiceOrigin = 'official' | 'demo';

export interface LibraryService {
  /** Service name */
  name: string;
  /** Short description */
  description: string;
  /** Icon name from Lucide */
  icon: string;
  /** Where this information comes from */
  origin: ServiceOrigin;
  /** Whether it links to an external resource */
  externalUrl?: string;
  /** Internal route if applicable */
  internalRoute?: string;
}

/**
 * Core services verified from the official website.
 */
export const officialServices: LibraryService[] = [
  {
    name: 'OPAC',
    description:
      'Discover and search books and other library collections through the Online Public Access Catalogue — an online database of materials held by the CUI Islamabad Campus library.',
    icon: 'Search',
    origin: 'official',
    externalUrl: 'https://lib.comsats.edu.pk:82',
  },
  {
    name: 'HEC Digital Library',
    description:
      'Access databases and journals subscribed by the CUI Islamabad Campus library through the HEC Digital Library Program, providing access to thousands of peer-reviewed publications.',
    icon: 'Database',
    origin: 'official',
  },
  {
    name: 'HEC E-Books Library',
    description:
      'Browse e-books from world-renowned publishers subscribed through the HEC Digital Library Program, covering a wide range of academic disciplines.',
    icon: 'BookOpen',
    origin: 'official',
  },
  {
    name: 'CUI Thesis Catalog',
    description:
      'Explore the extensive collection of research produced by the CUI community in the form of theses, dissertations, and project reports.',
    icon: 'FileText',
    origin: 'official',
  },
  {
    name: 'Newspapers & Magazines',
    description:
      'Access current and archived print newspapers and magazines available in the library reading area.',
    icon: 'Newspaper',
    origin: 'official',
  },
  {
    name: 'Audio/Video Resources',
    description:
      'Access multimedia academic resources including audio lectures and video materials.',
    icon: 'MonitorPlay',
    origin: 'official',
  },
  {
    name: 'Union Catalogue',
    description:
      'Search across the combined library holdings of all COMSATS University campuses through the unified catalogue system.',
    icon: 'Library',
    origin: 'official',
  },
];

/**
 * Additional services/features listed on the homepage.
 */
export const homepageFeatures: LibraryService[] = [
  {
    name: 'CUI Research Portal',
    description: 'Explore the institutional repository of COMSATS University research output.',
    icon: 'Globe',
    origin: 'official',
  },
  {
    name: 'Research Support',
    description: 'Dedicated support for researchers including tools, guidance, and access to scholarly databases.',
    icon: 'GraduationCap',
    origin: 'official',
  },
  {
    name: 'Research Tools',
    description: 'Access to citation management tools, plagiarism detection, and research productivity resources.',
    icon: 'Wrench',
    origin: 'official',
  },
  {
    name: 'Info Skills Program',
    description: 'Workshops and training sessions to develop information literacy and research skills.',
    icon: 'Lightbulb',
    origin: 'official',
  },
];
