import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { LibraryCard, DemoBanner } from '@/components/shared';
import {
  Video, Users, Presentation, Laptop, BookOpen, GraduationCap,
  BookMarked, Palette, Coffee, Camera,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { officialSpaces, spaceCategories, getImage, getImagesByCategory } from '@/lib/content';
import Image from 'next/image';

export const metadata = { title: 'Study Spaces' };

const iconMap: Record<string, React.ElementType> = {
  Video, Users, Presentation, Laptop, BookOpen, GraduationCap, BookMarked, Palette, Coffee,
};

/** Map space names to relevant photos */
const spacePhotoMap: Record<string, string> = {
  'Conference Room': 'conference-event',
  'Group Study Rooms': 'main-reading-hall',
  'Research Cubicles': 'service-desk-computers',
  'Reading Corner': 'reading-corner',
};

export default function SpacesPage() {
  const facilityImages = getImagesByCategory('facilities');

  return (
    <PageContainer>
      <DemoBanner />
      <PageHeader
        title="Explore Spaces"
        description="Spaces and facilities available at the Junaid Zaidi Library, as listed on the official library website."
      />

      {/* Spaces grid */}
      <div className="mb-6 flex flex-wrap gap-2">
        {spaceCategories.map((cat) => (
          <Badge key={cat.value} variant="outline" className="text-xs">
            {cat.label}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {officialSpaces.map((space) => {
          const Icon = iconMap[space.icon] ?? BookOpen;
          const photoKey = spacePhotoMap[space.name];
          const photo = photoKey ? getImage(photoKey) : null;

          return (
            <LibraryCard key={space.name} className="overflow-hidden">
              {photo && (
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-start gap-4 p-4 pt-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">{space.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {space.description}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs capitalize">
                      {space.category}
                    </Badge>
                    {space.bookable && (
                      <Badge variant="secondary" className="text-xs">
                        Bookable
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </LibraryCard>
          );
        })}
      </div>

      <Separator className="my-10" />

      {/* Facility photos */}
      <div>
        <div className="mb-6 flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Facility Photos</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Official photographs of library facilities.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facilityImages.map((img) => (
            <div key={img.key} className="relative overflow-hidden rounded-xl border border-border/40">
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className="h-48 w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                <p className="text-xs text-white/90 line-clamp-1">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
