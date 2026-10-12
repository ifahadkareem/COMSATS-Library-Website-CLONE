'use client';

import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock, Send, ExternalLink, Globe } from 'lucide-react';
import { libraryInfo } from '@/lib/content';
import { getLinksByGroup } from '@/lib/content';
import { DemoBanner } from '@/components/shared';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const contactInfo = [
  { icon: MapPin, label: 'Address', value: libraryInfo.address.formatted },
  { icon: Phone, label: 'Phone', value: libraryInfo.contact.phoneFormatted },
];

export default function ContactPage() {
  const usefulLinks = getLinksByGroup('Library Systems');
  const uniLinks = getLinksByGroup('University');

  return (
    <PageContainer>
      <DemoBanner />
      <PageHeader
        title="Contact Us"
        description={`Get in touch with ${libraryInfo.name}, ${libraryInfo.title}`}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="space-y-8">
          {/* Official contact info — from website */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Contact Information</h2>
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-3 rounded-xl border border-border/60 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <info.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{info.label}</p>
                    <p className="mt-0.5 text-sm text-foreground">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Official library system links */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Library Systems</h2>
            <p className="mb-3 text-xs text-muted-foreground">
              Official links from the library website.
            </p>
            <div className="space-y-2">
              {usefulLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border/40 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{link.label}</p>
                    {link.description && (
                      <p className="text-xs text-muted-foreground truncate">{link.description}</p>
                    )}
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          <Separator />

          {/* University links */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">University Links</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {uniLinks.slice(0, 6).map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-lg border border-border/40 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <span className="truncate">{link.label}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: contact form (demo) */}
        <div>
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Send a Message
                <Badge variant="secondary" className="text-[10px]">Demo</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@comsats.edu.pk" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What is this regarding?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={4} placeholder="Type your message here..." />
                </div>
                <Button type="submit" className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
