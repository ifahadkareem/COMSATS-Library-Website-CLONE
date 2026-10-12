/**
 * Official external links — sourced from the official COMSATS Junaid Zaidi Library
 * website: https://library.comsats.edu.pk/
 *
 * Only links found on the official website are listed here.
 * They are grouped by the section in which they appear.
 */

export interface ExternalLink {
  /** Display label */
  label: string;
  /** Full URL */
  url: string;
  /** Brief description */
  description?: string;
  /** Group this link belongs to */
  group: string;
}

/**
 * Links verified from the official website.
 */
export const officialExternalLinks: ExternalLink[] = [
  // --- Library Systems ---
  {
    label: 'OPAC (Koha)',
    url: 'https://lib.comsats.edu.pk:82',
    description: 'Online Public Access Catalogue — search the library\'s physical and digital holdings.',
    group: 'Library Systems',
  },
  {
    label: 'HEC Digital Library',
    url: 'https://www.digitallibrary.edu.pk/',
    description: 'Higher Education Commission\'s digital library programme with free access to journals and databases.',
    group: 'Library Systems',
  },

  // --- COMSATS University ---
  {
    label: 'CUI Islamabad Campus',
    url: 'https://islamabad.comsats.edu.pk/',
    group: 'University',
  },
  {
    label: 'CU-Online Student Portal',
    url: 'http://cuonline.comsats.edu.pk/',
    group: 'University',
  },
  {
    label: 'Admissions',
    url: 'http://admissions.comsats.edu.pk/',
    group: 'University',
  },
  {
    label: 'CUI Research',
    url: 'http://ww2.comsats.edu.pk/research',
    group: 'University',
  },
  {
    label: 'Scholarships',
    url: 'http://ww2.comsats.edu.pk/scholarships',
    group: 'University',
  },
  {
    label: 'CUI Journals',
    url: 'https://ww2.comsats.edu.pk/journals',
    group: 'University',
  },
  {
    label: 'Career Development Center',
    url: 'http://ww2.comsats.edu.pk/cdc',
    group: 'University',
  },
  {
    label: 'IT Center',
    url: 'http://ww2.comsats.edu.pk/itcenter',
    group: 'University',
  },
  {
    label: 'Photo Gallery',
    url: 'http://ww2.comsats.edu.pk/photogallery',
    group: 'University',
  },

  // --- HEC Resources ---
  {
    label: 'Pakistan Research Repository',
    url: 'http://eprints.hec.gov.pk/',
    description: 'HEC\'s national repository of theses and dissertations.',
    group: 'HEC Corner',
  },
  {
    label: 'Approved Ph.D. Supervisors',
    url: 'https://www.hec.gov.pk/english/scholarshipsgrants/ASA/Pages/Approved-PhD-Supervisors.aspx',
    group: 'HEC Corner',
  },
  {
    label: 'Ph.D. Directory of Pakistan',
    url: 'https://www.hec.gov.pk/english/services/students/PCD/Pages/Directory.aspx',
    group: 'HEC Corner',
  },
  {
    label: 'HEC Recognized Universities',
    url: 'https://www.hec.gov.pk/english/universities/pages/recognised.aspx',
    group: 'HEC Corner',
  },
  {
    label: 'HEC Journal Recognition System (HJRS)',
    url: 'https://hjrs.hec.gov.pk/',
    description: 'HEC\'s system for recognizing and categorizing academic journals.',
    group: 'HEC Corner',
  },
  {
    label: 'National Research Program for Universities (NRPU)',
    url: 'https://www.hec.gov.pk/english/services/universities/nrpu/Pages/Introduction.aspx',
    group: 'HEC Corner',
  },
  {
    label: 'Travel Grants',
    url: 'https://www.hec.gov.pk/english/services/faculty/HEC%20Research%20Travel%20Grant/Pages/HEC-Research-Travel-Grant.aspx',
    description: 'HEC research travel grants for faculty and students.',
    group: 'HEC Corner',
  },
  {
    label: 'University Rankings',
    url: 'https://www.hec.gov.pk/english/universities/pages/rank.aspx',
    group: 'HEC Corner',
  },
];

/** Get links by group */
export function getLinksByGroup(group: string): ExternalLink[] {
  return officialExternalLinks.filter((l) => l.group === group);
}

/** All unique group names */
export const linkGroups = [...new Set(officialExternalLinks.map((l) => l.group))];
