import storyFirstMeeting from "@/assets/story-first-meeting.jpg";
import storyTravels from "@/assets/story-travels.jpg";
import storyProposal from "@/assets/story-proposal.jpg";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const MILESTONES = [
  {
    year: "Autumn 2019",
    title: "The First Hello",
    text: "A rainy October evening in Florence, one shared umbrella, and a café table for two. Neither of us left until the barista turned off the lights.",
    img: storyFirstMeeting,
    alt: "Julian and Sophia laughing together over coffee at a café",
  },
  {
    year: "Summer 2021",
    title: "A Thousand Miles",
    text: "From the cliffs of Amalfi to night trains through Vienna — somewhere between the gelato and the wrong turns, home stopped being a place.",
    img: storyTravels,
    alt: "Julian and Sophia walking hand in hand along a cobbled street at golden hour",
  },
  {
    year: "Spring 2025",
    title: "The Question",
    text: "Under a canopy of candlelight in the gardens where we first met, Julian knelt — and Sophia said yes before he could finish the sentence.",
    img: storyProposal,
    alt: "Julian proposing to Sophia in a candlelit garden at dusk",
  },
] as const;

export function LoveStory() {
  return (
    <section id="story" className="scroll-mt-20 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-sage">
            Our Story
          </p>
          <h2 className="mt-3 font-display text-4xl font-medium sm:text-5xl">
            How It All Began
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-light leading-relaxed text-muted-foreground">
            Six years, three cities, and countless small moments that led us
            here.
          </p>
        </Reveal>

        <div className="relative mx-auto mt-16 max-w-4xl">
          {/* Timeline spine */}
          <div
            aria-hidden="true"
            className="absolute left-5 top-0 h-full w-px bg-border md:left-1/2"
          />

          {MILESTONES.map((milestone, index) => (
            <div
              key={milestone.title}
              className={cn(
                "relative mb-14 flex md:mb-24",
                index % 2 === 0 ? "md:justify-start" : "md:justify-end",
              )}
            >
              {/* Node on the spine */}
              <span
                aria-hidden="true"
                className="absolute left-5 top-10 z-10 size-3 -translate-x-1/2 rounded-full bg-blush ring-4 ring-background md:left-1/2"
              />
              <Reveal
                className="ml-14 w-full md:ml-0 md:w-[calc(50%-3rem)]"
                delay={index % 2 === 0 ? 0 : 100}
              >
                <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_20px_50px_-30px] shadow-blush/40">
                  <img
                    src={milestone.img}
                    alt={milestone.alt}
                    width={1200}
                    height={1200}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-6 sm:p-8">
                    <p className="text-xs font-medium uppercase tracking-[0.3em] text-sage">
                      {milestone.year}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-medium">
                      {milestone.title}
                    </h3>
                    <p className="mt-3 font-light leading-relaxed text-muted-foreground">
                      {milestone.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
