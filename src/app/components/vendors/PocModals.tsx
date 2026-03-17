import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Search,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Maximize2,
  Minimize2,
  Users,
  UserPlus,
  Phone,
  PhoneCall,
  Mail,
  Globe,
  Briefcase,
  Building2,
  Smartphone,
  Hash,
} from "lucide-react";
import type { ContactPerson } from "./partnerConstants";

const POC_PER_PAGE = 20;

const DEPT_COLORS: Record<string, { bg: string; text: string; accent: string; border: string }> = {
  "Sales": { bg: "#F0F4FF", text: "#3B6FC2", accent: "#4B83DB", border: "#D6E2F5" },
  "Supply Chain Management": { bg: "#ECFDF5", text: "#1B7A52", accent: "#34B77A", border: "#C6F0DA" },
  "Finance": { bg: "#FFF8ED", text: "#B05E10", accent: "#E58E2A", border: "#FADCB0" },
};

const AVATAR_TINTS: Record<string, { bg: string; text: string }> = {
  "#0A77FF": { bg: "#EBF3FF", text: "#0A77FF" },
  "#7C3AED": { bg: "#F0EBFF", text: "#7C3AED" },
  "#059669": { bg: "#E8FAF3", text: "#059669" },
  "#D97706": { bg: "#FEF5E7", text: "#B45D04" },
};

function getAvatarTint(color: string) {
  return AVATAR_TINTS[color] || { bg: "#F0F4FF", text: color };
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || query.trim().length === 0) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-[#FDE68A] text-inherit rounded-[2px] px-[1px]">{part}</mark>
    ) : (
      part
    )
  );
}

// ═══════════════════════════════════════════════════
// POC Section UI — shared between location + partner
// ═══════════════════════════════════════════════════

interface PocSectionProps {
  selectedContacts: ContactPerson[];
  onRemove: (id: string) => void;
  onOpenSelect: () => void;
  onOpenCreate: () => void;
  emptyDescription: string;
  isGlobal?: boolean;
}

