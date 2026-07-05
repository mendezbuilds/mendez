import { createClient } from "@supabase/supabase-js";
import { Project, MOCK_PROJECTS, Phase, Contract } from "./projectsData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = 
  supabaseUrl.trim() !== "" && 
  supabaseAnonKey.trim() !== "" &&
  !supabaseUrl.includes("your-supabase-url");

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export function isMockMode(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("mendez_mock_auth") === "true";
}

// Database to TypeScript Model Mapper
function mapRowToProject(row: Record<string, unknown>): Project {
  return {
    slug: String(row["slug"] || ""),
    title: String(row["title"] || ""),
    oneLiner: String(row["one_liner"] || ""),
    description: String(row["description"] || ""),
    problem: String(row["problem"] || ""),
    stack: (row["stack"] as string[]) || [],
    status: row["status"] as Project["status"],
    phases: (row["phases"] as unknown as Phase[]) || [],
    videoUrl: String(row["video_url"] || ""),
    githubUrl: String(row["github_url"] || ""),
    liveUrl: String(row["live_url"] || ""),
    contracts: (row["contracts"] as unknown as Contract[]) || [],
    featured: !!row["featured"],
    thumbnailUrl: String(row["thumbnail_url"] || ""),
  };
}

// TypeScript to Database Model Mapper
function mapProjectToRow(project: Project) {
  return {
    slug: project.slug,
    title: project.title,
    one_liner: project.oneLiner,
    description: project.description,
    problem: project.problem,
    stack: project.stack,
    status: project.status,
    phases: project.phases,
    video_url: project.videoUrl,
    github_url: project.githubUrl,
    live_url: project.liveUrl,
    contracts: project.contracts,
    featured: project.featured,
    thumbnail_url: project.thumbnailUrl,
  };
}

// Global In-Memory Cache for Admin Mock mutations
let mockProjectsCache: Project[] = [...MOCK_PROJECTS];

/* DATA ACCESS SERVICE METHODS: PROJECTS */

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured || !supabase || isMockMode()) {
    console.warn("Supabase is not configured or in mock mode. Falling back to mock data.");
    return mockProjectsCache;
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      // If table is empty, seed it with mock projects
      await seedMockData();
      return mockProjectsCache;
    }
    
    return data.map(mapRowToProject);
  } catch (error) {
    console.error("Failed to fetch projects from Supabase. Falling back to mock cache:", error);
    return mockProjectsCache;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured || !supabase || isMockMode()) {
    return mockProjectsCache.find(p => p.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found code
      throw error;
    }
    return data ? mapRowToProject(data) : null;
  } catch (error) {
    console.error(`Failed to fetch project by slug (${slug}) from Supabase. Falling back to mock cache:`, error);
    return mockProjectsCache.find(p => p.slug === slug) || null;
  }
}

export async function upsertProject(project: Project): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || isMockMode()) {
    const existingIndex = mockProjectsCache.findIndex(p => p.slug === project.slug);
    if (existingIndex >= 0) {
      mockProjectsCache[existingIndex] = project;
    } else {
      mockProjectsCache.push(project);
    }
    return true;
  }

  try {
    const row = mapProjectToRow(project);
    const { error } = await supabase
      .from("projects")
      .upsert(row, { onConflict: 'slug' });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Failed to upsert project to Supabase:", error);
    throw error;
  }
}

export async function deleteProject(slug: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || isMockMode()) {
    mockProjectsCache = mockProjectsCache.filter(p => p.slug !== slug);
    return true;
  }

  try {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("slug", slug);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Failed to delete project from Supabase:", error);
    throw error;
  }
}

// Seed Mock Data Helper
async function seedMockData() {
  if (!supabase) return;
  try {
    const rows = MOCK_PROJECTS.map(mapProjectToRow);
    const { error } = await supabase
      .from("projects")
      .insert(rows);
    if (error) console.error("Error seeding mock data into Supabase:", error);
  } catch (e) {
    console.error("Failed seeding mock data:", e);
  }
}

/* DATA ACCESS SERVICE METHODS: SETTINGS (ABOUT & AVATAR) */

