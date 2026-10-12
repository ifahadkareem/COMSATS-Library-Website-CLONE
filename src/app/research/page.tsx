import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DemoBanner } from '@/components/shared';
import {
  ExternalLink, BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  researcherCornerResources,
  hecCornerResources,
} from '@/lib/content';
import type { ResearchResource } from '@/lib/content';

export const metadata = { title: 'Research Support' };

function ResourceCard({ resource }: { resource: ResearchResource }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/40 px-4 py-3">
      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{resource.name}</p>
          <Badge variant="outline" className="text-[10px]">
            {resource.section === 'researcher-corner'
              ? 'Researcher Corner'
              : 'HEC Corner'}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{resource.description}</p>
        {resource.externalUrl && (
          <a
            href={resource.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Visit <ExternalLink className="h-2.5 w-2.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function ResearchPage() {
  return (
    <PageContainer>
      <DemoBanner />
      <PageHeader
        title="Research Support"
        description="Research tools and resources as listed on the official Junaid Zaidi Library website."
      />

      {/* Researcher Corner */}
      <div className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">Researcher Corner</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Resources listed under the &quot;Researcher Corner&quot; section of the official website.
        </p>
        <div className="grid gap-3 lg:grid-cols-2">
          {researcherCornerResources.map((r) => (
            <ResourceCard key={r.name} resource={r} />
          ))}
        </div>
      </div>

      <Separator className="my-8" />

      {/* HEC Corner */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">HEC Corner</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Links to Higher Education Commission resources as listed on the official library website.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {hecCornerResources.map((r) => (
            <ResourceCard key={r.name} resource={r} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
