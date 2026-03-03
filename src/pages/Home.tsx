/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import {
  FolderOpen, Upload, Shield, Zap, Crown, Star, ArrowRight,
  Check, Lock, Files, HardDrive, Users, ChevronDown,
  FileImage, FileVideo, FileAudio, FileText, Menu, X,
  Layers, Database, Globe, TrendingUp, Package
} from "lucide-react";

const TIERS = [
  {
    name: "Free",
    price: "0",
    color: "#6B7280",
    accent: "#9CA3AF",
    icon: <Package size={20} />,
    features: ["5 Folders", "1 Nesting Level", "Images Only", "5MB Max File Size", "20 Total Files", "5 Files/Folder"],
  },
  {
    name: "Silver",
    price: "9",
    color: "#94A3B8",
    accent: "#CBD5E1",
    icon: <Star size={20} />,
    popular: false,
    features: ["20 Folders", "3 Nesting Levels", "Image + PDF", "25MB Max File Size", "100 Total Files", "20 Files/Folder"],
  },
  {
    name: "Gold",
    price: "29",
    color: "#F59E0B",
    accent: "#FCD34D",
    icon: <Zap size={20} />,
    popular: true,
    features: ["100 Folders", "5 Nesting Levels", "Image, PDF, Audio", "100MB Max File Size", "500 Total Files", "50 Files/Folder"],
  },
  {
    name: "Diamond",
    price: "79",
    color: "#818CF8",
    accent: "#C4B5FD",
    icon: <Crown size={20} />,
    features: ["Unlimited Folders", "10 Nesting Levels", "All File Types", "500MB Max File Size", "Unlimited Files", "Unlimited/Folder"],
  },
];

const STATS = [
  { value: "99.9%", label: "Uptime SLA", icon: <Globe size={18} /> },
  { value: "500MB", label: "Max File Size", icon: <HardDrive size={18} /> },
  { value: "4", label: "Tier Plans", icon: <Layers size={18} /> },
  { value: "256-bit", label: "Encryption", icon: <Lock size={18} /> },
];

const FILE_TYPES = [
  { icon: <FileImage size={28} />, label: "Images", color: "#34D399", types: "JPG, PNG, GIF, WebP, SVG" },
  { icon: <FileVideo size={28} />, label: "Videos", color: "#60A5FA", types: "MP4, MOV, AVI, WebM" },
  { icon: <FileAudio size={28} />, label: "Audio", color: "#F472B6", types: "MP3, WAV, OGG, AAC" },
  { icon: <FileText size={28} />, label: "Documents", color: "#FBBF24", types: "PDF" },
];

function FloatingOrb({ style }: {style: any}) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        background: style.bg,
        width: style.size,
        height: style.size,
        top: style.top,
        left: style.left,
        right: style.right,
        filter: `blur(${style.blur})`,
        opacity: style.opacity,
        animation: `float ${style.duration} ease-in-out infinite`,
        animationDelay: style.delay,
      }}
    />
  );
}

function GridPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFile, setActiveFile] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveFile(p => (p + 1) % FILE_TYPES.length), 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#080C14", color: "#F1F5F9", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(129,140,248,0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 16px rgba(129,140,248,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(129,140,248,0); }
        }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-fade-up { animation: fadeSlideUp 0.7s ease forwards; }
        .delay-1 { animation-delay: 0.1s; opacity: 0; }
        .delay-2 { animation-delay: 0.25s; opacity: 0; }
        .delay-3 { animation-delay: 0.4s; opacity: 0; }
        .delay-4 { animation-delay: 0.55s; opacity: 0; }
        .delay-5 { animation-delay: 0.7s; opacity: 0; }

        .shimmer-text {
          background: linear-gradient(90deg, #818CF8 0%, #C4B5FD 30%, #F9A8D4 50%, #C4B5FD 70%, #818CF8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .tier-card:hover { transform: translateY(-6px); }
        .tier-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }

        .nav-link {
          position: relative;
          color: #94A3B8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
          letter-spacing: 0.01em;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: #818CF8;
          transition: width 0.3s ease;
        }
        .nav-link:hover { color: #E2E8F0; }
        .nav-link:hover::after { width: 100%; }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #818CF8 0%, #A78BFA 100%);
          color: white;
          padding: 12px 28px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.02em;
        }
        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 8px 30px rgba(129,140,248,0.4);
        }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: #CBD5E1;
          padding: 12px 28px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
          letter-spacing: 0.02em;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.2);
          color: white;
        }

        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 28px;
          transition: background 0.3s, border-color 0.3s, transform 0.3s;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(129,140,248,0.2);
          transform: translateY(-3px);
        }

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(129,140,248,0.1);
          border: 1px solid rgba(129,140,248,0.2);
          color: #A5B4FC;
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .glow-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(129,140,248,0.5), transparent);
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #080C14; }
        ::-webkit-scrollbar-thumb { background: #1E2A3A; border-radius: 3px; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 40px",
        height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(8,12,20,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        transition: "all 0.3s ease",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #818CF8, #A78BFA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(129,140,248,0.4)",
          }}>
            <FolderOpen size={18} color="white" />
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#F1F5F9", letterSpacing: "-0.02em" }}>
            VaultFS
          </span>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="desktop-nav">
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#filetypes" className="nav-link">File Types</a>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/login" className="btn-ghost" style={{ padding: "9px 20px", fontSize: 13 }}>
            User Login
          </a>
          <a href="/admin/login" className="btn-primary" style={{ padding: "9px 20px", fontSize: 13 }}>
            <Shield size={14} />
            Admin Login
          </a>
          <button
            style={{ display: "none", background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <GridPattern />

        {/* Orbs */}
        <FloatingOrb style={{ bg: "radial-gradient(circle, rgba(129,140,248,0.35) 0%, transparent 70%)", size: "700px", top: "-200px", left: "-200px", blur: "80px", opacity: 1, duration: "8s", delay: "0s" }} />
        <FloatingOrb style={{ bg: "radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)", size: "500px", top: "30%", right: "-100px", blur: "80px", opacity: 1, duration: "10s", delay: "2s" }} />
        <FloatingOrb style={{ bg: "radial-gradient(circle, rgba(244,114,182,0.15) 0%, transparent 70%)", size: "400px", bottom: "-100px", left: "40%", blur: "80px", opacity: 1, duration: "12s", delay: "4s" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "140px 40px 80px", width: "100%", position: "relative" }}>
          <div style={{ maxWidth: 760 }}>

            {/* Badge */}
            <div className="animate-fade-up delay-1">
              <div className="section-label">
                <Zap size={11} />
                SaaS File Management Platform
              </div>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up delay-2" style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(44px, 7vw, 80px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginBottom: 28,
            }}>
              Your Files.{" "}
              <span className="shimmer-text">Organized.</span>
              <br />
              <span style={{ color: "#E2E8F0" }}>Secured. Scaled.</span>
            </h1>

            {/* Subtext */}
            <p className="animate-fade-up delay-3" style={{
              fontSize: "clamp(16px, 2vw, 19px)",
              color: "#94A3B8",
              lineHeight: 1.7,
              maxWidth: 560,
              marginBottom: 44,
              fontWeight: 300,
            }}>
              A subscription-driven file &amp; folder management system where every action is governed by your plan — from folder depth to file type access.
            </p>

            {/* Buttons */}
            <div className="animate-fade-up delay-4" style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 60 }}>
              <a href="/login" className="btn-primary">
                Get Started Free
                <ArrowRight size={16} />
              </a>
              <a href="#pricing" className="btn-ghost">
                View Plans
                <ChevronDown size={16} />
              </a>
            </div>

            {/* Stats row */}
            <div className="animate-fade-up delay-5" style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ color: "#818CF8" }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: "#F1F5F9", letterSpacing: "-0.02em" }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Visual - File Browser Mockup */}
          <div style={{
            position: "absolute",
            right: -40,
            top: "50%",
            transform: "translateY(-50%)",
            width: 420,
            background: "rgba(15,20,32,0.9)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: 24,
            backdropFilter: "blur(20px)",
            boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(129,140,248,0.1)",
            animation: "fadeSlideUp 0.8s ease 0.6s forwards",
            opacity: 0,
          }}>
            {/* Window chrome */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444", opacity: 0.7 }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B", opacity: 0.7 }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981", opacity: 0.7 }} />
              <div style={{ flex: 1, height: 24, background: "rgba(255,255,255,0.04)", borderRadius: 6, marginLeft: 8, display: "flex", alignItems: "center", paddingLeft: 10 }}>
                <span style={{ fontSize: 11, color: "#475569" }}>~/my-workspace/projects</span>
              </div>
            </div>

            {/* Folder tree */}
            {[
              { name: "Projects", files: 12, depth: 0, open: true },
              { name: "Design Assets", files: 8, depth: 1, open: false },
              { name: "Brand Kit", files: 4, depth: 2, open: false },
              { name: "Documents", files: 6, depth: 0, open: false },
              { name: "Archive", files: 23, depth: 0, open: false },
            ].map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px",
                marginLeft: f.depth * 20,
                borderRadius: 8,
                background: i === 0 ? "rgba(129,140,248,0.1)" : "transparent",
                border: i === 0 ? "1px solid rgba(129,140,248,0.15)" : "1px solid transparent",
                marginBottom: 4,
                cursor: "pointer",
              }}>
                <FolderOpen size={15} color={i === 0 ? "#818CF8" : "#475569"} />
                <span style={{ fontSize: 13, color: i === 0 ? "#C4B5FD" : "#64748B", flex: 1 }}>{f.name}</span>
                <span style={{ fontSize: 11, color: "#334155", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 100 }}>{f.files}</span>
              </div>
            ))}

            <div className="glow-line" style={{ margin: "16px 0" }} />

            {/* File type badges */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {FILE_TYPES.map((ft, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px",
                  borderRadius: 100,
                  background: i === activeFile ? `${ft.color}18` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${i === activeFile ? ft.color + "40" : "rgba(255,255,255,0.06)"}`,
                  transition: "all 0.4s ease",
                }}>
                  <div style={{ color: ft.color, opacity: i === activeFile ? 1 : 0.4 }}>
                    {ft.icon}
                  </div>
                  <span style={{ fontSize: 11, color: i === activeFile ? ft.color : "#475569", fontWeight: 500, transition: "color 0.4s" }}>{ft.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#334155", letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(180deg, rgba(129,140,248,0.6), transparent)" }} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div className="section-label" style={{ margin: "0 auto 20px" }}>
            <Shield size={11} />
            Core Features
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#F1F5F9", marginBottom: 16 }}>
            Built for real-world SaaS
          </h2>
          <p style={{ color: "#64748B", fontSize: 17, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Every feature enforces your subscription limits — dynamically, reliably, at scale.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {[
            {
              icon: <Layers size={22} />, color: "#818CF8",
              title: "Tiered Subscription Plans",
              desc: "Admin-defined packages (Free → Diamond) that control every aspect of storage behavior. Switch plans anytime without data loss.",
            },
            {
              icon: <FolderOpen size={22} />, color: "#34D399",
              title: "Deep Folder Nesting",
              desc: "Hierarchical folder management with plan-enforced depth limits. Create, rename, and delete sub-folders freely within your tier.",
            },
            {
              icon: <Upload size={22} />, color: "#60A5FA",
              title: "Multi-type File Upload",
              desc: "Upload Images, Videos, Audio, and PDFs. Each plan unlocks different file types and enforces per-upload size limits.",
            },
            {
              icon: <Shield size={22} />, color: "#F472B6",
              title: "Per-Action Enforcement",
              desc: "Every folder and file action checks your active package in real time — max folders, nesting depth, file count, and size.",
            },
            {
              icon: <Users size={22} />, color: "#FBBF24",
              title: "Admin Control Panel",
              desc: "Full CRUD on subscription packages. Define limits, file permissions, and quotas without touching a line of code.",
            },
            {
              icon: <TrendingUp size={22} />, color: "#A78BFA",
              title: "Package History Tracking",
              desc: "Full audit trail of package switches with activation dates. Users see exactly when each plan was active.",
            },
            {
              icon: <Database size={22} />, color: "#F87171",
              title: "Robust Data Layer",
              desc: "PostgreSQL + Prisma ORM with type-safe queries, relational integrity, and optimized indexes for storage metadata.",
            },
            {
              icon: <Lock size={22} />, color: "#4ADE80",
              title: "Auth & Email Verification",
              desc: "Secure JWT authentication with email verification flow and password reset — production-grade from day one.",
            },
          ].map((feat, i) => (
            <div key={i} className="feature-card">
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${feat.color}18`,
                border: `1px solid ${feat.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: feat.color, marginBottom: 18,
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: "#E2E8F0", marginBottom: 10, letterSpacing: "-0.01em" }}>{feat.title}</h3>
              <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.7 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FILE TYPES ── */}
      <section id="filetypes" style={{ padding: "80px 40px", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div className="section-label" style={{ margin: "0 auto 20px" }}>
              <Files size={11} />
              Supported Formats
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#F1F5F9" }}>
              Every file type you need
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {FILE_TYPES.map((ft, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid rgba(255,255,255,0.06)`,
                borderRadius: 16,
                padding: "28px 24px",
                textAlign: "center",
                transition: "all 0.3s",
                cursor: "default",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${ft.color}0D`;
                  e.currentTarget.style.borderColor = `${ft.color}30`;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ color: ft.color, display: "flex", justifyContent: "center", marginBottom: 16 }}>{ft.icon}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#E2E8F0", marginBottom: 8 }}>{ft.label}</div>
                <div style={{ fontSize: 12, color: "#475569", letterSpacing: "0.04em" }}>{ft.types}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "120px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div className="section-label" style={{ margin: "0 auto 20px" }}>
            <Crown size={11} />
            Subscription Plans
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#F1F5F9", marginBottom: 16 }}>
            Plans for every scale
          </h2>
          <p style={{ color: "#64748B", fontSize: 17, maxWidth: 440, margin: "0 auto" }}>
            Start free. Upgrade as you grow. Admin manages all limits dynamically.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, alignItems: "start" }}>
          {TIERS.map((tier, i) => (
            <div key={i} className="tier-card" style={{
              background: tier.popular ? "rgba(129,140,248,0.07)" : "rgba(255,255,255,0.025)",
              border: tier.popular ? "1px solid rgba(129,140,248,0.3)" : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 20,
              padding: "32px 28px",
              position: "relative",
              boxShadow: tier.popular ? "0 0 60px rgba(129,140,248,0.12)" : "none",
            }}>
              {tier.popular && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #818CF8, #A78BFA)",
                  padding: "4px 16px",
                  borderRadius: 100,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>
                  Most Popular
                </div>
              )}

              {/* Tier header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${tier.color}20`,
                  border: `1px solid ${tier.color}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: tier.color,
                }}>
                  {tier.icon}
                </div>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#F1F5F9" }}>{tier.name}</span>
              </div>

              {/* Price */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 14, color: "#64748B" }}>$</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 44, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.03em" }}>{tier.price}</span>
                  <span style={{ fontSize: 14, color: "#64748B" }}>/mo</span>
                </div>
              </div>

              <div className="glow-line" style={{ marginBottom: 24, opacity: 0.4 }} />

              {/* Features */}
              <ul style={{ listStyle: "none", marginBottom: 32 }}>
                {tier.features.map((f, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: 13, color: "#94A3B8" }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: `${tier.color}20`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <Check size={10} color={tier.color} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <a href="/login" style={{
                display: "block",
                textAlign: "center",
                padding: "12px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.2s",
                background: tier.popular ? "linear-gradient(135deg, #818CF8, #A78BFA)" : "rgba(255,255,255,0.05)",
                color: tier.popular ? "white" : "#94A3B8",
                border: tier.popular ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}
                onMouseEnter={e => {
                  if (!tier.popular) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#E2E8F0";
                  }
                }}
                onMouseLeave={e => {
                  if (!tier.popular) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "#94A3B8";
                  }
                }}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: "80px 40px" }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          background: "linear-gradient(135deg, rgba(129,140,248,0.12) 0%, rgba(167,139,250,0.08) 100%)",
          border: "1px solid rgba(129,140,248,0.2)",
          borderRadius: 28,
          padding: "72px 60px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <FloatingOrb style={{ bg: "radial-gradient(circle, rgba(129,140,248,0.3) 0%, transparent 70%)", size: "400px", top: "-100px", left: "-100px", blur: "80px", opacity: 1, duration: "8s", delay: "0s" }} />
          <FloatingOrb style={{ bg: "radial-gradient(circle, rgba(244,114,182,0.2) 0%, transparent 70%)", size: "300px", bottom: "-100px", right: "-80px", blur: "80px", opacity: 1, duration: "10s", delay: "3s" }} />

          <div style={{ position: "relative" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(28px, 5vw, 50px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#F1F5F9", marginBottom: 18, lineHeight: 1.1 }}>
              Ready to manage your files<br />
              <span className="shimmer-text">the smart way?</span>
            </h2>
            <p style={{ color: "#94A3B8", fontSize: 17, marginBottom: 40, maxWidth: 440, margin: "0 auto 40px" }}>
              Sign up free. No credit card required. Upgrade whenever you're ready.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/login" className="btn-primary" style={{ fontSize: 15, padding: "14px 36px" }}>
                Start for Free <ArrowRight size={16} />
              </a>
              <a href="/admin/login" className="btn-ghost" style={{ fontSize: 15, padding: "14px 36px" }}>
                <Shield size={15} />
                Admin Portal
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #818CF8, #A78BFA)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FolderOpen size={16} color="white" />
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#F1F5F9" }}>VaultFS</span>
          </div>

          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <a href="/login" style={{ color: "#64748B", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#94A3B8"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>
              User Login
            </a>
            <a href="/admin/login" style={{ color: "#64748B", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#94A3B8"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>
              Admin Login
            </a>
            <a href="#pricing" style={{ color: "#64748B", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#94A3B8"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>
              Pricing
            </a>
            <a href="#features" style={{ color: "#64748B", textDecoration: "none", fontSize: 13, transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#94A3B8"}
              onMouseLeave={e => e.currentTarget.style.color = "#64748B"}>
              Features
            </a>
          </div>

          <p style={{ color: "#334155", fontSize: 12 }}>
            © 2026 VaultFS · SaaS File Management System
          </p>
        </div>
      </footer>
    </div>
  );
}