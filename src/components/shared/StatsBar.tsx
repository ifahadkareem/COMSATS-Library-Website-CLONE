'use client';

import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import type { LucideIcon } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function StatsBar({ stats }: { stats: StatItem[] }) {
  return (
    <section className="border-b bg-muted/30">
      <PageContainer className="py-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              className="text-center"
            >
              <stat.icon className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
