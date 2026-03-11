import { CATS, CATS_DARK } from "../theme";
import { MONTHS, fmtTime, getCat } from "../utils";

export default function Sidebar({ upcoming, isAdmin, T, dark }) {
    return (
        <aside style={{ position: "sticky", top: 24 }}>
            {/* Upcoming */}
            <div style={{ marginBottom: 28 }}>
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${T.rule}`
                }}>
                    <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: T.navy }}>
                        Upcoming
                    </span>
                    <span style={{ fontSize: 12, color: T.muted }}>{upcoming.length} event{upcoming.length !== 1 ? "s" : ""}</span>
                </div>
                {upcoming.length === 0
                    ? <p style={{ color: T.muted, fontSize: 13, fontStyle: "italic" }}>No upcoming events.</p>
                    : upcoming.map((ev, idx) => {
                        const cat = getCat(ev.category, dark);
                        const d = new Date(ev.date);
                        return (
                            <div key={ev.id} style={{
                                display: "flex", gap: 14, alignItems: "flex-start",
                                paddingBottom: 16, marginBottom: 16,
                                borderBottom: idx < upcoming.length - 1 ? `1px solid ${T.rule}` : "none"
                            }}>
                                <div style={{ textAlign: "center", minWidth: 44, flexShrink: 0 }}>
                                    <div style={{
                                        fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
                                        textTransform: "uppercase", color: T.muted
                                    }}>
                                        {MONTHS[d.getMonth()].slice(0, 3)}
                                    </div>
                                    <div style={{
                                        fontFamily: "'DM Serif Display',serif", fontSize: 28,
                                        color: T.navy, lineHeight: 1
                                    }}>{d.getDate()}</div>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: 14, fontWeight: 500, color: T.navy,
                                        marginBottom: 4, lineHeight: 1.3
                                    }}>{ev.title}</div>
                                    <div style={{
                                        display: "inline-flex", alignItems: "center", gap: 4,
                                        background: cat.bg, borderRadius: 4, padding: "2px 7px", marginBottom: 4
                                    }}>
                                        <span style={{ fontSize: 11, color: cat.color, fontWeight: 500 }}>{cat.label}</span>
                                    </div>
                                    {ev.location && <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>📍 {ev.location}</div>}
                                    {ev.startTime && <div style={{ fontSize: 12, color: T.muted, marginTop: 1 }}>
                                        {fmtTime(ev.startTime)}{ev.endTime ? ` – ${fmtTime(ev.endTime)}` : ""}
                                    </div>}
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            {/* Legend */}
            <div>
                <div style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: T.muted, marginBottom: 12
                }}>Event Types</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(dark ? CATS_DARK : CATS).map(cat => (
                        <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: T.navyMid }}>{cat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {isAdmin && (
                <div style={{
                    marginTop: 24, padding: "14px 16px", background: T.accentLt,
                    border: `1px solid ${T.accentMd}`, borderRadius: 10
                }}>
                    <div style={{
                        fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase",
                        color: T.accent, marginBottom: 6
                    }}>Exco Mode Active</div>
                    <p style={{ fontSize: 12, color: T.navyMid, lineHeight: 1.65 }}>
                        Hover a date to add events. Click any event to edit or delete it.
                    </p>
                </div>
            )}
        </aside>
    );
}
