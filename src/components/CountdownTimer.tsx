import { useEffect, useState } from "react";
import { WEDDING } from "@/lib/wedding";
import { cn } from "@/lib/utils";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function diffParts(target: Date, now: Date): Parts {
  const ms = Math.max(0, target.getTime() - now.getTime());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

const LABELS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export function CountdownTimer({ className }: { className?: string }) {
  // Start null so SSR and the first client render agree; the real
  // numbers appear immediately after hydration.
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const target = WEDDING.date;
    const update = () => setParts(diffParts(target, new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const arrived = parts !== null && parts.days + parts.hours + parts.minutes + parts.seconds === 0;

  if (arrived) {
    return (
      <p className={cn("font-display text-2xl italic", className)}>
        Today is the day — we're married!
      </p>
    );
  }

  return (
    <div
      className={cn("flex items-stretch justify-center gap-2 sm:gap-4", className)}
      aria-label={`Countdown to ${WEDDING.dateLabel}`}
      role="timer"
    >
      {LABELS.map(({ key, label }) => (
        <div
          key={key}
          className="flex min-w-[4.25rem] flex-col items-center rounded-xl border border-white/25 bg-white/10 px-3 py-4 backdrop-blur-sm sm:min-w-[5.5rem]"
        >
          <span className="font-display text-3xl font-medium tabular-nums sm:text-4xl">
            {parts ? String(parts[key]).padStart(2, "0") : "—"}
          </span>
          <span className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.2em] opacity-80">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
