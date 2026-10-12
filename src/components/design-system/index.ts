/* ═══════════════════════════════════════════════════════════════
 * Liquid Knowledge Design System
 * COMSATS University Islamabad — Junaid Zaidi Library
 *
 * Premium design system with layered sections, subtle gradients,
 * smooth transitions, modern cards, editorial typography, and
 * soft shadows. Built on top of shadcn/ui primitives.
 * ═══════════════════════════════════════════════════════════════ */

// ── Layout Components ──
export { DSCard, DSCardHeader, DSCardMedia, DSCardContent, DSCardFooter } from './Card';
export type { DSCardProps, DSCardHeaderProps, DSCardMediaProps, DSCardContentProps, DSCardFooterProps } from './Card';

export { BookCard } from './BookCard';
export type { BookCardProps } from './BookCard';

export { StatCard } from './StatCard';
export type { StatCardProps } from './StatCard';

// ── Base UI ──
export { SearchBar } from './SearchBar';
export type { SearchBarProps, SearchSuggestion } from './SearchBar';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

// ── Overlays ──
export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { Dropdown } from './Dropdown';
export type { DropdownProps, DropdownItem, DropdownGroup } from './Dropdown';

export { ToastContainer, useToast } from './Toast';
export type { ToastItem, ToastProps } from './Toast';

// ── Navigation / Data ──
export { Tabs } from './Tabs';
export type { TabsProps, DSTab } from './Tabs';

export { DSTable } from './Table';
export type { DSTableProps, DSTableColumn } from './Table';

export { Pagination } from './Pagination';
export type { PaginationProps } from './Pagination';

export { Breadcrumb } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb';

// ── State ──
export { EmptyState } from './EmptyState';
export type { EmptyStateProps } from './EmptyState';

export { LoadingSkeleton } from './LoadingSkeleton';
export type { LoadingSkeletonProps } from './LoadingSkeleton';

// ── Motion ──
export {
  PageEntrance,
  StaggerContainer,
  StaggerItem,
  CardHover,
  FadeIn,
  ScaleIn,
  SearchSuggestions,
  NavTransition,
  useReducedMotion,
} from './motion';
