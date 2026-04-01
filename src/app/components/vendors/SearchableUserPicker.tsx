import React, { useState, useMemo } from "react";
import { Search, X, Users, Shield, Plus, Bell, Info, Mail, ChevronDown, SlidersHorizontal, Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { SYSTEM_USERS, SYSTEM_ROLES, type LicenseType, type UserStatus } from "./partnerConstants";

const ROLE_COLORS = ["#EDF4FF", "#F0FDF4", "#F5F3FF", "#FEFCE8", "#FEF2F2", "#ECFDF5", "#FDF4FF", "#FFFBEB"];
const ROLE_TEXT_COLORS = ["#1D4ED8", "#15803D", "#7C3AED", "#A16207", "#DC2626", "#059669", "#A21CAF", "#B45309"];
const USER_BG_COLORS = ["#DBEAFE", "#D1FAE5", "#EDE9FE", "#FEF9C3", "#FEE2E2", "#CFFAFE", "#FCE7F3", "#FEF3C7"];
const USER_TEXT_COLORS = ["#1E40AF", "#166534", "#5B21B6", "#854D0E", "#991B1B", "#0E7490", "#9D174D", "#92400E"];

function getRoleColor(i: number) { return { bg: ROLE_COLORS[i % ROLE_COLORS.length], text: ROLE_TEXT_COLORS[i % ROLE_TEXT_COLORS.length] }; }
function getUserColor(i: number) { return { bg: USER_BG_COLORS[i % USER_BG_COLORS.length], text: USER_TEXT_COLORS[i % USER_TEXT_COLORS.length] }; }

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return <>{parts.map((p, i) => p.toLowerCase() === query.toLowerCase() ? <mark key={i} className="bg-transparent px-0.5 rounded-sm" style={{ backgroundColor: "#FEFCE8", color: "#854D0E", fontWeight: 500 }}>{p}</mark> : <React.Fragment key={i}>{p}</React.Fragment>)}</>;
}