export function PocSectionContent({
  selectedContacts,
  onRemove,
  onOpenSelect,
  onOpenCreate,
  emptyDescription,
  isGlobal,
}: PocSectionProps) {
  return (
    <div className="px-3 sm:px-4 py-3 sm:py-4">
      {selectedContacts.length > 0 ? (
        <div className="space-y-3">
          {/* Header row: count + actions */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A77FF]/8 border border-[#0A77FF]/12">
                {isGlobal ? <Globe className="w-3 h-3 text-[#0A77FF]" /> : <Users className="w-3 h-3 text-[#0A77FF]" />}
                <span className="text-[11px] text-[#0A77FF]" style={{ fontWeight: 700 }}>
                  {selectedContacts.length}
                </span>
              </div>
              <span className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>
                {isGlobal ? "global " : ""}contact{selectedContacts.length !== 1 ? "s" : ""} assigned
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onOpenSelect}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#0A77FF] hover:bg-[#EDF4FF] transition-colors cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                <Users className="w-3 h-3" />
                <span className="hidden min-[480px]:inline">Contact Directory</span>
              </button>
              <div className="w-px h-4 bg-[#E2E8F0]" />
              <button
                onClick={onOpenCreate}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#334155] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                <Plus className="w-3 h-3" />
                <span className="hidden min-[480px]:inline">New</span>
              </button>
            </div>
          </div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedContacts.map((contact) => {
              const dc = DEPT_COLORS[contact.department] || DEPT_COLORS["Sales"];
              return (
                <div
                  key={contact.id}
                  className="relative rounded-xl border bg-white group transition-all duration-200 hover:shadow-[0_4px_16px_-2px_rgba(0,0,0,0.08)] overflow-hidden"
                  style={{ borderColor: "#E8ECF1" }}
                >
                  <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${dc.accent}, ${dc.accent}80)` }} />
                  <button
                    onClick={() => onRemove(contact.id)}
                    className="absolute top-[11px] right-2.5 w-6 h-6 rounded-full bg-white border border-[#F1F5F9] text-[#94A3B8] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#FEF2F2] hover:text-[#EF4444] hover:border-[#FECACA] shadow-sm cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="p-3 pt-2.5">
                    <div className="flex items-start gap-2.5">
                      <div className="relative">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs shrink-0 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.15)]"
                          style={{ backgroundColor: contact.avatarColor, fontWeight: 700 }}
                        >
                          {getInitials(contact.name)}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 pr-5">
                        <p className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}>{contact.name}</p>
                        <span className="text-[10px] text-[#94A3B8] truncate block">{contact.company}</span>
                      </div>
                    </div>
                    <div className="mt-2.5 mb-2 flex items-center gap-1.5">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px]"
                        style={{ fontWeight: 600, backgroundColor: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dc.accent }} />
                        {contact.department}
                      </span>
                      {isGlobal && (
                        <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px] bg-[#F0F9FF] text-[#0369A1] border border-[#BAE6FD]" style={{ fontWeight: 600 }}>
                          <Globe className="w-2.5 h-2.5" />
                          Global
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 pt-2 border-t border-[#F1F5F9]">
                      <div className="flex items-center gap-2 text-[11px] text-[#475569]">
                        <div className="w-5 h-5 rounded bg-[#F8FAFC] flex items-center justify-center shrink-0">
                          <Phone className="w-2.5 h-2.5 text-[#94A3B8]" />
                        </div>
                        <span className="truncate">{contact.phone}</span>
                      </div>
                      {contact.secondaryPhone && (
                        <div className="flex items-center gap-2 text-[11px] text-[#475569]">
                          <div className="w-5 h-5 rounded bg-[#F8FAFC] flex items-center justify-center shrink-0">
                            <PhoneCall className="w-2.5 h-2.5 text-[#94A3B8]" />
                          </div>
                          <span className="truncate">{contact.secondaryPhone}</span>
                          {contact.secondaryPhoneExt && (
                            <span className="text-[10px] text-[#94A3B8] shrink-0">ext.{contact.secondaryPhoneExt}</span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-[#475569]">
                        <div className="w-5 h-5 rounded bg-[#F8FAFC] flex items-center justify-center shrink-0">
                          <Mail className="w-2.5 h-2.5 text-[#94A3B8]" />
                        </div>
                        <span className="truncate">{contact.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-[#64748B] leading-relaxed">
            {emptyDescription}
          </p>
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-2.5">
            <button
              onClick={onOpenSelect}
              className="group relative rounded-xl border border-[#E2E8F0] bg-white p-4 text-left transition-all duration-200 hover:border-[#BFDBFE] hover:shadow-[0_4px_16px_-4px_rgba(10,119,255,0.15)] cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#EDF4FF]/0 to-[#EDF4FF]/0 group-hover:from-[#EDF4FF]/60 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EDF4FF] to-[#DBEAFE] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                  <Users className="w-5 h-5 text-[#0A77FF]" />
                </div>
                <p className="text-[13px] text-[#0F172A]" style={{ fontWeight: 600 }}>Select from Contact Directory</p>
                <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                  Browse and pick from your saved contacts with search and filters.
                </p>
              </div>
            </button>
            <button
              onClick={onOpenCreate}
              className="group relative rounded-xl border border-[#E2E8F0] bg-white p-4 text-left transition-all duration-200 hover:border-[#D5D3EC] hover:shadow-[0_4px_16px_-4px_rgba(124,58,237,0.12)] cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#F5F3FF]/0 to-[#F5F3FF]/0 group-hover:from-[#F5F3FF]/60 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                  <UserPlus className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <p className="text-[13px] text-[#0F172A]" style={{ fontWeight: 600 }}>Create new contact</p>
                <p className="text-[11px] text-[#94A3B8] mt-1 leading-relaxed">
                  Add a brand-new point of contact directly from here.
                </p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Select from Dictionary Modal
// ═══════════════════════════════════════════════════

interface SelectPocDictionaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactDictionary: ContactPerson[];
  pocSearch: string;
  onPocSearchChange: (val: string) => void;
  pocCategoryFilter: "all" | "Sales" | "Supply Chain Management" | "Finance";
  onPocCategoryFilterChange: (val: "all" | "Sales" | "Supply Chain Management" | "Finance") => void;
  pocDepartmentCounts: Record<string, number>;
  pocPagedContacts: ContactPerson[];
  pocPage: number;
  pocTotalPages: number;
  onPocPageChange: (page: number) => void;
  pocTempSelected: Set<string>;
  onTogglePocTemp: (id: string) => void;
  onConfirm: () => void;
  onOpenCreatePoc: () => void;
  contextLabel: string;
}

export function SelectPocDictionaryModal({
  open,
  onOpenChange,
  contactDictionary,
  pocSearch,
  onPocSearchChange,
  pocCategoryFilter,
  onPocCategoryFilterChange,
  pocDepartmentCounts,
  pocPagedContacts,
  pocPage,
  pocTotalPages,
  onPocPageChange,
  pocTempSelected,
  onTogglePocTemp,
  onConfirm,
  onOpenCreatePoc,
  contextLabel,
}: SelectPocDictionaryModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const modalBaseClass =
    "!fixed !inset-0 !translate-x-0 !translate-y-0 !m-auto !w-full !h-full transition-[max-width,max-height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]";
  const modalSizeClass = isFullScreen
    ? `${modalBaseClass} !max-w-[calc(100%-1rem)] sm:!max-w-[calc(100%-1.5rem)] lg:!max-w-[calc(100%-2rem)] !max-h-[calc(100%-1rem)] sm:!max-h-[calc(100%-1.5rem)] lg:!max-h-[calc(100%-2rem)] !rounded-2xl`
    : `${modalBaseClass} !max-w-[100%] sm:!max-w-[960px] lg:!max-w-[1040px] !max-h-[100dvh] sm:!max-h-[88vh] rounded-none sm:!rounded-2xl`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex flex-col p-0 gap-0 border-0 sm:border ${modalSizeClass}`}
        hideCloseButton
        overlayClassName="z-[205]"
        style={{ zIndex: 210, boxShadow: "0 24px 48px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)" }}
      >
        <DialogTitle className="sr-only">Select point of contact</DialogTitle>
        <DialogDescription className="sr-only">Choose contacts from the contact directory to associate with {contextLabel}.</DialogDescription>

        {/* Header */}
        <div className="px-3 sm:px-5 pt-3 sm:pt-4 pb-3 shrink-0 border-b border-[#EEF2F6] bg-white rounded-t-none sm:rounded-t-2xl">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h2 className="text-[15px] sm:text-[17px] text-[#0F172A]" style={{ fontWeight: 700 }}>
                Select Point of Contact
              </h2>
              <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5" style={{ fontWeight: 400 }}>
                Choose from your saved contacts or create a new one to assign to {contextLabel}.
              </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                {isFullScreen ? "Exit full" : "Full view"}
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Search + Create CTA */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="relative w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input
                value={pocSearch}
                onChange={(e) => onPocSearchChange(e.target.value)}
                placeholder="Search point of contact"
                className="pl-9 h-9 rounded-lg border-[#E2E8F0] bg-white text-sm"
              />
            </div>
            <button
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0A77FF] text-white text-[13px] hover:bg-[#0960D9] transition-colors shadow-sm shrink-0 cursor-pointer"
              style={{ fontWeight: 600 }}
              onClick={onOpenCreatePoc}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create New Contact</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {([
              { key: "all" as const, label: "All", count: contactDictionary.length },
              { key: "Sales" as const, label: "Sales", count: pocDepartmentCounts["Sales"] || 0 },
              { key: "Supply Chain Management" as const, label: "Supply Chain", count: pocDepartmentCounts["Supply Chain Management"] || 0 },
              { key: "Finance" as const, label: "Finance", count: pocDepartmentCounts["Finance"] || 0 },
            ]).map((tab) => {
              const isActive = pocCategoryFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => onPocCategoryFilterChange(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all border cursor-pointer ${
                    isActive
                      ? "bg-[#0A77FF]/8 border-[#0A77FF]/20 text-[#0A77FF]"
                      : "bg-white border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:border-[#CBD5E1]"
                  }`}
                  style={{ fontWeight: isActive ? 600 : 500 }}
                >
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-[#0A77FF]/12 text-[#0A77FF]" : "bg-[#F1F5F9] text-[#94A3B8]"}`} style={{ fontWeight: 600 }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Grid */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 bg-[#FAFBFC]">
          {pocPagedContacts.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-[#94A3B8]" />
              </div>
              <p className="text-sm text-[#64748B]" style={{ fontWeight: 600 }}>No contacts found</p>
              <p className="text-xs text-[#94A3B8] mt-1.5 max-w-[260px]">Try adjusting your search or filter, or create a new contact.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {pocPagedContacts.map((contact) => {
                const isSelected = pocTempSelected.has(contact.id);
                const dc = DEPT_COLORS[contact.department] || DEPT_COLORS["Sales"];
                const at = getAvatarTint(contact.avatarColor);
                return (
                  <button
                    key={contact.id}
                    onClick={() => onTogglePocTemp(contact.id)}
                    className={`group/poc relative text-left rounded-xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-[#0A77FF] bg-[#FAFCFF] shadow-[0_0_0_1px_#0A77FF]"
                        : "border-[#E8ECF1] bg-white hover:border-[#BFDBFE] hover:shadow-[0_4px_16px_-4px_rgba(10,119,255,0.12)]"
                    }`}
                  >
                    <div className="p-3.5">
                      {/* Row 1: Avatar + Name + Checkbox */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] shrink-0"
                          style={{ backgroundColor: at.bg, color: at.text, fontWeight: 700 }}
                        >
                          {getInitials(contact.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}>{highlightMatch(contact.name, pocSearch)}</p>
                          <p className="text-[11px] text-[#64748B] truncate mt-0.5">{highlightMatch(contact.company, pocSearch)}</p>
                        </div>
                        <div className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                          isSelected ? "bg-[#0A77FF] border-[#0A77FF]" : "border-[#CBD5E1] bg-white group-hover/poc:border-[#94A3B8]"
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                        </div>
                      </div>

                      {/* Department badge */}
                      <div className="mt-2.5 mb-3">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-[2px] rounded text-[10px]"
                          style={{ fontWeight: 500, backgroundColor: dc.bg, color: dc.text }}
                        >
                          {contact.department === "Supply Chain Management" ? "Supply Chain" : contact.department}
                        </span>
                      </div>

                      {/* Contact details — clean list */}
                      <div className="space-y-1.5 pt-2.5 border-t border-[#F1F5F9]">
                        <div className="flex items-center gap-2 text-[11px] text-[#475569]">
                          <Phone className="w-3 h-3 text-[#94A3B8] shrink-0" />
                          <span className="truncate">{contact.phone}</span>
                        </div>
                        {contact.secondaryPhone && (
                          <div className="flex items-center gap-2 text-[11px] text-[#475569]">
                            <PhoneCall className="w-3 h-3 text-[#94A3B8] shrink-0" />
                            <span className="truncate">{contact.secondaryPhone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-[#475569]">
                          <Mail className="w-3 h-3 text-[#94A3B8] shrink-0" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="px-3 sm:px-5 py-2.5 border-t border-[#F1F5F9] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span>Records per page</span>
            <span className="px-2 py-1 rounded border border-[#E2E8F0] text-xs text-[#0F172A]" style={{ fontWeight: 500 }}>{POC_PER_PAGE}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => onPocPageChange(1)} disabled={pocPage === 1} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronsLeft className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
            <button onClick={() => onPocPageChange(Math.max(1, pocPage - 1))} disabled={pocPage === 1} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
            {Array.from({ length: Math.min(pocTotalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (pocTotalPages <= 5) pageNum = i + 1;
              else if (pocPage <= 3) pageNum = i + 1;
              else if (pocPage >= pocTotalPages - 2) pageNum = pocTotalPages - 4 + i;
              else pageNum = pocPage - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPocPageChange(pageNum)}
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs transition-colors ${
                    pocPage === pageNum ? "bg-[#0A77FF] text-white" : "text-[#64748B] hover:bg-[#F1F5F9]"
                  }`}
                  style={{ fontWeight: pocPage === pageNum ? 600 : 400 }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button onClick={() => onPocPageChange(Math.min(pocTotalPages, pocPage + 1))} disabled={pocPage === pocTotalPages} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
            <button onClick={() => onPocPageChange(pocTotalPages)} disabled={pocPage === pocTotalPages} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronsRight className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-5 py-3 border-t border-[#EEF2F6] bg-white rounded-b-none sm:rounded-b-2xl flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0A77FF]/8 border border-[#0A77FF]/12">
              <Users className="w-3 h-3 text-[#0A77FF]" />
              <span className="text-[11px] text-[#0A77FF]" style={{ fontWeight: 700 }}>{pocTempSelected.size}</span>
            </div>
            <span className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>
              selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-[#0A77FF] text-[13px] text-white hover:bg-[#0960D9] transition-colors shadow-sm cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════
// Create New POC Modal
// ═══════════════════════════════════════════════════

// Country code data for phone selectors
const COUNTRY_CODES = [
  { code: "+1", flag: "\u{1F1FA}\u{1F1F8}", label: "US" },
  { code: "+44", flag: "\u{1F1EC}\u{1F1E7}", label: "UK" },
  { code: "+91", flag: "\u{1F1EE}\u{1F1F3}", label: "IN" },
  { code: "+49", flag: "\u{1F1E9}\u{1F1EA}", label: "DE" },
  { code: "+33", flag: "\u{1F1EB}\u{1F1F7}", label: "FR" },
  { code: "+81", flag: "\u{1F1EF}\u{1F1F5}", label: "JP" },
  { code: "+86", flag: "\u{1F1E8}\u{1F1F3}", label: "CN" },
  { code: "+61", flag: "\u{1F1E6}\u{1F1FA}", label: "AU" },
  { code: "+971", flag: "\u{1F1E6}\u{1F1EA}", label: "AE" },
  { code: "+966", flag: "\u{1F1F8}\u{1F1E6}", label: "SA" },
];

function getCountryFlag(code: string) {
  return COUNTRY_CODES.find((c) => c.code === code)?.flag || "\u{1F1FA}\u{1F1F8}";
}

// Department tint colors for the avatar preview
const DEPT_AVATAR_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  "Sales": { bg: "#EBF3FF", text: "#0A77FF", ring: "#BFDBFE" },
  "Supply Chain Management": { bg: "#E8FAF3", text: "#059669", ring: "#A7F3D0" },
  "Finance": { bg: "#FEF5E7", text: "#D97706", ring: "#FDE68A" },
};

interface CreatePocModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contextName?: string;
  newPocName: string;
  onNewPocNameChange: (val: string) => void;
  newPocDepartment: "Sales" | "Supply Chain Management" | "Finance";
  onNewPocDepartmentChange: (val: "Sales" | "Supply Chain Management" | "Finance") => void;
  newPocRole: string;
  onNewPocRoleChange: (val: string) => void;
  newPocLandline: string;
  onNewPocLandlineChange: (val: string) => void;
  newPocLandlineCode: string;
  onNewPocLandlineCodeChange: (val: string) => void;
  newPocExt: string;
  onNewPocExtChange: (val: string) => void;
  newPocMobile: string;
  onNewPocMobileChange: (val: string) => void;
  newPocMobileCode: string;
  onNewPocMobileCodeChange: (val: string) => void;
  newPocEmail: string;
  onNewPocEmailChange: (val: string) => void;
  saveAndCreateAnother: boolean;
  onSaveAndCreateAnotherChange: (val: boolean) => void;
  onSave: () => void;
}

export function CreatePocModal({
  open,
  onOpenChange,
  contextName,
  newPocName,
  onNewPocNameChange,
  newPocDepartment,
  onNewPocDepartmentChange,
  newPocRole,
  onNewPocRoleChange,
  newPocLandline,
  onNewPocLandlineChange,
  newPocLandlineCode,
  onNewPocLandlineCodeChange,
  newPocExt,
  onNewPocExtChange,
  newPocMobile,
  onNewPocMobileChange,
  newPocMobileCode,
  onNewPocMobileCodeChange,
  newPocEmail,
  onNewPocEmailChange,
  saveAndCreateAnother,
  onSaveAndCreateAnotherChange,
  onSave,
}: CreatePocModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const modalBaseClass =
    "!fixed !inset-0 !translate-x-0 !translate-y-0 !m-auto !w-full !h-full transition-[max-width,max-height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]";
  const modalSizeClass = isFullScreen
    ? `${modalBaseClass} !max-w-[calc(100%-1rem)] sm:!max-w-[calc(100%-1.5rem)] lg:!max-w-[calc(100%-2rem)] !max-h-[calc(100%-1rem)] sm:!max-h-[calc(100%-1.5rem)] lg:!max-h-[calc(100%-2rem)] !rounded-2xl`
    : `${modalBaseClass} !max-w-[100%] sm:!max-w-[680px] !max-h-[100dvh] sm:!max-h-[90vh] rounded-none sm:!rounded-2xl`;

  const initials = newPocName.trim() ? getInitials(newPocName.trim()) : "";
  const deptAvatarColor = DEPT_AVATAR_COLORS[newPocDepartment] || DEPT_AVATAR_COLORS["Sales"];
  const isValid = newPocName.trim().length > 0;

  // Count filled fields for progress
  const filledCount = [newPocName, newPocRole, newPocLandline, newPocMobile, newPocEmail].filter((v) => v.trim()).length;
  const totalFields = 5;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex flex-col p-0 gap-0 border-0 sm:border ${modalSizeClass}`}
        hideCloseButton
        overlayClassName="z-[205]"
        style={{ zIndex: 210, boxShadow: "0 24px 48px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)" }}
      >
        <DialogTitle className="sr-only">Create New Point of Contact</DialogTitle>
        <DialogDescription className="sr-only">Create a new contact</DialogDescription>

        {/* Header */}
        <div className="px-3 sm:px-5 pt-3 sm:pt-4 pb-3 shrink-0 bg-white rounded-t-none sm:rounded-t-2xl border-b border-[#EEF2F6]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Live avatar preview */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: initials ? deptAvatarColor.bg : "#F1F5F9",
                  color: initials ? deptAvatarColor.text : "#94A3B8",
                  boxShadow: initials ? `0 0 0 2px white, 0 0 0 3.5px ${deptAvatarColor.ring}` : "none",
                  fontWeight: 700,
                  fontSize: initials.length > 1 ? "13px" : "15px",
                }}
              >
                {initials || <UserPlus className="w-4.5 h-4.5" />}
              </div>
              <div className="min-w-0">
                <h2 className="text-[15px] sm:text-[17px] text-[#0F172A]" style={{ fontWeight: 700 }}>
                  Create New Contact
                </h2>
                <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5 truncate" style={{ fontWeight: 400 }}>
                  {contextName
                    ? <>For <span className="text-[#0F172A]" style={{ fontWeight: 500 }}>{contextName}</span> &middot; Purchase Orders &amp; Inquiries</>
                    : "Assist with Purchase Orders/Sales Orders and inquiries."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                {isFullScreen ? "Exit full" : "Full view"}
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Subtle progress indicator */}
          
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5 bg-[#FAFBFC]">
          {/* Personnel Info Section */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[#EBF3FF] flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 text-[#0A77FF]" />
              </div>
              <span className="text-xs text-[#0F172A]" style={{ fontWeight: 600 }}>Personnel Info</span>
              
            </div>

            <div className="rounded-xl border border-[#E8ECF1] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="p-3.5 sm:p-4 space-y-3.5">
                {/* Name + Department row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="flex items-center gap-1 text-[12px] text-[#475569] mb-1.5" style={{ fontWeight: 500 }}>
                      <span>Full Name</span>
                      <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className={`relative rounded-lg transition-all duration-200 ${focusedField === "name" ? "ring-2 ring-[#0A77FF]/15" : ""}`}>
                      <Input
                        value={newPocName}
                        onChange={(e) => onNewPocNameChange(e.target.value)}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter full name"
                        className="h-10 rounded-lg border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#B8C4D0] focus:border-[#0A77FF] focus:ring-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-[12px] text-[#475569] mb-1.5" style={{ fontWeight: 500 }}>
                      Department
                    </label>
                    <Select value={newPocDepartment} onValueChange={(v) => onNewPocDepartmentChange(v as "Sales" | "Supply Chain Management" | "Finance")}>
                      <SelectTrigger className="h-10 rounded-lg border-[#E2E8F0] bg-white text-sm hover:border-[#CBD5E1] transition-colors focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/15 [&>svg]:text-[#94A3B8]">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="z-[250] rounded-lg">
                        <SelectItem value="Sales">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#0A77FF]" />
                            Sales
                          </span>
                        </SelectItem>
                        <SelectItem value="Supply Chain Management">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#059669]" />
                            Supply Chain Management
                          </span>
                        </SelectItem>
                        <SelectItem value="Finance">
                          <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                            Finance
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Role row */}
                <div className="sm:w-1/2 sm:pr-[7px]">
                  <label className="flex items-center gap-1 text-[12px] text-[#475569] mb-1.5" style={{ fontWeight: 500 }}>
                    <Briefcase className="w-3 h-3 text-[#94A3B8]" />
                    Role / Title
                  </label>
                  <div className={`relative rounded-lg transition-all duration-200 ${focusedField === "role" ? "ring-2 ring-[#0A77FF]/15" : ""}`}>
                    <Input
                      value={newPocRole}
                      onChange={(e) => onNewPocRoleChange(e.target.value)}
                      onFocus={() => setFocusedField("role")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="e.g. Sales Manager, Procurement Lead"
                      className="h-10 rounded-lg border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#B8C4D0] focus:border-[#0A77FF] focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[#ECFDF5] flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5 text-[#059669]" />
              </div>
              <span className="text-xs text-[#0F172A]" style={{ fontWeight: 600 }}>Contact Details</span>
              
            </div>

            <div className="rounded-xl border border-[#E8ECF1] bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
              <div className="p-3.5 sm:p-4 space-y-3.5">
                {/* Landline + Ext row */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3.5">
                  <div>
                    <label className="flex items-center gap-1 text-[12px] text-[#475569] mb-1.5" style={{ fontWeight: 500 }}>
                      <Phone className="w-3 h-3 text-[#94A3B8]" />
                      Landline Phone Number
                    </label>
                    <div className={`flex items-center rounded-lg border border-[#E2E8F0] bg-white overflow-hidden h-10 transition-all duration-200 ${focusedField === "landline" ? "border-[#0A77FF] ring-2 ring-[#0A77FF]/15" : "hover:border-[#CBD5E1]"}`}>
                      <Select value={newPocLandlineCode} onValueChange={onNewPocLandlineCodeChange}>
                        <SelectTrigger className="h-full border-0 border-r border-[#E2E8F0] rounded-none bg-[#FAFBFC] px-2.5 text-xs w-[85px] shrink-0 shadow-none focus:ring-0 hover:bg-[#F1F5F9] transition-colors">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[14px] leading-none">{getCountryFlag(newPocLandlineCode)}</span>
                            <span className="text-[12px] text-[#475569]" style={{ fontWeight: 500 }}>{newPocLandlineCode}</span>
                          </span>
                        </SelectTrigger>
                        <SelectContent className="z-[250] rounded-lg">
                          {COUNTRY_CODES.map((cc) => (
                            <SelectItem key={cc.code} value={cc.code}>
                              <span className="flex items-center gap-2">
                                <span className="text-[14px]">{cc.flag}</span>
                                <span>{cc.label}</span>
                                <span className="text-[#94A3B8]">{cc.code}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input
                        value={newPocLandline}
                        onChange={(e) => onNewPocLandlineChange(e.target.value)}
                        onFocus={() => setFocusedField("landline")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter phone number"
                        className="flex-1 h-full px-3 text-sm text-[#0F172A] outline-none bg-transparent placeholder:text-[#B8C4D0]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-[12px] text-[#475569] mb-1.5" style={{ fontWeight: 500 }}>
                      <Hash className="w-3 h-3 text-[#94A3B8]" />
                      Extension
                    </label>
                    <div className={`relative rounded-lg transition-all duration-200 ${focusedField === "ext" ? "ring-2 ring-[#0A77FF]/15" : ""}`}>
                      <Input
                        value={newPocExt}
                        onChange={(e) => onNewPocExtChange(e.target.value)}
                        onFocus={() => setFocusedField("ext")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Ext."
                        className="h-10 rounded-lg border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#B8C4D0] focus:border-[#0A77FF] focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="flex items-center gap-1 text-[12px] text-[#475569] mb-1.5" style={{ fontWeight: 500 }}>
                      <Smartphone className="w-3 h-3 text-[#94A3B8]" />
                      Mobile Number
                    </label>
                    <div className={`flex items-center rounded-lg border border-[#E2E8F0] bg-white overflow-hidden h-10 transition-all duration-200 ${focusedField === "mobile" ? "border-[#0A77FF] ring-2 ring-[#0A77FF]/15" : "hover:border-[#CBD5E1]"}`}>
                      <Select value={newPocMobileCode} onValueChange={onNewPocMobileCodeChange}>
                        <SelectTrigger className="h-full border-0 border-r border-[#E2E8F0] rounded-none bg-[#FAFBFC] px-2.5 text-xs w-[85px] shrink-0 shadow-none focus:ring-0 hover:bg-[#F1F5F9] transition-colors">
                          <span className="flex items-center gap-1.5">
                            <span className="text-[14px] leading-none">{getCountryFlag(newPocMobileCode)}</span>
                            <span className="text-[12px] text-[#475569]" style={{ fontWeight: 500 }}>{newPocMobileCode}</span>
                          </span>
                        </SelectTrigger>
                        <SelectContent className="z-[250] rounded-lg">
                          {COUNTRY_CODES.map((cc) => (
                            <SelectItem key={cc.code} value={cc.code}>
                              <span className="flex items-center gap-2">
                                <span className="text-[14px]">{cc.flag}</span>
                                <span>{cc.label}</span>
                                <span className="text-[#94A3B8]">{cc.code}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input
                        value={newPocMobile}
                        onChange={(e) => onNewPocMobileChange(e.target.value)}
                        onFocus={() => setFocusedField("mobile")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Enter mobile number"
                        className="flex-1 h-full px-3 text-sm text-[#0F172A] outline-none bg-transparent placeholder:text-[#B8C4D0]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-1 text-[12px] text-[#475569] mb-1.5" style={{ fontWeight: 500 }}>
                      <Mail className="w-3 h-3 text-[#94A3B8]" />
                      Email Address
                    </label>
                    <div className={`relative rounded-lg transition-all duration-200 ${focusedField === "email" ? "ring-2 ring-[#0A77FF]/15" : ""}`}>
                      <Input
                        value={newPocEmail}
                        onChange={(e) => onNewPocEmailChange(e.target.value)}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="name@company.com"
                        type="email"
                        className="h-10 rounded-lg border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#B8C4D0] focus:border-[#0A77FF] focus:ring-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-[#EEF2F6] bg-white px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between sm:rounded-b-2xl">
          <button
            onClick={() => onSaveAndCreateAnotherChange(!saveAndCreateAnother)}
            className="flex items-center gap-2 cursor-pointer select-none group/check"
          >
            <div
              className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-all duration-150 ${
                saveAndCreateAnother
                  ? "bg-[#0A77FF] border-[#0A77FF]"
                  : "border-[#CBD5E1] bg-white group-hover/check:border-[#94A3B8]"
              }`}
            >
              {saveAndCreateAnother && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </div>
            <span className="text-xs sm:text-[13px] text-[#475569] group-hover/check:text-[#334155] transition-colors" style={{ fontWeight: 500 }}>
              Save and create another
            </span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-3.5 sm:px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs sm:text-[13px] text-[#334155] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              Discard
            </button>
            <button
              onClick={onSave}
              disabled={!isValid}
              className={`px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-[13px] text-white transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5 ${
                isValid
                  ? "bg-[#0A77FF] hover:bg-[#0960D9] hover:shadow-md"
                  : "bg-[#0A77FF]/40 cursor-not-allowed shadow-none"
              }`}
              style={{ fontWeight: 600 }}
            >
              <Check className="w-3.5 h-3.5" />
              Save Contact
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}