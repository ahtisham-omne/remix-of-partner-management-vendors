import React, { useState, useMemo, useCallback } from "react";
import { Search, X, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Users, Mail, Phone, Building2, AlignJustify, List as ListIcon, LayoutGrid, ChevronDown, Check } from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { ContactPerson } from "./partnerConstants";

// ── Highlight helper ──
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return <>{parts.map((p, i) => p.toLowerCase() === query.toLowerCase() ? <mark key={i} className="bg-transparent px-0.5 rounded-sm" style={{ backgroundColor: "#FEFCE8", color: "#854D0E", fontWeight: 500 }}>{p}</mark> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
}

// ── Avatar color helper ──
const AVATAR_TINTS: Record<string, { bg: string; text: string }> = {
  "#0A77FF": { bg: "#EBF3FF", text: "#0A77FF" },
  "#7C3AED": { bg: "#F0EBFF", text: "#7C3AED" },
  "#059669": { bg: "#E8FAF3", text: "#059669" },
  "#D97706": { bg: "#FEF5E7", text: "#B45D04" },
};
function getAvatarTint(color: string) { return AVATAR_TINTS[color] || { bg: "#F0F4FF", text: color || "#64748B" }; }
function getInitials(name: string) { return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2); }

// ── Department badge ──
const DEPT_COLORS: Record<string, { bg: string; text: string }> = {
  Sales: { bg: "#EFF6FF", text: "#1D4ED8" },
  "Supply Chain Management": { bg: "#F0FDF4", text: "#15803D" },
  Finance: { bg: "#FFFBEB", text: "#92400E" },
};

// ── Density types ──
type Density = "condensed" | "comfort";

const DENSITY_OPTIONS: { key: Density; label: string; icon: typeof AlignJustify }[] = [
  { key: "condensed", label: "Condensed", icon: AlignJustify },
  { key: "comfort", label: "Comfort", icon: ListIcon },
];

// ── Props ──
export interface PocDataTableProps {
  contacts: ContactPerson[];
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  perPage?: number;
  onCreateNew?: () => void;
  selectable?: boolean;
  showActions?: boolean;
}

