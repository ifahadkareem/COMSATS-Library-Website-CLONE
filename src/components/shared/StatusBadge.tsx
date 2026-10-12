import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

// Status values now use UPPERCASE from the schema (e.g. AVAILABLE, ACTIVE, PUBLISHED)
// We normalize to lowercase for lookup.
const statusConfig: Record<string, { label: string; variant: BadgeVariant }> = {
  // Book copy statuses
  available:    { label: 'Available',    variant: 'success' },
  borrowed:     { label: 'Borrowed',     variant: 'warning' },
  reserved:     { label: 'Reserved',     variant: 'secondary' },
  lost:         { label: 'Lost',         variant: 'destructive' },
  damaged:      { label: 'Damaged',      variant: 'destructive' },
  maintenance:  { label: 'Maintenance',  variant: 'secondary' },

  // Borrow transaction statuses
  active:   { label: 'Active',   variant: 'success' },
  returned: { label: 'Returned', variant: 'default' },
  overdue:  { label: 'Overdue',  variant: 'destructive' },

  // Reservation statuses
  pending:   { label: 'Pending',   variant: 'warning' },
  fulfilled: { label: 'Fulfilled', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  expired:   { label: 'Expired',   variant: 'secondary' },

  // Fine statuses
  paid:  { label: 'Paid',  variant: 'success' },
  waived: { label: 'Waived', variant: 'default' },

  // Room booking statuses
  confirmed: { label: 'Confirmed', variant: 'success' },
  completed: { label: 'Completed', variant: 'default' },

  // Content statuses
  published: { label: 'Published', variant: 'success' },
  draft:     { label: 'Draft',     variant: 'secondary' },
  archived:  { label: 'Archived', variant: 'secondary' },

  // User / membership statuses
  suspended: { label: 'Suspended', variant: 'destructive' },
  inactive:  { label: 'Inactive',  variant: 'secondary' },

  // Access types
  free:          { label: 'Free',          variant: 'success' },
  institutional: { label: 'Institutional', variant: 'secondary' },
  restricted:    { label: 'Restricted',    variant: 'destructive' },
};

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-muted text-muted-foreground border-border',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  outline: 'bg-transparent text-foreground border-border',
  success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const config = statusConfig[key] ?? {
    label: status.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
    variant: 'outline' as BadgeVariant,
  };

  return (
    <Badge
      variant="outline"
      className={cn(variantClasses[config.variant], className)}
    >
      {config.label}
    </Badge>
  );
}
