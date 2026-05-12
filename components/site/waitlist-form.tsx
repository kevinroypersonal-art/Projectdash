"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = { id?: string; submitLabel?: string };

export function WaitlistForm({ id, submitLabel = "Request access" }: Props) {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<"idle" | "submitting" | "done">(
    "idle",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("submitting");
    // Stubbed — wire to Resend / Loops in v1.1.
    window.setTimeout(() => setState("done"), 600);
  }

  if (state === "done") {
    return (
      <p
        id={id}
        className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--color-fg)]"
      >
        You're on the list. Watch your inbox.
      </p>
    );
  }

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
    >
      <label htmlFor={`${id ?? "waitlist"}-email`} className="sr-only">
        Email address
      </label>
      <Input
        id={`${id ?? "waitlist"}-email`}
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        placeholder="you@domain.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1"
      />
      <Button
        type="submit"
        variant="outline"
        size="md"
        disabled={state === "submitting"}
      >
        {state === "submitting" ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}
