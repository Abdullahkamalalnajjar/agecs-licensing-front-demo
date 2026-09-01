"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { postIdentityTokenGenerate, postIdentityTokenGoogle } from "@/client";
import { GoogleLogin } from "@react-oauth/google";
import { client } from "@/client/client.gen";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError]               = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const redirect = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      const role = [decoded.role, decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]]
        .flat().filter(Boolean)[0];
      router.push(role === "Student" ? "/products" : "/products");
    } catch {
      router.push("/products");
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setGoogleLoading(true);
    setError("");
    try {
      client.setConfig({ baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://localhost:5003" });
      const res = await postIdentityTokenGoogle({ body: { idToken: credentialResponse.credential } });
      if ((res.data as any)?.isSuccess && (res.data as any)?.value?.accessToken) {
        const token = (res.data as any).value.accessToken;
        login(token);
        redirect(token);
      } else {
        setError(
          (res.data as any)?.errors?.map((e: any) => e.description).filter(Boolean).join(", ") ||
          "Google sign-in failed."
        );
      }
    } catch (err: any) {
      setError(err?.body?.message || "An error occurred during Google login.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="login-container">

      {/* ── Left panel — Geist hero with mesh gradient ── */}
      <div className="login-left">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-xs)", marginBottom: "var(--sp-3xl)", position: "relative" }}>
          <div style={{
            width: 32, height: 32,
            background: "var(--ink)",
            borderRadius: "var(--r-sm)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="12" viewBox="0 0 14 12" fill="white">
              <path d="M7 0L14 12H0L7 0Z" />
            </svg>
          </div>
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-ink)", letterSpacing: "-0.02em" }}>
            AGECS
          </span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            fontWeight: 500,
            color: "var(--text-mute)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginLeft: 4,
          }}>
            Licensing
          </span>
        </div>

        {/* Headline */}
        <div style={{ maxWidth: 380, position: "relative" }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            fontWeight: 500,
            color: "var(--text-mute)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "var(--sp-md)",
          }}>
            License management
          </p>

          <h1 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            color: "var(--text-ink)",
            marginBottom: "var(--sp-lg)",
          }}>
            Manage licenses with confidence.
          </h1>

          <p style={{
            fontSize: "0.9375rem",
            color: "var(--text-body)",
            lineHeight: 1.65,
            marginBottom: "var(--sp-2xl)",
          }}>
            A powerful admin dashboard to manage software products, promocodes, and customer support — all in one place.
          </p>

          {/* Feature list */}
          {[
            "Full product & license management",
            "Promo codes with usage tracking",
            "Integrated support ticket system",
          ].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: "var(--sp-sm)", marginBottom: "var(--sp-sm)" }}>
              <div style={{
                width: 18, height: 18,
                border: "1px solid var(--hairline)",
                borderRadius: "var(--r-full)",
                background: "var(--canvas-elevated)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--text-ink)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span style={{ fontSize: "0.875rem", color: "var(--text-body)" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — Login form ── */}
      <div className="login-right">
        <div style={{ width: "100%", maxWidth: 380 }}>

          {/* Header */}
          <div style={{ marginBottom: "var(--sp-xl)" }}>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "var(--text-ink)",
              marginBottom: 6,
            }}>
              Welcome back
            </h2>
            <p style={{ color: "var(--text-body)", fontSize: "0.875rem" }}>
              Sign in to your account to continue.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert-error" style={{ marginBottom: "var(--sp-md)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Google sign-in */}
          <div style={{ position: "relative", width: "100%", height: 40 }}>
            <button
              type="button"
              id="google-signin-btn"
              disabled={googleLoading}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--sp-xs)",
                background: "var(--canvas-elevated)",
                border: "1px solid var(--hairline)",
                borderRadius: "var(--r-sm)",
                color: "var(--text-ink)",
                fontSize: "0.875rem", fontWeight: 500,
                cursor: googleLoading ? "not-allowed" : "pointer",
                transition: "background 0.15s ease, border-color 0.15s ease",
                fontFamily: "inherit",
                opacity: googleLoading ? 0.6 : 1,
                zIndex: 1,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--hairline-soft)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#d4d4d4";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--canvas-elevated)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--hairline)";
              }}
            >
              {googleLoading ? (
                <span className="spinner-dark" />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? "Connecting…" : "Continue with Google"}
            </button>

            {/* Hidden Google SDK button — perfectly overlays the custom button */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.0001, zIndex: 10, overflow: "hidden" }}>
              <div style={{ transform: "scale(1.5)", transformOrigin: "top left", width: "100%", height: "100%" }}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setError("Google Login Failed")}
                  width="400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
