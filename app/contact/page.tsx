"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

const SUBJECTS = [
  "General Enquiry",
  "Technical Issue",
  "Content Request",
  "Account Help",
  "Partnership",
  "Other",
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulate submission — replace with your email service later
    await new Promise((res) => setTimeout(res, 1000));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      <section className="relative px-4 md:px-12 pt-28 md:pt-32 pb-6">
        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">
          Contact Us
        </h1>
        <p className="text-sm text-gray-500 max-w-xl">
          Got a question, issue or idea? We'd love to hear from you. Fill in the form below and we'll get back to you as soon as possible.
        </p>
      </section>

      <div className="mx-4 md:mx-12 h-px bg-white/5 mb-8" />

      <section className="px-4 md:px-12 pb-16">
        {submitted ? (
          <div className="max-w-md rounded-lg border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-3xl mb-4">✓</p>
            <h2 className="text-xl font-bold text-white mb-2">Message Sent</h2>
            <p className="text-sm text-gray-500">
              Thanks for reaching out! We'll get back to you within 24–48 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); setName(""); setEmail(""); setPhone(""); setMessage(""); setSubject(SUBJECTS[0]); }}
              className="mt-6 rounded bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-100"
            >
              Send Another
            </button>
          </div>
        ) : (
          <div className="max-w-2xl rounded-lg border border-white/8 bg-white/3 p-6 md:p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">Name</label>
                  <input type="text" placeholder="Your full name" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition"
                    required />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">Email</label>
                  <input type="email" placeholder="your@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition"
                    required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</label>
                  <input type="tel" placeholder="+44 7700 000000" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">Subject</label>
                  <select value={subject} onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded border border-white/10 bg-[#0a0a0f] px-4 py-3 text-sm text-white outline-none focus:border-white/25 transition" required>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s} className="bg-[#0d1117]">{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-400 uppercase tracking-wider">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help..."
                  rows={6}
                  className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-white/25 transition resize-none"
                  required />
              </div>

              <button type="submit" disabled={loading}
                className="w-full rounded bg-white py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:opacity-50">
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}