import { DAYS_FULL, daysInM, firstDayOfM, getCat, MONTHS } from "../utils";
import EventCard from "./EventCard";

export default function Calendar({
    yr, mo, events, selDay, setSelDay, hovDay, setHovDay,
    isAdmin, openAdd, openEdit, delEv, prevMo, nextMo, T, dark
}) {
    const today = new Date();
    const dim = daysInM(yr, mo);
    const fd = firstDayOfM(yr, mo);
    const cells = Math.ceil((fd + dim) / 7) * 7;

    const evOnDay = d => events.filter(e => {
        const ed = new Date(e.date);
        return ed.getFullYear() === yr && ed.getMonth() === mo && ed.getDate() === d;
    });

    return (
        <div>
            {/* Month header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
                <div>
                    <h2 className="month-title" style={{ color: T.navy }}>
                        {MONTHS[mo]}
                    </h2>
                    <span style={{ fontSize: 16, color: T.muted, fontWeight: 300 }}>{yr}</span>
                </div>
                <div style={{ display: "flex", gap: 6, paddingBottom: 8 }}>
                    <button onClick={prevMo}
                        style={{
                            width: 36, height: 36, background: T.surface, border: `1px solid ${T.rule}`,
                            borderRadius: 8, fontSize: 18, color: T.navyMid, display: "flex",
                            alignItems: "center", justifyContent: "center"
                        }}>‹</button>
                    <button onClick={nextMo}
                        style={{
                            width: 36, height: 36, background: T.surface, border: `1px solid ${T.rule}`,
                            borderRadius: 8, fontSize: 18, color: T.navyMid, display: "flex",
                            alignItems: "center", justifyContent: "center"
                        }}>›</button>
                </div>
            </div>

            {/* Day-of-week labels */}
            <div className="cal-grid-wrapper">
                <div className="cal-grid-inner">
                    <div style={{
                        display: "grid", gridTemplateColumns: "repeat(7,1fr)",
                        borderBottom: `1px solid ${T.rule}`, marginBottom: 2
                    }}>
                        {DAYS_FULL.map((d, i) => (
                            <div key={i} style={{
                                textAlign: "center", fontSize: 11, fontWeight: 600,
                                letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted,
                                paddingBottom: 10
                            }}>{d}</div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)" }}>
                        {Array.from({ length: cells }).map((_, i) => {
                            const day = i - fd + 1;
                            const valid = day >= 1 && day <= dim;
                            const dayEvs = valid ? evOnDay(day) : [];
                            const isToday = valid && day === today.getDate() && mo === today.getMonth() && yr === today.getFullYear();
                            const isSel = selDay === day && valid;
                            const isHov = hovDay === day && valid;
                            const rightEdge = (i + 1) % 7 === 0;
                            const bottomEdge = i >= cells - 7;

                            return (
                                <div key={i} className="day-cell"
                                    onClick={() => valid && setSelDay(isSel ? null : day)}
                                    onMouseEnter={() => valid && setHovDay(day)}
                                    onMouseLeave={() => setHovDay(null)}
                                    style={{
                                        minHeight: 96,
                                        background: isSel ? T.accentLt : isHov && valid ? (dark ? "#1a1a30" : "#F0EFF9") : "transparent",
                                        borderRight: rightEdge ? "none" : `1px solid ${T.rule}`,
                                        borderBottom: bottomEdge ? "none" : `1px solid ${T.rule}`,
                                        padding: "10px 8px 8px",
                                        cursor: valid ? "pointer" : "default",
                                        opacity: valid ? 1 : 0.25,
                                        transition: "background 0.1s",
                                        position: "relative",
                                    }}>
                                    {valid && <>
                                        <div className="day-num-wrapper" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                            <span className="day-num" style={{
                                                width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
                                                borderRadius: "50%", fontSize: 13, fontWeight: isSel || isToday ? 600 : 400,
                                                background: isToday ? T.navy : isSel ? T.accent : "transparent",
                                                color: isToday || isSel ? (dark ? "#0D0D1A" : "#fff") : T.navyMid,
                                                flexShrink: 0,
                                            }}>{day}</span>
                                            {isAdmin && isHov && (
                                                <span className="add-btn"
                                                    onClick={e => { e.stopPropagation(); openAdd(day); }}
                                                    style={{
                                                        opacity: 0, fontSize: 18, color: T.accent, lineHeight: 1,
                                                        width: 22, height: 22, display: "flex", alignItems: "center",
                                                        justifyContent: "center", borderRadius: 4,
                                                        background: T.accentLt, transition: "opacity 0.15s"
                                                    }}>+</span>
                                            )}
                                        </div>
                                        <div className="ev-badge-container" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                            {dayEvs.slice(0, 3).map(ev => {
                                                const cat = getCat(ev.category, dark);
                                                return (
                                                    <div key={ev.id} onClick={e => openEdit(ev, e)} className="ev-badge"
                                                        style={{
                                                            fontSize: 10, fontWeight: 500, padding: "2px 6px", borderRadius: 4,
                                                            background: cat.bg, color: cat.color,
                                                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                                            cursor: isAdmin ? "pointer" : "default", letterSpacing: "0.01em",
                                                            lineHeight: 1.6
                                                        }}>
                                                        <span className="ev-badge-text">{ev.title}</span>
                                                    </div>
                                                );
                                            })}
                                            {dayEvs.length > 3 && <div className="ev-more" style={{ fontSize: 9, color: T.muted, paddingLeft: 2 }}>+{dayEvs.length - 3} more</div>}
                                        </div>
                                    </>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Selected day detail */}
            {selDay && (
                <div style={{ marginTop: 32, animation: "slideUp 0.2s ease" }}>
                    <div className="sel-day-header" style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginBottom: 16, paddingBottom: 14, borderBottom: `1px solid ${T.rule}`
                    }}>
                        <div>
                            <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: T.navy }}>
                                {MONTHS[mo]} {selDay}
                            </span>
                            <span style={{ fontSize: 14, color: T.muted, marginLeft: 8 }}>{yr}</span>
                        </div>
                        {isAdmin && (
                            <button onClick={() => openAdd(selDay)}
                                style={{
                                    background: T.navy, color: T.surface, border: "none",
                                    borderRadius: 8, padding: "7px 16px", fontSize: 12, fontWeight: 500
                                }}>
                                + Add Event
                            </button>
                        )}
                    </div>
                    {evOnDay(selDay).length === 0
                        ? <p style={{ color: T.muted, fontSize: 14, fontStyle: "italic" }}>Nothing scheduled.</p>
                        : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {evOnDay(selDay).map(ev => <EventCard key={ev.id} ev={ev} isAdmin={isAdmin} onEdit={openEdit} onDel={delEv} T={T} dark={dark} />)}
                        </div>
                    }
                </div>
            )}
        </div>
    );
}
