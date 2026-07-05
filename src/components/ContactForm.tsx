"use client";

import React, { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate transmission delay
    setTimeout(() => {
      setLoading(false);
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }, 1200);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
      {status === "success" ? (
        <div style={{ background: "rgba(201, 168, 76, 0.05)", border: "1px solid rgba(201, 168, 76, 0.15)", borderRadius: "20px", padding: "3rem 2rem", textAlign: "center" }}>
          <span style={{ fontSize: "2.5rem", color: "var(--accent)" }}>✓</span>
          <h3 className="title-sm" style={{ marginTop: "1rem", fontSize: "1.25rem", color: "var(--text-primary)" }}>Message Transmitted</h3>
          <p className="body-text" style={{ fontSize: "0.95rem", marginTop: "0.5rem" }}>
            Thanks for reaching out! I'll get back to you within 24 hours.
          </p>
          <button onClick={() => setStatus("idle")} className="btn-secondary" style={{ marginTop: "1.5rem", fontSize: "0.85rem", padding: "0.5rem 1.2rem" }}>
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form-card">
          <div className="contact-form-grid">
            <div className="form-group" style={{ marginBottom: 0, textAlign: "left", display: "flex", flexDirection: "column" }}>
              <label className="form-label" style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", textTransform: "none", letterSpacing: "normal", color: "var(--text-secondary)", marginBottom: "0.5rem" }} htmlFor="form-name">Name</label>
              <input
                id="form-name"
                type="text"
                placeholder="Alex Mendez"
                className="form-input"
                style={{ borderRadius: "12px", background: "rgba(12, 12, 12, 0.6)", borderColor: "rgba(255, 255, 255, 0.08)", padding: "0.9rem 1.2rem", width: "100%" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0, textAlign: "left", display: "flex", flexDirection: "column" }}>
              <label className="form-label" style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", textTransform: "none", letterSpacing: "normal", color: "var(--text-secondary)", marginBottom: "0.5rem" }} htmlFor="form-email">Email</label>
              <input
                id="form-email"
                type="email"
                placeholder="alex@mendez.com"
                className="form-input"
                style={{ borderRadius: "12px", background: "rgba(12, 12, 12, 0.6)", borderColor: "rgba(255, 255, 255, 0.08)", padding: "0.9rem 1.2rem", width: "100%" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: "1.5rem", textAlign: "left", display: "flex", flexDirection: "column" }}>
            <label className="form-label" style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", textTransform: "none", letterSpacing: "normal", color: "var(--text-secondary)", marginBottom: "0.5rem" }} htmlFor="form-subject">Subject</label>
            <input
              id="form-subject"
              type="text"
              placeholder="Project Scoping & Timelines"
              className="form-input"
              style={{ borderRadius: "12px", background: "rgba(12, 12, 12, 0.6)", borderColor: "rgba(255, 255, 255, 0.08)", padding: "0.9rem 1.2rem", width: "100%" }}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "2rem", textAlign: "left", display: "flex", flexDirection: "column" }}>
            <label className="form-label" style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", textTransform: "none", letterSpacing: "normal", color: "var(--text-secondary)", marginBottom: "0.5rem" }} htmlFor="form-message">Message</label>
            <textarea
              id="form-message"
              rows={5}
              placeholder="Tell me about your product, scoping, and target timelines..."
              className="form-input"
              style={{ resize: "vertical", borderRadius: "12px", background: "rgba(12, 12, 12, 0.6)", borderColor: "rgba(255, 255, 255, 0.08)", padding: "0.9rem 1.2rem", width: "100%" }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn-filled"
            style={{ width: "100%", padding: "0.9rem", fontSize: "0.95rem" }}
            disabled={loading}
          >
            {loading ? "Transmitting..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
