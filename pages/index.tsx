"use client";

import Head from "next/head";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const features = [
  ["📋", "Professional summaries", "Generate comprehensive medical record summaries from your notes."],
  ["✅", "Action items", "Get clear next steps and follow-up actions for every consultation."],
  ["✉️", "Patient emails", "Draft clear, patient-friendly communications automatically."],
];

export default function Home() {
  return <main className="medical-shell"><Head><title>MediNotes Pro · Consultation assistant</title><meta name="description" content="AI-powered consultation notes and patient communication." /></Head><div className="medical-container">
    <nav className="medical-nav"><Link href="/" className="medical-brand"><span>✚</span>MediNotes Pro</Link><SignedOut><SignInButton mode="modal"><button className="medical-nav-button">Sign in</button></SignInButton></SignedOut><SignedIn><div className="medical-actions"><Link href="/product" className="medical-nav-button">Go to app</Link><UserButton showName={true} /></div></SignedIn></nav>
    <section className="medical-hero"><span className="medical-eyebrow">Clinical workflow, simplified</span><h1>Transform your <span>consultation notes.</span></h1><p>AI-powered assistance for professional summaries, action items, and patient communications—all from one focused workspace.</p><div className="feature-grid">{features.map(([icon, title, copy]) => <article className="feature-card" key={title}><div className="feature-icon">{icon}</div><h2>{title}</h2><p>{copy}</p></article>)}</div><SignedOut><SignInButton mode="modal"><button className="medical-cta">Start free trial <span>→</span></button></SignInButton></SignedOut><SignedIn><Link href="/product" className="medical-cta">Open consultation assistant <span>→</span></Link></SignedIn></section>
    <p className="medical-disclaimer">For demonstration purposes only · Not a substitute for clinical judgement</p>
  </div></main>;
}
