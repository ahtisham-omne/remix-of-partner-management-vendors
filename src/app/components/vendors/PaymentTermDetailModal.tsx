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
  Package,
  Building2,
  FileText,
  Paperclip,
  Clock,
  Search,
  SlidersHorizontal,
  Copy,
  Check,
  Sparkles,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { getAvatarTint } from "../../utils/avatarTints";
import {
  type PaymentTermPreset,
  CREATE_PT_TYPES,
} from "./partnerConstants";
import { FilterPills, type FilterPillOption } from "./FilterPills";

/* ─── Tab config ─── */
const PT_DETAIL_TABS = [
  { id: "items", label: "Items", icon: Package },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "files", label: "Files", icon: Paperclip },
  { id: "audit", label: "Audit", icon: Shield },
  { id: "activity", label: "Activity", icon: Clock },
];

/* ─── Mock items matching reference ─── */
const PT_MOCK_ITEMS = [
  { id: "1", name: "Steel Bolts M10×40", partNo: "SB-M10-40", category: "Fasteners", price: 12.50, status: "Active" },
  { id: "2", name: "Hex Nuts M10", partNo: "HN-M10", category: "Fasteners", price: 4.20, status: "Active" },
  { id: "3", name: "Flat Washers M10", partNo: "FW-M10", category: "Fasteners", price: 2.80, status: "Active" },
  { id: "4", name: "Spring Lock Washers M10", partNo: "SLW-M10", category: "Fasteners", price: 3.40, status: "Inactive" },
  { id: "5", name: "Threaded Rods M12×1m", partNo: "TR-M12-1M", category: "Rods", price: 18.90, status: "Active" },
  { id: "6", name: "Carriage Bolts 3/8×3", partNo: "CB-38-3", category: "Fasteners", price: 8.60, status: "Active" },
];

/* ─── Mock vendors ─── */
const PT_MOCK_VENDORS = [
  { id: "V-1", name: "Acme Industrial Supply Co.", code: "V-1", status: "Active" },
  { id: "V-2", name: "Global Fasteners Inc.", code: "V-2", status: "Active" },
  { id: "V-3", name: "Berlin Technik GmbH", code: "V-3", status: "Active" },
  { id: "V-4", name: "Pacific Hardware Ltd.", code: "V-4", status: "Active" },
  { id: "V-5", name: "Midwest Bolt & Nut Co.", code: "V-5", status: "Active" },
  { id: "V-6", name: "Atlas Steel Products", code: "V-6", status: "Inactive" },
  { id: "V-7", name: "Nordic Fastening Systems", code: "V-7", status: "Active" },
];

/* ─── Filter pill options ─── */
const ITEM_FILTER_OPTIONS: FilterPillOption[] = [
  { key: "all", label: "All", showCount: false },
  { key: "active", label: "Active", showCount: false },
  { key: "inactive", label: "Inactive", showCount: false },
];

interface PaymentTermDetailModalProps {
  term: PaymentTermPreset | null;
  open: boolean;
  onClose: () => void;
}

