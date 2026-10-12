import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, MapPin, Target, Eye, Users, Phone, Info, Camera } from 'lucide-react';
import { libraryInfo, officialServices, officialUserGuides, officialForms, aboutSections, getImagesByCategory, getImage } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { DemoBanner } from '@/components/shared/DemoBanner';
import Image from 'next/image';

export const metadata = { title: 'About' };

const values = [
  { title: 'Academic Excellence', description: 'Supporting the university\'s mission of providing quality education through comprehensive information resources and access to HEC digital library programmes.', icon: Target },
  { title: 'Open Access', description: 'Promoting equitable access to knowledge for all members of the COMSATS community through OPAC, digital resources, and union catalogue services.', icon: Eye },
  { title: 'Community', description: 'Building an inclusive, collaborative environment that fosters learning and intellectual growth through shared spaces and research support.', icon: Users },
];

export default function AboutPage() {
  return (
    <PageContainer>
      <DemoBanner />
      <PageHeader
        title="About the Library"
        description={`${libraryInfo.name} — ${libraryInfo.title} of ${libraryInfo.university}`}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Library Overview */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {libraryInfo.description}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The library provides access to the Online Public Access Catalogue (OPAC),
              HEC Digital Library databases and journals, HEC E-Books Library, CUI Thesis
              Catalog, newspapers, magazines, audio/video resources, and the CUI Union
              Catalogue.
            </p>
          </div>

          <Separator />

          {/* Official website sections */}
          <div>
            <h2 className="text-lg font-semibold">Library Sections</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              The following sections are listed on the official library website.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {aboutSections.map((s) => (
                <Badge key={s.slug} variant="outline" className="text-xs">
                  {s.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Practical info — address from official site */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Location</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {libraryInfo.address.formatted}
            </p>
            <div className="mt-3">
              <InfoRow icon={MapPin} label="Campus" value={libraryInfo.campus} />
              <InfoRow icon={Phone} label="Phone" value={libraryInfo.contact.phoneFormatted} />
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold">Library Hours</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              <Badge variant="secondary" className="text-[10px]">Demo data</Badge>{' '}
              Timings shown below are for demonstration purposes only.
            </p>
            <div className="mt-3 space-y-2">
              <InfoRow icon={Clock} label="Monday – Friday" value="8:00 AM – 10:00 PM" />
              <InfoRow icon={Clock} label="Saturday" value="9:00 AM – 6:00 PM" />
              <InfoRow icon={Clock} label="Sunday" value="Closed" />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-10" />

      {/* Services summary */}
      <div className="mb-10">
        <h2 className="mb-6 text-lg font-semibold">Explore Resources</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Key services listed on the official library website.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {officialServices.slice(0, 4).map((service) => (
            <Card key={service.name} className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-3">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-10" />

      {/* Values */}
      <div>
        <h2 className="mb-6 text-lg font-semibold">Our Values</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-xl border border-border/60 p-5">
              <v.icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-semibold">{v.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-10" />

      {/* Photo gallery — official photographs */}
      <div className="mb-10">
        <div className="mb-6 flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Library Gallery</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Official photographs from the Junaid Zaidi Library website.
        </p>

        {/* Exterior */}
        <h3 className="mb-3 text-sm font-medium">Exterior</h3>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {getImagesByCategory('exterior').map((img) => (
            <div key={img.key} className="relative overflow-hidden rounded-xl border border-border/40">
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className="h-48 w-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Interior highlights */}
        <h3 className="mb-3 text-sm font-medium">Interior</h3>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {getImagesByCategory('interior').slice(0, 6).map((img) => (
            <div key={img.key} className="relative overflow-hidden rounded-xl border border-border/40">
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className="h-44 w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                <p className="text-xs text-white/90 line-clamp-1">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Facilities */}
        <h3 className="mb-3 text-sm font-medium">Facilities</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {getImagesByCategory('facilities').map((img) => (
            <div key={img.key} className="relative overflow-hidden rounded-xl border border-border/40">
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className="h-44 w-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                <p className="text-xs text-white/90 line-clamp-1">{img.alt}</p>
              </div>
              {img.isPlaceholder && (
                <Badge className="absolute right-2 top-2" variant="secondary">Placeholder</Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-10" />

      {/* User Guides section */}
      <div>
        <h2 className="mb-6 text-lg font-semibold">User Guides & Manuals</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Guides and manuals listed on the official library website.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {officialUserGuides.map((guide) => (
            <div key={guide.name} className="flex items-start gap-3 rounded-lg border border-border/40 px-4 py-3">
              <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{guide.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{guide.description}</p>
                <div className="mt-1.5 flex gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {guide.isVideo ? 'Video' : 'Document'}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {guide.audience}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator className="my-10" />

      {/* Forms section */}
      <div>
        <h2 className="mb-6 text-lg font-semibold">Library Forms</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Forms available on the official library website.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {officialForms.map((form) => (
            <div key={form.name} className="flex items-start gap-3 rounded-lg border border-border/40 px-4 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{form.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{form.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}