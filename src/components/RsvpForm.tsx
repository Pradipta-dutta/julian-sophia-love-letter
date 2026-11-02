import { useState, type ChangeEvent, type FormEvent } from "react";
import { Check, Heart, Loader2, Music2, Send } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/Reveal";

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

type Attendance = "accepts" | "declines";

const DIETARY_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "none", label: "None" },
  { value: "other", label: "Other" },
] as const;

const rsvpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, "Please share your full name.")
      .max(100, "Please keep it under 100 characters."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Please enter a valid email address.")
      .max(255, "Please keep it under 255 characters."),
    attendance: z.enum(["accepts", "declines"], {
      errorMap: () => ({ message: "Please let us know if you can join us." }),
    }),
    guestCount: z.number().int().min(1, "At least one guest.").max(10),
    plusOneNames: z.string().trim().max(500).optional(),
    dietary: z.array(z.string()).max(6).optional(),
    dietaryOther: z.string().trim().max(200).optional(),
    songRequest: z.string().trim().max(120).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.attendance !== "accepts") return;
    if (val.guestCount > 1 && !val.plusOneNames?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["plusOneNames"],
        message: "Please list the full names of everyone in your party.",
      });
    }
    if (val.dietary?.includes("other") && !val.dietaryOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dietaryOther"],
        message: "Please describe your dietary requirement.",
      });
    }
  });

type RsvpValues = z.infer<typeof rsvpSchema>;

/** Clean, sheet-ready JSON payload — one row per RSVP. */
type RsvpPayload = {
  fullName: string;
  email: string;
  attendance: "Accepts with Joy" | "Declines with Regret";
  totalGuests: number;
  plusOneNames: string | null;
  dietaryRequirements: string[];
  dietaryOther: string | null;
  songRequest: string | null;
  submittedAt: string; // ISO 8601
};

/* ================================================================== */
/* DATA INTEGRATION PREP — GOOGLE SHEETS / MAKE / ZAPIER               */
/* ================================================================== */
/**
 * Wire the form to a Google Sheet in three steps:
 *
 * 1. Create a Google Sheet, then Extensions → Apps Script, and add:
 *
 *      function doPost(e) {
 *        const sheet = SpreadsheetApp.getActiveSheet();
 *        const data = JSON.parse(e.postData.contents);
 *        sheet.appendRow([data.fullName, data.email, data.attendance,
 *          data.totalGuests, data.plusOneNames, data.dietaryRequirements.join(", "),
 *          data.dietaryOther, data.songRequest, data.submittedAt]);
 *        return ContentService.createTextOutput("ok");
 *      }
 *
 * 2. Deploy → New deployment → Web app → access "Anyone".
 *
 * 3. Paste the Web App URL (or a Make/Zapier webhook URL) into
 *    WEBHOOK_URL below — handleSubmit will pick it up automatically.
 */
const WEBHOOK_URL = ""; // e.g. "https://script.google.com/macros/s/XXXX/exec"

/**
 * Placeholder submission handler.
 * Point `fetch` at a Google Apps Script URL or Make/Zapier webhook to
 * dump the payload straight into a Google Sheet.
 */
