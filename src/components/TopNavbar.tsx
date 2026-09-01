"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";

const navItems = [
  { name: "Licenses",   path: "/licenses" },
  { name: "Products",   path: "/products" },
  { name: "Promocodes", path: "/promocodes" },
  { name: "Tickets",    path: "/tickets" },
  { name: "Categories", path: "/ticket-categories" },
];

export default function TopNavbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

  const filteredNavItems = navItems.filter(item => {
    if (user?.role === "Student") {
      return item.name === "Tickets" || item.name === "Products";
    }
    return true;
  });

  return (
    <>
      <header className="top-navbar">
        <div className="navbar-container">
          {/* ── Brand ── */}
          <div className="navbar-brand-section">
            <div className="navbar-logo">
              {/* Vercel-style triangle mark */}
              <svg width="14" height="12" viewBox="0 0 14 12" fill="white">
                <path d="M7 0L14 12H0L7 0Z" />
              </svg>
            </div>
            <div className="navbar-brand">
              <span className="navbar-brand-name">AGECS</span>
            </div>
          </div>

          {/* ── Desktop Navigation ── */}
          <nav className="navbar-nav desktop-only">
            {filteredNavItems.map(item => {
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`navbar-link ${isActive ? "active" : ""}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="navbar-actions desktop-only">
            {user && (
              <div className="user-profile-badge">
                <span className="user-email">{user.email}</span>
                <span className="user-role">{user.role}</span>
              </div>
            )}
            <button onClick={logout} className="btn-danger-ghost btn-sm">
              Sign Out
            </button>
          </div>

          {/* ── Mobile Menu Toggle ── */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <nav className="mobile-nav">
            {filteredNavItems.map(item => {
              const isActive = pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`mobile-nav-link ${isActive ? "active" : ""}`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mobile-nav-footer">
            {user && (
              <div style={{ padding: "var(--sp-sm) var(--sp-md)", background: "var(--hairline-soft)", borderRadius: "var(--r-sm)", fontSize: "0.85rem" }}>
                <div style={{ fontWeight: 500, color: "var(--text-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                <div style={{ color: "var(--text-mute)", fontSize: "0.7rem", marginTop: 2, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{user.role}</div>
              </div>
            )}
            <button onClick={logout} className="btn-danger-ghost" style={{ width: "100%", justifyContent: "center" }}>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </>
  );
}
