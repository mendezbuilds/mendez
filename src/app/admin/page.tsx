"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const checkUser = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push("/admin/dashboard");
        }
      } else {
        const mockAuth = localStorage.getItem("mendez_mock_auth");
        if (mockAuth === "true") {
          router.push("/admin/dashboard");
        }
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all credentials.");
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        // Real Supabase Authentication
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        router.push("/admin/dashboard");
      } else {
        // Mock Authentication Fallback
        if (email === "mendez@builtbymendez.com" && password === "password") {
          localStorage.setItem("mendez_mock_auth", "true");
          router.push("/admin/dashboard");
        } else {
          setError("Invalid credentials. Hint: use mendez@builtbymendez.com / password");
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "An authentication error occurred.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div 
        className="container" 
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          padding: "3rem 1.5rem"
        }}
      >
        <div 
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "var(--surface)",
            border: "1px solid var(--border-rest)",
            borderRadius: "8px",
            padding: "2.5rem",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.9)",
            position: "relative",
            zIndex: 10
          }}
        >
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <span className="small-label">Secure Portal</span>
            <h1 className="title-sm" style={{ marginTop: "0.5rem", fontSize: "1.5rem" }}>
              Administrator Portal
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.5rem", fontFamily: "var(--font-body)" }}>
              {isSupabaseConfigured 
                ? "Sign in using your Supabase account." 
                : "Running in mock mode. Enter mendez@builtbymendez.com / password"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", textTransform: "none", letterSpacing: "normal" }} htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="mendez@builtbymendez.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
                style={{ borderRadius: "8px" }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", textTransform: "none", letterSpacing: "normal" }} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
                style={{ borderRadius: "8px" }}
              />
            </div>

            {error && (
              <div 
                className="form-error" 
                style={{ margin: "1rem 0", textAlign: "left", fontFamily: "var(--font-body)", borderRadius: "8px" }}
              >
                Error: {error}
              </div>
            )}

            <button 
              type="submit" 
              className="btn-filled" 
              style={{ width: "100%", marginTop: "1rem" }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Link href="/" className="small-label" style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Return to portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
