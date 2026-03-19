import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import {
  ArrowLeft,
  X,
  Pencil,
  Archive,
  Maximize2,
  Minimize2,
  Receipt,
  ChevronDown,
  Package,
  Building2,
  FileText,
  Paperclip,
  Clock,
  ChartColumn,
  Zap,
  Search,
  Plus,
  SlidersHorizontal,
  MoreHorizontal,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { getAvatarTint } from "../../utils/avatarTints";
import {
  type PaymentTermPreset,
  CREATE_PT_TYPES,
} from "./partnerConstants";
import { FilterPills, type FilterPillOption } from "./FilterPills";

const PT_DETAIL_TABS = [
  { id: "items", label: "Applicable Items", icon: Package },
  { id: "vendors_applied", label: "Partners Using", icon: Building2 },
  { id: "notes", label: "Notes & Attachments", icon: FileText },
  { id: "audit_log", label: "Activity Log", icon: Clock },
];

// Richer items data matching the reference screenshot
const PT_MOCK_ITEMS = [
  { id: "100219-42", partNo: "100219-42", name: "Front bulkhead cabinet lower cov...", category: "Ram Pro Master 2500...", itemType: "Parts", typeColor: "#0A77FF" },
  { id: "100219-51", partNo: "100219-51", name: "Box walls inlay cabinet", category: "Hardware", itemType: "Parts", typeColor: "#0A77FF" },
  { id: "100219-51-01", partNo: "100219-51-01", name: "Box walls inlay cabinet with defib...", category: "Cabinet", itemType: "Equipment • Capital", typeColor: "#7C3AED" },
  { id: "100219-51-01RC", partNo: "100219-51-01RC", name: "Box walls inlay cabinet with defib...", category: "Electronics", itemType: "Equipment • Non-Cap", typeColor: "#D97706" },
  { id: "100219-51-02", partNo: "100219-51-02", name: "Box walls inlay cabinet with refrig...", category: "Hardware", itemType: "Parts", typeColor: "#0A77FF" },
  { id: "100219-52", partNo: "100219-52", name: "Box closeout top cap inlay cabinet", category: "Electronics", itemType: "Equipment • Non-Cap", typeColor: "#D97706" },
  { id: "100219-52-02", partNo: "100219-52-02", name: "Box closeout top cap inlay cabin...", category: "Cabinet", itemType: "Parts", typeColor: "#0A77FF" },
  { id: "100120-70", partNo: "100120-70", name: "Toyota long cut, emergency brak...", category: "Hardware", itemType: "Miscellaneous", typeColor: "#D97706" },
  { id: "100120-71", partNo: "100120-71", name: "Toyota long cut, brake line bracket", category: "Electronics", itemType: "Equipment • Capital", typeColor: "#7C3AED" },
  { id: "100120-72", partNo: "100120-72", name: "Toyota long cut, 48 inch wide, re...", category: "Cabinet", itemType: "Parts", typeColor: "#0A77FF" },
  { id: "100120-73", partNo: "100120-73", name: "Toyota long cut, 48 inch wide, re...", category: "Hardware", itemType: "Equipment • Non-Cap", typeColor: "#D97706" },
  { id: "100120-74", partNo: "100120-74", name: "Toyota wide Black Diamond Trea...", category: "Electronics", itemType: "Parts", typeColor: "#0A77FF" },
];

// Richer vendors data matching the reference screenshot
const PT_MOCK_VENDORS = [
  { id: "V-1", name: "Toyota International", types: ["Vendor • Sub-Contractor", "Customer"], moreTypes: 2, partNo: "100219-42", moreItems: 12 },
  { id: "V-2", name: "Ford Motor Company", types: ["Vendor • Service Provider"], moreTypes: 1, partNo: "100219-51", moreItems: 34 },
  { id: "V-3", name: "General Motors (GM)", types: ["Vendor • Seller", "Customer"], moreTypes: 3, partNo: "100219-51-01", moreItems: 15 },
  { id: "V-4", name: "Tesla, Inc.", types: ["Vendor • Sub-Contractor"], moreTypes: 1, partNo: "100219-51-01RC", moreItems: 23 },
  { id: "V-5", name: "Chrysler (Stellantis N.V.)", types: ["Vendor • Service Provider"], moreTypes: 2, partNo: "100219-51-02", moreItems: 54 },
  { id: "V-6", name: "Rivian Automotive", types: ["Vendor • Seller", "Customer"], moreTypes: 2, partNo: "100219-52", moreItems: 43 },
  { id: "V-7", name: "Lucid Motors", types: ["Vendor • Service Provider"], moreTypes: 2, partNo: "100219-52-02", moreItems: 12 },
  { id: "V-8", name: "Honda Motor Co., Ltd. (USA)", types: ["Vendor • Seller"], moreTypes: 2, partNo: "100120-70", moreItems: 8 },
  { id: "V-9", name: "Nissan North America", types: ["Vendor • Sub-Contractor"], moreTypes: 2, partNo: "100120-71", moreItems: 5 },
  { id: "V-10", name: "BMW of North America", types: ["Vendor • Seller", "Customer"], moreTypes: 2, partNo: "100120-72", moreItems: 18 },
];

const ITEM_FILTER_OPTIONS: FilterPillOption[] = [
  { key: "me_mode", label: "Me mode", showCount: false },
  { key: "parts", label: "Parts", showCount: false },
  { key: "equipment_capital", label: "Equipment • Capital", showCount: false },
  { key: "equipment_noncap", label: "Equipment • Non-Capital", showCount: false },
  { key: "miscellaneous", label: "Miscellaneous", showCount: false },
  { key: "active", label: "Active", showCount: false },
  { key: "inactive", label: "Inactive", showCount: false },
];

const VENDOR_FILTER_OPTIONS: FilterPillOption[] = [
  { key: "me_mode", label: "Me mode", showCount: false },
  { key: "customers", label: "Customers", showCount: false },
  { key: "vendors", label: "Vendors", showCount: false },
  { key: "both", label: "Both (Vendors/Customers)", showCount: false },
  { key: "all", label: "All", showCount: false },
];

interface PaymentTermDetailModalProps {
  term: PaymentTermPreset | null;
  open: boolean;
  onClose: () => void;
}

function PaymentTermDetailModal({ term, open, onClose }: PaymentTermDetailModalProps) {
  const [tab, setTab] = useState("items");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(true);
  const [itemFilter, setItemFilter] = useState("parts");
  const [vendorFilter, setVendorFilter] = useState("all");

  if (!term) return null;

  const ptDuration = term.duration || (term.name.match(/\d+/) ? term.name.match(/\d+/)![0] : "30");
  const ptTypeLabel = CREATE_PT_TYPES.find((t) => t.id === term.category)?.label || term.typeBadge;
  const badgeColor = term.badgeColor;

  const modalBaseClass = "!fixed !inset-0 !translate-x-0 !translate-y-0 !m-auto !w-full !h-full transition-[max-width,max-height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]";
  const modalSizeClass = isFullscreen
    ? `${modalBaseClass} !max-w-[calc(100%-1rem)] sm:!max-w-[calc(100%-1.5rem)] lg:!max-w-[calc(100%-2rem)] !max-h-[calc(100%-1rem)] sm:!max-h-[calc(100%-1.5rem)] lg:!max-h-[calc(100%-2rem)] !rounded-2xl`
    : `${modalBaseClass} !max-w-[100%] sm:!max-w-[1400px] !max-h-[100dvh] sm:!max-h-[92vh] rounded-none sm:!rounded-2xl`;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setIsFullscreen(false); setTab("items"); setAboutOpen(true); } }}>
      <DialogContent
        className={`flex flex-col p-0 gap-0 border-0 sm:border z-[200] ${modalSizeClass}`}
        hideCloseButton
        style={{ boxShadow: "0 24px 48px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)" }}
      >
        <DialogTitle className="sr-only">Payment Term Details — {term.name}</DialogTitle>
        <DialogDescription className="sr-only">Detailed view of payment term {term.name}</DialogDescription>

        {/* ─── Header Bar ─── */}
        <div className="shrink-0 bg-white rounded-t-none sm:rounded-t-2xl border-b border-[#EEF2F6]">
          <div className="px-3 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={onClose} className="inline-flex items-center gap-1.5 text-[#0A77FF] text-[12px] hover:underline cursor-pointer shrink-0" style={{ fontWeight: 500 }}>
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Payment Terms
              </button>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => toast.info("Edit coming soon")}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => toast.info("Archive coming soon")}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                <Archive className="w-3.5 h-3.5" />
                Archive
              </button>
              <div className="w-px h-5 bg-[#E2E8F0] mx-0.5 hidden sm:block" />
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                {isFullscreen ? "Exit full" : "Full view"}
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Body: Split Layout ─── */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* ─── LEFT PANEL ─── */}
          <div className="w-[380px] border-r border-[#E8ECF1] flex flex-col bg-white shrink-0 overflow-y-auto">
            {/* Hero: Badge + Name + Description + Trigger pill */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] shrink-0" style={{ fontWeight: 800, backgroundColor: badgeColor + "15", color: badgeColor }}>
                  {term.typeBadge}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}>{term.name}</h3>
                    <button className="p-1 rounded hover:bg-[#F1F5F9] transition-colors cursor-pointer shrink-0 text-[#DC2626]">
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 rounded hover:bg-[#F1F5F9] transition-colors cursor-pointer shrink-0 text-[#64748B]">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-0.5 leading-relaxed">{term.description}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[11px] text-[#334155]" style={{ fontWeight: 500 }}>
                      {term.trigger}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* About this pricing rule (collapsible) */}
            <div className="border-t border-[#E8ECF1]">
              <button onClick={() => setAboutOpen(!aboutOpen)} className="w-full flex items-center gap-1.5 px-5 py-3 text-[12px] text-[#0F172A] cursor-pointer hover:bg-[#F8FAFC] transition-colors" style={{ fontWeight: 600 }}>
                <ChevronDown className={`w-3.5 h-3.5 text-[#0A77FF] transition-transform duration-200 ${aboutOpen ? "" : "-rotate-90"}`} />
                About this payment term
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${aboutOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-5 pb-4 space-y-2.5">
                  {/* Compact key-value rows */}
                  {[
                    { label: "Term Type", value: ptTypeLabel },
                    { label: "NET Duration", value: `${ptDuration} days` },
                    { label: "Trigger Event", value: term.trigger, isBadge: true },
                    { label: "Description", value: term.description || "-" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-3 py-1.5 border-b border-[#F1F5F9] last:border-0">
                      <span className="text-[11px] text-[#64748B] shrink-0" style={{ fontWeight: 500 }}>{row.label}</span>
                      {row.isBadge ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[11px] text-[#334155]" style={{ fontWeight: 500 }}>
                          {row.value}
                        </span>
                      ) : (
                        <span className="text-[12px] text-[#0F172A] text-right" style={{ fontWeight: 500 }}>{row.value}</span>
                      )}
                    </div>
                  ))}

                  {/* Discount section */}
                  <div className="border-t border-[#E8ECF1] pt-2.5 mt-1">
                    <h4 className="text-[11px] text-[#0F172A] mb-2" style={{ fontWeight: 600 }}>Early Payment Discount</h4>
                    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-[#F1F5F9]">
                      <span className="text-[11px] text-[#64748B] shrink-0" style={{ fontWeight: 500 }}>Discount %</span>
                      <span className="text-[12px] text-[#0F172A]" style={{ fontWeight: 500 }}>{term.discountPercent || "-"}</span>
                    </div>
                    <div className="flex items-start justify-between gap-3 py-1.5">
                      <span className="text-[11px] text-[#64748B] shrink-0" style={{ fontWeight: 500 }}>Eligible Period</span>
                      <span className="text-[12px] text-[#0F172A]" style={{ fontWeight: 500 }}>{term.discountPeriod ? `${term.discountPeriod} days` : "-"}</span>
                    </div>
                  </div>

                  {/* Created by / Created at */}
                  <div className="border-t border-[#E8ECF1] pt-2.5 mt-1">
                    <div className="flex items-start justify-between gap-3 py-1.5 border-b border-[#F1F5F9]">
                      <span className="text-[11px] text-[#64748B] shrink-0" style={{ fontWeight: 500 }}>Created By</span>
                      <div className="flex items-center gap-1.5">
                        {(() => { const cTint = getAvatarTint("Ahtisham Ahmad"); return (
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] shrink-0" style={{ backgroundColor: cTint.bg, color: cTint.fg, fontWeight: 700 }}>AA</div>
                        ); })()}
                        <span className="text-[12px] text-[#0F172A]" style={{ fontWeight: 500 }}>Ahtisham Ahmad</span>
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-3 py-1.5">
                      <span className="text-[11px] text-[#64748B] shrink-0" style={{ fontWeight: 500 }}>Created at</span>
                      <span className="text-[12px] text-[#0F172A]" style={{ fontWeight: 500 }}>Jan 16, 2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT PANEL ─── */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            {/* Tabs row */}
            <div className="flex items-center border-b border-[#E8ECF1] shrink-0">
              <div className="flex items-center flex-1 overflow-x-auto px-2">
                {PT_DETAIL_TABS.map((t) => {
                  const active = tab === t.id;
                  const count = t.id === "items" ? PT_MOCK_ITEMS.length : t.id === "vendors_applied" ? term.vendorsApplied : 0;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-[12px] border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        active ? "border-[#0A77FF] text-[#0A77FF] bg-white" : "border-transparent text-[#94A3B8] hover:text-[#64748B]"
                      }`}
                      style={{ fontWeight: active ? 600 : 500 }}
                    >
                      <t.icon className="w-3.5 h-3.5" />
                      {t.label}
                      {count > 0 && (
                        <span className={`text-[9px] rounded-full px-1.5 py-px min-w-[16px] text-center ${active ? "bg-[#0A77FF]/10 text-[#0A77FF]" : "bg-[#F1F5F9] text-[#94A3B8]"}`} style={{ fontWeight: 700 }}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Items tab */}
            {tab === "items" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search + Filters + density */}
                <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2 shrink-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-[220px]">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
                      <input type="text" placeholder="Search items..." className="w-full pl-8 h-8 text-[12px] bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0A77FF] transition-colors" />
                    </div>
                    <button className="h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#475569] hover:bg-[#F8FAFC] cursor-pointer transition-colors inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                    </button>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[12px] tabular-nums" style={{ fontWeight: 500 }}>
                      <span className="text-[#0A77FF]">{PT_MOCK_ITEMS.length}</span>
                    </span>
                    <div className="w-px h-5 bg-[#E2E8F0]" />
                    <button className="h-8 w-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5 text-[#94A3B8]" />
                    </button>
                  </div>
                </div>

                {/* Filter pills */}
                <div className="px-4 pb-2">
                  <FilterPills options={ITEM_FILTER_OPTIONS} activeKey={itemFilter} onSelect={setItemFilter} />
                </div>

                <div className="h-px bg-[#E8ECF1] shrink-0" />

                <div className="flex-1 overflow-auto">
                  <table className="w-full text-[12px]">
                    <thead className="sticky top-0 bg-[#F8FAFC] z-10">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-[#64748B]">Part No. <ChevronDown className="w-3 h-3" /></div>
                        </th>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>Item Description</th>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-[#64748B]">Category <ChevronDown className="w-3 h-3" /></div>
                        </th>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>Item Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_ITEMS.map((item) => (
                        <tr key={item.id} className="hover:bg-[#F8FBFF] transition-colors border-b border-[#F1F5F9]">
                          <td className="px-4 py-2.5 text-[12px] text-[#0F172A]" style={{ fontWeight: 500 }}>{item.partNo}</td>
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                                <Package className="w-3 h-3 text-[#94A3B8]" />
                              </div>
                              <span className="text-[12px] text-[#0F172A] truncate max-w-[240px]" style={{ fontWeight: 400 }}>{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-[12px] text-[#0F172A]" style={{ fontWeight: 400 }}>{item.category}</td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex px-2 py-0.5 rounded-md border text-[11px]" style={{ fontWeight: 500, color: item.typeColor, backgroundColor: item.typeColor + "10", borderColor: item.typeColor + "30" }}>
                              {item.itemType}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-2 border-t border-[#E8ECF1] shrink-0 bg-[#FAFBFC]">
                  <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-[#E2E8F0] text-[11px] cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                    <span>«</span>
                    <span>← Prev</span>
                    <span className="px-2 py-0.5 rounded bg-[#0A77FF] text-white" style={{ fontWeight: 600 }}>1</span>
                    <span>Next →</span>
                    <span>»</span>
                  </div>
                </div>
              </div>
            )}

            {/* Vendors Applied tab */}
            {tab === "vendors_applied" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2 shrink-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-[220px]">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
                      <input type="text" placeholder="Search partner, location..." className="w-full pl-8 h-8 text-[12px] bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0A77FF] transition-colors" />
                    </div>
                    <button className="h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#475569] hover:bg-[#F8FAFC] cursor-pointer transition-colors inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                    </button>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[12px] tabular-nums" style={{ fontWeight: 500 }}>
                      <span className="text-[#0A77FF]">{PT_MOCK_VENDORS.length}</span>
                    </span>
                    <div className="w-px h-5 bg-[#E2E8F0]" />
                    <button className="h-8 w-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5 text-[#94A3B8]" />
                    </button>
                  </div>
                </div>

                {/* Filter pills */}
                <div className="px-4 pb-2">
                  <FilterPills options={VENDOR_FILTER_OPTIONS} activeKey={vendorFilter} onSelect={setVendorFilter} />
                </div>

                <div className="h-px bg-[#E8ECF1] shrink-0" />

                <div className="flex-1 overflow-auto">
                  <table className="w-full text-[12px]">
                    <thead className="sticky top-0 bg-[#F8FAFC] z-10">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-[#64748B]">Partner Name <ChevronDown className="w-3 h-3" /></div>
                        </th>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-[#64748B]">Partner Type <ChevronDown className="w-3 h-3" /></div>
                        </th>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-[#64748B]">No. of Items <ChevronDown className="w-3 h-3" /></div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_VENDORS.map((v) => {
                        const vTint = getAvatarTint(v.name);
                        const vInit = v.name.split(" ").map(w => w[0]).slice(0, 2).join("");
                        return (
                          <tr key={v.id} className="hover:bg-[#F8FBFF] transition-colors border-b border-[#F1F5F9]">
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] shrink-0" style={{ fontWeight: 600, backgroundColor: vTint.bg, color: vTint.fg }}>
                                  {vInit}
                                </div>
                                <span className="text-[12px] text-[#0F172A]" style={{ fontWeight: 500 }}>{v.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-1 flex-wrap">
                                {v.types.map((type, i) => (
                                  <span key={i} className={`inline-flex px-2 py-0.5 rounded-md border text-[10px] ${
                                    type.includes("Customer")
                                      ? "border-[#0A77FF]/25 bg-[#EBF3FF] text-[#0A77FF]"
                                      : "border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]"
                                  }`} style={{ fontWeight: 500 }}>
                                    {type}
                                  </span>
                                ))}
                                {v.moreTypes > 0 && (
                                  <span className="text-[10px] text-[#94A3B8]" style={{ fontWeight: 500 }}>+{v.moreTypes}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[12px] text-[#0F172A] tabular-nums" style={{ fontWeight: 500 }}>{v.partNo}</span>
                                <span className="text-[11px] text-[#0A77FF] cursor-pointer hover:underline" style={{ fontWeight: 500 }}>+{v.moreItems} more</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-2 border-t border-[#E8ECF1] shrink-0 bg-[#FAFBFC]">
                  <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-[#E2E8F0] text-[11px] cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                    <span>«</span>
                    <span>← Prev</span>
                    <span className="px-2 py-0.5 rounded bg-[#0A77FF] text-white" style={{ fontWeight: 600 }}>1</span>
                    <span>2</span>
                    <span>…</span>
                    <span>5</span>
                    <span>6</span>
                    <span>Next →</span>
                    <span>»</span>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder tabs */}
            {tab !== "items" && tab !== "vendors_applied" && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: badgeColor + "12", border: `1px solid ${badgeColor}30` }}>
                    {(() => { const T = PT_DETAIL_TABS.find((x) => x.id === tab); return T ? <T.icon className="w-5 h-5" style={{ color: badgeColor }} /> : null; })()}
                  </div>
                  <p className="text-[13px] text-[#334155]" style={{ fontWeight: 500 }}>{PT_DETAIL_TABS.find((x) => x.id === tab)?.label || tab}</p>
                  <p className="text-[11px] text-[#CBD5E1] mt-1" style={{ fontWeight: 400 }}>Coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { PaymentTermDetailModal };