export function PocDataTable({
  contacts,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  page,
  totalPages,
  onPageChange,
  totalCount,
  perPage = 20,
  onCreateNew,
  selectable = true,
  showActions = false,
}: PocDataTableProps) {
  const [density, setDensity] = useState<Density>("condensed");
  const isRelaxed = density === "comfort";

  // Department counts for filters
  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    contacts.forEach((c) => { counts[c.department] = (counts[c.department] || 0) + 1; });
    return counts;
  }, [contacts]);

  const FILTERS = [
    { key: "all", label: "All", count: totalCount },
    { key: "Sales", label: "Sales", count: deptCounts["Sales"] || 0 },
    { key: "Supply Chain Management", label: "Supply Chain", count: deptCounts["Supply Chain Management"] || 0 },
    { key: "Finance", label: "Finance", count: deptCounts["Finance"] || 0 },
  ];

  // Select all logic
  const allPageIds = contacts.map((c) => c.id);
  const allPageSelected = selectable && selectedIds ? allPageIds.length > 0 && allPageIds.every((id) => selectedIds.has(id)) : false;
  const somePageSelected = selectable && selectedIds ? !allPageSelected && allPageIds.some((id) => selectedIds.has(id)) : false;

  const handleSelectAll = useCallback(() => {
    if (onSelectAll) onSelectAll(allPageIds);
  }, [allPageIds, onSelectAll]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Row 1: Search + Create + Count + Density */}
      <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2 shrink-0">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-8 h-9 text-sm bg-white border-border/80 shadow-sm placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-primary/20"
            />
            {searchQuery && (
              <button onClick={() => onSearchChange("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {onCreateNew && (
            <button onClick={onCreateNew} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#0A77FF] hover:bg-[#0862D0] text-white text-sm shadow-sm transition-colors cursor-pointer" style={{ fontWeight: 600 }}>
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create New</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground tabular-nums" style={{ fontWeight: 500 }}>
            {totalCount} contact{totalCount !== 1 ? "s" : ""}
          </span>
          <div className="w-px h-5 bg-border/60" />
          {/* Density */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg border border-border bg-white shadow-sm hover:bg-muted/40 transition-colors cursor-pointer">
                {density === "condensed" ? <AlignJustify className="w-4 h-4 text-muted-foreground/80" /> : <ListIcon className="w-4 h-4 text-muted-foreground/80" />}
                <span className="text-sm hidden md:inline" style={{ fontWeight: 500 }}>{density === "condensed" ? "Condensed" : "Comfort"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              {DENSITY_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt.key} onClick={() => setDensity(opt.key)} className={density === opt.key ? "bg-muted/50" : ""}>
                  <opt.icon className="w-4 h-4 mr-2 text-muted-foreground" />
                  {opt.label}
                  {density === opt.key && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Row 2: Filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-4 pb-2.5 shrink-0">
        {FILTERS.map((f) => {
          const isActive = categoryFilter === f.key;
          return (
            <button key={f.key} onClick={() => onCategoryFilterChange(f.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive ? "border-primary bg-[#EDF4FF] hover:bg-[#D6E8FF]" : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:border-muted-foreground/30"
              }`}
              style={{ fontWeight: isActive ? 500 : 400, color: isActive ? "#0A77FF" : undefined }}
            >
              {f.label}
              <span className={`text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center ${isActive ? "bg-primary/10" : "bg-muted"}`}
                style={{ fontWeight: 600, color: isActive ? "#0A77FF" : "#475569" }}>{f.count}</span>
            </button>
          );
        })}
      </div>

      {/* Table header */}
      <div className={`flex items-center gap-3 px-4 bg-muted/30 border-y border-border shrink-0 ${isRelaxed ? "py-2" : "py-1.5"}`}>
        {selectable && (
          <Checkbox
            checked={allPageSelected ? true : somePageSelected ? "indeterminate" : false}
            onCheckedChange={handleSelectAll}
            className="shrink-0"
          />
        )}
        <span className="w-8" />
        <span className="flex-1 text-muted-foreground text-xs font-normal">Name</span>
        <span className="w-[140px] text-muted-foreground text-xs font-normal">Department</span>
        <span className="w-[180px] text-muted-foreground text-xs font-normal hidden lg:block">Email</span>
        <span className="w-[130px] text-muted-foreground text-xs font-normal hidden md:block">Phone</span>
      </div>

      {/* Table body */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Users className="w-8 h-8 text-[#E2E8F0] mb-2" />
            <p className="text-sm text-muted-foreground" style={{ fontWeight: 500 }}>No contacts found</p>
            <p className="text-xs text-muted-foreground/60 mt-0.5">Try adjusting your search or filters</p>
          </div>
        ) : (
          contacts.map((contact) => {
            const isSelected = selectable && selectedIds ? selectedIds.has(contact.id) : false;
            const at = getAvatarTint(contact.avatarColor);
            const initials = getInitials(contact.name);
            return (
              <div
                key={contact.id}
                onClick={() => selectable && onToggleSelect?.(contact.id)}
                className={`flex items-center gap-3 px-4 border-b border-border/50 transition-colors ${selectable ? "cursor-pointer" : ""} ${
                  isSelected ? "bg-primary/[0.03]" : "hover:bg-muted/50"
                } ${isRelaxed ? "py-3" : "py-2"}`}
              >
                {selectable && (
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelect?.(contact.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0"
                  />
                )}
                {/* Avatar */}
                <div
                  className={`rounded-lg flex items-center justify-center shrink-0 ${isRelaxed ? "w-9 h-9" : "w-8 h-8"}`}
                  style={{ backgroundColor: at.bg, color: at.text, fontSize: isRelaxed ? 12 : 11, fontWeight: 700 }}
                >
                  {initials}
                </div>
                {/* Name + Company */}
                <div className="flex-1 min-w-0">
                  <p className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} text-[#0F172A] truncate`} style={{ fontWeight: 500 }}>
                    <HighlightText text={contact.name} query={searchQuery} />
                  </p>
                  {isRelaxed && (
                    <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
                      <HighlightText text={contact.company} query={searchQuery} />
                    </p>
                  )}
                </div>
                {/* Department — plain text */}
                <span className={`w-[140px] ${isRelaxed ? "text-[13px]" : "text-sm"} text-[#64748B] truncate shrink-0`}>
                  <HighlightText text={contact.department === "Supply Chain Management" ? "Supply Chain" : contact.department} query={searchQuery} />
                </span>
                {/* Email */}
                <span className={`w-[180px] ${isRelaxed ? "text-[13px]" : "text-sm"} text-muted-foreground truncate shrink-0 hidden lg:block`}>
                  <HighlightText text={contact.email} query={searchQuery} />
                </span>
                {/* Phone */}
                <span className={`w-[130px] ${isRelaxed ? "text-[13px]" : "text-sm"} text-muted-foreground truncate shrink-0 hidden md:block`}>
                  {contact.phone}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border shrink-0 bg-card">
          <span className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
            {(page - 1) * perPage + 1}–{Math.min(page * perPage, totalCount)} of {totalCount}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => onPageChange(1)} disabled={page === 1} className="p-1.5 rounded-md hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronsLeft className="w-3.5 h-3.5 text-muted-foreground" /></button>
            <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="p-1.5 rounded-md hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button key={p} onClick={() => onPageChange(p)}
                  className={`w-8 h-8 rounded-md text-xs transition-colors cursor-pointer ${p === page ? "bg-primary text-white" : "hover:bg-muted/60 text-muted-foreground"}`}
                  style={{ fontWeight: p === page ? 600 : 400 }}
                >{p}</button>
              );
            })}
            <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="p-1.5 rounded-md hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /></button>
            <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages} className="p-1.5 rounded-md hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronsRight className="w-3.5 h-3.5 text-muted-foreground" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
