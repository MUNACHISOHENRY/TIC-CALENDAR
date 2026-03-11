import { CATS } from "../theme";
import { field } from "../utils";

export default function SearchBar({ search, setSearch, filters, setFilters, T, dark }) {
    const toggleFilter = (id) => {
        setFilters(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    return (
        <div style={{ marginBottom: 28 }}>
            <input
                type="text"
                placeholder="Search title, description, or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...field(T), marginBottom: 16, padding: "12px 16px", fontSize: 15 }}
            />
            <div className="search-filters" style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: T.muted, fontWeight: 500, marginRight: 4, flexShrink: 0 }}>Filters:</span>
                {CATS.map(cat => {
                    const active = filters.includes(cat.id);
                    return (
                        <button
                            key={cat.id}
                            onClick={() => toggleFilter(cat.id)}
                            style={{
                                background: active ? cat.bg : "transparent",
                                color: active ? cat.color : T.muted,
                                border: `1px solid ${active ? cat.color : T.rule}`,
                                borderRadius: 20,
                                padding: "6px 14px",
                                fontSize: 12,
                                fontWeight: 500,
                                transition: "all 0.2s ease",
                                flexShrink: 0
                            }}
                        >
                            {cat.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
