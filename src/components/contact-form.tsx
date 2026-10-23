"use client";

import { Suspense, useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Mail,
  UserRound,
} from "lucide-react";
import { company } from "@/lib/company";

const web3FormsAccessKey = "5e90270f-dc01-47dd-bf77-9d2e833e49ac";

const serviceNames: Record<string, string> = {
  staffing: "Staffing",
  contract: "Contract staffing",
  "contract-to-hire": "Contract-to-hire",
  direct: "Direct placement",
  development: "Development",
};

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
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const submissionController = useRef<AbortController | null>(null);
  const isSubmitting = status === "sending";

  useEffect(() => {
    setIntent(params.get("intent") === "career" ? "career" : "hiring");
    const selected = params.get("service");
    setService(
      selected && Object.keys(serviceNames).includes(selected)
        ? selected
        : "",
    );
    setStatus("idle");
    setErrorMessage("");
    return () => {
      submissionController.current?.abort();
      submissionController.current = null;
    };
  }, [params]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionController.current) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    if (form.has("botcheck")) {
      setStatus("error");
      setErrorMessage("Unable to submit this form. Please contact us by email.");
      return;
    }
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
    const serviceName = serviceNames[service] || "Let’s discuss";
    const inquiryType =
      intent === "career"
        ? "career inquiry"
        : service === "development"
          ? "development inquiry"
          : "staffing inquiry";
    const controller = new AbortController();
    submissionController.current = controller;
    setStatus("sending");
    setErrorMessage("");
    let timedOut = false;
    const timeout = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 15000);
    let failureMessage =
      "We couldn’t send your message. Please try again or email us directly.";
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: web3FormsAccessKey,
          subject: `HireCraft ${inquiryType} — ${name}`,
          from_name: "HireCraft website",
          name,
          email: String(form.get("email") || "").trim(),
          message,
          botcheck: false,
          inquiry_type: inquiryType,
          ...(intent === "hiring"
            ? {
                company: String(form.get("company") || "").trim(),
                service: serviceName,
              }
            : { interest: "Career opportunities" }),
        }),
      });
      if (response.status === 429) {
        failureMessage = "Too many requests. Please wait a moment and try again.";
      }
      const result = await response.json();
      if (!response.ok || result?.success !== true) {
        throw new Error("Submission rejected");
      }
      if (controller.signal.aborted) return;
      formElement.reset();
      setStatus("success");
    } catch {
      if (controller.signal.aborted && !timedOut) return;
      setErrorMessage(
        timedOut
          ? "We couldn’t confirm delivery in time. Please wait before trying again, or email us directly."
          : failureMessage,
      );
      setStatus("error");
    } finally {
      window.clearTimeout(timeout);
      if (submissionController.current === controller) {
        submissionController.current = null;
      }
    }
  }

  return (
    <div className="contact-form-card">
      <h2>Tell us what’s next.</h2>
      <p className="form-intro">
        A few details are all it takes to get started.
      </p>
      <fieldset className="intent-fieldset" disabled={isSubmitting}>
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
                setStatus("idle");
              }}
            />
            <BriefcaseBusiness size={18} />
            Hire talent or build a project
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
                setStatus("idle");
              }}
            />
            <UserRound size={18} />
            Find my next role
          </label>
        </div>
      </fieldset>
      <form
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
        onChange={(event) => {
          setStatus("idle");
          const messageField = event.currentTarget.elements.namedItem(
            "message",
          ) as HTMLTextAreaElement;
          messageField.setCustomValidity("");
        }}
      >
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          style={{ display: "none" }}
        />
        <div className="form-row">
          <label htmlFor="name">
            Full name <span>*</span>
            <input
              id="name"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                name="service"
                value={service}
                onChange={(event) => setService(event.target.value)}
              >
                <option value="">Let’s discuss</option>
                {Object.entries(serviceNames).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <label htmlFor="message">
          {intent === "hiring"
            ? service === "development"
              ? "Tell us about your project"
              : "Tell us about your hiring needs"
            : "Tell us about your next move"}{" "}
          <span>*</span>
          <textarea
            id="message"
            disabled={isSubmitting}
            name="message"
            required
            minLength={10}
            maxLength={3000}
            rows={4}
            placeholder={
              intent === "hiring"
                ? service === "development"
                  ? "The solution, goals, and timeline you have in mind…"
                  : "The roles, skills, or project you have in mind…"
                : "Your experience, skills, and the kind of opportunity you’re looking for…"
            }
          />
        </label>
        <div className="form-note">
          <Mail size={15} />
          <p>
            Send your inquiry directly to our team. We’ll reply to the email
            address you provide.
          </p>
        </div>
        <button
          className="button button-blue form-submit"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send message"}
          <ArrowUpRight size={18} />
        </button>
      </form>
      {status === "sending" && (
        <p className="form-feedback" role="status">
          Sending your message…
        </p>
      )}
      {status === "success" && (
        <div className="submission-panel" role="status">
          <span className="submission-heading">
            <Check size={18} />
            Thank you! Your message has been sent.
          </span>
          <p>Our team will review your inquiry and get back to you by email.</p>
        </div>
      )}
      {status === "error" && (
        <div className="submission-panel submission-error" role="alert">
          <p>{errorMessage}</p>
          {company.email && (
            <a href={`mailto:${company.email}`}>Email {company.name}</a>
          )}
        </div>
      )}
    </div>
  );
}
