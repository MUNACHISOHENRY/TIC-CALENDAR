import { useState } from "react";
import { CATS } from "../theme";
import { field, lbl } from "../utils";
import Overlay from "./Overlay";

export default function EventModal({ form, setForm, editId, onSave, onDelete, onClose, T }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <Overlay onClose={onClose} T={T}>
            <div style={{ marginBottom: 22 }}>
                <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, fontWeight: 400, color: confirmDelete ? T.danger : T.navy, marginBottom: 4 }}>
                    {confirmDelete ? "Delete Event?" : (editId ? "Edit Event" : "New Event")}
                </h2>
                <p style={{ fontSize: 13, color: T.muted }}>
                    {confirmDelete ? "This action cannot be undone." : (editId ? "Update the details below." : "Add a new event to the calendar.")}
                </p>
            </div>

            {confirmDelete ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, background: T.surface, padding: 16, borderRadius: 8, border: `1px solid ${T.rule}` }}>
                    <p style={{ fontSize: 14, color: T.navyMid, lineHeight: 1.5 }}>
                        Are you sure you want to permanently delete the event <strong>{form.title}</strong>?
                    </p>
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button onClick={() => { onDelete(); setConfirmDelete(false); }}
                            style={{
                                background: T.danger, color: "#fff", border: "none",
                                borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 500,
                                flex: 1, transition: "transform 0.1s, opacity 0.2s"
                            }}>
                            Yes, Delete
                        </button>
                        <button onClick={() => setConfirmDelete(false)}
                            style={{
                                background: "transparent", border: `1px solid ${T.rule}`, color: T.muted,
                                borderRadius: 8, padding: "10px 18px", fontSize: 14, flex: 1,
                                transition: "transform 0.1s, opacity 0.2s"
                            }}>Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                            <label style={lbl(T)}>Title</label>
                            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="What's the event?" style={field(T)} />
                        </div>
                        <div>
                            <label style={lbl(T)}>Description</label>
                            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Brief description…" rows={3} style={{ ...field(T), resize: "vertical" }} />
                        </div>
                        <div className="form-row">
                            <div>
                                <label style={lbl(T)}>Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={field(T)}>
                                    {CATS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={lbl(T)}>Date</label>
                                <input type="date" value={form.date || ""} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={field(T)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div>
                                <label style={lbl(T)}>Start Time</label>
                                <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} style={field(T)} />
                            </div>
                            <div>
                                <label style={lbl(T)}>End Time</label>
                                <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} style={field(T)} />
                            </div>
                        </div>
                        <div>
                            <label style={lbl(T)}>Location</label>
                            <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                placeholder="Where?" style={field(T)} />
                        </div>
                        {!editId && (
                            <div>
                                <label style={lbl(T)}>Recurrence</label>
                                <select value={form.recurrence || "none"} onChange={e => setForm(f => ({ ...f, recurrence: e.target.value }))} style={field(T)}>
                                    <option value="none">Does not repeat</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="biweekly">Bi-weekly (Every 2 weeks)</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                                {form.recurrence && form.recurrence !== "none" && (
                                    <p style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>This will auto-generate 10 upcoming instances.</p>
                                )}
                            </div>
                        )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28 }}>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={onSave}
                                style={{
                                    background: T.navy, color: T.surface, border: "none",
                                    borderRadius: 8, padding: "10px 22px", fontSize: 14, fontWeight: 500,
                                    transition: "transform 0.1s, opacity 0.2s"
                                }}>
                                {editId ? "Save Changes" : "Add Event"}
                            </button>
                            <button onClick={onClose}
                                style={{
                                    background: "transparent", border: `1px solid ${T.rule}`, color: T.muted,
                                    borderRadius: 8, padding: "10px 18px", fontSize: 14,
                                    transition: "transform 0.1s, opacity 0.2s"
                                }}>Cancel</button>
                        </div>
                        {editId && (
                            <button onClick={() => setConfirmDelete(true)}
                                style={{
                                    background: "transparent", border: `1px solid #FECACA`, color: T.danger,
                                    borderRadius: 8, padding: "10px 16px", fontSize: 13,
                                    transition: "transform 0.1s, opacity 0.2s"
                                }}>Delete</button>
                        )}
                    </div>
                </>
            )}
        </Overlay>
    );
}
