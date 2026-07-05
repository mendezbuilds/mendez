import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/supabase";
import Footer from "@/components/Footer";

export const revalidate = 0;

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  const project = await getProjectBySlug(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="container" style={{ paddingTop: "8rem", flexGrow: 1, paddingBottom: "6rem" }}>
        
        {/* Back Link */}
        <Link href="/" className="back-link" style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", fontWeight: 500 }}>
          ← Return to portfolio
        </Link>

        {/* Project Header */}
        <div style={{ marginBottom: "3rem" }}>
          <span className="small-label" style={{ fontSize: "0.9rem" }}>
            Case Study
          </span>
          <h1 className="title-md" style={{ marginTop: "0.5rem" }}>
            {project.title}
          </h1>
          <p className="body-text" style={{ fontSize: "1.2rem", marginTop: "1rem", maxWidth: "800px" }}>
            {project.oneLiner}
          </p>
        </div>

        {/* Project Info Layout */}
        <div className="project-details-grid">
          
          {/* Main Area */}
          <div>
            <div style={{ marginBottom: "3rem" }}>
              <h3 className="detail-section-title">The Problem</h3>
              <p className="body-text" style={{ whiteSpace: "pre-wrap" }}>
                {project.problem}
              </p>
            </div>

            <div style={{ marginBottom: "3rem" }}>
              <h3 className="detail-section-title">The Solution</h3>
              <p className="body-text" style={{ whiteSpace: "pre-wrap" }}>
                {project.description}
              </p>
            </div>

            {/* Video Demo */}
            {project.videoUrl && (
              <div style={{ marginBottom: "3rem" }}>
                <h3 className="detail-section-title">Product Demo</h3>
                <div style={{ background: "#050505", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", aspectRatio: "16/10" }}>
                  <video
                    src={project.videoUrl}
                    poster={project.thumbnailUrl || undefined}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            )}

            {/* Thumbnail Fallback */}
            {!project.videoUrl && project.thumbnailUrl && (
              <div style={{ marginBottom: "3rem" }}>
                <h3 className="detail-section-title">Project Thumbnail</h3>
                <div style={{ background: "#050505", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", aspectRatio: "16/10", position: "relative" }}>
                  <Image
                    src={project.thumbnailUrl}
                    alt={project.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}

            {/* Development Phases */}
            {project.phases && project.phases.length > 0 && (
              <div>
                <h3 className="detail-section-title">Development Phases</h3>
                <div style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "1.5rem 2rem" }}>
                  {project.phases.map((phase, idx) => (
                    <div key={idx} className="phase-item" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                      <span style={{ fontWeight: 400, fontFamily: "var(--font-body)" }}>{phase.name}</span>
                      <span
                        className={`status-badge ${
                          phase.status === "done"
                            ? "status-done"
                            : phase.status === "planned"
                            ? "status-planned"
                            : "status-addon"
                        }`}
                      >
                        {phase.status === "deferred-paid-addon" ? "Add-on" : phase.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div>
            {/* Project Status */}
            <div style={{ marginBottom: "2.5rem" }}>
              <h3 className="detail-section-title">Project Status</h3>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.5rem" }}>
                <span className="status-badge status-done" style={{ fontSize: "0.85rem", padding: "0.45rem 1rem", borderRadius: "100px", width: "100%", textTransform: "none", textAlign: "center", fontFamily: "var(--font-body)" }}>
                  {project.status.replace("-", " ")}
                </span>
              </div>
            </div>

            {/* Project Stack */}
            <div style={{ marginBottom: "2.5rem" }}>
              <h3 className="detail-section-title">Technology Stack</h3>
              <div className="card-stack" style={{ marginTop: "0.5rem" }}>
                {project.stack.map((tech) => (
                  <span key={tech} className="tag-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Links */}
            {(project.githubUrl || project.liveUrl) && (
              <div style={{ marginBottom: "2.5rem" }}>
                <h3 className="detail-section-title">Project Links</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "1rem" }}>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      className="btn-outlined"
                      style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem", textAlign: "center" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Site
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      className="btn-secondary"
                      style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem", textAlign: "center" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Code
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Smart Contracts */}
            {project.contracts && project.contracts.length > 0 && (
              <div>
                <h3 className="detail-section-title">Smart Contracts</h3>
                <div style={{ marginTop: "1rem" }}>
                  {project.contracts.map((contract, idx) => (
                    <div key={idx} className="contract-card" style={{ borderRadius: "12px", borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className="small-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                        {contract.name}
                      </span>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginTop: "0.2rem", fontFamily: "var(--font-body)" }}>
                        Network: {contract.network}
                      </span>
                      <code className="contract-address">
                        {contract.address}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
