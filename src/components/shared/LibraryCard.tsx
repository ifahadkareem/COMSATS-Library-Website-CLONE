import { cn } from '@/utils/cn';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface LibraryCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function LibraryCard({
  children,
  className,
  hover = true,
  padding = 'md',
  onClick,
}: LibraryCardProps) {
  const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <Card
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      className={cn(
        'border-border/60 bg-card shadow-sm transition-all duration-200',
        hover && 'hover:border-primary/20 hover:shadow-md',
        onClick && 'cursor-pointer',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </Card>
  );
}

interface LibraryCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function LibraryCardHeader({ children, className }: LibraryCardHeaderProps) {
  return (
    <CardHeader className={cn('p-0 pb-3', className)}>
      {children}
    </CardHeader>
  );
}

interface LibraryCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function LibraryCardContent({ children, className }: LibraryCardContentProps) {
  return (
    <CardContent className={cn('p-0', className)}>
      {children}
    </CardContent>
  );
}

interface LibraryCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function LibraryCardFooter({ children, className }: LibraryCardFooterProps) {
  return (
    <CardFooter className={cn('mt-4 border-t border-border/40 pt-3', className)}>
      {children}
    </CardFooter>
  );
}