function PaymentTermDetailModal({ term, open, onClose }: PaymentTermDetailModalProps) {
  const [tab, setTab] = useState("items");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [itemFilter, setItemFilter] = useState("all");

  if (!term) return null;

  const ptDuration = term.duration || (term.name.match(/\d+/) ? term.name.match(/\d+/)![0] : "30");
  const ptTypeLabel = CREATE_PT_TYPES.find((t) => t.id === term.category)?.label || "NET Terms (After X Days of a Certain Event)";
  const badgeColor = term.badgeColor;

  const modalBaseClass = "!fixed !inset-0 !translate-x-0 !translate-y-0 !m-auto !w-full !h-full transition-[max-width,max-height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]";
  const modalSizeClass = isFullscreen
    ? `${modalBaseClass} !max-w-[calc(100%-1rem)] sm:!max-w-[calc(100%-1.5rem)] lg:!max-w-[calc(100%-2rem)] !max-h-[calc(100%-1rem)] sm:!max-h-[calc(100%-1.5rem)] lg:!max-h-[calc(100%-2rem)] !rounded-2xl`
    : `${modalBaseClass} !max-w-[100%] sm:!max-w-[960px] lg:!max-w-[1080px] !max-h-[100dvh] sm:!max-h-[90vh] rounded-none sm:!rounded-2xl`;

  const itemCount = PT_MOCK_ITEMS.length;
  const vendorCount = PT_MOCK_VENDORS.length;
  const creatorTint = getAvatarTint("John Doe");

  const filteredItems = itemFilter === "all" ? PT_MOCK_ITEMS
    : PT_MOCK_ITEMS.filter(i => i.status.toLowerCase() === itemFilter);

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
              <h2 className="text-sm font-semibold text-foreground truncate">{term.name}</h2>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide shrink-0"
                style={{ backgroundColor: `${badgeColor}18`, color: badgeColor }}
              >
                {term.typeBadge}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-muted-foreground shrink-0">
                {term.trigger || "Invoice Date"}
              </span>
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
                Full view
              </button>
              <button onClick={() => { onClose(); setIsFullscreen(false); setTab("items"); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="px-5 pb-3 text-xs text-muted-foreground -mt-1">{term.description || `Payment is due ${ptDuration} days after the ${(term.trigger || "invoice date").toLowerCase()}.`}</p>
        </div>

        {/* ─── Body ─── */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* ─── LEFT SIDEBAR ─── */}
          <div className="w-[280px] lg:w-[300px] border-r border-border flex flex-col shrink-0 overflow-y-auto bg-card">
            {/* Card-style header matching PaymentTermCard */}
            <div className="px-4 pt-4 pb-3">
              {/* Type + Trigger pill — same as card */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-stretch rounded-full overflow-hidden border shrink-0" style={{ borderColor: badgeColor + "40" }}>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-[2px] text-[10px]"
                    style={{ fontWeight: 600, color: badgeColor, backgroundColor: badgeColor + "15" }}
                  >
                    <Receipt className="w-3 h-3" />
                    {term.typeBadge}
                  </span>
                  <span className="inline-flex items-center px-2 py-[2px] text-[10px] bg-card text-muted-foreground border-l" style={{ fontWeight: 500, borderColor: badgeColor + "40" }}>
                    {term.trigger || "Invoice Date"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-[3px] rounded-md border border-border bg-secondary/50 text-[9px] text-muted-foreground shrink-0" style={{ fontWeight: 600 }}>
                  <Lock className="w-2.5 h-2.5" /> PRESET
                </span>
              </div>

              {/* Name */}
              <p className="text-sm text-foreground mb-1" style={{ fontWeight: 600 }}>{term.name}</p>

              {/* Description */}
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                {term.description || `Payment is due ${ptDuration} days after the ${(term.trigger || "invoice date").toLowerCase()}.`}
              </p>

              {/* Hero duration + vendor count — same as card */}
              <div className="flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-[28px] text-foreground tabular-nums leading-none tracking-tight" style={{ fontWeight: 600 }}>{ptDuration}</span>
                  <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>days</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground" style={{ fontWeight: 500 }}>
                  <Building2 className="w-3 h-3" /> {vendorCount} vendors using
                </span>
              </div>

              {/* Discount strip — same as card */}
              {(term.applyDiscount || term.discountPercent) && (
                <div className="pt-2">
                  <div className="flex items-center px-2.5 py-[5px] rounded-lg border border-border bg-secondary/30 text-[11px] tabular-nums">
                    <span className="text-muted-foreground" style={{ fontWeight: 400 }}>
                      Early pay {term.discountPercent || "2"}% within {term.discountPeriod || "10"} days
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-border" />

            {/* Metadata section */}
            <div className="px-4 py-3 space-y-3">
              <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Details</h4>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Type</span>
                  <p className="text-xs text-foreground mt-1 leading-snug">{ptTypeLabel}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Duration</span>
                  <p className="text-xs text-foreground mt-1">{ptDuration} days</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Trigger</span>
                  <p className="text-xs text-foreground mt-1">{term.trigger || "Invoice Date"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Status</span>
                  <p className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-chart-2/10 text-chart-2">Active</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Created by */}
            <div className="px-4 py-3">
              <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Created By</h4>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                  style={{ backgroundColor: creatorTint.bg, color: creatorTint.fg }}
                >
                  JD
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">John Doe</p>
                  <p className="text-[10px] text-muted-foreground">Dec 15, 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT PANEL ─── */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Tabs */}
            <div className="flex items-center border-b border-border shrink-0 px-1 bg-card">
              {PT_DETAIL_TABS.map((t) => {
                const active = tab === t.id;
                const count = t.id === "items" ? itemCount : t.id === "vendors" ? vendorCount : 0;
                const TabIcon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-3 text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      active ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-foreground font-medium"
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
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
                <div className="px-4 py-3 shrink-0 bg-card border-b border-border">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="relative flex-1 max-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                        <input type="text" placeholder="Search items..." className="w-full pl-9 pr-3 h-8 text-xs bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground/60" />
                      </div>
                      <button className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent cursor-pointer transition-colors inline-flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                      </button>
                    </div>
                    <button className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 cursor-pointer transition-colors inline-flex items-center gap-1.5">
                      + Add Item
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-secondary/60">
                        <th className="text-left pl-4 pr-2 py-2.5 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Item</th>
                        <th className="text-left pl-4 pr-2 py-2.5 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Part No.</th>
                        <th className="text-left pl-4 pr-2 py-2.5 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Category</th>
                        <th className="text-right pl-4 pr-4 py-2.5 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Price</th>
                        <th className="text-left pl-4 pr-4 py-2.5 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-accent/40 transition-colors border-b border-border">
                          <td className="pl-4 pr-2 py-2.5 text-xs text-foreground whitespace-nowrap">{item.name}</td>
                          <td className="pl-4 pr-2 py-2.5 whitespace-nowrap">
                            <span className="font-mono text-[11px] text-muted-foreground">{item.partNo}</span>
                          </td>
                          <td className="pl-4 pr-2 py-2.5 text-xs text-muted-foreground whitespace-nowrap">{item.category}</td>
                          <td className="pl-4 pr-4 py-2.5 text-right whitespace-nowrap tabular-nums text-xs text-foreground">${item.price.toFixed(2)}</td>
                          <td className="pl-4 pr-4 py-2.5 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.status === "Active" ? "bg-chart-2/10 text-chart-2" : "bg-destructive/10 text-destructive"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border shrink-0 bg-card">
                  <span className="text-[11px] text-muted-foreground">Showing <span className="text-foreground font-medium">{filteredItems.length}</span> of <span className="text-foreground font-medium">{itemCount}</span> items</span>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Records per page</span>
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
                <div className="px-4 py-3 shrink-0 bg-card border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-[240px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <input type="text" placeholder="Search partners..." className="w-full pl-9 pr-3 h-8 text-xs bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground/60" />
                    </div>
                    <button className="h-8 px-3 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent cursor-pointer transition-colors inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-secondary/60">
                        <th className="text-left pl-4 pr-2 py-2.5 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Partner</th>
                        <th className="text-left pl-4 pr-2 py-2.5 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Code</th>
                        <th className="text-left pl-4 pr-4 py-2.5 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_VENDORS.map((v) => {
                        const vTint = getAvatarTint(v.name);
                        const vInit = v.name.split(" ").map(w => w[0]).slice(0, 2).join("");
                        return (
                          <tr key={v.id} className="hover:bg-accent/40 transition-colors border-b border-border">
                            <td className="pl-4 pr-2 py-2.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" style={{ backgroundColor: vTint.bg, color: vTint.fg }}>
                                  {vInit}
                                </div>
                                <span className="text-xs font-medium text-foreground">{v.name}</span>
                              </div>
                            </td>
                            <td className="pl-4 pr-2 py-2.5 font-mono text-[11px] text-muted-foreground">{v.code}</td>
                            <td className="pl-4 pr-4 py-2.5">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                v.status === "Active" ? "bg-chart-2/10 text-chart-2" : "bg-destructive/10 text-destructive"
                              }`}>
                                {v.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border shrink-0 bg-card">
                  <span className="text-[11px] text-muted-foreground">Showing <span className="text-foreground font-medium">{vendorCount}</span> of <span className="text-foreground font-medium">{vendorCount}</span> items</span>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-border bg-card text-[11px] text-foreground cursor-pointer outline-none">
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
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-3">
                    {(() => { const T = PT_DETAIL_TABS.find((x) => x.id === tab); return T ? <T.icon className="w-5 h-5 text-muted-foreground" /> : null; })()}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{PT_DETAIL_TABS.find((x) => x.id === tab)?.label || tab}</p>
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
              <button className="h-8 px-3.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-accent transition-colors cursor-pointer inline-flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <button className="h-8 px-3.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer inline-flex items-center gap-1.5">
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
