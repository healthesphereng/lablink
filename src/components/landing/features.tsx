import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, FileText, MapPin } from 'lucide-react';

const features = [
  {
    title: 'Schedule a Test',
    description: 'Schedule lab tests with just a few clicks, anytime, anywhere.',
    icon: CalendarPlus,
    href: '/schedule',
  },
  {
    title: 'View Your Results',
    description: 'Access comprehensive test results securely online within hours.',
    icon: FileText,
    href: '/results',
  },
  {
    title: 'Find a Lab',
    description: 'Locate a convenient testing center near you from our extensive network.',
    icon: MapPin,
    href: '#',
  },
];

export default function FeaturesSection() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl text-primary">
              Why Choose Lab Link?
            </h2>
            <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We make healthcare management effortless and transparent.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <Icon className="h-6 w-6 text-primary" />
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full">
                  <p className="flex-grow text-foreground/80">{feature.description}</p>
                  <Button variant="link" asChild className="mt-4 self-start pl-0 text-accent-foreground/90">
                      <Link href={feature.href}>LEARN MORE →</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
