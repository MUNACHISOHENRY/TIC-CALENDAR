import { CATS, CATS_DARK } from "./theme";

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const DAYS_FULL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const EVENTS_COL = "events";
export const ADMIN_PW = import.meta.env.VITE_ADMIN_PASSWORD || "exco2024";

export const getCat = (id, dark = false) => {
    const cats = dark ? CATS_DARK : CATS;
    return cats.find(c => c.id === id) || cats[4];
};

export const daysInM = (y, m) => new Date(y, m + 1, 0).getDate();
export const firstDayOfM = (y, m) => new Date(y, m, 1).getDay();
export const pad = n => String(n).padStart(2, "0");

export const fmtTime = t => {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hr = +h;
    return `${hr % 12 || 12}:${m}${hr < 12 ? "am" : "pm"}`;
};

export const emptyForm = (date = "") => ({
    title: "", description: "", category: "meeting",
    location: "", startTime: "", endTime: "", date,
});

// Style helpers
export const lbl = (T) => ({
    display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", color: T.muted, marginBottom: 6,
});

export const field = (T) => ({
    width: "100%", background: T.bg, border: `1px solid ${T.rule}`, borderRadius: 8,
    padding: "10px 12px", color: T.navy, fontSize: 14, outline: "none",
    transition: "border-color 0.15s",
});
