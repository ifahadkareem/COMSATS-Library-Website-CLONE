/**
 * About page sections — the official website lists these under the "About" dropdown.
 * Content descriptions are demo content for the redesign; section names are official.
 */

export interface AboutSection {
  /** Official section name from the website navigation */
  name: string;
  /** Slug for routing */
  slug: string;
  /** Whether the section name is from the official site */
  official: boolean;
}

/**
 * About page sections listed in the official website navigation.
 */
export const aboutSections: AboutSection[] = [
  { name: 'Message of the Incharge', slug: 'message', official: true },
  { name: 'Introduction', slug: 'introduction', official: true },
  { name: '10 Quick Facts of Junaid Zaidi Library (JZL)', slug: 'quick-facts', official: true },
  { name: 'Rules & Regulations', slug: 'rules', official: true },
  { name: 'Staff Directory', slug: 'staff', official: true },
  { name: 'Floor Plan / Layout Plan', slug: 'floor-plan', official: true },
  { name: 'Location Map / Road Map', slug: 'location', official: true },
];

/**
 * Gallery sections listed in the official website navigation.
 */
export const gallerySections = [
  'Visits',
  'Activities/Events',
  'Virtual Tour',
] as const;