const DEFAULT_ABOUT_STORY = `I'm Mendez, a freelance developer based in Lagos, Nigeria. I build across web2 and web3 — from token-gated access systems and DAO tooling to production-ready backend infrastructure and SaaS products.

I work in clearly scoped phases, communicate proactively, and ship real, working software — not mockups. Every project I take on gets the same level of care I put into my own work.

Currently available for new engagements. If you're building something serious, let's talk.`;

export async function getAboutStory(): Promise<string> {
  if (!isSupabaseConfigured || !supabase || isMockMode()) {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mendez_about_story") || DEFAULT_ABOUT_STORY;
    }
    return DEFAULT_ABOUT_STORY;
  }
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("about_text")
      .eq("id", "singleton")
      .single();
      
    if (error) {
      if (error.code === "PGRST116") return DEFAULT_ABOUT_STORY;
      throw error;
    }
    return data && data.about_text ? data.about_text : DEFAULT_ABOUT_STORY;
  } catch (err) {
    console.warn("Could not load about story from settings table. Falling back to default:", err);
    if (typeof window !== "undefined") {
      return localStorage.getItem("mendez_about_story") || DEFAULT_ABOUT_STORY;
    }
    return DEFAULT_ABOUT_STORY;
  }
}

export async function saveAboutStory(story: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || isMockMode()) {
    if (typeof window !== "undefined") {
      localStorage.setItem("mendez_about_story", story);
    }
    return true;
  }
  try {
    const { error } = await supabase
      .from("site_settings")
      .update({ about_text: story, updated_at: new Date().toISOString() })
      .eq("id", "singleton");
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to save about story to settings table:", err);
    if (typeof window !== "undefined") {
      localStorage.setItem("mendez_about_story", story);
      return true;
    }
    throw err;
  }
}

export async function getAvatarUrl(): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase || isMockMode()) {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mendez_mock_avatar");
    }
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("avatar_url")
      .eq("id", "singleton")
      .single();
      
    if (error) {
      if (typeof window !== "undefined") {
        return localStorage.getItem("mendez_mock_avatar");
      }
      return null;
    }
    return data ? data.avatar_url : null;
  } catch (err) {
    console.warn("Failed to retrieve avatar_url setting, falling back to local:", err);
    if (typeof window !== "undefined") {
      return localStorage.getItem("mendez_mock_avatar");
    }
    return null;
  }
}

export async function uploadAvatarFile(file: File): Promise<string> {
  if (!isSupabaseConfigured || !supabase || isMockMode()) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        localStorage.setItem("mendez_mock_avatar", base64data);
        resolve(base64data);
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    
    // Step 1: Upload file to Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (uploadError) throw uploadError;
    
    // Step 2: Get the public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(uploadData.path);
      
    const publicUrl = urlData.publicUrl;
      
    // Step 3: Save the public URL to site_settings
    const { error: settingsError } = await supabase
      .from("site_settings")
      .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
      .eq("id", "singleton");
      
    if (settingsError) throw settingsError;
      
    return publicUrl;
  } catch (err) {
    console.warn("Failed to upload avatar to live Supabase storage. Falling back to local storage:", err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        localStorage.setItem("mendez_mock_avatar", base64data);
        resolve(base64data);
      };
      reader.readAsDataURL(file);
    });
  }
}

export async function getChatWidgetCode(): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase || isMockMode()) {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mendez_chat_widget");
    }
    return null;
  }
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("chat_widget_code")
      .eq("id", "singleton")
      .single();
      
    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data ? data.chat_widget_code : null;
  } catch (err) {
    console.warn("Failed to retrieve chat_widget_code:", err);
    if (typeof window !== "undefined") {
      return localStorage.getItem("mendez_chat_widget");
    }
    return null;
  }
}

export async function saveChatWidgetCode(code: string | null): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase || isMockMode()) {
    if (typeof window !== "undefined") {
      if (code === null) localStorage.removeItem("mendez_chat_widget");
      else localStorage.setItem("mendez_chat_widget", code);
    }
    return true;
  }
  try {
    const { error } = await supabase
      .from("site_settings")
      .update({ chat_widget_code: code, updated_at: new Date().toISOString() })
      .eq("id", "singleton");
      
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Failed to save chat_widget_code:", err);
    if (typeof window !== "undefined") {
      if (code === null) localStorage.removeItem("mendez_chat_widget");
      else localStorage.setItem("mendez_chat_widget", code);
      return true;
    }
    throw err;
  }
}

