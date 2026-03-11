import logo from "../assets/tic-logo.png";

export default function Navbar({ isAdmin, setAdmin, setLoginOpen, dark, setDark, T }) {
    return (
        <nav className="nav-wrap" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 0", borderBottom: `1px solid ${T.rule}`, marginBottom: 32
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src={logo} alt="TIC Logo"
                    style={{ width: 52, height: 52, objectFit: "contain", borderRadius: 8 }} />
                <div>
                    <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 18, color: T.navy, lineHeight: 1 }}>
                        Tech Innovation Club
                    </div>
                    <div style={{ fontSize: 11, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
                        Lagos, Nigeria
                    </div>
                </div>
            </div>
            <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Dark mode toggle */}
                <button onClick={() => setDark(d => !d)}
                    style={{
                        background: T.surface, border: `1px solid ${T.rule}`,
                        borderRadius: 20, padding: "6px 14px", fontSize: 13,
                        color: T.navyMid, display: "flex", alignItems: "center", gap: 6,
                        transition: "all 0.2s ease",
                    }}>
                    {dark ? "☀️" : "🌙"} {dark ? "Light" : "Dark"}
                </button>

                {isAdmin
                    ? <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                            display: "flex", alignItems: "center", gap: 6,
                            background: T.accentLt, border: `1px solid ${T.accentMd}`,
                            borderRadius: 20, padding: "5px 12px"
                        }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} />
                            <span style={{ fontSize: 12, color: T.accent, fontWeight: 500 }}>Exco Mode</span>
                        </div>
                        <button onClick={() => setAdmin(false)}
                            style={{
                                background: "none", border: `1px solid ${T.rule}`, color: T.muted,
                                borderRadius: 8, padding: "7px 16px", fontSize: 13,
                                transition: "all 0.2s ease",
                            }}>Sign out</button>
                    </div>
                    : <button onClick={() => setLoginOpen(true)}
                        style={{
                            background: T.navy, color: T.surface, border: "none",
                            borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 500,
                            letterSpacing: "0.01em", transition: "all 0.2s ease",
                        }}>
                        Exco Login
                    </button>
                }
            </div>
        </nav>
    );
}
