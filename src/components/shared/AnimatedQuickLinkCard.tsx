'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LibraryCard } from '@/components/shared/LibraryCard';

interface AnimatedQuickLinkCardProps {
  title: string;
  description: string;
  href: string;
  color: string;
  icon: React.ElementType;
  index: number;
}

export function AnimatedQuickLinkCard({
  title,
  description,
  href,
  color,
  icon: Icon,
  index,
}: AnimatedQuickLinkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.06, duration: 0.35 }}
    >
      <Link href={href} className="block">
        <LibraryCard hover padding="md">
          <div className="flex items-start gap-4">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </LibraryCard>
      </Link>
    </motion.div>
  );
}
