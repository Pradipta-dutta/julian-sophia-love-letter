import { createFileRoute } from "@tanstack/react-router";
import { Heart, MapPin } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { WEDDING } from "@/lib/wedding";
import { CountdownTimer } from "@/components/CountdownTimer";
import { EventDetails } from "@/components/EventDetails";
import { LoveStory } from "@/components/LoveStory";
import { Reveal } from "@/components/Reveal";
import { RsvpForm } from "@/components/RsvpForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Julian & Sophia — Wedding Invitation" },
      {
        name: "description",
        content:
          "Julian & Sophia are getting married on Saturday, June 19, 2027 at Villa Serenella, Tuscany, Italy. Read our story, find event details, and RSVP online.",
      },
      { property: "og:title", content: "Julian & Sophia — Wedding Invitation" },
      {
        property: "og:description",
        content:
          "Join us Saturday, June 19, 2027 at Villa Serenella, Tuscany, Italy. Read our story and RSVP online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeddingPage,
});

function Monogram() {
  return (
    <span className="font-display text-lg tracking-[0.3em] text-burgundy">
      J&nbsp;<span className="italic text-blush">&</span>&nbsp;S
    </span>
  );
}

function HeartDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-4 ${className ?? ""}`}>
      <span className="h-px w-16 bg-border" />
      <Heart className="size-3.5 fill-blush text-blush" />
      <span className="h-px w-16 bg-border" />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-cream/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="#top" aria-label="Back to top">
          <Monogram />
        </a>
        <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:gap-10">
          <a href="#story" className="transition-colors hover:text-burgundy">
            Our Story
          </a>
          <a href="#details" className="transition-colors hover:text-burgundy">
            Details
          </a>
          <a
            href="#rsvp"
            className="rounded-full border border-blush/50 px-4 py-2 text-burgundy transition-colors hover:bg-accent"
          >
            RSVP
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-24 pt-28"
    >
      <img
        src={heroImg}
        alt="A sunlit Tuscan garden ceremony arch wrapped in roses and eucalyptus"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-cream/70 via-cream/40 to-cream"
      />

      <Reveal className="relative z-10 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.4em] text-sage">
          Together with their families
        </p>

        <h1 className="mt-6 font-display text-6xl font-medium leading-[1.05] text-burgundy sm:text-7xl md:text-8xl">
          Julian <span className="italic text-blush">&</span> Sophia
        </h1>

        <div className="mt-6 flex flex-col items-center gap-1.5 text-sm font-light tracking-[0.15em] text-muted-foreground sm:flex-row sm:justify-center sm:gap-3">
          <span className="inline-flex items-center gap-1.5">
            <Heart className="size-3.5 fill-blush text-blush" aria-hidden="true" />
            {WEDDING.dateLabel}
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-3.5 text-blush" aria-hidden="true" />
            {WEDDING.venue} · {WEDDING.location}
          </span>
        </div>

        <CountdownTimer className="mt-10" />

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#rsvp"
            className="inline-flex items-center justify-center rounded-full bg-burgundy px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-lg shadow-burgundy/30 transition hover:bg-blush hover:shadow-blush/40"
          >
            RSVP Now
          </a>
          <a
            href="#story"
            className="inline-flex items-center justify-center rounded-full border border-burgundy/30 px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-burgundy transition hover:bg-cream/60"
          >
            Our Story
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card px-4 py-12 text-center">
      <Monogram />
      <p className="mt-4 font-display text-lg italic text-muted-foreground">
        With love, {WEDDING.groom} & {WEDDING.bride}
      </p>
      <p className="mt-2 text-xs tracking-[0.2em] text-muted-foreground">
        {WEDDING.email}
      </p>
    </footer>
  );
}

function WeddingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />
        <HeartDivider className="py-4" />
        <LoveStory />
        <div className="bg-secondary/40">
          <EventDetails />
        </div>
        <HeartDivider className="py-4" />
        <RsvpForm />
      </main>
      <Footer />
    </div>
  );
}
