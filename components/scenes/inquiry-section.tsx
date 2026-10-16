"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Container } from "@/components/layout/container";
import { useExperience } from "@/components/experience/experience-provider";
import { ambienceOptions, floralOptions, paletteOptions, styleOptions } from "@/lib/experience";

export function InquirySection() {
  const { style, palette, floral, ambience, hasCustomized } = useExperience();
  const [preparedDraft, setDraft] = useState<{ href: string; body: string; selectionKey: string } | null>(null);
  const [error, setError] = useState("");
  const [contactError, setContactError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [invitationOpened, setInvitationOpened] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const draftPanel = useRef<HTMLDivElement>(null);
  const selectionKey = [style, palette, floral, ambience, hasCustomized].join("|");
  const draft = preparedDraft?.selectionKey === selectionKey ? preparedDraft : null;

  useEffect(() => { if (draft) draftPanel.current?.focus(); }, [draft]);

  function openInvitation() {
    setInvitationOpened(true);
    const input = formRef.current?.elements.namedItem("name") as HTMLInputElement | null;
    input?.focus({ preventScroll: true });
    input?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) || "").trim();
    const email = get("email");
    const whatsapp = get("whatsapp");
    for (const field of ["name", "location"]) {
      if (get(field)) continue;
      setError(field === "name" ? "Please enter your name." : "Please enter a city or event location.");
      (form.elements.namedItem(field) as HTMLInputElement | null)?.focus();
      setDraft(null);
      return;
    }
    if (!email && !whatsapp) {
      setError("Please add an email address or WhatsApp number so we can reply.");
      setContactError(true);
      (form.elements.namedItem("email") as HTMLInputElement | null)?.focus();
      setDraft(null);
      return;
    }
    setError("");
    setContactError(false);
    setCopied(false);
    const selections = [
      style ? `Style direction: ${styleOptions.find((option) => option.id === style)?.title}` : "",
      hasCustomized ? `Palette: ${paletteOptions.find((option) => option.id === palette)?.label}` : "",
      hasCustomized ? `Florals: ${floralOptions.find((option) => option.id === floral)?.label}` : "",
      hasCustomized ? `Ambience: ${ambienceOptions.find((option) => option.id === ambience)?.label}` : "",
    ].filter(Boolean);
    const body = [
      "Hello Tashkeel Atelier,", "", "I'd like to talk about a celebration.", "",
      `Name: ${get("name")}`, `Email: ${email || "Not provided"}`, `WhatsApp: ${whatsapp || "Not provided"}`,
      `Event type: ${get("eventType")}`, `Expected date: ${get("date") ? new Intl.DateTimeFormat("en-PK", { dateStyle: "long" }).format(new Date(`${get("date")}T12:00:00`)) : "To be decided"}`,
      `Event location: ${get("location")}`, `Services: ${get("services")}`,
      `Approximate guests: ${get("guests") || "Not specified"}`, `Budget range: ${get("budget") || "Not specified"}`,
      ...(selections.length ? ["", "My design choices:", ...selections] : []),
      "", "What I have in mind:", get("notes") || "I'll tell you more when we talk.",
    ].join("\n");
    const href = `mailto:tashkeelatelier@gmail.com?subject=${encodeURIComponent(`Wedding inquiry from ${get("name")}`)}&body=${encodeURIComponent(body)}`;
    setDraft({ href, body, selectionKey });
  }

  async function copyDraft() {
    if (!draft) return;
    try { await navigator.clipboard.writeText(draft.body); setCopied(true); }
    catch { setCopied(false); setError("Copying is unavailable here. Please use the email draft link instead."); }
  }

  return <section id="inquire" className="inquiry-section scene-section" aria-labelledby="inquiry-heading"><Container className="inquiry-layout">
    <div className="inquiry-intro"><p className="scene-kicker">06 / Your story starts here</p><h2 id="inquiry-heading" className="scene-heading">Enough about our ideas. <em>Tell us yours.</em></h2><p>Tell us what you know so far. A few details are enough to begin the conversation.</p><button type="button" className="envelope-art" data-opened={invitationOpened} aria-label="Open the inquiry note" aria-controls="inquiry-form" onClick={openInvitation}><span className="envelope-letter" aria-hidden="true">Your story<br />starts here.</span><span className="envelope-seal" aria-hidden="true">T / A</span></button><p className="inquiry-direct">Prefer to write directly? <a href="mailto:tashkeelatelier@gmail.com">tashkeelatelier@gmail.com</a></p></div>
    <div className="inquiry-paper"><h3>Begin with a note</h3><p className="form-note">This prepares an email in your own mail app. Review and send it there to deliver your inquiry.</p><p id="contact-help" className="form-note">Add an email address or WhatsApp number so we can reply. Fields marked * are required.</p><form id="inquiry-form" ref={formRef} onSubmit={prepareEmail} onChange={() => { if (preparedDraft) setDraft(null); if (error) setError(""); if (contactError) setContactError(false); }}>
      <div className="form-pair"><label>Your name * <input name="name" autoComplete="name" required maxLength={100} /></label><label>Email <input name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} aria-invalid={contactError || undefined} aria-describedby={contactError ? "inquiry-error contact-help" : "contact-help"} maxLength={150} /></label></div>
      <div className="form-pair"><label>WhatsApp <input name="whatsapp" type="tel" autoComplete="tel" aria-invalid={contactError || undefined} aria-describedby={contactError ? "inquiry-error contact-help" : "contact-help"} maxLength={30} placeholder="e.g. +92 300 1234567" /></label><label>Event type * <select name="eventType" required defaultValue=""><option value="" disabled>Select one</option><option>Wedding</option><option>Mehndi</option><option>Walima</option><option>Other celebration</option></select></label></div>
      <label>Event location * <input name="location" autoComplete="address-level2" required maxLength={120} placeholder="City or venue, if known" /></label>
      <label>What help do you need? * <select name="services" required defaultValue=""><option value="" disabled>Select one</option><option>Full planning and coordination</option><option>Design and styling</option><option>Production or wedding-day coordination</option><option>Invitations, favors or guest details</option><option>Not sure yet</option></select></label>
      <label>What are you imagining? <textarea name="notes" rows={4} maxLength={1000} placeholder="Tell us about the ideas you love, the questions you have, or anything else on your mind." /></label>
      <details className="optional-details"><summary>Add a date, guest count or budget <span>(optional)</span></summary><div className="optional-fields"><label>Expected date <input name="date" type="date" /></label><div className="form-pair"><label>Approximate guests <input name="guests" type="number" min="1" max="100000" inputMode="numeric" /></label><label>Budget range <input name="budget" maxLength={100} placeholder="In PKR, if known" /></label></div></div></details>
      {error && <p id="inquiry-error" className="form-error" role="alert">{error}</p>}
      <button className="primary-action" type="submit">Prepare my inquiry <span aria-hidden="true">↗</span></button>
    </form>
    {draft && <div ref={draftPanel} tabIndex={-1} className="draft-ready" aria-label="Prepared inquiry"><p role="status">Your email is ready. Open it, review the details, then press Send in your mail app. Nothing has been delivered yet.</p><div className="draft-actions"><a className="primary-action" href={draft.href}>Open email draft <span aria-hidden="true">↗</span></a><button type="button" className="secondary-action" onClick={copyDraft}>{copied ? "Copied" : "Copy details"}</button></div><span className="sr-only" role="status">{copied ? "Inquiry details copied to clipboard." : ""}</span></div>}
    </div>
  </Container></section>;
}
