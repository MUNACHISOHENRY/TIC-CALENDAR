import { collection, deleteDoc, doc, onSnapshot, updateDoc, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { darkTheme, lightTheme } from "./theme";
import { emptyForm, EVENTS_COL, pad } from "./utils";

import Calendar from "./components/Calendar";
import EventModal from "./components/EventModal";
import LoginModal from "./components/LoginModal";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import Sidebar from "./components/Sidebar";

export default function TICCalendar() {
  const today = new Date();

  // Dark mode
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("tic-dark");
    return saved === "true";
  });
  const T = dark ? darkTheme : lightTheme;

  useEffect(() => {
    localStorage.setItem("tic-dark", dark);
  }, [dark]);

  // Calendar state
  const [yr, setYr] = useState(today.getFullYear());
  const [mo, setMo] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selDay, setSelDay] = useState(null);
  const [hovDay, setHovDay] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState([]);

  // Admin state
  const [isAdmin, setAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Event modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm());

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Real-time Firestore listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, EVENTS_COL), (snap) => {
      const docs = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      setEvents(docs);
      setLoading(false);
    }, () => {
      setLoading(false);
      showToast("Failed to load events", "error");
    });
    return () => unsub();
  }, []);

  // Filtered events
  const filteredEvents = events.filter(e => {
    const matchSearch = search ?
      [e.title, e.description, e.location].join(" ").toLowerCase().includes(search.toLowerCase())
      : true;
    const matchCat = filters.length > 0 ? filters.includes(e.category) : true;
    return matchSearch && matchCat;
  });

  // Upcoming events (filtered)
  const upcoming = [...filteredEvents]
    .filter(e => new Date(e.date) >= new Date(today.toDateString()))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  // Navigation
  const prevMo = () => { if (mo === 0) { setYr(y => y - 1); setMo(11); } else setMo(m => m - 1); setSelDay(null); };
  const nextMo = () => { if (mo === 11) { setYr(y => y + 1); setMo(0); } else setMo(m => m + 1); setSelDay(null); };

  // Event CRUD
  const openAdd = day => {
    if (!isAdmin) return;
    setForm({ ...emptyForm(`${yr}-${pad(mo + 1)}-${pad(day)}`), recurrence: "none" });
    setEditId(null); setModalOpen(true);
  };
  const openEdit = (ev, e) => { e.stopPropagation(); if (!isAdmin) return; setForm({ ...ev, recurrence: "none" }); setEditId(ev.id); setModalOpen(true); };

  const saveEv = async () => {
    if (!form.title.trim()) return;
    try {
      const { id, recurrence, ...data } = form; // strip id, handle recurrence

      if (editId) {
        await updateDoc(doc(db, EVENTS_COL, editId), data);
        showToast("Event updated ✓");
      } else {
        // Handle recurrence generation
        const limitMap = { "none": 1, "weekly": 10, "biweekly": 10, "monthly": 12 };
        const instances = limitMap[recurrence || "none"];

        const batch = writeBatch(db);
        const baseDate = new Date(data.date);

        for (let i = 0; i < instances; i++) {
          const newDocRef = doc(collection(db, EVENTS_COL));
          const instanceDate = new Date(baseDate);

          if (recurrence === "weekly") instanceDate.setDate(baseDate.getDate() + (i * 7));
          if (recurrence === "biweekly") instanceDate.setDate(baseDate.getDate() + (i * 14));
          if (recurrence === "monthly") instanceDate.setMonth(baseDate.getMonth() + i);

          batch.set(newDocRef, {
            ...data,
            date: `${instanceDate.getFullYear()}-${pad(instanceDate.getMonth() + 1)}-${pad(instanceDate.getDate())}`
          });
        }
        await batch.commit();
        showToast(instances > 1 ? `Created ${instances} recurring events ✓` : "Event created ✓");
      }
      setModalOpen(false);
    } catch (e) {
      console.error(e);
      showToast("Failed to save event", "error");
    }
  };

  const delEv = async (id, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await deleteDoc(doc(db, EVENTS_COL, id));
      showToast("Event deleted");
      setModalOpen(false);
    } catch {
      showToast("Failed to delete event", "error");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: T.bg,
      fontFamily: "'DM Sans',sans-serif", color: T.navy,
      transition: "background 0.4s ease, color 0.4s ease",
    }}>
      {/* Styles omitted for brevity, keeping the same reset and keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:${T.accentMd};color:${T.navy};}
        body{background:${T.bg};transition:background 0.4s ease; max-width: 100vw; overflow-x: hidden;}
        button{font-family:'DM Sans',sans-serif;cursor:pointer;transition:transform 0.1s ease,opacity 0.2s ease;}
        button:hover{opacity:0.85;}
        button:active{transform:scale(0.97);}
        input,select,textarea{font-family:'DM Sans',sans-serif;transition:border-color 0.2s ease,box-shadow 0.2s ease;}
        input:focus,select:focus,textarea:focus{border-color:${T.accent} !important;box-shadow:0 0 0 3px ${T.accentMd}40;}
        input[type=date]::-webkit-calendar-picker-indicator,
        input[type=time]::-webkit-calendar-picker-indicator{opacity:0.4;cursor:pointer;}
        select option{background:${T.surface};color:${T.navy};}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes toastIn{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .day-cell{transition:background 0.15s ease;}
        .day-cell:hover .add-btn{opacity:1!important;}
        
        /* Typography overrides */
        .month-title { font-family: 'DM Serif Display', serif; font-size: 48px; font-weight: 400; line-height: 1; letter-spacing: -0.02em; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .modal-inner { padding: 32px; }
        
        @media (max-width: 768px) {
          .modal-inner { padding: 20px !important; }
          .form-row { grid-template-columns: 1fr !important; gap: 16px !important; }
          .app-container { padding: 0 16px !important; }
          .cal-layout { grid-template-columns: 1fr !important; gap: 24px !important; }
          .cal-layout aside { margin-top: 24px; }
          .nav-wrap { flex-direction: column !important; align-items: flex-start !important; gap: 16px; padding: 16px 0 !important; }
          .nav-actions { width: 100%; justify-content: space-between !important; flex-wrap: wrap; gap: 12px; }
          .month-title { font-size: 32px !important; }
          
          /* Smooth Hidden Scrollbar Filter */
          .search-filters { flex-wrap: nowrap !important; overflow-x: auto; padding-bottom: 8px; width: 100%; max-width: 100vw; -webkit-overflow-scrolling: touch; scrollbar-width: none; -ms-overflow-style: none; }
          .search-filters::-webkit-scrollbar { display: none; }
          .search-filters button { flex-shrink: 0; }
          
          /* Horizontal Swipable Calendar */
          .cal-grid-wrapper { overflow-x: auto; padding-bottom: 12px; width: calc(100% + 32px); margin-left: -16px; padding-left: 16px; padding-right: 16px; box-sizing: border-box; scrollbar-width: none; -webkit-overflow-scrolling: touch; scroll-snap-type: x proximity; }
          .cal-grid-wrapper::-webkit-scrollbar { display: none; }
          .cal-grid-inner { min-width: 760px; width: 100%; padding-right: 16px; }
          .day-cell { scroll-snap-align: center; }
          
          /* Improved Day Grid Spacing */
          .sel-day-header { flex-wrap: wrap; gap: 12px; }
          .day-cell { min-height: 86px !important; padding: 6px !important; }
          .add-btn { display: none !important; }
          
          /* Better Event Pills */
          .ev-badge-container { flex-direction: column !important; gap: 4px !important; margin-top: 4px; align-items: stretch !important; }
          .ev-badge { width: 100% !important; height: auto !important; padding: 4px 6px !important; border-radius: 4px !important; line-height: 1.2 !important; text-align: left; }
          .ev-badge-text { display: block !important; font-size: 11px !important; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.2 !important; }
          .ev-more { display: block !important; font-size: 11px !important; text-align: left; padding-left: 4px !important; margin-top: 2px; }
        }
      `}</style>

      <div className="app-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <Navbar isAdmin={isAdmin} setAdmin={setAdmin} setLoginOpen={setLoginOpen}
          dark={dark} setDark={setDark} T={T} />

        <div className="cal-layout" style={{
          display: "grid", gridTemplateColumns: "1fr 300px", gap: 40, alignItems: "start",
        }}>
          <div>
            <SearchBar search={search} setSearch={setSearch} filters={filters} setFilters={setFilters} T={T} dark={dark} />
            {loading
              ? <div style={{ padding: 80, textAlign: "center", animation: "fadeIn 0.3s ease" }}>
                <div style={{
                  width: 40, height: 40,
                  border: `3px solid ${T.rule}`, borderTopColor: T.accent,
                  borderRadius: "50%", animation: "spin 0.8s linear infinite",
                  margin: "0 auto 20px",
                }} />
                <p style={{ color: T.muted, fontSize: 15 }}>Loading events…</p>
              </div>
              : <Calendar
                yr={yr} mo={mo} events={filteredEvents}
                selDay={selDay} setSelDay={setSelDay}
                hovDay={hovDay} setHovDay={setHovDay}
                isAdmin={isAdmin} openAdd={openAdd} openEdit={openEdit} delEv={delEv}
                prevMo={prevMo} nextMo={nextMo} T={T} dark={dark}
              />
            }
          </div>
          <Sidebar upcoming={upcoming} isAdmin={isAdmin} T={T} dark={dark} />
        </div>

        <div style={{ height: 60 }} />
      </div>

      {/* Floating Action Button (Mobile Friendly Add Event) */}
      {isAdmin && (
        <button onClick={() => setModalOpen(true)}
          style={{
            position: "fixed", bottom: 32, right: 24, width: 56, height: 56,
            borderRadius: "50%", background: T.accent, color: "#fff",
            fontSize: 28, display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center",
            boxShadow: `0 8px 24px ${T.accentMd}60`, border: "none", zIndex: 99,
            transition: "transform 0.2s ease, opacity 0.2s ease"
          }}>
          +
        </button>
      )}

      {/* Modals */}
      {loginOpen && (
        <LoginModal
          onLogin={() => { setAdmin(true); setLoginOpen(false); }}
          onClose={() => setLoginOpen(false)} T={T}
        />
      )}
      {modalOpen && (
        <EventModal
          form={form} setForm={setForm} editId={editId}
          onSave={saveEv}
          onDelete={(e) => { delEv(editId, e); }}
          onClose={() => setModalOpen(false)} T={T}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: toast.type === "error"
            ? "linear-gradient(135deg, #DC2626, #B91C1C)"
            : "linear-gradient(135deg, #4338CA, #6366F1)",
          color: "#fff", padding: "12px 28px", borderRadius: 12, fontSize: 14,
          fontWeight: 500, zIndex: 300, animation: "toastIn 0.25s ease",
          boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
          letterSpacing: "0.01em",
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}