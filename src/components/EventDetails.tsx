import { Flower2, Music2, Wine } from "lucide-react";
import { EVENTS } from "@/lib/wedding";
import { Reveal } from "@/components/Reveal";

const ICONS = [Flower2, Wine, Music2] as const;

export function EventDetails() {
  return (
    <section id="details" className="scroll-mt-20 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-sage">
            When & Where
          </p>
          <h2 className="mt-3 font-display text-4xl font-medium sm:text-5xl">
            Event Details
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-light leading-relaxed text-muted-foreground">
            One afternoon, three celebrations. Join us in the hills of Tuscany
            as the day unfolds from vows to dancing.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {EVENTS.map((event, index) => {
            const Icon = ICONS[index % ICONS.length] ?? Flower2;
            const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`;
            return (
              <Reveal key={event.name} delay={index * 150}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 shadow-[0_20px_50px_-30px] shadow-blush/40 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex size-12 items-center justify-center rounded-full bg-accent text-blush">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-medium">
                    {event.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {event.timeDetail}
                  </p>

                  <dl className="mt-6 space-y-4 text-sm">
                    <div>
                      <dt className="font-medium uppercase tracking-widest text-sage text-[0.65rem]">
                        Time
                      </dt>
                      <dd className="mt-0.5 font-display text-lg">{event.time}</dd>
                    </div>
                    <div>
                      <dt className="font-medium uppercase tracking-widest text-sage text-[0.65rem]">
                        Location
                      </dt>
                      <dd className="mt-0.5 leading-relaxed">
                        {event.location}
                        <span className="block text-muted-foreground">
                          {event.venueDetail}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium uppercase tracking-widest text-sage text-[0.65rem]">
                        Dress Code
                      </dt>
                      <dd className="mt-0.5 leading-relaxed">
                        {event.dressCode}
                        <span className="block text-muted-foreground">
                          {event.dressNote}
                        </span>
                      </dd>
                    </div>
                  </dl>

                  {/* TODO: replace the map query with the exact venue pin. */}
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-blush/50 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-burgundy transition-colors hover:bg-accent hover:text-burgundy"
                  >
                    View Map
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
