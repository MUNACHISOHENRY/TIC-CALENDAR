import { useState } from "react";
import { ADMIN_PW, field, lbl } from "../utils";
import Overlay from "./Overlay";

export default function LoginModal({ onLogin, onClose, T }) {
    const [pw, setPw] = useState("");
    const [pwErr, setPwErr] = useState("");
    const [focused, setFocused] = useState(false);

    const handleLogin = () => {
        if (pw === ADMIN_PW) { onLogin(); setPw(""); setPwErr(""); }
        else setPwErr("Wrong password.");
    };

    return (
        <Overlay onClose={() => { onClose(); setPwErr(""); setPw(""); }} T={T}>
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, fontWeight: 400, color: T.navy, marginBottom: 6 }}>
                    Exco Login
                </h2>
                <p style={{ fontSize: 13, color: T.muted }}>Enter your password to manage TIC events.</p>
            </div>
            <label style={lbl(T)}>Password</label>
            <input type="password" value={pw} autoFocus
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="••••••••"
                style={{ ...field(T), outline: focused ? `2px solid ${T.accent}` : `2px solid transparent` }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            {pwErr && <p style={{ color: T.danger, fontSize: 12, marginTop: 6 }}>{pwErr}</p>}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={handleLogin}
                    style={{
                        background: T.navy, color: T.surface, border: "none", borderRadius: 8,
                        padding: "10px 22px", fontSize: 14, fontWeight: 500
                    }}>Login</button>
                <button onClick={() => { onClose(); setPwErr(""); setPw(""); }}
                    style={{
                        background: "none", border: `1px solid ${T.rule}`, color: T.muted,
                        borderRadius: 8, padding: "10px 18px", fontSize: 14
                    }}>Cancel</button>
            </div>
        </Overlay>
    );
}
