/**
 * Library spaces & facilities — sourced from the official COMSATS Junaid Zaidi Library
 * website navigation: https://library.comsats.edu.pk/
 *
 * The official website lists these under "Explore Spaces".
 * Descriptions are summarized for a modern redesign context.
 * Capacity and floor numbers are demo/application data unless noted.
 */

export type SpaceCategory =
  | 'collaborative'
  | 'individual'
  | 'specialized'
  | 'recreational'
  | 'administrative';

export interface LibrarySpace {
  /** Official name from the website */
  name: string;
  /** Short summary */
  description: string;
  /** Category for filtering */
  category: SpaceCategory;
  /** Lucide icon name for UI rendering */
  icon: string;
  /** Whether this space requires booking */
  bookable: boolean;
  /** Whether this is verified from the official website */
  official: boolean;
}

/**
 * Spaces verified from the official website's "Explore Spaces" navigation.
 */
export const officialSpaces: LibrarySpace[] = [
  {
    name: 'Video Conference Room',
    description: 'Equipped for virtual meetings, online lectures, and collaborative sessions with remote participants.',
    category: 'collaborative',
    icon: 'Video',
    bookable: true,
    official: true,
  },
  {
    name: 'Conference Room',
    description: 'A dedicated space for meetings, presentations, and academic discussions.',
    category: 'administrative',
    icon: 'Presentation',
    bookable: true,
    official: true,
  },
  {
    name: 'Group Study Rooms',
    description: 'Collaborative study rooms designed for group work, discussions, and team projects.',
    category: 'collaborative',
    icon: 'Users',
    bookable: true,
    official: true,
  },
  {
    name: 'Research Cubicles',
    description: 'Individual enclosed workspaces for focused research and deep academic work.',
    category: 'individual',
    icon: 'Laptop',
    bookable: true,
    official: true,
  },
  {
    name: 'Reading Corner',
    description: 'A comfortable area for casual reading and browsing library materials.',
    category: 'recreational',
    icon: 'BookOpen',
    bookable: false,
    official: true,
  },
  {
    name: 'PhD Research Lab',
    description: 'A specialized workspace reserved for PhD scholars to conduct their research.',
    category: 'specialized',
    icon: 'GraduationCap',
    bookable: true,
    official: true,
  },
  {
    name: 'Khatoon Corner',
    description: 'A dedicated section featuring literary collections and resources.',
    category: 'specialized',
    icon: 'BookMarked',
    bookable: false,
    official: true,
  },
  {
    name: 'Art Gallery',
    description: 'An exhibition space showcasing art, creative works, and cultural displays.',
    category: 'recreational',
    icon: 'Palette',
    bookable: false,
    official: true,
  },
  {
    name: 'Coffee Shop',
    description: 'A refreshment area for library visitors to take breaks and recharge.',
    category: 'recreational',
    icon: 'Coffee',
    bookable: false,
    official: true,
  },
];

export const spaceCategories: { label: string; value: SpaceCategory }[] = [
  { label: 'All Spaces', value: 'collaborative' },
  { label: 'Collaborative', value: 'collaborative' },
  { label: 'Individual', value: 'individual' },
  { label: 'Specialized', value: 'specialized' },
  { label: 'Recreational', value: 'recreational' },
];
