import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  ArrowLeft,
  X,
  Pencil,
  Archive,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Package,
  Building2,
  FileText,
  Paperclip,
  Clock,
  BarChart3,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Copy,
  Receipt,
  Zap,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { getAvatarTint } from "../../utils/avatarTints";
import {
  type PaymentTermPreset,
  CREATE_PT_TYPES,
} from "./partnerConstants";

/* ─── Tab config matching the screenshot ─── */
const PT_DETAIL_TABS = [
  { id: "items", label: "Items", icon: Package },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "files", label: "Files", icon: Paperclip },
  { id: "audit", label: "Audit", icon: Clock },
  { id: "activity", label: "Activity", icon: BarChart3 },
];

/* ─── Mock items matching the screenshot ─── */
const PT_MOCK_ITEMS = [
  { id: "1", name: "Steel Bolts M10×40", partNo: "SB-M10-40", category: "Fasteners", price: "$12.50", status: "Active" },
  { id: "2", name: "Hex Nuts M10", partNo: "HN-M10", category: "Fasteners", price: "$4.20", status: "Active" },
  { id: "3", name: "Flat Washers M10", partNo: "FW-M10", category: "Fasteners", price: "$2.80", status: "Active" },
  { id: "4", name: "Spring Lock Washers M10", partNo: "SLW-M10", category: "Fasteners", price: "$3.40", status: "Inactive" },
  { id: "5", name: "Threaded Rods M12×1m", partNo: "TR-M12-1M", category: "Rods", price: "$18.90", status: "Active" },
  { id: "6", name: "Carriage Bolts 3/8×3", partNo: "CB-38-3", category: "Fasteners", price: "$8.60", status: "Active" },
];

/* ─── Mock vendors for sidebar ─── */
const PT_MOCK_VENDORS_SIDEBAR = [
  { id: "V-1", name: "Acme Industrial Supply Co.", status: "Active" },
  { id: "V-2", name: "Global Fasteners Inc.", status: "Active" },
  { id: "V-3", name: "Berlin Technik GmbH", status: "Active" },
  { id: "V-4", name: "Pacific Hardware Ltd.", status: "Active" },
  { id: "V-5", name: "Midwest Bolt & Nut Co.", status: "Active" },
  { id: "V-6", name: "Atlas Steel Products", status: "Inactive" },
  { id: "V-7", name: "Nordic Fastening Systems", status: "Active" },
];