async function submitRsvp(payload: RsvpPayload): Promise<void> {
  if (!WEBHOOK_URL) {
    // No endpoint configured yet: simulate a short round-trip so the
    // saving state and confirmation overlay are still exercised.
    console.debug("[RSVP] payload ready to POST:", payload);
    await new Promise((resolve) => setTimeout(resolve, 700));
    return;
  }

  await fetch(WEBHOOK_URL, {
    method: "POST",
    // Google Apps Script requires no-cors for anonymous POSTs.
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const inputClass =
  "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-blush focus:ring-2 focus:ring-blush/25";
const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground";
const errorClass = "mt-1.5 text-xs text-destructive";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  attendance: null as Attendance | null,
  guestCount: 1,
  plusOneNames: "",
  dietary: [] as string[],
  dietaryOther: "",
  songRequest: "",
};

export function RsvpForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const declining = form.attendance === "declines";
  const accepting = form.attendance === "accepts";
  const showPartyFields = accepting;
  const showDietaryAndSong = accepting;

  const set = <K extends keyof typeof EMPTY_FORM>(
    key: K,
    value: (typeof EMPTY_FORM)[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const onTextChange =
    (key: "fullName" | "email" | "plusOneNames" | "dietaryOther" | "songRequest") =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      set(key, e.target.value);

  const toggleDietary = (value: string) => {
    const isNone = value === "none";
    setForm((prev) => {
      const has = prev.dietary.includes(value);
      let dietary: string[];
      if (has) {
        dietary = prev.dietary.filter((d) => d !== value);
      } else if (isNone) {
        dietary = ["none"];
      } else {
        dietary = [...prev.dietary.filter((d) => d !== "none"), value];
      }
      return { ...prev, dietary };
    });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const parsed = rsvpSchema.safeParse({
      ...form,
      guestCount: Number(form.guestCount),
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    const v: RsvpValues = parsed.data;
    const isAccepting = v.attendance === "accepts";

    /** Clean JSON payload — ready to POST to Google Sheets. */
    const payload: RsvpPayload = {
      fullName: v.fullName,
      email: v.email,
      attendance: isAccepting ? "Accepts with Joy" : "Declines with Regret",
      totalGuests: isAccepting ? v.guestCount : 0,
      plusOneNames:
        isAccepting && v.guestCount > 1 && v.plusOneNames?.trim()
          ? v.plusOneNames.trim()
          : null,
      dietaryRequirements: isAccepting
        ? (v.dietary ?? [])
            .filter((d) => d !== "other") // "Other" is captured separately
            .map((d) => DIETARY_OPTIONS.find((o) => o.value === d)?.label ?? d)
        : [],
      dietaryOther: isAccepting && v.dietaryOther?.trim() ? v.dietaryOther.trim() : null,
      songRequest: isAccepting && v.songRequest?.trim() ? v.songRequest.trim() : null,
      submittedAt: new Date().toISOString(),
    };

    setStatus("submitting");
    try {
      await submitRsvp(payload);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const closeOverlay = () => {
    setStatus("idle");
    setForm(EMPTY_FORM);
    setErrors({});
  };

  return (
    <section id="rsvp" className="scroll-mt-20 px-4 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-sage">
            Répondez S'il Vous Plaît
          </p>
          <h2 className="mt-3 font-display text-4xl font-medium sm:text-5xl">
            Will You Join Us?
          </h2>
          <p className="mx-auto mt-4 max-w-md font-light leading-relaxed text-muted-foreground">
            Kindly respond by April 15, 2027. We can't wait to celebrate with
            you.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-[0_30px_80px_-40px] shadow-blush/50 sm:p-10"
          >
            {/* Full name */}
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full Name <span className="text-blush">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                maxLength={100}
                value={form.fullName}
                onChange={onTextChange("fullName")}
                placeholder="Your full name"
                className={cn(inputClass, errors.fullName && "border-destructive")}
              />
              {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="mt-6">
              <label htmlFor="email" className={labelClass}>
                Email Address <span className="text-blush">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                maxLength={255}
                value={form.email}
                onChange={onTextChange("email")}
                placeholder="you@example.com"
                className={cn(inputClass, errors.email && "border-destructive")}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            {/* Attendance */}
            <fieldset className="mt-8">
              <legend className={labelClass}>
                Attendance Status <span className="text-blush">*</span>
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    { value: "accepts", label: "Accepts with Joy" },
                    { value: "declines", label: "Declines with Regret" },
                  ] as const
                ).map((option) => {
                  const selected = form.attendance === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          attendance: option.value,
                          // Reset party-only fields when declining.
                          ...(option.value === "declines"
                            ? { plusOneNames: "", dietary: [], dietaryOther: "", songRequest: "" }
                            : {}),
                        }))
                      }
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-lg border px-4 py-3.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush/40",
                        selected
                          ? "border-blush bg-accent font-medium text-burgundy"
                          : "border-input bg-background text-muted-foreground hover:border-blush/50",
                      )}
                    >
                      {selected && <Check className="size-4 text-blush" aria-hidden="true" />}
                      {option.label}
                    </button>
                  );
                })}
              </div>
              {errors.attendance && <p className={errorClass}>{errors.attendance}</p>}
            </fieldset>

            {/* Guest count */}
            <div className="mt-6">
              <label htmlFor="guestCount" className={labelClass}>
                Total Guests in Party
              </label>
              <select
                id="guestCount"
                value={form.guestCount}
                onChange={(e) => set("guestCount", Number(e.target.value))}
                className={cn(inputClass, "appearance-none")}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n === 1 ? "Just me" : `${n} guests`}
                  </option>
                ))}
              </select>
            </div>

            {/* Plus-ones — only when accepting with more than one guest */}
            {showPartyFields && form.guestCount > 1 && (
              <div className="mt-6">
                <label htmlFor="plusOneNames" className={labelClass}>
                  Full Names of Plus-Ones / Party Members
                </label>
                <textarea
                  id="plusOneNames"
                  rows={3}
                  maxLength={500}
                  value={form.plusOneNames}
                  onChange={onTextChange("plusOneNames")}
                  placeholder="List each additional guest's full name"
                  className={cn(inputClass, "resize-none", errors.plusOneNames && "border-destructive")}
                />
                {errors.plusOneNames && (
                  <p className={errorClass}>{errors.plusOneNames}</p>
                )}
              </div>
            )}

            {/* Dietary & song — only when accepting */}
            {showDietaryAndSong && (
              <>
                <fieldset className="mt-8">
                  <legend className={labelClass}>Dietary Requirements</legend>
                  <div className="flex flex-wrap gap-2">
                    {DIETARY_OPTIONS.map((option) => {
                      const checked = form.dietary.includes(option.value);
                      return (
                        <label
                          key={option.value}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                            checked
                              ? "border-blush bg-accent text-burgundy"
                              : "border-input bg-background text-muted-foreground hover:border-blush/50",
                          )}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={() => toggleDietary(option.value)}
                          />
                          {checked && <Check className="size-3.5" aria-hidden="true" />}
                          {option.label}
                        </label>
                      );
                    })}
                  </div>
                  {form.dietary.includes("other") && (
                    <div className="mt-3">
                      <input
                        type="text"
                        maxLength={200}
                        value={form.dietaryOther}
                        onChange={onTextChange("dietaryOther")}
                        placeholder="Please describe your dietary requirement"
                        className={cn(
                          inputClass,
                          errors.dietaryOther && "border-destructive",
                        )}
                      />
                      {errors.dietaryOther && (
                        <p className={errorClass}>{errors.dietaryOther}</p>
                      )}
                    </div>
                  )}
                </fieldset>

                <div className="mt-6">
                  <label htmlFor="songRequest" className={labelClass}>
                    Song Request
                  </label>
                  <div className="relative">
                    <Music2
                      className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60"
                      aria-hidden="true"
                    />
                    <input
                      id="songRequest"
                      type="text"
                      maxLength={120}
                      value={form.songRequest}
                      onChange={onTextChange("songRequest")}
                      placeholder="A song that will get you on the dance floor"
                      className={cn(inputClass, "pl-11")}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit */}
            <div className="mt-10 text-center">
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-burgundy px-10 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-lg shadow-burgundy/25 transition hover:bg-blush hover:shadow-blush/30 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : declining ? (
                  <>
                    <Heart className="size-4" aria-hidden="true" />
                    Send Blessings
                  </>
                ) : (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    Send RSVP
                  </>
                )}
              </button>
              {status === "error" && (
                <p className={cn(errorClass, "mt-4")}>
                  Something went wrong saving your response. Please try again in
                  a moment.
                </p>
              )}
              <p className="mt-4 text-xs text-muted-foreground">
                Please submit one response per household.
              </p>
            </div>
          </form>
        </Reveal>
      </div>

      {/* Confirmation overlay */}
      {status === "success" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="RSVP confirmation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-burgundy/40 px-4 backdrop-blur-sm"
        >
          <div className="animate-in fade-in zoom-in-95 w-full max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-2xl duration-300">
            <div className="heart-pop mx-auto flex size-16 items-center justify-center rounded-full bg-accent">
              <Heart className="size-7 fill-blush text-blush" aria-hidden="true" />
            </div>
            <h3 className="mt-6 font-display text-3xl font-medium">
              Thank you!
            </h3>
            <p className="mt-2 text-muted-foreground">
              Your response has been saved.
            </p>
            <p className="mt-4 font-light leading-relaxed text-muted-foreground">
              {declining
                ? "You will be warmly missed — thank you for letting us know, and for your blessings from afar."
                : "We can't wait to celebrate with you in Tuscany. A confirmation will arrive in your inbox soon."}
            </p>
            <button
              type="button"
              onClick={closeOverlay}
              className="mt-8 rounded-full border border-blush/50 px-8 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-burgundy transition-colors hover:bg-accent"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
