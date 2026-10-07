"use client";

import { useId, useState } from "react";

// Front-end only for now: there is no mailing-list backend yet.
export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);
  const inputId = useId();

  if (submitted) {
    return (
      <p role="status" className="text-body">
        Thank you. You&rsquo;ll hear from us soon.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="Email address"
        className="field sm:flex-1"
      />
      <button type="submit" className="btn btn-primary">
        Subscribe
      </button>
    </form>
  );
}
