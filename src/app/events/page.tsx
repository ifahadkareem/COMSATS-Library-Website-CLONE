import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { EmptyState, DemoBanner } from '@/components/shared';
import { Calendar, Camera } from 'lucide-react';
import Image from 'next/image';
import { getImage } from '@/lib/content';

export const metadata = { title: 'Events' };

export default function EventsPage() {
  const eventPhoto = getImage('conference-event');

  return (
    <PageContainer>
      <DemoBanner />
      <PageHeader
        title="Events & Activities"
        description="Library events, workshops, seminars, and visits — as listed on the official library website under Gallery."
      />

      {/* Conference room photo — official */}
      {eventPhoto && (
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Camera className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Official library photograph</p>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-border/40">
            <Image
              src={eventPhoto.src}
              alt={eventPhoto.alt}
              width={eventPhoto.width}
              height={eventPhoto.height}
              className="h-56 w-full object-cover sm:h-64 lg:h-72"
            />
          </div>
        </div>
      )}

      <EmptyState
        icon={<Calendar className="h-10 w-10" />}
        title="No upcoming events"
        description="New events will appear here once published by the library team. This prototype does not contain live event data."
      />
    </PageContainer>
  );
}
