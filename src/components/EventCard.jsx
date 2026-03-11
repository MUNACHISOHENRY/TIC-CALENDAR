import { useState } from "react";
import { fmtTime, getCat } from "../utils";
import { generateICal } from "../utils/ical";

export default function EventCard({ ev, isAdmin, onEdit, onDel, T, dark }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const cat = getCat(ev.category, dark);

    return (
        <div style={{
            background: T.surface, border: `1px solid ${T.rule}`, borderRadius: 10,
            padding: "14px 16px", borderLeft: `3px solid ${cat.color}`,
            transition: "box-shadow 0.2s ease"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ fontSize: 16, fontWeight: 500, color: T.navy, marginBottom: 4 }}>{ev.title}</div>
                        {isAdmin && (
                            <div style={{ display: "flex", gap: 2, marginLeft: 12, flexShrink: 0 }}>
                                <button onClick={e => onEdit(ev, e)}
                                    style={{
                                        background: "none", border: "none", color: T.muted, fontSize: 14,
                                        padding: "4px 8px", borderRadius: 6, cursor: "pointer"
                                    }}>✎</button>
                                <button onClick={e => { e.stopPropagation(); setConfirmDelete(true); }}
                                    style={{
                                        background: "none", border: "none", color: T.muted, fontSize: 14,
                                        padding: "4px 8px", borderRadius: 6, cursor: "pointer"
                                    }}>✕</button>
                            </div>
                        )}
                    </div>
                    <div style={{
                        display: "inline-flex", alignItems: "center", background: cat.bg,
                        borderRadius: 4, padding: "2px 8px", marginBottom: ev.description ? 8 : 6
                    }}>
                        <span style={{ fontSize: 11, color: cat.color, fontWeight: 600 }}>{cat.label}</span>
                    </div>
                    {ev.description && <p style={{ fontSize: 13, color: T.navyMid, lineHeight: 1.55, marginBottom: 10 }}>{ev.description}</p>}
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                        {(ev.startTime || ev.endTime) && (
                            <span style={{ fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 4 }}>
                                🕒 {fmtTime(ev.startTime)}{ev.endTime ? ` – ${fmtTime(ev.endTime)}` : ""}
                            </span>
                        )}
                        {ev.location && (
                            <span style={{ fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 4 }}>
                                📍 {ev.location}
                            </span>
                        )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4, paddingTop: 12, borderTop: `1px solid ${T.rule}50` }}>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button
                                onClick={(e) => { e.stopPropagation(); generateICal(ev); }}
                                style={{
                                    background: "transparent", color: T.muted, border: `1px solid ${T.rule}`,
                                    borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 500,
                                    display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s ease"
                                }}>
                                <span>📅</span> iCal
                            </button>
                        </div>
                        {confirmDelete && (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 12, color: T.danger, fontWeight: 500 }}>Delete?</span>
                                <button onClick={(e) => { e.stopPropagation(); onDel(ev.id, e); }}
                                    style={{
                                        background: T.danger, color: "#fff", border: "none",
                                        borderRadius: 4, padding: "4px 10px", fontSize: 11, cursor: "pointer"
                                    }}>Yes</button>
                                <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
                                    style={{
                                        background: T.surface, color: T.muted, border: `1px solid ${T.rule}`,
                                        borderRadius: 4, padding: "4px 10px", fontSize: 11, cursor: "pointer"
                                    }}>No</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
