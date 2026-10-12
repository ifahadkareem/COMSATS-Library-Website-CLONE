'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { libraryInfo } from '@/lib/content';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy text-navy-foreground">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-navy to-primary/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-white/60">
            {libraryInfo.university}
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {libraryInfo.name}
          </h1>
          <p className="mt-1 text-base font-medium text-white/50">
            {libraryInfo.title}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-white/75 sm:text-xl">
            {libraryInfo.tagline}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
              <Link href="/catalog">
                <Search className="h-4 w-4" />
                Explore OPAC
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/about">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
