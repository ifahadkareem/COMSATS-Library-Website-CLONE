import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { LibraryCard, DemoBanner } from '@/components/shared';
import {
  Search, Database, BookOpen, FileText, Newspaper, MonitorPlay,
  Library, Globe, GraduationCap, Wrench, Lightbulb,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { officialServices, homepageFeatures } from '@/lib/content';

export const metadata = { title: 'Digital Resources' };

const iconMap: Record<string, React.ElementType> = {
  Search, Database, BookOpen, FileText, Newspaper, MonitorPlay,
  Library, Globe, GraduationCap, Wrench, Lightbulb,
};

export default function ResourcesPage() {
  return (
    <PageContainer>
      <DemoBanner />
      <PageHeader
        title="Explore Resources"
        description="Digital resources and services of the Junaid Zaidi Library, as listed on the official library website."
      />

      {/* Core services — from official site "Explore Resources" */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Library Resources</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Resources listed under &quot;Explore Resources&quot; on the official website.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {officialServices.map((service) => {
            const Icon = iconMap[service.icon] ?? BookOpen;
            const content = (
              <LibraryCard key={service.name}>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{service.name}</h3>
                      <Badge variant="outline" className="text-[10px]">Official</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
                      {service.description}
                    </p>
                    {service.externalUrl && (
                      <p className="mt-2 text-xs text-primary">
                        External service &rarr;
                      </p>
                    )}
                  </div>
                </div>
              </LibraryCard>
            );

            if (service.externalUrl) {
              return (
                <a
                  key={service.name}
                  href={service.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }
            return <div key={service.name}>{content}</div>;
          })}
        </div>
      </div>

      {/* Homepage features — also from official site */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Additional Services</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Features listed on the official library homepage.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {homepageFeatures.map((service) => {
            const Icon = iconMap[service.icon] ?? BookOpen;
            return (
              <LibraryCard key={service.name}>
                <div className="flex flex-col gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{service.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>
              </LibraryCard>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
