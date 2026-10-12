/**
 * Content configuration barrel export.
 *
 * This module re-exports all content data structures used across the application.
 * Data is organized into two categories:
 *
 *  1. OFFICIAL information — verified from https://library.comsats.edu.pk/
 *  2. DEMO/APPLICATION information — generated for the prototype
 *
 * Official data lives in @/lib/content/*.ts files.
 * Demo data should NOT be presented as official COMSATS data.
 */

// Core library info (official)
export { libraryInfo } from './library-info';
export type { LibraryInfo } from './library-info';

// Spaces & facilities (names from official site, descriptions are demo)
export { officialSpaces, spaceCategories } from './spaces';
export type { LibrarySpace, SpaceCategory } from './spaces';

// Services (descriptions based on official site text)
export { officialServices, homepageFeatures } from './services';
export type { LibraryService, ServiceOrigin } from './services';

// External links (all verified from official site)
export { officialExternalLinks, getLinksByGroup, linkGroups } from './external-links';
export type { ExternalLink } from './external-links';

// Research resources (names and sections from official site)
export { researcherCornerResources, hecCornerResources, allResearchResources } from './research-resources';
export type { ResearchResource } from './research-resources';

// Forms (names from official site)
export { officialForms } from './forms';
export type { LibraryForm } from './forms';

// User guides (names from official site)
export { officialUserGuides } from './user-guides';
export type { UserGuide } from './user-guides';

// About sections (section names from official site)
export { aboutSections, gallerySections } from './about-sections';
export type { AboutSection } from './about-sections';

// Image assets (official photographs from library website)
export { libraryImages, getImagesByCategory, getImage, getRealImages } from './images';
export type { LibraryImage } from './images';
