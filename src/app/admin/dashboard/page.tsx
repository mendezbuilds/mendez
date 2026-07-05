"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  supabase,
  isSupabaseConfigured,
  getProjects,
  upsertProject,
  deleteProject,
  getAboutStory,
  saveAboutStory,
  getAvatarUrl,
  uploadAvatarFile,
  getChatWidgetCode,
  saveChatWidgetCode,
} from "@/lib/supabase";
import { Project, Phase, Contract } from "@/lib/projectsData";

export default function AdminDashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // About and Avatar state
  const [aboutStory, setAboutStory] = useState("");
  const [aboutLoading, setAboutLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Chat Widget state
  const [chatWidgetCode, setChatWidgetCode] = useState("");
  const [chatWidgetLoading, setChatWidgetLoading] = useState(false);
  const [chatWidgetActive, setChatWidgetActive] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formSlug, setFormSlug] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formOneLiner, setFormOneLiner] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formProblem, setFormProblem] = useState("");
  const [formStack, setFormStack] = useState("");
  const [formStatus, setFormStatus] = useState<Project["status"]>("active");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formVideoUrl, setFormVideoUrl] = useState("");
  const [formGithubUrl, setFormGithubUrl] = useState("");
  const [formLiveUrl, setFormLiveUrl] = useState("");
  const [formThumbnailUrl, setFormThumbnailUrl] = useState("");

  // Sub-items Form State
  const [formPhases, setFormPhases] = useState<Phase[]>([]);
  const [formContracts, setFormContracts] = useState<Contract[]>([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Auth Protection Check
  useEffect(() => {
    const checkAuth = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push("/admin");
        } else {
          setAuthChecked(true);
        }
      } else {
        const mockAuth = localStorage.getItem("mendez_mock_auth");
        if (mockAuth !== "true") {
          router.push("/admin");
        } else {
          setAuthChecked(true);
        }
      }
    };
    checkAuth();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const projData = await getProjects();
      setProjects(projData);

      const story = await getAboutStory();
      setAboutStory(story);

      const avatar = await getAvatarUrl();
      setAvatarUrl(avatar);

      const chatWidget = await getChatWidgetCode();
      setChatWidgetCode(chatWidget || "");
      setChatWidgetActive(!!chatWidget);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load data once authenticated
  useEffect(() => {
    if (!authChecked) return;
    fetchData();
  }, [authChecked]);

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem("mendez_mock_auth");
    }
    router.push("/admin");
  };

  // Sub-item Handlers: Phases
  const addPhaseRow = () => {
    setFormPhases([...formPhases, { name: "", status: "planned" }]);
  };

  const updatePhaseRow = (index: number, field: keyof Phase, value: string) => {
    const updated = [...formPhases];
    updated[index] = { ...updated[index], [field]: value };
    setFormPhases(updated);
  };

  const removePhaseRow = (index: number) => {
    setFormPhases(formPhases.filter((_, idx) => idx !== index));
  };

  // Sub-item Handlers: Contracts
  const addContractRow = () => {
    setFormContracts([...formContracts, { name: "", address: "", network: "Ethereum Mainnet" }]);
  };

  const updateContractRow = (index: number, field: keyof Contract, value: string) => {
    const updated = [...formContracts];
    updated[index] = { ...updated[index], [field]: value };
    setFormContracts(updated);
  };

  const removeContractRow = (index: number) => {
    setFormContracts(formContracts.filter((_, idx) => idx !== index));
  };

  // Form Reset
  const resetForm = () => {
    setIsEditing(false);
    setFormSlug("");
    setFormTitle("");
    setFormOneLiner("");
    setFormDescription("");
    setFormProblem("");
    setFormStack("");
    setFormStatus("active");
    setFormFeatured(false);
    setFormVideoUrl("");
    setFormGithubUrl("");
    setFormLiveUrl("");
    setFormThumbnailUrl("");
    setFormPhases([]);
    setFormContracts([]);
    setMessage("");
    setError("");
  };

  // Set form to edit project
  const handleEditInit = (project: Project) => {
    setIsEditing(true);
    setFormSlug(project.slug);
    setFormTitle(project.title);
    setFormOneLiner(project.oneLiner);
    setFormDescription(project.description);
    setFormProblem(project.problem);
    setFormStack(project.stack.join(", "));
    setFormStatus(project.status);
    setFormFeatured(project.featured);
    setFormVideoUrl(project.videoUrl || "");
    setFormGithubUrl(project.githubUrl || "");
    setFormLiveUrl(project.liveUrl || "");
    setFormThumbnailUrl(project.thumbnailUrl || "");
    setFormPhases(project.phases || []);
    setFormContracts(project.contracts || []);
    setMessage("");
    setError("");
  };

  // Handle Save Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitLoading(true);

    if (!formSlug || !formTitle || !formOneLiner || !formDescription || !formProblem) {
      setError("Please fill out all required fields.");
      setSubmitLoading(false);
      return;
    }

    const parsedStack = formStack
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const payload: Project = {
      slug: formSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, ""),
      title: formTitle.trim(),
      oneLiner: formOneLiner.trim(),
      description: formDescription.trim(),
      problem: formProblem.trim(),
      stack: parsedStack,
      status: formStatus,
      phases: formPhases.filter((p) => p.name.trim() !== ""),
      videoUrl: formVideoUrl.trim(),
      githubUrl: formGithubUrl.trim(),
      liveUrl: formLiveUrl.trim(),
      contracts: formContracts.filter((c) => c.name.trim() !== "" && c.address.trim() !== ""),
      featured: formFeatured,
      thumbnailUrl: formThumbnailUrl.trim(),
    };

    try {
      await upsertProject(payload);
      setMessage(`Project "${payload.title}" saved successfully.`);
      resetForm();
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to save project.";
      setError(errMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle Delete Project
  const handleDeleteProject = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project: "${title}"?`)) return;

    setMessage("");
    setError("");
    try {
      await deleteProject(slug);
      setMessage(`Project "${title}" deleted successfully.`);
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to delete project.";
      setError(errMsg);
    }
  };

  // Handle Save About Copy
  const handleSaveAbout = async () => {
    setMessage("");
    setError("");
    setAboutLoading(true);
    try {
      await saveAboutStory(aboutStory);
      setMessage("About bio story updated successfully.");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to save bio story.";
      setError(errMsg);
    } finally {
      setAboutLoading(false);
    }
  };

  // Handle Avatar Image Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setMessage("");
    setError("");
    setAvatarUploading(true);

    try {
      const file = files[0];
      const uploadedUrl = await uploadAvatarFile(file);
      setAvatarUrl(uploadedUrl);
      setMessage("Avatar image uploaded and updated successfully.");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to upload avatar.";
      setError(errMsg);
    } finally {
      setAvatarUploading(false);
    }
  };

  // Handle Save Chat Widget
  const handleSaveChatWidget = async () => {
    setMessage("");
    setError("");
    setChatWidgetLoading(true);
    try {
      const codeToSave = chatWidgetCode.trim() || null;
      await saveChatWidgetCode(codeToSave);
      setChatWidgetActive(!!codeToSave);
      setMessage(codeToSave ? "Chat widget updated successfully." : "Chat widget removed.");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to save chat widget.";
      setError(errMsg);
    } finally {
      setChatWidgetLoading(false);
    }
  };

  // Handle Clear Chat Widget
  const handleClearChatWidget = async () => {
    setChatWidgetCode("");
    setMessage("");
    setError("");
    setChatWidgetLoading(true);
    try {
      await saveChatWidgetCode(null);
      setChatWidgetActive(false);
      setMessage("Chat widget removed.");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to remove chat widget.";
      setError(errMsg);
    } finally {
      setChatWidgetLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="container" style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="small-label">[ Authenticating... ]</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "8rem", paddingBottom: "8rem", minHeight: "100vh" }}>
      
      {/* Header Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem", marginBottom: "3rem" }}>
        <div>
          <span className="small-label" style={{ color: "var(--text-secondary)" }}>
            {isSupabaseConfigured ? "Connected to Supabase" : "Using local mock database"}
          </span>
          <h1 className="title-md" style={{ marginTop: "0.5rem" }}>Admin Dashboard</h1>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button className="btn-secondary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }} onClick={fetchData} disabled={loading}>
            Refresh data
          </button>
          <button className="btn-filled" style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }} onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>

      {message && (
        <div className="small-label" style={{ color: "var(--color-success)", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.15)", padding: "1rem", borderRadius: "12px", marginBottom: "2.5rem" }}>
          Success: {message}
        </div>
      )}

      {error && (
        <div className="form-error" style={{ marginBottom: "2.5rem", borderRadius: "12px" }}>
          Error: {error}
        </div>
      )}

      <div className="grid-2" style={{ alignItems: "flex-start", gap: "4rem" }}>
        
        {/* Left Side: Avatar, About & Project List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
          
          {/* Avatar Upload Panel */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border-rest)", borderRadius: "20px", padding: "2rem" }}>
            <span className="small-label">Profile Configuration</span>
            <h3 className="title-sm" style={{ fontSize: "1.2rem", marginTop: "0.5rem", marginBottom: "1.5rem" }}>Hero Avatar Photo</h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
              <div className="avatar-wrapper" style={{ width: "90px", height: "90px", border: "1px solid var(--accent)", padding: "2px", borderRadius: "50%" }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar Preview" className="avatar-img" style={{ borderRadius: "50%", width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div className="avatar-monogram" style={{ fontSize: "2rem", borderRadius: "50%" }}>M</div>
                )}
              </div>
              
              <div style={{ flexGrow: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={avatarUploading}
                  style={{ display: "none" }}
                  id="avatar-input"
                />
                <label
                  htmlFor="avatar-input"
                  className="btn-secondary"
                  style={{ cursor: "pointer", fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}
                >
                  {avatarUploading ? "Uploading image..." : "Choose image file"}
                </label>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", marginTop: "0.75rem", fontFamily: "var(--font-body)" }}>
                  Uploads image directly to the Supabase Storage Bucket `avatars`.
                </p>
              </div>
            </div>
          </div>

          {/* About Section Editor */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border-rest)", borderRadius: "20px", padding: "2rem" }}>
            <span className="small-label">Bio Story Editor</span>
            <h3 className="title-sm" style={{ fontSize: "1.2rem", marginTop: "0.5rem", marginBottom: "1.5rem" }}>About Narrative Copy</h3>
            
            <div className="form-group">
              <textarea
                className="form-input"
                rows={7}
                style={{ resize: "vertical", fontSize: "0.9rem", lineHeight: "1.6", borderRadius: "12px" }}
                placeholder="Write your story here. Use double newlines for paragraphs."
                value={aboutStory}
                onChange={(e) => setAboutStory(e.target.value)}
                disabled={aboutLoading}
              />
            </div>
            
            <button
              onClick={handleSaveAbout}
              className="btn-primary"
              style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}
              disabled={aboutLoading}
            >
              {aboutLoading ? "Saving story..." : "Save bio text"}
            </button>
          </div>

          {/* Chat Widget Section */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border-rest)", borderRadius: "20px", padding: "2rem" }}>
            <span className="small-label">Integration Settings</span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
              <h3 className="title-sm" style={{ fontSize: "1.2rem", margin: 0 }}>Chat Widget Embed Code</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: chatWidgetActive ? "var(--color-success)" : "rgba(255, 255, 255, 0.2)" }} />
                <span className="small-label" style={{ fontSize: "0.8rem", color: chatWidgetActive ? "var(--text-primary)" : "var(--text-secondary)" }}>
                  {chatWidgetActive ? "Widget active" : "No widget set"}
                </span>
              </div>
            </div>
            
            <div className="form-group">
              <textarea
                className="form-input"
                rows={5}
                style={{ resize: "vertical", fontSize: "0.9rem", lineHeight: "1.6", borderRadius: "12px", fontFamily: "monospace" }}
                placeholder="Paste your Crisp, Tawk.to, or any chat widget embed code here..."
                value={chatWidgetCode}
                onChange={(e) => setChatWidgetCode(e.target.value)}
                disabled={chatWidgetLoading}
              />
            </div>
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={handleSaveChatWidget}
                className="btn-primary"
                style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem" }}
                disabled={chatWidgetLoading}
              >
                {chatWidgetLoading ? "Saving..." : "Save widget"}
              </button>
              <button
                onClick={handleClearChatWidget}
                className="btn-secondary"
                style={{ fontSize: "0.85rem", padding: "0.6rem 1.2rem", color: "var(--color-error)", borderColor: "rgba(239, 68, 68, 0.2)" }}
                disabled={chatWidgetLoading || !chatWidgetActive}
              >
                Clear widget
              </button>
            </div>
          </div>

          {/* Managed Projects List */}
          <div>
            <h3 className="title-sm" style={{ borderBottom: "1px solid var(--border-rest)", paddingBottom: "0.5rem", marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              Managed Repositories ({projects.length})
            </h3>

            {loading ? (
              <div className="body-text">Scanning repositories...</div>
            ) : projects.length === 0 ? (
              <div className="body-text" style={{ color: "var(--text-secondary)" }}>No projects found</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {projects.map((proj) => (
                  <div key={proj.slug} className="admin-project-card" style={{ borderRadius: "16px" }}>
                    <div>
                      <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.05rem", color: "var(--text-primary)" }}>
                        {proj.title} {proj.featured && <span className="accent-text" style={{ fontSize: "0.8rem", marginLeft: "0.5rem" }}>★ Featured</span>}
                      </h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem", fontFamily: "var(--font-body)" }}>
                        /{proj.slug} • Build status: {proj.status}
                      </p>
                    </div>
                    <div className="admin-project-actions">
                      <button
                        className="btn-secondary"
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                        onClick={() => handleEditInit(proj)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-secondary"
                        style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", borderColor: "rgba(239, 68, 68, 0.2)", color: "var(--color-error)" }}
                        onClick={() => handleDeleteProject(proj.slug, proj.title)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Create/Edit Project Form */}
        <div style={{ background: "var(--surface)", border: "1px solid var(--border-rest)", borderRadius: "20px", padding: "2.5rem" }}>
          <span className="small-label">Project Configuration</span>
          <h3 className="title-sm" style={{ fontSize: "1.2rem", marginTop: "0.5rem", marginBottom: "2rem" }}>
            {isEditing ? `Edit: ${formTitle}` : "Register New Project"}
          </h3>

          <form onSubmit={handleSaveProject}>
            <div className="form-group">
              <label className="form-label">Project Slug *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. gatewrx"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                disabled={isEditing || submitLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Gatewrx"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                disabled={submitLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">One-Line Pitch *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Enterprise access gating protocol."
                value={formOneLiner}
                onChange={(e) => setFormOneLiner(e.target.value)}
                disabled={submitLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">The Problem / Use Case *</label>
              <textarea
                className="form-input"
                rows={4}
                style={{ resize: "vertical" }}
                placeholder="Contextualize the core issue..."
                value={formProblem}
                onChange={(e) => setFormProblem(e.target.value)}
                disabled={submitLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description / Solution *</label>
              <textarea
                className="form-input"
                rows={5}
                style={{ resize: "vertical" }}
                placeholder="Describe how the solution resolves the issue..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                disabled={submitLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Technical Stack (Comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Next.js, Solidity, Viem"
                value={formStack}
                onChange={(e) => setFormStack(e.target.value)}
                disabled={submitLoading}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Build Status</label>
                <select
                  className="form-input"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as Project["status"])}
                  disabled={submitLoading}
                  style={{ background: "#050505" }}
                >
                  <option value="active">Active</option>
                  <option value="phase-in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="available-for-clients">Available</option>
                </select>
              </div>

              <div className="form-group" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", paddingLeft: "0.5rem" }}>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", marginTop: "1.2rem" }}>
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    disabled={submitLoading}
                    style={{ width: "16px", height: "16px", accentColor: "var(--accent)" }}
                  />
                  Flagship Build
                </label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Demo Video Link (.mp4 URL)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. /videos/gatewrx.mp4"
                value={formVideoUrl}
                onChange={(e) => setFormVideoUrl(e.target.value)}
                disabled={submitLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. https://github.com/..."
                value={formGithubUrl}
                onChange={(e) => setFormGithubUrl(e.target.value)}
                disabled={submitLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Live Deployment URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. https://gatewrx.xyz"
                value={formLiveUrl}
                onChange={(e) => setFormLiveUrl(e.target.value)}
                disabled={submitLoading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Card Thumbnail Image Path</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. /images/gatewrx-thumb.jpg"
                value={formThumbnailUrl}
                onChange={(e) => setFormThumbnailUrl(e.target.value)}
                disabled={submitLoading}
              />
            </div>

            {/* Development Phases Section */}
            <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-rest)", paddingBottom: "0.4rem", marginBottom: "0.8rem" }}>
                <span className="small-label" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  Development Phases
                </span>
                <button type="button" className="small-label" style={{ fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }} onClick={addPhaseRow}>
                  + Add Phase
                </button>
              </div>

              {formPhases.map((phase, index) => (
                <div key={index} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ flexGrow: 1, padding: "0.5rem", borderRadius: "8px" }}
                    placeholder="Phase name"
                    value={phase.name}
                    onChange={(e) => updatePhaseRow(index, "name", e.target.value)}
                  />
                  <select
                    className="form-input"
                    style={{ width: "120px", padding: "0.5rem", background: "#050505", borderRadius: "8px" }}
                    value={phase.status}
                    onChange={(e) => updatePhaseRow(index, "status", e.target.value)}
                  >
                    <option value="done">Done</option>
                    <option value="planned">Planned</option>
                    <option value="deferred-paid-addon">Add-on</option>
                  </select>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: "0.5rem", color: "var(--color-error)", borderColor: "rgba(239, 68, 68, 0.2)", borderRadius: "8px" }}
                    onClick={() => removePhaseRow(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* Smart Contracts Section */}
            <div style={{ marginTop: "1.5rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-rest)", paddingBottom: "0.4rem", marginBottom: "0.8rem" }}>
                <span className="small-label" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  Smart Contract Deployments
                </span>
                <button type="button" className="small-label" style={{ fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }} onClick={addContractRow}>
                  + Add Contract
                </button>
              </div>

              {formContracts.map((contract, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "column", gap: "0.4rem", background: "rgba(0, 0, 0, 0.3)", padding: "0.8rem", borderRadius: "8px", marginBottom: "0.8rem", border: "1px solid var(--border-rest)" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: "50%", padding: "0.5rem", borderRadius: "8px" }}
                      placeholder="Contract Name"
                      value={contract.name}
                      onChange={(e) => updateContractRow(index, "name", e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: "50%", padding: "0.5rem", borderRadius: "8px" }}
                      placeholder="Network"
                      value={contract.network}
                      onChange={(e) => updateContractRow(index, "network", e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="text"
                      className="form-input"
                      style={{ flexGrow: 1, padding: "0.5rem", borderRadius: "8px" }}
                      placeholder="Contract Address (0x...)"
                      value={contract.address}
                      onChange={(e) => updateContractRow(index, "address", e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: "0.5rem", color: "var(--color-error)", borderColor: "rgba(239, 68, 68, 0.2)", borderRadius: "8px" }}
                      onClick={() => removeContractRow(index)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ flexGrow: 1 }}
                disabled={submitLoading}
              >
                {submitLoading ? "Saving project..." : isEditing ? "Update project" : "Publish project"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                  disabled={submitLoading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