function LicenseBadge({ type }: { type: LicenseType }) {
  const styles: Record<LicenseType, { bg: string; text: string; border: string }> = {
    "Full Access": { bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE" },
    "Field User": { bg: "#F1F5F9", text: "#475569", border: "#E2E8F0" },
    "Read Only": { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  };
  const s = styles[type];
  return (
    <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-md border shrink-0" style={{ fontWeight: 500, backgroundColor: s.bg, color: s.text, borderColor: s.border }}>
      {type}
    </span>
  );
}

function StatusPill({ status }: { status: UserStatus }) {
  const isActive = status === "Active";
  return (
    <span
      className="inline-flex items-center text-[11px] px-2.5 py-0.5 rounded-full border shrink-0"
      style={{
        fontWeight: 500,
        backgroundColor: isActive ? "#ECFDF5" : "#F1F5F9",
        color: isActive ? "#065F46" : "#334155",
        borderColor: isActive ? "#A7F3D0" : "#CBD5E1",
      }}
    >
      {status}
    </span>
  );
}

// ── Searchable Filter Dropdown ──
function FilterDropdown({ label, value, options, onChange, accentColor }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; accentColor: string;
}) {
  const [open, setOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const isActive = value !== "all";
  const filtered = options.filter((o) => o === "all" || o.toLowerCase().includes(filterSearch.toLowerCase()));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button"
          className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border text-xs transition-colors cursor-pointer ${
            isActive
              ? "border-primary/30 bg-[#EDF4FF] text-[#0A77FF]"
              : "border-border bg-white text-foreground hover:bg-muted/50 hover:border-muted-foreground/30"
          }`}
          style={{ fontWeight: isActive ? 600 : 500 }}
        >
          <SlidersHorizontal className={`w-3 h-3 ${isActive ? "text-[#0A77FF]" : "text-muted-foreground"}`} />
          {isActive ? value : label}
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" sideOffset={4} className="w-[200px] p-0 z-[350] rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#E2E8F0]/80">
        {options.length > 5 && (
          <div className="p-2 border-b border-[#F1F5F9]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
              <input
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full h-8 pl-8 pr-3 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[12px] text-[#0F172A] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#0A77FF]"
                autoFocus
              />
            </div>
          </div>
        )}
        <div className="max-h-[200px] overflow-y-auto py-1 scrollbar-hide">
          {filtered.map((opt) => {
            const isAll = opt === "all";
            const isSelected = isAll ? value === "all" : value === opt;
            return (
              <button key={opt} type="button"
                onClick={() => { onChange(isAll ? "all" : (value === opt ? "all" : opt)); setOpen(false); setFilterSearch(""); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-[12px] transition-colors ${isSelected ? "bg-[#EDF4FF]/50" : "hover:bg-[#F8FAFC]"}`}
                style={{ fontWeight: isSelected ? 600 : 400 }}
              >
                <span className={`flex-1 ${isSelected ? "text-[#0A77FF]" : "text-[#334155]"}`}>{isAll ? `All ${label}s` : opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#0A77FF] shrink-0" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface SearchableUserPickerProps {
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  accentColor?: string;
  accentBg?: string;
  accentBorder?: string;
  accentText?: string;
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
}: SearchableUserPickerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"roles" | "users">("roles");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [licenseFilter, setLicenseFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [listFilter, setListFilter] = useState<"all" | "roles" | "users">("all");

  const departments = useMemo(() => {
    const depts = new Set<string>();
    SYSTEM_USERS.forEach((u) => depts.add(u.department));
    return Array.from(depts).sort();
  }, []);

  const filteredUsers = useMemo(() => {
    let list = [...SYSTEM_USERS];
    if (deptFilter !== "all") list = list.filter((u) => u.department === deptFilter);
    if (licenseFilter !== "all") list = list.filter((u) => u.licenseType === licenseFilter);
    if (statusFilter !== "all") list = list.filter((u) => u.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q) || u.department.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list;
  }, [search, deptFilter, licenseFilter, statusFilter]);

  const filteredRoles = useMemo(() => {
    let list = [...SYSTEM_ROLES];
    if (deptFilter !== "all") list = list.filter((r) => r.department === deptFilter);
    if (licenseFilter !== "all") list = list.filter((r) => r.licenseType === licenseFilter);
    if (statusFilter !== "all") list = list.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.department.toLowerCase().includes(q));
    }
    return list;
  }, [search, deptFilter, licenseFilter, statusFilter]);

  const selectedUsers = useMemo(() => SYSTEM_USERS.filter((u) => selectedIds.has(u.id)), [selectedIds]);
  const selectedRoles = useMemo(() => SYSTEM_ROLES.filter((r) => selectedIds.has(r.id)), [selectedIds]);
  const totalSelected = selectedUsers.length + selectedRoles.length;

  const toggle = (id: string) => { const next = new Set(selectedIds); next.has(id) ? next.delete(id) : next.add(id); onSelectionChange(next); };
  const remove = (id: string) => { const next = new Set(selectedIds); next.delete(id); onSelectionChange(next); };

  const showRolesInList = listFilter === "all" || listFilter === "roles";
  const showUsersInList = listFilter === "all" || listFilter === "users";
  const hasActiveFilters = deptFilter !== "all" || licenseFilter !== "all" || statusFilter !== "all";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] text-[#334155]" style={{ fontWeight: 600 }}>{label}</p>
        {totalSelected > 0 && (
          <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ fontWeight: 600, backgroundColor: accentBg, color: accentText }}>
            {totalSelected} recipient{totalSelected !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Recipients list */}
      {totalSelected > 0 && (
        <div className="mb-2.5">
          {selectedRoles.length > 0 && selectedUsers.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {(["all", "roles", "users"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setListFilter(f)}
                  className={`px-2.5 py-1 rounded-full text-[11px] border transition-colors ${listFilter === f ? "border-[#0A77FF] text-[#0A77FF] bg-[#EDF4FF]" : "border-[#E2E8F0] text-[#94A3B8] bg-white hover:bg-[#F8FAFC]"}`}
                  style={{ fontWeight: listFilter === f ? 600 : 500 }}
                >{f === "all" ? `All (${totalSelected})` : f === "roles" ? `Roles (${selectedRoles.length})` : `Users (${selectedUsers.length})`}</button>
              ))}
            </div>
          )}
          {showRolesInList && selectedRoles.length > 0 && (
            <>
              {listFilter === "all" && selectedUsers.length > 0 && (
                <div className="flex items-center gap-1.5 mb-1 mt-1"><Shield className="w-3 h-3 text-[#94A3B8]" /><span className="text-[10px] text-[#94A3B8] uppercase tracking-wide" style={{ fontWeight: 600 }}>Roles</span></div>
              )}
              <div className="space-y-1">
                {selectedRoles.map((role, i) => {
                  const c = getRoleColor(i);
                  return (
                    <div key={role.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#F1F5F9] bg-white">
                      <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: c.bg }}><Shield className="w-3 h-3" style={{ color: c.text }} /></div>
                      <p className="text-[12px] text-[#0F172A] truncate flex-1" style={{ fontWeight: 600 }}>{role.name}</p>
                      <LicenseBadge type={role.licenseType} />
                      <StatusPill status={role.status} />
                      <span className="text-[10px] px-1.5 py-[2px] rounded-full bg-[#F1F5F9] text-[#64748B] shrink-0" style={{ fontWeight: 500 }}>{role.userCount} users</span>
                      <button onClick={() => remove(role.id)} className="p-0.5 rounded hover:bg-[#FEF2F2] transition-colors cursor-pointer shrink-0"><X className="w-3 h-3 text-[#CBD5E1] hover:text-[#EF4444]" /></button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {showUsersInList && selectedUsers.length > 0 && (
            <>
              {listFilter === "all" && selectedRoles.length > 0 && (
                <div className="flex items-center gap-1.5 mb-1 mt-2"><Users className="w-3 h-3 text-[#94A3B8]" /><span className="text-[10px] text-[#94A3B8] uppercase tracking-wide" style={{ fontWeight: 600 }}>Users</span></div>
              )}
              <div className="space-y-1">
                {selectedUsers.map((user, i) => {
                  const c = getUserColor(i);
                  const isDisabled = user.status === "Disabled";
                  return (
                    <div key={user.id} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#F1F5F9] bg-white ${isDisabled ? "opacity-60" : ""}`}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] shrink-0" style={{ fontWeight: 700, backgroundColor: c.bg, color: c.text }}>{user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
                      <p className="text-[12px] text-[#0F172A] truncate flex-1" style={{ fontWeight: 600 }}>{user.name}</p>
                      <LicenseBadge type={user.licenseType} />
                      <StatusPill status={user.status} />
                      <button onClick={() => remove(user.id)} className="p-0.5 rounded hover:bg-[#FEF2F2] transition-colors cursor-pointer shrink-0"><X className="w-3 h-3 text-[#CBD5E1] hover:text-[#EF4444]" /></button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* CTA */}
      <button type="button" onClick={() => { setModalOpen(true); setSearch(""); setDeptFilter("all"); setLicenseFilter("all"); setStatusFilter("all"); }}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-dashed transition-all cursor-pointer text-[12px] hover:bg-[#FAFBFC]"
        style={{ borderColor: accentBorder, color: accentText, fontWeight: 600 }}
      >
        <Plus className="w-3.5 h-3.5" />{totalSelected > 0 ? "Manage recipients" : "Add notification recipients"}
      </button>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="!p-0 !gap-0 !bg-white overflow-hidden flex flex-col z-[300] !border-[#E2E8F0]/60 w-[calc(100%-2rem)] sm:w-[680px] 2xl:w-[780px]"
          style={{ maxWidth: "min(860px, calc(100vw - 2rem))", maxHeight: "min(85vh, 760px)", borderRadius: 16, boxShadow: "0 24px 80px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)" }}
          hideCloseButton>
          <DialogTitle className="sr-only">Select Notification Recipients</DialogTitle>
          <DialogDescription className="sr-only">Search and select users or roles to notify.</DialogDescription>

          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-[#E2E8F0] bg-white shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accentBg }}><Bell className="w-5 h-5" style={{ color: accentColor }} /></div>
                <div>
                  <h3 className="text-[15px] text-[#0F172A]" style={{ fontWeight: 700 }}>Notification Recipients</h3>
                  <p className="text-[12px] text-[#94A3B8] mt-0.5">Select roles or individual users to notify</p>
                </div>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors cursor-pointer"><X className="w-4.5 h-4.5 text-[#94A3B8]" /></button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={tab === "roles" ? "Search roles by name or department…" : "Search users by name, role, or email…"}
                className="w-full h-10 pl-10 pr-9 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#0A77FF] focus:ring-2 focus:ring-[#0A77FF]/10 focus:bg-white transition-colors" autoFocus />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-[#F1F5F9] transition-colors cursor-pointer"><X className="w-3.5 h-3.5 text-[#94A3B8]" /></button>}
            </div>

            {/* Filter row — tabs + dropdown filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tab pills */}
              {(["roles", "users"] as const).map((t) => {
                const isActive = tab === t;
                const count = t === "roles" ? filteredRoles.length : filteredUsers.length;
                return (
                  <button key={t} type="button" onClick={() => { setTab(t); setSearch(""); }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? "border-primary bg-[#EDF4FF] hover:bg-[#D6E8FF]"
                        : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:border-muted-foreground/30"
                    }`}
                    style={{ fontWeight: isActive ? 500 : 400, color: isActive ? "#0A77FF" : undefined }}
                  >
                    {t === "roles" ? <Shield className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                    {t === "roles" ? "Roles" : "Users"}
                    <span className={`text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center ${isActive ? "bg-primary/10" : "bg-muted"}`}
                      style={{ fontWeight: 600, color: isActive ? "#0A77FF" : "#475569" }}>{count}</span>
                  </button>
                );
              })}

              <span className="w-px h-5 bg-[#E2E8F0]" />

              {/* Department dropdown */}
              <FilterDropdown
                label="Department"
                value={deptFilter}
                options={["all", ...departments]}
                onChange={setDeptFilter}
                accentColor={accentColor}
              />

              {/* License dropdown */}
              <FilterDropdown
                label="License"
                value={licenseFilter}
                options={["all", "Full Access", "Field User", "Read Only"]}
                onChange={setLicenseFilter}
                accentColor={accentColor}
              />

              {/* Status dropdown */}
              <FilterDropdown
                label="Status"
                value={statusFilter}
                options={["all", "Active", "Disabled"]}
                onChange={setStatusFilter}
                accentColor={accentColor}
              />

              {hasActiveFilters && (
                <button type="button" onClick={() => { setDeptFilter("all"); setLicenseFilter("all"); setStatusFilter("all"); }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] cursor-pointer transition-colors border border-transparent hover:border-[#FECACA]" style={{ fontWeight: 500 }}>
                  <X className="w-3 h-3" />Clear all
                </button>
              )}
            </div>
          </div>

          {/* Table header — matches listing page */}
          <div className="flex items-center gap-3 px-5 py-2 bg-muted/30 border-b border-border shrink-0">
            <div className="w-[18px]" />
            <div className="w-9" />
            <span className="flex-1 text-muted-foreground text-xs font-normal">{tab === "roles" ? "Role" : "User"}</span>
            <span className="w-[100px] text-muted-foreground text-xs font-normal">Department</span>
            <span className="w-[90px] text-muted-foreground text-xs font-normal text-center">License</span>
            <span className="w-[80px] text-muted-foreground text-xs font-normal text-center">Status</span>
          </div>

          {/* List */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide bg-white">
            {tab === "roles" ? (
              filteredRoles.length === 0 ? (
                <div className="px-5 py-12 text-center"><Shield className="w-8 h-8 text-[#E2E8F0] mx-auto mb-2" /><p className="text-[13px] text-[#94A3B8]" style={{ fontWeight: 500 }}>No roles match your filters</p></div>
              ) : (
                <div>
                  {filteredRoles.map((role, i) => {
                    const isSelected = selectedIds.has(role.id);
                    const c = getRoleColor(i);
                    const isDisabledRole = role.status === "Disabled";
                    return (
                      <button key={role.id} type="button" onClick={() => toggle(role.id)}
                        className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors border-b border-border/50 ${isSelected ? "bg-primary/[0.03]" : "hover:bg-muted/50"} ${isDisabledRole ? "opacity-60" : ""}`}>
                        <div className="w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center shrink-0 transition-all"
                          style={{ borderColor: isSelected ? accentColor : "#CBD5E1", backgroundColor: isSelected ? accentColor : "transparent" }}>
                          {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: c.bg }}><Shield className="w-4.5 h-4.5" style={{ color: c.text }} /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}><HighlightText text={role.name} query={search} /></p>
                            {role.description && (
                              <Tooltip><TooltipTrigger asChild><span><Info className="w-3 h-3 text-[#CBD5E1] shrink-0" /></span></TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-[240px] text-[11px] z-[350] rounded-xl bg-white/95 backdrop-blur-md border border-[#E2E8F0]/80 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]">{role.description}</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">{role.activeUsers}/{role.userCount} active users</p>
                        </div>
                        <span className="w-[100px] text-[11px] text-[#64748B] truncate shrink-0"><HighlightText text={role.department} query={search} /></span>
                        <div className="w-[90px] flex justify-center"><LicenseBadge type={role.licenseType} /></div>
                        <div className="w-[80px] flex justify-center"><StatusPill status={role.status} /></div>
                      </button>
                    );
                  })}
                </div>
              )
            ) : (
              filteredUsers.length === 0 ? (
                <div className="px-5 py-12 text-center"><Users className="w-8 h-8 text-[#E2E8F0] mx-auto mb-2" /><p className="text-[13px] text-[#94A3B8]" style={{ fontWeight: 500 }}>No users match your filters</p></div>
              ) : (
                <div>
                  {filteredUsers.map((user, i) => {
                    const isSelected = selectedIds.has(user.id);
                    const c = getUserColor(i);
                    const isDisabledUser = user.status === "Disabled";
                    return (
                      <button key={user.id} type="button" onClick={() => toggle(user.id)}
                        className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors border-b border-border/50 ${isSelected ? "bg-primary/[0.03]" : "hover:bg-muted/50"} ${isDisabledUser ? "opacity-50" : ""}`}>
                        <div className="w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center shrink-0 transition-all"
                          style={{ borderColor: isSelected ? accentColor : "#CBD5E1", backgroundColor: isSelected ? accentColor : "transparent" }}>
                          {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] shrink-0" style={{ fontWeight: 700, backgroundColor: c.bg, color: c.text }}>
                          {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}><HighlightText text={user.name} query={search} /></p>
                          <p className="text-[11px] text-[#94A3B8] truncate mt-0.5"><HighlightText text={user.role} query={search} /> · {user.email}</p>
                        </div>
                        <span className="w-[100px] text-[11px] text-[#64748B] truncate shrink-0"><HighlightText text={user.department} query={search} /></span>
                        <div className="w-[90px] flex justify-center"><LicenseBadge type={user.licenseType} /></div>
                        <div className="w-[80px] flex justify-center"><StatusPill status={user.status} /></div>
                      </button>
                    );
                  })}
                </div>
              )
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#E2E8F0] bg-white shrink-0">
            <span className="text-[13px] text-[#64748B]" style={{ fontWeight: 500 }}>{totalSelected > 0 ? `${totalSelected} recipient${totalSelected !== 1 ? "s" : ""} selected` : "No recipients selected"}</span>
            <div className="flex items-center gap-3">
              {totalSelected > 0 && (
                <button onClick={() => onSelectionChange(new Set())} className="text-[13px] text-[#64748B] hover:text-[#EF4444] transition-colors cursor-pointer px-3.5 py-2 rounded-lg hover:bg-[#FEF2F2] border border-[#E2E8F0] hover:border-[#FECACA]" style={{ fontWeight: 500 }}>Clear all</button>
              )}
              <button onClick={() => setModalOpen(false)} className="px-5 py-2 rounded-lg text-[13px] text-white cursor-pointer transition-colors hover:opacity-90 shadow-sm" style={{ fontWeight: 600, backgroundColor: accentColor }}>Done</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
