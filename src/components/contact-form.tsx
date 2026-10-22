"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Copy,
  Mail,
  UserRound,
} from "lucide-react";
import { company } from "@/lib/company";

export function ContactForm() {
  return (
    <Suspense
      fallback={
        <div className="contact-form-card" role="status">
          Loading inquiry form…
        </div>
      }
    >
      <ContactFormFields />
    </Suspense>
  );
}

function ContactFormFields() {
  const params = useSearchParams();
  const [intent, setIntent] = useState("hiring");
  const [service, setService] = useState("");
  const [draft, setDraft] = useState<{ subject: string; body: string } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    setIntent(params.get("intent") === "career" ? "career" : "hiring");
    const selected = params.get("service");
    setService(
      selected && ["contract", "contract-to-hire", "direct"].includes(selected)
        ? selected
        : "",
    );
    setDraft(null);
  }, [params]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const message = String(form.get("message") || "").trim();
    const messageField = event.currentTarget.elements.namedItem(
      "message",
    ) as HTMLTextAreaElement;
    if (message.length < 10) {
      messageField.setCustomValidity(
        "Please tell us a little more, using at least 10 characters.",
      );
      messageField.reportValidity();
      return;
    }
    const serviceName =
      service === "contract"
        ? "Contract staffing"
        : service === "contract-to-hire"
          ? "Contract-to-hire"
          : service === "direct"
            ? "Direct placement"
            : "Let’s discuss";
    setDraft({
      subject: `HireCraft ${intent === "hiring" ? "staffing inquiry" : "career inquiry"} — ${name}`,
      body: `Hello HireCraft,\n\n${message}\n\nName: ${name}\nEmail: ${form.get("email")}\n${intent === "hiring" ? `Company: ${String(form.get("company") || "Not provided").trim()}\nService: ${serviceName}` : "Interest: Career opportunities"}\n\nThank you,\n${name}`,
    });
    setCopied(false);
    setCopyError(false);
  }

  async function copyDraft() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(
        `To: ${company.email}\nSubject: ${draft.subject}\n\n${draft.body}`,
      );
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className="contact-form-card">
      <h2>Tell us what’s next.</h2>
      <p className="form-intro">
        A few details are all it takes to get started.
      </p>
      <fieldset className="intent-fieldset">
        <legend>I’m here to</legend>
        <div className="intent-options">
          <label
            className={
              intent === "hiring" ? "intent-option selected" : "intent-option"
            }
          >
            <input
              type="radio"
              name="intent"
              value="hiring"
              checked={intent === "hiring"}
              onChange={() => {
                setIntent("hiring");
                setDraft(null);
              }}
            />
            <BriefcaseBusiness size={18} />
            Hire great talent
          </label>
          <label
            className={
              intent === "career" ? "intent-option selected" : "intent-option"
            }
          >
            <input
              type="radio"
              name="intent"
              value="career"
              checked={intent === "career"}
              onChange={() => {
                setIntent("career");
                setDraft(null);
              }}
            />
            <UserRound size={18} />
            Find my next role
          </label>
        </div>
      </fieldset>
      <form
        onSubmit={handleSubmit}
        onChange={(event) => {
          setDraft(null);
          const messageField = event.currentTarget.elements.namedItem(
            "message",
          ) as HTMLTextAreaElement;
          messageField.setCustomValidity("");
        }}
      >
        <div className="form-row">
          <label htmlFor="name">
            Full name <span>*</span>
            <input
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Alex Morgan"
              required
              maxLength={100}
              pattern=".*\S.*"
              title="Please enter your name."
            />
          </label>
          <label htmlFor="email">
            Email address <span>*</span>
            <input
              id="email"
              name="email"
              autoComplete="email"
              type="email"
              placeholder="you@company.com"
              required
              maxLength={200}
            />
          </label>
        </div>
        {intent === "hiring" && (
          <div className="form-row">
            <label htmlFor="company">
              Company name
              <input
                id="company"
                name="company"
                autoComplete="organization"
                placeholder="Your company"
                maxLength={150}
              />
            </label>
            <label htmlFor="service">
              How can we help?
              <select
                id="service"
                name="service"
                value={service}
                onChange={(event) => setService(event.target.value)}
              >
                <option value="">Let’s discuss</option>
                <option value="contract">Contract staffing</option>
                <option value="contract-to-hire">Contract-to-hire</option>
                <option value="direct">Direct placement</option>
              </select>
            </label>
          </div>
        )}
        <label htmlFor="message">
          {intent === "hiring"
            ? "Tell us about your hiring needs"
            : "Tell us about your next move"}{" "}
          <span>*</span>
          <textarea
            id="message"
            name="message"
            required
            minLength={10}
            maxLength={3000}
            rows={4}
            placeholder={
              intent === "hiring"
                ? "The roles, skills, or project you have in mind…"
                : "Your experience, skills, and the kind of opportunity you’re looking for…"
            }
          />
        </label>
        <div className="form-note">
          <Mail size={15} />
          <p>
            This prepares an email to HireCraft. You’ll review and send it from
            your email app.
          </p>
        </div>
        <button className="button button-blue form-submit" type="submit">
          Prepare your message <ArrowUpRight size={18} />
        </button>
      </form>
      {draft && (
        <div className="draft-panel" role="status">
          <span className="draft-heading">
            <Check size={18} />
            Your email draft is ready
          </span>
          <p>
            Your message hasn’t been sent yet. Open your email app to review and
            send it, or copy the draft.
          </p>
          <div className="draft-actions">
            <a
              className="button button-blue"
              href={`mailto:${company.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`}
            >
              Open email app <ArrowUpRight size={16} />
            </a>
            <button className="copy-button" onClick={copyDraft}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy draft"}
            </button>
          </div>
          {copyError && (
            <>
              <p>
                Copy isn’t available in this browser. Select the draft below:
              </p>
              <textarea
                aria-label="Email draft to copy"
                readOnly
                rows={7}
                value={`To: ${company.email}\nSubject: ${draft.subject}\n\n${draft.body}`}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
