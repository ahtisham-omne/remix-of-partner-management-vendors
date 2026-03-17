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
} from "lucide-react";
import { toast } from "sonner";
import { getAvatarTint } from "../../utils/avatarTints";
import {
  type PaymentTermPreset,
  CREATE_PT_TYPES,
} from "./partnerConstants";

const PT_DETAIL_TABS = [
  { id: "items", label: "Items", icon: Package },
  { id: "vendors_applied", label: "Vendors", icon: Building2 },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "attachments", label: "Files", icon: Paperclip },
  { id: "audit_log", label: "Audit", icon: Clock },
  { id: "recent_activity", label: "Activity", icon: ChartColumn },
];

const PT_MOCK_ITEMS = [
  { id: "ITM-001", name: "Steel Bolts M10x40", partNo: "SB-M10-40", category: "Fasteners", price: "$12.50", status: "Active" as const },
  { id: "ITM-002", name: "Hex Nuts M10", partNo: "HN-M10", category: "Fasteners", price: "$4.20", status: "Active" as const },
  { id: "ITM-003", name: "Flat Washers M10", partNo: "FW-M10", category: "Fasteners", price: "$2.80", status: "Active" as const },
  { id: "ITM-004", name: "Spring Lock Washers M10", partNo: "SLW-M10", category: "Fasteners", price: "$3.40", status: "Inactive" as const },
  { id: "ITM-005", name: "Threaded Rods M12x1m", partNo: "TR-M12-1M", category: "Rods", price: "$18.90", status: "Active" as const },
  { id: "ITM-006", name: "Carriage Bolts 3/8x3", partNo: "CB-38-3", category: "Fasteners", price: "$8.60", status: "Active" as const },
];

