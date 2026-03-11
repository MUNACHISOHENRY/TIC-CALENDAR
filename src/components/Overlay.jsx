export default function Overlay({ children, onClose, T }) {
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 200, background: "rgba(13,13,43,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
            backdropFilter: "blur(4px)", animation: "fadeIn 0.15s ease"
        }}
            onClick={onClose}>
            <div className="modal-inner" style={{
                background: T.surface, borderRadius: 14,
                width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto",
                boxShadow: "0 24px 60px rgba(13,13,43,0.18), 0 4px 16px rgba(13,13,43,0.08)",
                border: `1px solid ${T.rule}`
            }}
                onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
