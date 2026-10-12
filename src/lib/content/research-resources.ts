/**
 * Research support resources — sourced from the official COMSATS Junaid Zaidi Library
 * website: https://library.comsats.edu.pk/
 *
 * Items listed under "Researcher Corner" and "HEC Corner" dropdowns.
 */

export interface ResearchResource {
  /** Resource name */
  name: string;
  /** Brief description */
  description: string;
  /** Which section it appears in on the official site */
  section: 'researcher-corner' | 'hec-corner' | 'homepage';
  /** External URL if applicable */
  externalUrl?: string;
}

/**
 * Researcher Corner items from the official website.
 */
export const researcherCornerResources: ResearchResource[] = [
  {
    name: 'VIKO – A Complete Set of Instructions for Researchers',
    description:
      'VIKO (Virtuell Idé- og KunnskapsOppbygging) is an interactive tutorial covering the research process — from topic selection to publication.',
    section: 'researcher-corner',
  },
  {
    name: 'Turnitin – A Source to Detect Plagiarism',
    description:
      'Access to Turnitin for plagiarism detection, used for thesis screening and ensuring academic integrity.',
    section: 'researcher-corner',
  },
  {
    name: 'List of Journals Listed by ISI Web of Knowledge',
    description:
      'A curated list of journals indexed in the ISI Web of Knowledge to help researchers identify reputable publishing venues.',
    section: 'researcher-corner',
  },
];

/**
 * HEC Corner items from the official website.
 */
export const hecCornerResources: ResearchResource[] = [
  {
    name: 'Pakistan Research Repository',
    description: 'National repository of theses and dissertations from Pakistani universities.',
    section: 'hec-corner',
    externalUrl: 'http://eprints.hec.gov.pk/',
  },
  {
    name: 'List of Approved Ph.D. Supervisors',
    description: 'HEC-maintained directory of approved doctoral supervisors across Pakistan.',
    section: 'hec-corner',
  },
  {
    name: 'Ph.D. Directory of Pakistan',
    description: 'Directory of PhD degree holders in Pakistan, maintained by HEC.',
    section: 'hec-corner',
  },
  {
    name: 'HEC Recognized Universities',
    description: 'List of universities and degree-awarding institutions recognized by the Higher Education Commission.',
    section: 'hec-corner',
  },
  {
    name: 'HEC Journal Recognition System (HJRS)',
    description: 'System for recognizing and categorizing academic journals for faculty promotion and research evaluation.',
    section: 'hec-corner',
  },
  {
    name: 'National Research Program for Universities (NRPU)',
    description: 'Competitive research grant programme by HEC to support university-based research projects.',
    section: 'hec-corner',
  },
  {
    name: 'Travel Grants for Teachers / MS / MPhil / Ph.D. Students',
    description: 'HEC-funded travel grants for presenting research at international conferences and workshops.',
    section: 'hec-corner',
  },
  {
    name: 'Scholarships',
    description: 'Information about HEC and other scholarship opportunities for higher education.',
    section: 'hec-corner',
  },
];

/** All research resources combined */
export const allResearchResources: ResearchResource[] = [
  ...researcherCornerResources,
  ...hecCornerResources,
];
