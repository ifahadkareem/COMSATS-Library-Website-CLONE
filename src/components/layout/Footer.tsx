import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen, MapPin, Phone, ExternalLink, ArrowUpRight,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { libraryInfo, getLinksByGroup } from '@/lib/content';
import { cn } from '@/lib/utils';

const footerUsefulLinks = [
  { label: 'Catalog', href: '/catalog' },
  { label: 'Digital Resources', href: '/resources' },
  { label: 'Research Support', href: '/research' },
  { label: 'Study Spaces', href: '/spaces' },
  { label: 'Events', href: '/events' },
];

const footerLibraryLinks = [
  { label: 'About the Library', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'User Guides', href: '/about' },
  { label: 'Library Forms', href: '/about' },
];

export function Footer() {
  const universityLinks = getLinksByGroup('University').slice(0, 5);

  return (
    <footer className="border-t border-border/60 bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-primary">
                <Image
                  src="/logo.svg"
                  alt="COMSATS"
                  width={24}
                  height={24}
                  className="object-contain brightness-0 invert"
                />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight text-foreground">
                  {libraryInfo.name}
                </p>
                <p className="text-[11px] leading-tight text-muted-foreground">
                  {libraryInfo.title}
                </p>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {libraryInfo.shortDescription}
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-2.5">
              <a
                href={`tel:${libraryInfo.contact.phone}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Phone className="size-3.5" />
                {libraryInfo.contact.phoneFormatted}
              </a>
              <p className="inline-flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0" />
                <span>Park Road, Tarlai Kalan, Islamabad 45550</span>
              </p>
            </div>
          </div>

          {/* Useful Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Useful Links
            </h3>
            <ul className="space-y-3">
              {footerUsefulLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Library */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Library
            </h3>
            <ul className="space-y-3">
              {footerLibraryLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'HEC Digital Library', url: 'https://www.digitallibrary.edu.pk/' },
                { label: 'OPAC (Koha)', url: 'https://lib.comsats.edu.pk:82' },
                { label: 'CUI Research Portal', url: 'http://ww2.comsats.edu.pk/research' },
                { label: 'Pakistan Research Repository', url: 'http://eprints.hec.gov.pk/' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* University */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-foreground">
              University
            </h3>
            <ul className="space-y-3">
              {universityLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Official website distinction */}
        <div className="rounded-xl border border-border/60 bg-surface-muted/50 px-5 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Official COMSATS Library Website
              </p>
              <p className="text-xs text-muted-foreground">
                This is a modern redesign prototype. For live services, catalog search, and real-time availability, visit the official website.
              </p>
            </div>
            <a
              href="https://library.comsats.edu.pk/"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2 shrink-0 rounded-lg border border-border/60 bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/60',
                'sm:ml-4'
              )}
            >
              Visit Official Site
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>

        <Separator className="my-0" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Prototype/Demo — Not affiliated with the official COMSATS Library backend.
          </p>
          <p className="text-xs text-muted-foreground">
            {libraryInfo.university} · {libraryInfo.campus}
          </p>
        </div>
      </div>
    </footer>
  );
}
