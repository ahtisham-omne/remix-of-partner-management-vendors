import React, { useState, useMemo, useCallback } from "react";
import { Search, X, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Users, Mail, Phone, Building2, AlignJustify, List as ListIcon, ChevronDown, Check } from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { ContactPerson } from "./partnerConstants";

// ── Highlight ──
function Hl({ text, q }: { text: string; q: string }) {
  if (!q.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return <>{parts.map((p, i) => p.toLowerCase() === q.toLowerCase() ? <mark key={i} className="bg-transparent px-0.5 rounded-sm" style={{ backgroundColor: "#FEFCE8", color: "#854D0E", fontWeight: 500 }}>{p}</mark> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
}

// ── Avatar ──
const TINTS: Record<string, { bg: string; text: string }> = {
  "#0A77FF": { bg: "#EBF3FF", text: "#0A77FF" }, "#7C3AED": { bg: "#F0EBFF", text: "#7C3AED" },
  "#059669": { bg: "#E8FAF3", text: "#059669" }, "#D97706": { bg: "#FEF5E7", text: "#B45D04" },
};
function tint(c: string) { return TINTS[c] || { bg: "#F0F4FF", text: c || "#64748B" }; }
function initials(n: string) { return n.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2); }

// ── Density ──
type Density = "condensed" | "comfort";

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
}

export function PocDataTable({
  contacts, selectedIds, onToggleSelect, onSelectAll,
  searchQuery, onSearchChange, categoryFilter, onCategoryFilterChange,
  page, totalPages, onPageChange, totalCount, perPage = 20,
  onCreateNew, selectable = true,
}: PocDataTableProps) {
  const [density, setDensity] = useState<Density>("condensed");
  const isComfort = density === "comfort";

  const allIds = contacts.map((c) => c.id);
  const allSel = selectable && selectedIds ? allIds.length > 0 && allIds.every((id) => selectedIds.has(id)) : false;
  const someSel = selectable && selectedIds ? !allSel && allIds.some((id) => selectedIds.has(id)) : false;

  const FILTERS = [
    { key: "all", label: "All", count: totalCount },
    { key: "Sales", label: "Sales" },
    { key: "Supply Chain Management", label: "Supply Chain" },
    { key: "Finance", label: "Finance" },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* ── Row 1: Search + Filters + Count + Density + Create ── */}
      <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2 shrink-0">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
            <Input
              placeholder="Search by name, email, or phone..."
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
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Count */}
          <span className="text-sm tabular-nums mr-1 hidden sm:inline" style={{ fontWeight: 500 }}>
            <span className="text-foreground">{totalCount}</span>
            <span className="text-muted-foreground/70"> contacts</span>
          </span>

          <div className="w-px h-5 bg-border/60 mx-0.5 hidden sm:block" />

          {/* Density */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center h-9 gap-2 px-3 rounded-lg border border-border bg-white shadow-sm hover:bg-muted/40 transition-colors cursor-pointer">
                {isComfort ? <ListIcon className="w-[18px] h-[18px] text-muted-foreground/80" /> : <AlignJustify className="w-[18px] h-[18px] text-muted-foreground/80" />}
                <span className="text-sm hidden md:inline" style={{ fontWeight: 500 }}>{isComfort ? "Comfort" : "Condensed"}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              {(["condensed", "comfort"] as Density[]).map((d) => (
                <DropdownMenuItem key={d} onClick={() => setDensity(d)} className={density === d ? "bg-muted/50" : ""}>
                  {d === "condensed" ? <AlignJustify className="w-4 h-4 mr-2 text-muted-foreground" /> : <ListIcon className="w-4 h-4 mr-2 text-muted-foreground" />}
                  {d === "condensed" ? "Condensed" : "Comfort"}
                  {density === d && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create */}
          {onCreateNew && (
            <>
              <div className="w-px h-5 bg-border/60 mx-0.5 hidden sm:block" />
              <button onClick={onCreateNew} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#0A77FF] hover:bg-[#0862D0] text-white text-sm shadow-sm transition-colors cursor-pointer" style={{ fontWeight: 600 }}>
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Create New</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Row 2: Filter pills ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-4 pb-2.5 shrink-0">
        {FILTERS.map((f) => {
          const isActive = categoryFilter === f.key;
          return (
            <button key={f.key} onClick={() => onCategoryFilterChange(f.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive ? "border-primary bg-[#EDF4FF] hover:bg-[#D6E8FF] active:bg-[#ADD1FF]" : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:border-muted-foreground/30 active:bg-muted"
              }`}
              style={{ fontWeight: isActive ? 500 : 400, color: isActive ? "#0A77FF" : undefined }}
            >
              {f.label}
              {f.count != null && (
                <span className={`text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center ${isActive ? "bg-primary/10" : "bg-muted"}`}
                  style={{ fontWeight: 600, color: isActive ? "#0A77FF" : "#475569" }}>{f.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Table ── */}
      <div className="flex-1 min-h-0 overflow-auto border-t border-border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow className={`bg-muted/30 hover:bg-muted/30 ${isComfort ? "[&>th]:h-10" : "[&>th]:h-8"}`}>
              {selectable && (
                <TableHead className="w-[40px] min-w-[40px] max-w-[40px] !pl-4 !pr-0">
                  <Checkbox
                    checked={allSel ? true : someSel ? "indeterminate" : false}
                    onCheckedChange={() => onSelectAll?.(allIds)}
                  />
                </TableHead>
              )}
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="w-[130px]">Department</TableHead>
              <TableHead className="w-[200px]">Email</TableHead>
              <TableHead className="w-[140px]">Phone</TableHead>
              <TableHead className="w-[140px]">Secondary Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={selectable ? 6 : 5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Users className="w-8 h-8 text-[#E2E8F0] mb-2" />
                    <p className="text-sm text-muted-foreground" style={{ fontWeight: 500 }}>No contacts found</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((c) => {
                const isSel = selectable && selectedIds ? selectedIds.has(c.id) : false;
                const t = tint(c.avatarColor);
                return (
                  <TableRow
                    key={c.id}
                    onClick={() => selectable && onToggleSelect?.(c.id)}
                    className={`${selectable ? "cursor-pointer" : ""} ${isSel ? "bg-primary/[0.03]" : ""} ${
                      isComfort ? "[&>td]:py-3 [&>td]:pl-4 [&>td]:pr-2" : "[&>td]:py-1 [&>td]:pl-4 [&>td]:pr-2"
                    }`}
                  >
                    {selectable && (
                      <TableCell className="w-[40px] !pl-4 !pr-0">
                        <Checkbox checked={isSel} onCheckedChange={() => onToggleSelect?.(c.id)} onClick={(e) => e.stopPropagation()} />
                      </TableCell>
                    )}
                    {/* Name + Company */}
                    <TableCell>
                      <div className={`flex items-center ${isComfort ? "gap-3" : "gap-2.5"}`}>
                        <div
                          className={`${isComfort ? "w-9 h-9" : "w-8 h-8"} rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-[#E8ECF1]`}
                          style={{ backgroundColor: t.bg, color: t.text, fontSize: isComfort ? 12 : 11, fontWeight: 700 }}
                        >
                          {initials(c.name)}
                        </div>
                        <div className="min-w-0">
                          <span className={`${isComfort ? "text-[13.5px]" : "text-sm"} truncate block`} style={{ fontWeight: 500 }}><Hl text={c.name} q={searchQuery} /></span>
                          {isComfort && <span className="text-xs text-muted-foreground/60 truncate block">{c.company}</span>}
                        </div>
                      </div>
                    </TableCell>
                    {/* Department — plain text */}
                    <TableCell>
                      <span className={`${isComfort ? "text-[13.5px]" : "text-sm"} text-[#475569]`}>
                        {c.department === "Supply Chain Management" ? "Supply Chain" : c.department}
                      </span>
                    </TableCell>
                    {/* Email */}
                    <TableCell>
                      <span className={`${isComfort ? "text-[13.5px]" : "text-sm"} text-muted-foreground truncate block max-w-[180px]`}>
                        <Hl text={c.email} q={searchQuery} />
                      </span>
                    </TableCell>
                    {/* Phone */}
                    <TableCell>
                      <div className="min-w-0">
                        <span className={`${isComfort ? "text-[13.5px]" : "text-sm"} text-muted-foreground block`}>{c.phone}</span>
                        {isComfort && c.phoneExt && <span className="text-xs text-muted-foreground/50">ext. {c.phoneExt}</span>}
                      </div>
                    </TableCell>
                    {/* Secondary Phone */}
                    <TableCell>
                      <div className="min-w-0">
                        <span className={`${isComfort ? "text-[13.5px]" : "text-sm"} text-muted-foreground block`}>{c.secondaryPhone || "—"}</span>
                        {isComfort && c.secondaryPhoneExt && <span className="text-xs text-muted-foreground/50">ext. {c.secondaryPhoneExt}</span>}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination — matches listing page ── */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border shrink-0">
          <span className="text-xs text-muted-foreground tabular-nums" style={{ fontWeight: 500 }}>
            {contacts.length > 0 ? `${(page - 1) * perPage + 1}–${Math.min(page * perPage, totalCount)} of ${totalCount}` : `0 of ${totalCount}`}
          </span>
          <div className="flex items-center gap-0.5">
            <button onClick={() => onPageChange(1)} disabled={page <= 1} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronsLeft className="w-3.5 h-3.5 text-muted-foreground" /></button>
            <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button key={p} onClick={() => onPageChange(p)}
                  className={`w-8 h-8 rounded-md text-xs transition-colors cursor-pointer ${p === page ? "bg-primary text-white" : "hover:bg-muted/60 text-muted-foreground"}`}
                  style={{ fontWeight: p === page ? 600 : 400 }}>{p}</button>
              );
            })}
            <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /></button>
            <button onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-muted/60 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"><ChevronsRight className="w-3.5 h-3.5 text-muted-foreground" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
