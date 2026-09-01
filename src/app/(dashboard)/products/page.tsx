"use client";
import { useEffect, useState, useCallback } from "react";
import { getApiProducts, deleteApiProductsById } from "@/client";
import { client } from "@/client/client.gen";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductDto } from "@/client/types.gen";
import { resolveMediaUrl } from "@/lib/mediaUrl";
import ProductFormModal from "@/components/ProductFormModal";

import { useAuth } from "@/components/AuthProvider";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = () => setIsCreateModalOpen(true);

  const router = useRouter();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }

      client.setConfig({
        baseUrl: (process.env.NEXT_PUBLIC_API_URL || "https://localhost:5003"),
        auth: token,
      });

      const response = await getApiProducts({ throwOnError: false });
      if ((response.data as any)?.isSuccess) {
        setProducts((response.data as any).value || []);
      } else if (response.error || (response.data as any)?.isError) {
        setError((response.data as any)?.errors?.map((e: any) => e.description).join(", ") || "Failed to load products.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const rootProducts = products.filter((p) => !p.parentProductId);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">{loading ? "Loading…" : `${rootProducts.length} product${rootProducts.length !== 1 ? "s" : ""}`}</p>
        </div>
        {user?.role !== "Student" && (
          <button id="create-product-btn" className="btn-primary" onClick={openCreateModal}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Product
          </button>
        )}
      </div>

      {error && (
        <div className="alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.75rem" }}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: "340px", borderRadius: "var(--radius-lg)" }} />
          ))
        ) : rootProducts.length === 0 ? (
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="empty-state">
              <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              <p className="empty-state-title">No products yet</p>
              <p className="empty-state-sub">Create your first product to get started</p>
            </div>
          </div>
        ) : (
          rootProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} style={{
              background: "var(--canvas-elevated)",
              border: "1px solid var(--hairline)",
              borderRadius: "var(--r-md)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              textDecoration: "none",
              transition: "box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 2px 2px rgba(0,0,0,0.05), 0 8px 16px -4px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
            }}
            >
              {/* ── Product Image Area ── */}
              <div style={{
                position: "relative",
                background: "var(--hairline-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 1.5rem",
                minHeight: 180,
                borderBottom: "1px solid var(--hairline)",
              }}>
                {/* Decorative dot grid */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: "radial-gradient(circle, var(--hairline) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                  opacity: 0.7,
                  pointerEvents: "none",
                }} />

                {product.media && product.media.length > 0 && product.media[0].url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveMediaUrl(product.media[0].url)}
                    alt={product.name || "Product"}
                    style={{
                      position: "relative",
                      maxHeight: 160,
                      maxWidth: "100%",
                      objectFit: "contain",
                      display: "block",
                      filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.12))",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = "scale(1.06)"; }}
                    onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div style={{
                    position: "relative",
                    width: 96, height: 96,
                    background: "var(--canvas-elevated)",
                    border: "1px solid var(--hairline)",
                    borderRadius: "var(--r-md)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </div>
                )}

                {/* Status badges */}
                <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "flex-end" }}>
                  {product.hidden
                    ? <span className="badge badge-neutral">Hidden</span>
                    : <span className="badge badge-success">Visible</span>}
                  {product.comingSoon && <span className="badge badge-warning">Soon</span>}
                </div>
              </div>

              {/* ── Info ── */}
              <div style={{ padding: "1.1rem 1.25rem 1rem", display: "flex", flexDirection: "column", gap: "0.7rem", flex: 1 }}>

                {/* Title */}
                <div>
                  <h3 style={{ margin: "0 0 3px", fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-ink)", letterSpacing: "-0.01em" }}>
                    {product.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--text-mute)", fontFamily: "var(--font-mono)" }}>
                    {product.family && <span>{product.family}</span>}
                    {product.family && product.version && <span>·</span>}
                    {product.version && <span>v{product.version}</span>}
                  </div>
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", flexWrap: "wrap", marginTop: "auto" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-mute)" }}>from</span>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    color: "var(--text-ink)",
                    background: "var(--hairline-soft)",
                    border: "1px solid var(--hairline)",
                    borderRadius: "var(--r-sm)",
                    padding: "1px 6px",
                  }}>
                    ${product.prices && product.prices.length > 0 ? (product.prices[0].price || 0).toFixed(2) : "0.00"}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-mute)" }}>/yr</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {isCreateModalOpen && (
        <ProductFormModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
