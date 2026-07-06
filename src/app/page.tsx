import Link from "next/link";
import Image from "next/image";
import ParticleField from "@/components/ParticleField";
import GlassObject from "@/components/GlassObject";
import SpotlightCard from "@/components/SpotlightCard";
import ThreeDCardIcon from "@/components/ThreeDCardIcon";
import Marquee from "@/components/Marquee";
import ContactForm from "@/components/ContactForm";
import CountUp from "@/components/CountUp";
import ScrollReveal from "@/components/ScrollReveal";
import Typewriter from "@/components/Typewriter";
import Footer from "@/components/Footer";
import HeroAvatar from "@/components/HeroAvatar";
import AboutStory from "@/components/AboutStory";
import { getProjects, getAboutStory, getAvatarUrl, getSocialLinks } from "@/lib/supabase";
import { getStats } from "@/lib/projectsData";

export const revalidate = 0; // Always pull fresh data on requests

export default async function HomePage() {
  const projects = await getProjects();
  const aboutStory = await getAboutStory();
  const avatarUrl = await getAvatarUrl();
  const stats = getStats(projects);
  const socials = await getSocialLinks();
  const hasSocials = socials.githubUrl || socials.twitterUrl || socials.linkedinUrl || socials.telegramUrl;

  const featuredProject = projects.find((p) => p.featured) || projects[0];
  const otherProjects = projects.filter((p) => p.slug !== featuredProject?.slug);

  const aboutParagraphs = aboutStory.split("\n\n").filter((p) => p.trim() !== "");

  const SKILLS = [
    "Solidity",
    "Next.js",
    "TypeScript",
    "Viem / Wagmi",
    "Ethers.js",
    "PostgreSQL",
    "Hardhat / Foundry",
    "Rust",
    "Go",
    "React",
    "Node.js",
    "Web3 Integration",
  ];

  return (
    <div style={{ position: "relative" }}>
      {/* 1. Hero Section */}
      <section className="hero-section bg-hero grid-bg" id="top">
        <ParticleField />
        
        <div className="container hero-layout">
          <div className="hero-text-side">
            <span className="small-label" style={{ display: "block", marginBottom: "1rem" }}>
              Open to new projects
            </span>
            
            <HeroAvatar defaultUrl={avatarUrl} />

            <h1 className="title-lg">
              <Typewriter text="Mendez" speed={150} />
            </h1>

            <p className="body-text hero-bio">
              I build web3 infrastructure and on-chain systems for DAOs, NFT projects, and DeFi communities.
            </p>

            <div className="hero-ctas">
              <a href="#projects" className="btn-outlined">
                View Projects
              </a>
              <a href="#contact" className="btn-filled">
                Hire Me
              </a>
            </div>
          </div>

          <div className="hero-graphic-side float-element">
            <GlassObject />
          </div>
        </div>
      </section>

      {/* Partner Logo Marquee Scrolling Strip */}
      <Marquee />

      {/* 2. About Section */}
      <section className="section-padding bg-about" id="about" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <ScrollReveal className="reveal-hidden">
            <div className="section-header">
              <span className="small-label" style={{ display: "block", marginBottom: "0.75rem" }}>About me</span>
              <h2 className="title-md section-header-line" style={{ marginTop: 0 }}>
                My background
              </h2>
            </div>
          </ScrollReveal>

          <AboutStory defaultStory={aboutStory} />
        </div>
      </section>

      {/* 3. Featured Project Section */}
      <section className="section-padding bg-hero grid-bg" id="projects" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
        <div className="container">
          <ScrollReveal className="reveal-hidden">
            <div className="section-header" style={{ marginBottom: "3.5rem" }}>
              <h2 className="title-md section-header-line" style={{ marginTop: 0 }}>
                Selected Work
              </h2>
            </div>
          </ScrollReveal>

          {featuredProject ? (
            <ScrollReveal className="reveal-hidden" delay={100}>
              <SpotlightCard className="featured-project-card shimmer-wrapper">
                <div className="featured-layout">
                  <div className="featured-video-container" style={{ position: "relative" }}>
                    {featuredProject.videoUrl ? (
                      <video
                        src={featuredProject.videoUrl}
                        poster={featuredProject.thumbnailUrl || undefined}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="project-card-video"
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "100%",
                          height: "100%",
                          background: "#080808",
                          padding: "2rem",
                        }}
                      >
                        <h4 className="title-sm" style={{ fontSize: "1.1rem", opacity: 0.8 }}>
                          {featuredProject.title}
                        </h4>
                      </div>
                    )}
                  </div>
                  
                  <div className="featured-content">
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <ThreeDCardIcon shape="octahedron" />
                        <span className="small-label" style={{ fontSize: "0.8rem", verticalAlign: "middle" }}>Active Case Study</span>
                      </div>
                      <h3 className="title-sm" style={{ fontSize: "1.6rem" }}>
                        {featuredProject.title}
                      </h3>
                      <p className="body-text" style={{ marginTop: "1.2rem", fontSize: "1rem" }}>
                        {featuredProject.oneLiner}
                      </p>
                    </div>
                    
                    <div>
                      <div className="card-stack" style={{ marginBottom: "1.5rem" }}>
                        {featuredProject.stack.slice(0, 4).map((tech) => (
                          <span key={tech} className="tag-pill">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <Link href={`/projects/${featuredProject.slug}`} className="arrow-link" style={{ marginTop: 0 }}>
                        View project <span>→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          ) : (
            <div className="body-text" style={{ padding: "4rem 0", textAlign: "center" }}>
              Loading portfolio case studies...
            </div>
          )}

          {/* 4. All Projects Grid */}
          {otherProjects.length > 0 && (
            <div style={{ marginTop: "5rem" }}>
              <ScrollReveal className="reveal-hidden">
                <h3 className="title-sm" style={{ marginBottom: "2.5rem" }}>
                  More case studies
                </h3>
              </ScrollReveal>

              <div className="grid-2">
                {otherProjects.map((project, idx) => (
                  <ScrollReveal key={project.slug} delay={idx * 150} className="reveal-hidden">
                    <Link href={`/projects/${project.slug}`} style={{ display: "block", height: "100%" }}>
                      <SpotlightCard className="project-card shimmer-wrapper">
                        {project.thumbnailUrl && (
                          <div style={{ position: "relative", width: "100%", height: "160px", marginBottom: "1.5rem", borderRadius: "8px", overflow: "hidden" }}>
                            <Image src={project.thumbnailUrl} alt={project.title} fill style={{ objectFit: "cover" }} />
                          </div>
                        )}
                        <div>
                          <div className="card-title-row" style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "space-between", flexWrap: "wrap" }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <ThreeDCardIcon shape={idx % 2 === 0 ? "cube" : "tetrahedron"} />
                              <h4 className="title-sm" style={{ fontSize: "1.25rem" }}>
                                {project.title}
                              </h4>
                            </div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--accent)", display: "inline-block" }} />
                              <span className="small-label" style={{ fontSize: "0.75rem" }}>{project.status.replace("-", " ")}</span>
                            </div>
                          </div>
                          <p className="body-text" style={{ fontSize: "0.95rem", marginTop: "0.5rem" }}>
                            {project.oneLiner}
                          </p>
                        </div>

                        <div>
                          <div className="card-stack" style={{ marginBottom: "1.5rem" }}>
                            {project.stack.slice(0, 3).map((tech) => (
                              <span key={tech} className="tag-pill">
                                {tech}
                              </span>
                            ))}
                          </div>
                          
                          <div className="arrow-link" style={{ marginTop: 0 }}>
                            View project <span>→</span>
                          </div>
                        </div>
                      </SpotlightCard>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Stack / Skills Section */}
      <section className="section-padding bg-stack" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
        <div className="container">
          <ScrollReveal className="reveal-hidden">
            <div className="section-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span className="small-label" style={{ display: "block", marginBottom: "0.75rem" }}>What I work with</span>
              <h2 className="title-md section-header-line" style={{ marginTop: 0 }}>
                Technical stack
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal className="reveal-hidden" delay={100}>
            <div className="skills-container">
              {SKILLS.map((skill) => (
                <span key={skill} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. Stats Strip */}
      <section className="stats-strip bg-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="float-element float-delay-1" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "28px", height: "28px", color: "var(--accent)", marginBottom: "0.8rem" }}>
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              <div className="stat-number">
                <CountUp end={stats.projectsShipped} suffix="+" />
              </div>
              <div className="stat-label">Projects Shipped</div>
            </div>
            <div className="float-element float-delay-2" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "28px", height: "28px", color: "var(--accent)", marginBottom: "0.8rem" }}>
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
              <div className="stat-number">
                <CountUp end={stats.phasesCompleted} />
              </div>
              <div className="stat-label">Phases Completed</div>
            </div>
            <div className="float-element float-delay-3" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "28px", height: "28px", color: "var(--accent)", marginBottom: "0.8rem" }}>
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <div className="stat-number">
                <CountUp end={stats.contractsDeployed} />
              </div>
              <div className="stat-label">Smart Contracts Deployed</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Contact / Hire Me Section */}
      <section className="contact-section-wrapper" id="contact">
        <div className="container section-padding contact-section">
          <ScrollReveal className="reveal-hidden">
            <span className="small-label" style={{ display: "block", marginBottom: "0.75rem", fontWeight: 600, color: "var(--accent)" }}>Let's build something</span>
            <h2 className="title-md" style={{ marginTop: 0, marginBottom: "1.5rem" }}>
              Working on something serious?
            </h2>
            <p className="body-text" style={{ maxWidth: "600px", margin: "0 auto 3rem" }}>
              I'm currently available for new projects. Send a message to discuss scoping, timelines, and how we can bring your on-chain protocol or product to life.
            </p>
          </ScrollReveal>

          <ScrollReveal className="reveal-hidden" delay={150}>
            {/* Dark Brand Contact Form */}
            <ContactForm />
            
            {/* Social Links Row */}
            {hasSocials && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", marginTop: "4.5rem" }}>
                <span className="small-label" style={{ fontSize: "0.85rem", opacity: 0.6 }}>Or connect via socials</span>
                <div className="social-links" style={{ gap: "1.2rem", display: "flex" }}>
                  {socials.githubUrl && (
                    <a href={socials.githubUrl} target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="GitHub" style={{ width: "40px", height: "40px" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </a>
                  )}
                  {socials.twitterUrl && (
                    <a href={socials.twitterUrl} target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Twitter" style={{ width: "40px", height: "40px" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                  )}
                  {socials.linkedinUrl && (
                    <a href={socials.linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="LinkedIn" style={{ width: "40px", height: "40px" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  )}
                  {socials.telegramUrl && (
                    <a href={socials.telegramUrl} target="_blank" rel="noopener noreferrer" className="social-icon-btn" aria-label="Telegram" style={{ width: "40px", height: "40px" }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "18px", height: "18px" }}>
                        <path d="M22 2L11 13" />
                        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      <Footer socials={socials} />
    </div>
  );
}
