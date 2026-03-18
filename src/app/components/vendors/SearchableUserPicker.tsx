import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, ChevronDown, Users } from "lucide-react";
import { SYSTEM_USERS, type SystemUser } from "./partnerConstants";

interface SearchableUserPickerProps {
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  accentColor?: string;       // e.g. "#D97706" for amber, "#DC2626" for red
  accentBg?: string;          // e.g. "#FFFBEB", "#FEF2F2"
  accentBorder?: string;      // e.g. "#FDE68A", "#FECACA"
  accentText?: string;        // e.g. "#92400E", "#991B1B"
  label?: string;
  placeholder?: string;
}

export function SearchableUserPicker({
  selectedIds,
  onSelectionChange,
  accentColor = "#0A77FF",
  accentBg = "#EDF4FF",
  accentBorder = "#BFDBFE",
  accentText = "#1E40AF",
  label = "Select recipients",
  placeholder = "Search users by name, role, or department…",
}: SearchableUserPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return SYSTEM_USERS;
    const q = search.toLowerCase();
    return SYSTEM_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedUsers = useMemo(
    () => SYSTEM_USERS.filter((u) => selectedIds.has(u.id)),
    [selectedIds]
  );

  const toggleUser = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    onSelectionChange(next);
  };

  const removeUser = (id: string) => {
    const next = new Set(selectedIds);
    next.delete(id);
    onSelectionChange(next);
  };

  return (
    <div ref={containerRef} className="relative">
      <p className="text-[10px] mb-1.5" style={{ fontWeight: 600, color: accentText }}>{label}</p>

      {/* Selected user pills */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1.5">
          {selectedUsers.map((user) => (
            <span
              key={user.id}
              className="inline-flex items-center gap-1 pl-1 pr-1.5 py-0.5 rounded-full text-[10px] border"
              style={{
                fontWeight: 500,
                backgroundColor: accentBg,
                borderColor: accentBorder,
                color: accentText,
              }}
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white shrink-0"
                style={{ fontWeight: 700, backgroundColor: user.avatarColor }}
              >
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
              <span className="truncate max-w-[80px]">{user.name.split(" ")[0]}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeUser(user.id); }}
                className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Trigger / search input */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all"
        style={{
          borderColor: isOpen ? accentColor : "#E2E8F0",
          backgroundColor: isOpen ? `${accentBg}30` : "white",
        }}
      >
        <Users className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
        <span className="text-[11px] flex-1" style={{ color: selectedIds.size > 0 ? accentText : "#94A3B8", fontWeight: 500 }}>
          {selectedIds.size > 0
            ? `${selectedIds.size} user${selectedIds.size !== 1 ? "s" : ""} selected`
            : "Click to search and add users…"}
        </span>
        <ChevronDown
          className="w-3.5 h-3.5 shrink-0 transition-transform"
          style={{ color: "#94A3B8", transform: isOpen ? "rotate(180deg)" : undefined }}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 left-0 right-0 mt-1 rounded-lg border shadow-lg overflow-hidden"
          style={{ borderColor: accentBorder, backgroundColor: "white" }}
        >
          {/* Search bar */}
          <div className="flex items-center gap-2 px-2.5 py-2 border-b" style={{ borderColor: "#F1F5F9" }}>
            <Search className="w-3.5 h-3.5 shrink-0 text-[#94A3B8]" />
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-[11px] text-[#0F172A] placeholder:text-[#94A3B8] bg-transparent outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="p-0.5 rounded hover:bg-[#F1F5F9]">
                <X className="w-3 h-3 text-[#94A3B8]" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[180px] overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="px-3 py-4 text-center">
                <p className="text-[11px] text-[#94A3B8]">No users found for "{search}"</p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = selectedIds.has(user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUser(user.id)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left transition-colors hover:bg-[#F8FAFC]"
                    style={isSelected ? { backgroundColor: `${accentBg}60` } : undefined}
                  >
                    {/* Checkbox indicator */}
                    <div
                      className="w-4 h-4 rounded border-[1.5px] flex items-center justify-center shrink-0 transition-all"
                      style={{
                        borderColor: isSelected ? accentColor : "#CBD5E1",
                        backgroundColor: isSelected ? accentColor : "transparent",
                      }}
                    >
                      {isSelected && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Avatar */}
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] text-white shrink-0"
                      style={{ fontWeight: 700, backgroundColor: user.avatarColor }}
                    >
                      {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}>{user.name}</p>
                      <p className="text-[9px] text-[#94A3B8] truncate">{user.role} · {user.department}</p>
                    </div>

                    {isSelected && (
                      <span
                        className="text-[8px] px-1.5 py-0.5 rounded-full shrink-0"
                        style={{ fontWeight: 600, backgroundColor: accentBg, color: accentColor, border: `1px solid ${accentBorder}` }}
                      >
                        Added
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-2.5 py-1.5 border-t flex items-center justify-between" style={{ borderColor: "#F1F5F9", backgroundColor: "#FAFBFC" }}>
            <span className="text-[9px] text-[#94A3B8]">{SYSTEM_USERS.length} users in system</span>
            {selectedIds.size > 0 && (
              <button
                onClick={() => onSelectionChange(new Set())}
                className="text-[9px] px-1.5 py-0.5 rounded hover:bg-[#F1F5F9] transition-colors"
                style={{ color: accentColor, fontWeight: 600 }}
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}