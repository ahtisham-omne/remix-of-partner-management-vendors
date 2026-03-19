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
  Check,
  CalendarDays,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { getAvatarTint } from "../../utils/avatarTints";
import {
  type PaymentTermPreset,
  CREATE_PT_TYPES,
} from "./partnerConstants";

/* ─── Tab config ─── */
const PT_DETAIL_TABS = [
  { id: "items", label: "Applicable Items", icon: Package },
  { id: "vendors", label: "Partners Using", icon: Building2 },
  { id: "notes", label: "Notes & Attachments", icon: FileText },
  { id: "activity", label: "Activity Log", icon: Clock },
];

/* ─── Mock items ─── */
const PT_MOCK_ITEMS = [
  { id: "1", name: "Steel Bolts M10×40", partNo: "SB-M10-40", category: "Fasteners", price: "$12.50", status: "Active" },
  { id: "2", name: "Hex Nuts M10", partNo: "HN-M10", category: "Fasteners", price: "$4.20", status: "Active" },
  { id: "3", name: "Flat Washers M10", partNo: "FW-M10", category: "Fasteners", price: "$2.80", status: "Active" },
  { id: "4", name: "Spring Lock Washers M10", partNo: "SLW-M10", category: "Fasteners", price: "$3.40", status: "Inactive" },
  { id: "5", name: "Threaded Rods M12×1m", partNo: "TR-M12-1M", category: "Rods", price: "$18.90", status: "Active" },
  { id: "6", name: "Carriage Bolts 3/8×3", partNo: "CB-38-3", category: "Fasteners", price: "$8.60", status: "Active" },
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

  if (!term) return null;

  const ptDuration = term.duration || (term.name.match(/\d+/) ? term.name.match(/\d+/)![0] : "30");
  const ptTypeLabel = CREATE_PT_TYPES.find((t) => t.id === term.category)?.label || term.typeBadge;
  const badgeColor = term.badgeColor;

  const modalBaseClass = "!fixed !inset-0 !translate-x-0 !translate-y-0 !m-auto !w-full !h-full transition-[max-width,max-height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]";
  const modalSizeClass = isFullscreen
    ? `${modalBaseClass} !max-w-[calc(100%-1rem)] sm:!max-w-[calc(100%-1.5rem)] lg:!max-w-[calc(100%-2rem)] !max-h-[calc(100%-1rem)] sm:!max-h-[calc(100%-1.5rem)] lg:!max-h-[calc(100%-2rem)] !rounded-2xl`
    : `${modalBaseClass} !max-w-[100%] sm:!max-w-[1400px] !max-h-[100dvh] sm:!max-h-[92vh] rounded-none sm:!rounded-2xl`;

  const itemCount = PT_MOCK_ITEMS.length;
  const vendorCount = PT_MOCK_VENDORS_TABLE.length;

  const creatorTint = getAvatarTint("John Doe");

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
        <div className="shrink-0 bg-card rounded-t-none sm:rounded-t-2xl border-b border-border">
          <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={onClose} className="w-8 h-8 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-accent transition-colors cursor-pointer shrink-0">
                <ArrowLeft className="w-3.5 h-3.5 text-foreground" />
              </button>
              <span className="text-[14px] font-semibold text-foreground truncate">Payment Term Details</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => toast.info("Edit coming soon")} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer">
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button onClick={() => toast.info("Archive coming soon")} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer">
                <Archive className="w-3.5 h-3.5" /> Archive
              </button>
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer">
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => toast.info("More options")} className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* ─── LEFT SIDEBAR ─── */}
          <div className="w-[380px] border-r border-border flex flex-col shrink-0 overflow-y-auto bg-card">
            {/* Card-style summary — mirrors the payment term card design */}
            <div className="p-5">
              <div className="rounded-xl border border-border bg-card p-5" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.04)" }}>
                {/* Pills row — same as card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border"
                      style={{ backgroundColor: `${badgeColor}12`, color: badgeColor, borderColor: `${badgeColor}30` }}
                    >
                      <Package className="w-3 h-3" />
                      {term.typeBadge}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border border-border bg-secondary/60 text-secondary-foreground">
                      <CalendarDays className="w-3 h-3" />
                      {term.trigger}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold border border-border bg-secondary/60 text-muted-foreground uppercase tracking-wide">
                    <Lock className="w-3 h-3" />
                    Preset
                  </span>
                </div>

                {/* Title & description */}
                <h3 className="text-[16px] font-bold text-foreground leading-snug">{term.name}</h3>
                <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{term.description}</p>

                {/* Hero metric row */}
                <div className="flex items-end justify-between mt-5 pt-4 border-t border-border">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[32px] font-extrabold text-foreground leading-none tabular-nums">{ptDuration}</span>
                    <span className="text-[13px] text-muted-foreground font-medium">days</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="font-semibold text-foreground">{vendorCount}</span> vendors using
                  </div>
                </div>
              </div>
            </div>

            {/* About section */}
            <div className="border-t border-border">
              <button onClick={() => setAboutOpen(!aboutOpen)} className="w-full flex items-center justify-between px-5 py-3 text-[12px] font-semibold text-foreground cursor-pointer hover:bg-accent/50 transition-colors uppercase tracking-wider">
                Details
                {aboutOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              {aboutOpen && (
                <div className="px-5 pb-5">
                  <div className="space-y-0 rounded-lg border border-border overflow-hidden">
                    {/* Row items */}
                    {[
                      { label: "Type", value: ptTypeLabel },
                      { label: "Duration", value: `${ptDuration} days` },
                      { label: "Trigger", value: term.trigger },
                      { label: "Discount", value: term.description?.includes("discount") ? "2% / 10 days" : "None" },
                      { label: "Status", value: "Active", isStatus: true },
                    ].map((row, i) => (
                      <div key={row.label} className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-border" : ""} bg-card`}>
                        <span className="text-[11px] text-muted-foreground font-medium">{row.label}</span>
                        {row.isStatus ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-chart-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                            {row.value}
                          </span>
                        ) : (
                          <span className="text-[12px] font-semibold text-foreground">{row.value}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Created by — clean inline row */}
                  <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-card">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: creatorTint.bg, color: creatorTint.fg }}
                    >
                      JD
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[12px] font-semibold text-foreground">John Doe</span>
                      <p className="text-[10px] text-muted-foreground">Created Dec 15, 2025</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── RIGHT PANEL ─── */}
          <div className="flex-1 flex flex-col overflow-hidden bg-secondary/30">
            {/* Tabs */}
            <div className="flex items-center border-b border-border shrink-0 px-1 bg-card">
              {PT_DETAIL_TABS.map((t) => {
                const active = tab === t.id;
                const count = t.id === "items" ? itemCount : t.id === "vendors" ? vendorCount : 0;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-3 text-[12px] border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      active ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground font-medium"
                    }`}
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    {t.label}
                    {count > 0 && (
                      <span className={`text-[9px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-bold ${active ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Items Tab */}
            {tab === "items" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3 shrink-0 bg-card border-b border-border">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-[260px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <input type="text" placeholder="Search items..." className="w-full pl-9 pr-3 h-8 text-[12px] bg-secondary/50 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground/60" />
                    </div>
                    <button className="h-8 px-3 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-accent cursor-pointer transition-colors inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                    </button>
                  </div>
                  <button className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 cursor-pointer transition-colors inline-flex items-center gap-1.5">
                    + Add Item
                  </button>
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="w-full text-[12px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-secondary/70">
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[10px] font-semibold border-b border-border uppercase tracking-wider">Item</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[10px] font-semibold border-b border-border uppercase tracking-wider">Part No.</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[10px] font-semibold border-b border-border uppercase tracking-wider">Category</th>
                        <th className="text-right px-4 py-2.5 text-muted-foreground text-[10px] font-semibold border-b border-border uppercase tracking-wider">Price</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[10px] font-semibold border-b border-border uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_ITEMS.map((item) => (
                        <tr key={item.id} className="hover:bg-accent/30 transition-colors border-b border-border bg-card">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-md bg-secondary border border-border flex items-center justify-center shrink-0">
                                <Package className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <span className="text-[12px] font-medium text-foreground">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className="inline-flex px-2 py-0.5 rounded-md bg-secondary/80 text-[11px] font-mono text-muted-foreground">{item.partNo}</span>
                          </td>
                          <td className="px-4 py-2.5 text-[12px] text-muted-foreground">{item.category}</td>
                          <td className="px-4 py-2.5 text-right text-[12px] font-semibold text-foreground tabular-nums">{item.price}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.status === "Active" ? "bg-chart-2/10 text-chart-2" : "bg-chart-5/10 text-chart-5"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.status === "Active" ? "bg-chart-2" : "bg-chart-5"}`} />
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-2 border-t border-border shrink-0 bg-card">
                  <span className="text-[11px] text-muted-foreground">Showing {itemCount} of {itemCount} items</span>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Per page</span>
                    <select className="h-6 px-1.5 rounded border border-border bg-card text-[11px] text-foreground cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Vendors Tab */}
            {tab === "vendors" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3 shrink-0 bg-card border-b border-border">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-[260px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <input type="text" placeholder="Search partners..." className="w-full pl-9 pr-3 h-8 text-[12px] bg-secondary/50 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground/60" />
                    </div>
                    <button className="h-8 px-3 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-accent cursor-pointer transition-colors inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-[12px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-secondary/70">
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[10px] font-semibold border-b border-border uppercase tracking-wider">Partner</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[10px] font-semibold border-b border-border uppercase tracking-wider">Type</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground text-[10px] font-semibold border-b border-border uppercase tracking-wider">Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_VENDORS_TABLE.map((v) => {
                        const vTint = getAvatarTint(v.name);
                        const vInit = v.name.split(" ").map(w => w[0]).slice(0, 2).join("");
                        return (
                          <tr key={v.id} className="hover:bg-accent/30 transition-colors border-b border-border bg-card">
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" style={{ backgroundColor: vTint.bg, color: vTint.fg }}>
                                  {vInit}
                                </div>
                                <span className="text-[12px] font-medium text-foreground">{v.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-1 flex-wrap">
                                {v.types.map((type, i) => (
                                  <span key={i} className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                    type.includes("Customer") ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                                  }`}>
                                    {type}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-2.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-mono text-muted-foreground">{v.partNo}</span>
                                <span className="text-[11px] text-primary cursor-pointer hover:underline font-medium">+{v.moreItems}</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-4 py-2 border-t border-border shrink-0 bg-card">
                  <span className="text-[11px] text-muted-foreground">Showing {PT_MOCK_VENDORS_TABLE.length} of {vendorCount} partners</span>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Per page</span>
                    <select className="h-6 px-1.5 rounded border border-border bg-card text-[11px] text-foreground cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder tabs */}
            {tab !== "items" && tab !== "vendors" && (
              <div className="flex-1 flex items-center justify-center bg-card">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                    {(() => { const T = PT_DETAIL_TABS.find((x) => x.id === tab); return T ? <T.icon className="w-5 h-5 text-muted-foreground" /> : null; })()}
                  </div>
                  <p className="text-[13px] font-semibold text-foreground">{PT_DETAIL_TABS.find((x) => x.id === tab)?.label || tab}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="shrink-0 border-t border-border bg-card rounded-b-none sm:rounded-b-2xl">
          <div className="px-5 py-2.5 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Reviewing: <span className="text-foreground font-semibold">{term.name}</span></span>
            <div className="flex items-center gap-2">
              <button className="h-8 px-3.5 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-accent transition-colors cursor-pointer inline-flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <button className="h-8 px-3.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center gap-1.5">
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
