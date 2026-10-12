interface SectionDividerProps {
  className?: string;
  label?: string;
}

export function SectionDivider({ className, label }: SectionDividerProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <div className="h-px flex-1 bg-border/60" />
      {label && (
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
      <div className="h-px flex-1 bg-border/60" />
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