const PT_MOCK_VENDORS = [
  { id: "V-1", name: "Acme Industrial Supply Co.", status: "Active" as const, itemCount: 12 },
  { id: "V-2", name: "Global Fasteners Inc.", status: "Active" as const, itemCount: 8 },
  { id: "V-3", name: "Berlin Technik GmbH", status: "Active" as const, itemCount: 15 },
  { id: "V-4", name: "Tokyo Materials Corp.", status: "Inactive" as const, itemCount: 3 },
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
  const [vendorsOpen, setVendorsOpen] = useState(true);

  if (!term) return null;

  const ptDuration = term.duration || (term.name.match(/\d+/) ? term.name.match(/\d+/)![0] : "30");
  const ptTypeLabel = CREATE_PT_TYPES.find((t) => t.id === term.category)?.label || term.typeBadge;
  const badgeColor = term.badgeColor;

  const modalBaseClass = "!fixed !inset-0 !translate-x-0 !translate-y-0 !m-auto !w-full !h-full transition-[max-width,max-height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]";
  const modalSizeClass = isFullscreen
    ? `${modalBaseClass} !max-w-[calc(100%-1rem)] sm:!max-w-[calc(100%-1.5rem)] lg:!max-w-[calc(100%-2rem)] !max-h-[calc(100%-1rem)] sm:!max-h-[calc(100%-1.5rem)] lg:!max-h-[calc(100%-2rem)] !rounded-2xl`
    : `${modalBaseClass} !max-w-[100%] sm:!max-w-[1200px] !max-h-[100dvh] sm:!max-h-[88vh] rounded-none sm:!rounded-2xl`;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setIsFullscreen(false); setTab("items"); setAboutOpen(true); setVendorsOpen(true); } }}>
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
              <button onClick={onClose} className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shrink-0 cursor-pointer">
                <ArrowLeft className="w-4 h-4 text-[#64748B]" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[15px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}>{term.name}</h3>
                  <span className="hidden sm:inline-flex items-stretch rounded-full overflow-hidden border shrink-0" style={{ borderColor: badgeColor + "40" }}>
                    <span className="inline-flex items-center gap-1 px-2 py-[2px] text-[10px]" style={{ fontWeight: 600, color: badgeColor, backgroundColor: badgeColor + "15" }}>
                      <Receipt className="w-3 h-3" />
                      {term.typeBadge}
                    </span>
                    <span className="inline-flex items-center px-2 py-[2px] text-[10px] bg-white text-[#64748B] border-l" style={{ fontWeight: 500, borderColor: badgeColor + "40" }}>
                      {term.trigger}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-[#64748B] truncate max-w-[340px]" style={{ fontWeight: 400 }}>{term.description}</span>
                </div>
              </div>
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
          <div className="w-[300px] border-r border-[#E8ECF1] flex flex-col bg-[#FAFBFC] shrink-0 overflow-y-auto">
            {/* Hero value + status */}
            <div className="px-4 pt-4 pb-3 border-b border-[#E8ECF1]">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] tabular-nums leading-none tracking-tight" style={{ fontWeight: 600, color: badgeColor }}>
                    {ptDuration}
                  </span>
                  <span className="text-[12px] text-[#94A3B8]" style={{ fontWeight: 500 }}>
                    days
                  </span>
                </div>
                <span className="px-2 py-[3px] rounded-full text-[10px] border shrink-0" style={{ fontWeight: 500, color: "#059669", backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }}>
                  Active
                </span>
              </div>
              <div className="flex items-center gap-3 mt-3">
                {[
                  { label: "Items", value: String(PT_MOCK_ITEMS.length) },
                  { label: "Vendors", value: String(term.vendorsApplied) },
                ].map((s, i) => (
                  <div key={s.label} className="flex items-center gap-3">
                    {i > 0 && <div className="w-px h-4 bg-[#E8ECF1]" />}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] text-[#0F172A] tabular-nums" style={{ fontWeight: 600 }}>{s.value}</span>
                      <span className="text-[11px] text-[#94A3B8]" style={{ fontWeight: 500 }}>{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#E8ECF1]">
              {[
                { icon: Package, label: "Add item" },
                { icon: Building2, label: "Add vendor" },
                { icon: MoreHorizontal, label: "More actions" },
              ].map((a) => (
                <Tooltip key={a.label}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => toast.info(`${a.label} coming soon`)}
                      className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:scale-[0.97]"
                    >
                      <a.icon className="w-3.5 h-3.5 text-[#64748B]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6} className="z-[300] !bg-white !text-[#334155] !border !border-[#E2E8F0] !shadow-sm rounded-lg text-[11px] px-2.5 py-1.5" style={{ fontWeight: 500 }}>
                    {a.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* About section (collapsible) */}
            <div className="border-b border-[#E8ECF1]">
              <button onClick={() => setAboutOpen(!aboutOpen)} className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] text-[#0F172A] cursor-pointer hover:bg-white/60 transition-colors" style={{ fontWeight: 600 }}>
                About
                <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${aboutOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 pb-3 space-y-3">
                  <p className="text-[11px] text-[#475569] leading-relaxed" style={{ fontWeight: 400 }}>{term.description}</p>

                  <div className="flex items-center justify-between rounded-lg border px-3 py-2 bg-white border-[#E8ECF1]">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span className="text-[11px] text-[#334155]" style={{ fontWeight: 500 }}>Trigger Event</span>
                    </div>
                    <span className="text-[11px] text-[#0F172A]" style={{ fontWeight: 600 }}>{term.trigger}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-[#E8ECF1] bg-white px-3 py-2">
                      <p className="text-[9px] text-[#94A3B8] uppercase tracking-wide" style={{ fontWeight: 500 }}>Type</p>
                      <p className="text-[12px] text-[#0F172A] mt-0.5" style={{ fontWeight: 500 }}>{ptTypeLabel}</p>
                    </div>
                    <div className="rounded-lg border border-[#E8ECF1] bg-white px-3 py-2">
                      <p className="text-[9px] text-[#94A3B8] uppercase tracking-wide" style={{ fontWeight: 500 }}>Duration</p>
                      <p className="text-[12px] text-[#0F172A] mt-0.5" style={{ fontWeight: 500 }}>{ptDuration} days</p>
                    </div>
                  </div>

                  {(term.applyDiscount || term.discountPercent) && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-[#E8ECF1] bg-white px-3 py-2">
                        <p className="text-[9px] text-[#94A3B8] uppercase tracking-wide" style={{ fontWeight: 500 }}>Discount %</p>
                        <p className="text-[12px] text-[#0F172A] mt-0.5" style={{ fontWeight: 500 }}>{term.discountPercent || "2"}%</p>
                      </div>
                      <div className="rounded-lg border border-[#E8ECF1] bg-white px-3 py-2">
                        <p className="text-[9px] text-[#94A3B8] uppercase tracking-wide" style={{ fontWeight: 500 }}>Discount Period</p>
                        <p className="text-[12px] text-[#0F172A] mt-0.5" style={{ fontWeight: 500 }}>{term.discountPeriod || "10"} days</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-[#E8ECF1] bg-white px-3 py-2">
                      <p className="text-[9px] text-[#94A3B8] uppercase tracking-wide" style={{ fontWeight: 500 }}>Created by</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {(() => { const cTint = getAvatarTint("John Doe"); return (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] shrink-0" style={{ backgroundColor: cTint.bg, color: cTint.fg, fontWeight: 700 }}>JD</div>
                        ); })()}
                        <span className="text-[11px] text-[#0F172A] truncate" style={{ fontWeight: 500 }}>John Doe</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-[#E8ECF1] bg-white px-3 py-2">
                      <p className="text-[9px] text-[#94A3B8] uppercase tracking-wide" style={{ fontWeight: 500 }}>Created at</p>
                      <p className="text-[11px] text-[#0F172A] mt-1" style={{ fontWeight: 500 }}>Dec 15, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendors section (collapsible) */}
            <div className="flex-1">
              <button onClick={() => setVendorsOpen(!vendorsOpen)} className="w-full flex items-center justify-between px-4 py-2.5 text-[12px] text-[#0F172A] cursor-pointer hover:bg-white/60 transition-colors" style={{ fontWeight: 600 }}>
                <span>Vendors ({term.vendorsApplied})</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-200 ${vendorsOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${vendorsOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-4 pb-4 space-y-2">
                  {PT_MOCK_VENDORS.map((v) => {
                    const vTint = getAvatarTint(v.name);
                    const vInitials = v.name.split(" ").map(w => w[0]).slice(0, 2).join("");
                    return (
                      <div key={v.id} className="rounded-xl border p-3 transition-all bg-white border-[#E8ECF1] hover:border-[#CBD5E1] hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md flex items-center justify-center text-[10px]" style={{ fontWeight: 700, backgroundColor: vTint.bg, color: vTint.fg }}>
                              {vInitials}
                            </div>
                            <div>
                              <span className="text-[12px] text-[#0F172A] block" style={{ fontWeight: 500 }}>{v.name}</span>
                              <span className="text-[10px] text-[#94A3B8]">{v.id}</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                            v.status === "Active" ? "bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]" : "bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]"
                          }`} style={{ fontWeight: 500 }}>{v.status}</span>
                        </div>
                      </div>
                    );
                  })}
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
                  <button onClick={() => toast.info("Add item coming soon")} className="h-8 px-3 rounded-lg bg-[#0A77FF] hover:bg-[#0862D0] text-white text-[12px] shadow-sm cursor-pointer transition-colors inline-flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                    <Plus className="w-3.5 h-3.5" /> Add item
                  </button>
                </div>

                <div className="h-px bg-[#E8ECF1] mx-4 shrink-0" />

                <div className="flex-1 overflow-auto">
                  <table className="w-full text-[12px]">
                    <thead className="sticky top-0 bg-[#F8FAFC] z-10">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>Item</th>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>Part No.</th>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>Category</th>
                        <th className="text-right px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>Price</th>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_ITEMS.map((item) => (
                        <tr key={item.id} className="hover:bg-[#F8FBFF] transition-colors">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                                <Package className="w-3.5 h-3.5 text-[#94A3B8]" />
                              </div>
                              <span className="text-[13px] text-[#0F172A]" style={{ fontWeight: 500 }}>{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <code className="text-[11px] text-[#64748B] bg-[#F1F5F9] px-1.5 py-0.5 rounded">{item.partNo}</code>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B] text-[11px]" style={{ fontWeight: 500 }}>{item.category}</span>
                          </td>
                          <td className="px-4 py-2.5 text-right text-[#0F172A] tabular-nums" style={{ fontWeight: 500 }}>{item.price}</td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] border" style={{ fontWeight: 500, color: item.status === "Active" ? "#059669" : "#DC2626", backgroundColor: item.status === "Active" ? "#ECFDF5" : "#FEF2F2", borderColor: item.status === "Active" ? "#A7F3D0" : "#FECACA" }}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-2 border-t border-[#E8ECF1] shrink-0 bg-[#FAFBFC]">
                  <span className="text-[11px] text-[#94A3B8]">Showing {PT_MOCK_ITEMS.length} of {PT_MOCK_ITEMS.length} items</span>
                  <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-[#E2E8F0] text-[11px] cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Vendors tab */}
            {tab === "vendors_applied" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2 shrink-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-[220px]">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
                      <input type="text" placeholder="Search vendors..." className="w-full pl-8 h-8 text-[12px] bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0A77FF] transition-colors" />
                    </div>
                  </div>
                  <button onClick={() => toast.info("Add vendor coming soon")} className="h-8 px-3 rounded-lg bg-[#0A77FF] hover:bg-[#0862D0] text-white text-[12px] shadow-sm cursor-pointer transition-colors inline-flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                    <Plus className="w-3.5 h-3.5" /> Add vendor
                  </button>
                </div>

                <div className="h-px bg-[#E8ECF1] mx-4 shrink-0" />

                <div className="flex-1 overflow-auto">
                  <table className="w-full text-[12px]">
                    <thead className="sticky top-0 bg-[#F8FAFC] z-10">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>Vendor Name</th>
                        <th className="text-left px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>Status</th>
                        <th className="text-right px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>No. of Items</th>
                        <th className="text-right px-4 py-2.5 text-[#94A3B8] text-[11px] border-b border-[#E8ECF1]" style={{ fontWeight: 600 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_VENDORS.map((v) => {
                        const vTint = getAvatarTint(v.name);
                        const vInit = v.name.split(" ").map(w => w[0]).slice(0, 2).join("");
                        return (
                          <tr key={v.id} className="hover:bg-[#F8FBFF] transition-colors">
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] shrink-0" style={{ fontWeight: 600, backgroundColor: vTint.bg, color: vTint.fg }}>
                                  {vInit}
                                </div>
                                <span className="text-[13px] text-[#0F172A]" style={{ fontWeight: 500 }}>{v.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] border" style={{ fontWeight: 500, color: v.status === "Active" ? "#059669" : "#DC2626", backgroundColor: v.status === "Active" ? "#ECFDF5" : "#FEF2F2", borderColor: v.status === "Active" ? "#A7F3D0" : "#FECACA" }}>
                                {v.status}
                              </span>
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <span className="text-[14px] text-[#0F172A] tabular-nums" style={{ fontWeight: 600 }}>{v.itemCount}</span>
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <button className="w-6 h-6 rounded flex items-center justify-center text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
