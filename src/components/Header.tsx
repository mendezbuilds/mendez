"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const sections = ["about", "projects", "contact"];
      const scrollPos = window.scrollY + 160;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }

      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMenuOpen(false); // Close mobile drawer on selection
    if (isHome) {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      e.preventDefault();
      router.push(`/#${targetId}`);
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link 
          href="/" 
          onClick={() => setMenuOpen(false)}
          style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.01em", zIndex: 201 }}
        >
          Mendez<span style={{ color: "var(--accent)" }}>.</span>
        </Link>
        
        {/* Animated Burger Button for Mobile viewports */}
        <button
          className={`burger-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="burger-line" />
          <span className="burger-line" />
          <span className="burger-line" />
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a
            href="#about"
            onClick={(e) => handleNavClick(e, "about")}
            className={`nav-link ${activeSection === "about" ? "active" : ""}`}
          >
            About
          </a>
          <a
            href="#projects"
            onClick={(e) => handleNavClick(e, "projects")}
            className={`nav-link ${activeSection === "projects" ? "active" : ""}`}
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "contact")}
            className={`nav-link ${activeSection === "contact" ? "active" : ""}`}
          >
            Contact
          </a>

          {/* Social Links */}
          <div className="social-links" style={{ gap: "0.6rem", margin: "0 0.75rem", display: "inline-flex" }}>
            <a href="https://github.com/mendezbuilds" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub" style={{ width: "28px", height: "28px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "13px", height: "13px" }}>
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a href="https://x.com/mendezbuilds" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Twitter" style={{ width: "28px", height: "28px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "13px", height: "13px" }}>
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="https://linkedin.com/in/alex-mendez" target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn" style={{ width: "28px", height: "28px" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "13px", height: "13px" }}>
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>

          <Link
            href="/admin"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
            style={{
              fontSize: "0.8rem",
              border: "1px solid rgba(201, 168, 76, 0.25)",
              padding: "0.35rem 0.9rem",
              borderRadius: "100px",
              color: "var(--accent)"
            }}
          >
            Admin Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}