/* ─── Mock vendors for tab table ─── */
const PT_MOCK_VENDORS_TABLE = [
  { id: "V-1", name: "Acme Industrial Supply Co.", types: ["Vendor • Sub-Contractor", "Customer"], partNo: "SB-M10-40", moreItems: 12 },
  { id: "V-2", name: "Global Fasteners Inc.", types: ["Vendor • Service Provider"], partNo: "HN-M10", moreItems: 34 },
  { id: "V-3", name: "Berlin Technik GmbH", types: ["Vendor • Seller"], partNo: "FW-M10", moreItems: 15 },
  { id: "V-4", name: "Pacific Hardware Ltd.", types: ["Vendor • Sub-Contractor"], partNo: "SLW-M10", moreItems: 23 },
  { id: "V-5", name: "Midwest Bolt & Nut Co.", types: ["Vendor • Service Provider", "Customer"], partNo: "TR-M12-1M", moreItems: 8 },
  { id: "V-6", name: "Atlas Steel Products", types: ["Vendor • Seller"], partNo: "CB-38-3", moreItems: 5 },
  { id: "V-7", name: "Nordic Fastening Systems", types: ["Vendor • Sub-Contractor"], partNo: "SB-M10-40", moreItems: 18 },
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
    : `${modalBaseClass} !max-w-[100%] sm:!max-w-[1400px] !max-h-[100dvh] sm:!max-h-[92vh] rounded-none sm:!rounded-2xl`;

  const itemCount = PT_MOCK_ITEMS.length;
  const vendorCount = PT_MOCK_VENDORS_SIDEBAR.length;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setIsFullscreen(false); setTab("items"); } }}>
      <DialogContent
        className={`flex flex-col p-0 gap-0 border-0 sm:border z-[200] ${modalSizeClass}`}
        hideCloseButton
        style={{ boxShadow: "0 24px 48px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)" }}
      >
        <DialogTitle className="sr-only">Payment Term Details — {term.name}</DialogTitle>
        <DialogDescription className="sr-only">Detailed view of payment term {term.name}</DialogDescription>

        {/* ─── Header ─── */}
        <div className="shrink-0 bg-background rounded-t-none sm:rounded-t-2xl border-b border-border">
          <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={onClose} className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors cursor-pointer shrink-0">
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-[15px] font-semibold text-foreground truncate">{term.name}</h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold text-white shrink-0" style={{ backgroundColor: badgeColor }}>
                    {term.typeBadge}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md border border-border bg-muted text-[11px] font-medium text-muted-foreground shrink-0">
                    {term.trigger}
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground mt-0.5 truncate">{term.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => toast.info("Edit coming soon")} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => toast.info("Archive coming soon")} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer">
                <Archive className="w-3.5 h-3.5" /> Archive
              </button>
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer">
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                {isFullscreen ? "Exit full" : "Full view"}
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* ─── LEFT SIDEBAR ─── */}
          <div className="w-[340px] border-r border-border flex flex-col bg-background shrink-0 overflow-y-auto">
            {/* Hero metric */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-[36px] font-bold text-foreground leading-none tabular-nums">{ptDuration}</span>
                  <span className="text-[14px] text-muted-foreground font-medium">days</span>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-[13px]">
                <span className="font-semibold text-foreground">{itemCount} <span className="font-normal text-muted-foreground">Items</span></span>
                <span className="font-semibold text-foreground">{vendorCount} <span className="font-normal text-muted-foreground">Vendors</span></span>
              </div>
              {/* Action icons */}
              <div className="flex items-center gap-1.5 mt-3">
                <button className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
                  <Receipt className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
                  <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-muted transition-colors cursor-pointer">
                  <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* About section */}
            <div className="border-t border-border">
              <button onClick={() => setAboutOpen(!aboutOpen)} className="w-full flex items-center justify-between px-5 py-3 text-[13px] font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors">
                About
                {aboutOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              {aboutOpen && (
                <div className="px-5 pb-4 space-y-3">
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{term.description}</p>
                  
                  {/* Trigger event row */}
                  <div className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-medium">Trigger Event</span>
                    </div>
                    <span className="text-[12px] font-semibold text-foreground">{term.trigger}</span>
                  </div>

                  {/* Type / Duration 2-col cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-border bg-muted/20 p-3">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Type</span>
                      <p className="text-[12px] font-medium text-foreground mt-1 leading-snug">{ptTypeLabel}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/20 p-3">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Duration</span>
                      <p className="text-[12px] font-medium text-foreground mt-1">{ptDuration} days</p>
                    </div>
                  </div>

                  {/* Created by / Created at 2-col cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg border border-border bg-muted/20 p-3">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created by</span>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {(() => { const t = getAvatarTint("John Doe"); return (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0" style={{ backgroundColor: t.bg, color: t.fg }}>JD</div>
                        ); })()}
                        <span className="text-[12px] font-medium text-foreground">John Doe</span>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/20 p-3">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Created at</span>
                      <p className="text-[12px] font-medium text-foreground mt-1.5">Dec 15, 2025</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vendors list in sidebar */}
            <div className="border-t border-border">
              <button onClick={() => setVendorsOpen(!vendorsOpen)} className="w-full flex items-center justify-between px-5 py-3 text-[13px] font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors">
                Vendors ({vendorCount})
                {vendorsOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              {vendorsOpen && (
                <div className="px-5 pb-4 space-y-2">
                  {PT_MOCK_VENDORS_SIDEBAR.map((v) => {
                    const t = getAvatarTint(v.name);
                    const initials = v.name.split(" ").map(w => w[0]).slice(0, 2).join("");
                    return (
                      <div key={v.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-background hover:bg-muted/30 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: t.bg, color: t.fg }}>
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12px] font-medium text-foreground truncate">{v.name}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${v.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-muted text-muted-foreground border border-border"}`}>
                              {v.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-muted-foreground">{v.id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ─── RIGHT PANEL ─── */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Tabs */}
            <div className="flex items-center border-b border-border shrink-0 px-1">
              {PT_DETAIL_TABS.map((t) => {
                const active = tab === t.id;
                const count = t.id === "items" ? itemCount : t.id === "vendors" ? vendorCount : 0;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[12px] border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                    style={{ fontWeight: active ? 600 : 500 }}
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    {t.label}
                    {count > 0 && (
                      <span className={`text-[9px] rounded-full px-1.5 py-px min-w-[16px] text-center font-bold ${active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Items Tab ── */}
            {tab === "items" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search bar */}
                <div className="flex items-center justify-between gap-3 px-4 py-3 shrink-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-[260px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <input type="text" placeholder="Search items..." className="w-full pl-9 pr-3 h-9 text-[12px] bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors" />
                    </div>
                    <button className="h-9 px-3 rounded-lg border border-border bg-background text-[12px] font-medium text-foreground hover:bg-muted cursor-pointer transition-colors inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                    </button>
                  </div>
                  <button className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 cursor-pointer transition-colors inline-flex items-center gap-1.5">
                    + Add Item
                  </button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-[12px]">
                    <thead className="sticky top-0 bg-muted/50 z-10">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[11px] font-semibold border-b border-border">Item</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[11px] font-semibold border-b border-border">Part No.</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[11px] font-semibold border-b border-border">Category</th>
                        <th className="text-right px-4 py-2.5 text-muted-foreground text-[11px] font-semibold border-b border-border">Price</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[11px] font-semibold border-b border-border">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_ITEMS.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors border-b border-border/50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                                <Package className="w-3.5 h-3.5 text-muted-foreground" />
                              </div>
                              <span className="text-[13px] font-medium text-foreground">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex px-2 py-0.5 rounded border border-border bg-muted/50 text-[11px] font-mono text-muted-foreground">{item.partNo}</span>
                          </td>
                          <td className="px-4 py-3 text-[12px] text-muted-foreground">{item.category}</td>
                          <td className="px-4 py-3 text-right text-[13px] font-medium text-foreground tabular-nums">{item.price}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.status === "Active"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-orange-50 text-orange-600 border border-orange-200"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border shrink-0 bg-muted/30">
                  <span className="text-[11px] text-muted-foreground">Showing {itemCount} of {itemCount} items</span>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-border bg-background text-[11px] cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── Vendors Tab ── */}
            {tab === "vendors" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3 shrink-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-[260px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <input type="text" placeholder="Search vendors..." className="w-full pl-9 pr-3 h-9 text-[12px] bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors" />
                    </div>
                    <button className="h-9 px-3 rounded-lg border border-border bg-background text-[12px] font-medium text-foreground hover:bg-muted cursor-pointer transition-colors inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-[12px]">
                    <thead className="sticky top-0 bg-muted/50 z-10">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[11px] font-semibold border-b border-border">Partner Name</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[11px] font-semibold border-b border-border">Partner Type</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[11px] font-semibold border-b border-border">No. of Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_VENDORS_TABLE.map((v) => {
                        const vTint = getAvatarTint(v.name);
                        const vInit = v.name.split(" ").map(w => w[0]).slice(0, 2).join("");
                        return (
                          <tr key={v.id} className="hover:bg-muted/30 transition-colors border-b border-border/50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ backgroundColor: vTint.bg, color: vTint.fg }}>
                                  {vInit}
                                </div>
                                <span className="text-[12px] font-medium text-foreground">{v.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 flex-wrap">
                                {v.types.map((type, i) => (
                                  <span key={i} className={`inline-flex px-2 py-0.5 rounded-md border text-[10px] font-medium ${
                                    type.includes("Customer") ? "border-primary/25 bg-primary/5 text-primary" : "border-border bg-muted text-muted-foreground"
                                  }`}>
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[12px] font-medium text-foreground tabular-nums">{v.partNo}</span>
                                <span className="text-[11px] text-primary cursor-pointer hover:underline font-medium">+{v.moreItems} more</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border shrink-0 bg-muted/30">
                  <span className="text-[11px] text-muted-foreground">Showing {vendorCount} of {vendorCount} vendors</span>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-border bg-background text-[11px] cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder tabs */}
            {tab !== "items" && tab !== "vendors" && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center mx-auto mb-3">
                    {(() => { const T = PT_DETAIL_TABS.find((x) => x.id === tab); return T ? <T.icon className="w-5 h-5 text-muted-foreground" /> : null; })()}
                  </div>
                  <p className="text-[13px] font-medium text-foreground">{PT_DETAIL_TABS.find((x) => x.id === tab)?.label || tab}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="shrink-0 border-t border-border bg-muted/30 rounded-b-none sm:rounded-b-2xl">
          <div className="px-5 py-3 flex items-center justify-between">
            <span className="text-[12px] text-muted-foreground font-medium">Reviewing: {term.name}</span>
            <div className="flex items-center gap-2">
              <button className="h-9 px-4 rounded-lg border border-border bg-background text-[12px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer inline-flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Use Template
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { PaymentTermDetailModal };
