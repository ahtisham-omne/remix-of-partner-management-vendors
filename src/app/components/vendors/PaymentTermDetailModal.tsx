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
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Copy,
  Check,
  CalendarDays,
  Image as ImageIcon,
  Trash2,
  Plus,
  Info,
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
  { id: "vendors", label: "Vendors Applied", icon: Building2 },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "attachments", label: "Attachments", icon: Paperclip },
  { id: "activity", label: "Recent Activity", icon: Clock },
];

/* ─── Mock items ─── */
const PT_MOCK_ITEMS = [
  { id: "1", acquisitionMethod: "Both", acqPriority: "Purchased", stockingUnit: "m (Meter)", altUnit: "EA (Each)", status: "Active" },
  { id: "2", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "km (Kilometer)", altUnit: "ly (Light Y...", status: "Active" },
  { id: "3", acquisitionMethod: "Both", acqPriority: "Manufactured", stockingUnit: "in (Inch)", altUnit: "cm (centi...", status: "Active" },
  { id: "4", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "ft (Feet)", altUnit: "EA (Each)", status: "Active" },
  { id: "5", acquisitionMethod: "Manufactured", acqPriority: "-", stockingUnit: "ly (Light Year)", altUnit: "kg (Kilogra...", status: "Active" },
  { id: "6", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "mm (millimeters)", altUnit: "EA (Each)", status: "Active" },
  { id: "7", acquisitionMethod: "Both", acqPriority: "Purchased", stockingUnit: "cm (centimeters)", altUnit: "Roll100m (...", status: "Active" },
  { id: "8", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "yd (yards)", altUnit: "EA (Each)", status: "Active" },
  { id: "9", acquisitionMethod: "Manufactured", acqPriority: "-", stockingUnit: "mi (miles)", altUnit: "EA (Each)", status: "Active" },
  { id: "10", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "nmi (nautical mi...)", altUnit: "EA (Each)", status: "Active" },
  { id: "11", acquisitionMethod: "Both", acqPriority: "Manufactured", stockingUnit: "kg (Kilogram)", altUnit: "EA (Each)", status: "Active" },
  { id: "12", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "g (Gram)", altUnit: "EA (Each)", status: "Active" },
  { id: "13", acquisitionMethod: "Manufactured", acqPriority: "-", stockingUnit: "mg (Milligram)", altUnit: "EA (Each)", status: "Active" },
  { id: "14", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "Roll100m (Roll...)", altUnit: "EA (Each)", status: "Active" },
  { id: "15", acquisitionMethod: "Both", acqPriority: "Purchased", stockingUnit: "Bo12 (Box of 12)", altUnit: "EA (Each)", status: "Active" },
  { id: "16", acquisitionMethod: "Manufactured", acqPriority: "-", stockingUnit: "Bo24 (Box of 24)", altUnit: "EA (Each)", status: "Active" },
  { id: "17", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "cm (centimeters)", altUnit: "EA (Each)", status: "Active" },
  { id: "18", acquisitionMethod: "Both", acqPriority: "Manufactured", stockingUnit: "m (Meter)", altUnit: "EA (Each)", status: "Active" },
  { id: "19", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "mg (Milligram)", altUnit: "EA (Each)", status: "Active" },
  { id: "20", acquisitionMethod: "Manufactured", acqPriority: "-", stockingUnit: "in (Inch)", altUnit: "EA (Each)", status: "Active" },
];

/* ─── Mock vendors ─── */
const PT_MOCK_VENDORS_TABLE = [
  { id: "V-1", name: "Acme Industrial Supply Co.", types: ["Vendor • Sub-Contractor", "Customer"], partNo: "SB-M10-40", moreItems: 12 },
  { id: "V-2", name: "Global Fasteners Inc.", types: ["Vendor • Service Provider"], partNo: "HN-M10", moreItems: 34 },
  { id: "V-3", name: "Berlin Technik GmbH", types: ["Vendor • Seller"], partNo: "FW-M10", moreItems: 15 },
  { id: "V-4", name: "Pacific Hardware Ltd.", types: ["Vendor • Sub-Contractor"], partNo: "SLW-M10", moreItems: 23 },
  { id: "V-5", name: "Midwest Bolt & Nut Co.", types: ["Vendor • Service Provider", "Customer"], partNo: "TR-M12-1M", moreItems: 8 },
  { id: "V-6", name: "Atlas Steel Products", types: ["Vendor • Seller"], partNo: "CB-38-3", moreItems: 5 },
  { id: "V-7", name: "Nordic Fastening Systems", types: ["Vendor • Sub-Contractor"], partNo: "SB-M10-40", moreItems: 18 },
];

/* ─── Filter pill options ─── */
const ITEM_FILTER_OPTIONS: FilterPillOption[] = [
  { key: "all", label: "Me mode", showCount: false },
  { key: "parts", label: "Parts", showCount: false },
  { key: "equip-capital", label: "Equipment • Capital", showCount: false },
  { key: "equip-non-capital", label: "Equipment • Non-Capital", showCount: false },
  { key: "misc", label: "Miscellaneous", showCount: false },
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
  const [aboutOpen, setAboutOpen] = useState(true);
  const [discountOpen, setDiscountOpen] = useState(true);
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
  const vendorCount = PT_MOCK_VENDORS_TABLE.length;
  const creatorTint = getAvatarTint("Ahtisham Ahmad");

  /* ─── Sidebar info label ─── */
  const InfoLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
      {children}
      <Info className="w-3 h-3 text-muted-foreground/40" />
    </span>
  );

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
              <span className="text-[14px] font-semibold text-foreground truncate">Select payment terms</span>
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
              <button onClick={() => { onClose(); setIsFullscreen(false); setTab("items"); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* ─── LEFT SIDEBAR ─── */}
          <div className="w-[320px] lg:w-[340px] border-r border-border flex flex-col shrink-0 overflow-y-auto bg-card">
            {/* Hero: Badge + Name + Actions */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start gap-3">
                {/* Category pill */}
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide shrink-0 mt-0.5"
                  style={{ backgroundColor: `${badgeColor}18`, color: badgeColor }}
                >
                  {term.typeBadge}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[16px] font-semibold text-foreground leading-snug">{term.name}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toast.info("Delete")} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toast.info("Add")} className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[12px] text-muted-foreground leading-relaxed mt-1">
                    Payment is due {ptDuration} days after the {(term.trigger || "invoice date").toLowerCase()}.
                  </p>
                </div>
              </div>

              {/* Trigger pill */}
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-[12px] font-medium text-foreground">
                  <CalendarDays className="w-3.5 h-3.5 text-muted-foreground" />
                  {term.trigger || "Invoice Date"}
                </span>
              </div>
            </div>

            {/* ─── About this payment term ─── */}
            <div className="border-t border-border">
              <button
                onClick={() => setAboutOpen(!aboutOpen)}
                className="w-full flex items-center justify-between px-5 py-3 text-[13px] font-semibold text-foreground cursor-pointer hover:bg-accent/40 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  {aboutOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                  About this payment term
                </span>
              </button>
              {aboutOpen && (
                <div className="px-5 pb-5">
                  {/* 2-col grid like reference */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <InfoLabel>Payment Term Name</InfoLabel>
                      <p className="text-[13px] font-medium text-foreground mt-0.5">{term.name}</p>
                    </div>
                    <div>
                      <InfoLabel>Payment Term Type</InfoLabel>
                      <p className="text-[13px] font-medium text-foreground mt-0.5 leading-snug">{ptTypeLabel}</p>
                    </div>
                    <div>
                      <InfoLabel>NET Duration (Days)</InfoLabel>
                      <p className="text-[13px] font-medium text-foreground mt-0.5">{ptDuration} days</p>
                    </div>
                    <div>
                      <InfoLabel>Description</InfoLabel>
                      <p className="text-[13px] text-muted-foreground mt-0.5">-</p>
                    </div>
                    <div className="col-span-2">
                      <InfoLabel>Trigger Event</InfoLabel>
                      <span className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 text-[12px] font-medium text-foreground">
                        {term.trigger || "Invoice Date"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Discount Terms ─── */}
            <div className="border-t border-border">
              <button
                onClick={() => setDiscountOpen(!discountOpen)}
                className="w-full flex items-center justify-between px-5 py-3 text-[13px] font-semibold text-foreground cursor-pointer hover:bg-accent/40 transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  {discountOpen ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                  Apply Discount Terms
                </span>
              </button>
              {discountOpen && (
                <div className="px-5 pb-5">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <InfoLabel>Discount Percentage (%)</InfoLabel>
                      <p className="text-[13px] text-muted-foreground mt-0.5">-</p>
                    </div>
                    <div>
                      <InfoLabel>Eligible Payment Period (Days)</InfoLabel>
                      <p className="text-[13px] text-muted-foreground mt-0.5">-</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ─── Created by ─── */}
            <div className="border-t border-border px-5 py-4 mt-auto">
              <div className="grid grid-cols-2 gap-x-6">
                <div>
                  <InfoLabel>Created By</InfoLabel>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                      style={{ backgroundColor: creatorTint.bg, color: creatorTint.fg }}
                    >
                      AA
                    </div>
                    <span className="text-[12px] font-medium text-foreground">Ahtisham Ahmad</span>
                  </div>
                </div>
                <div>
                  <InfoLabel>Created at</InfoLabel>
                  <p className="text-[13px] font-medium text-foreground mt-1.5">Jan 16, 2025</p>
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
                    className={`inline-flex items-center gap-1.5 px-4 py-3 text-[12px] border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
                <div className="px-4 py-3 shrink-0 bg-card border-b border-border space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="relative flex-1 max-w-[280px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                        <input type="text" placeholder="Search items..." className="w-full pl-9 pr-3 h-8 text-[12px] bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground/60" />
                      </div>
                      <button className="h-8 px-3 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-accent cursor-pointer transition-colors inline-flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                      </button>
                    </div>
                    <span className="text-[11px] tabular-nums font-medium text-muted-foreground">{itemCount}</span>
                  </div>
                  <FilterPills options={ITEM_FILTER_OPTIONS} activeKey={itemFilter} onSelect={setItemFilter} />
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="w-full text-[12px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-secondary/60">
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Acquisition Method</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Acquisition Method 1st Priority</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Default Stocking Unit</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Alternative Stocking Unit</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_ITEMS.map((item) => (
                        <tr key={item.id} className="hover:bg-accent/40 transition-colors border-b border-border">
                          <td className="px-4 py-2.5 text-[12px] text-foreground whitespace-nowrap">{item.acquisitionMethod}</td>
                          <td className="px-4 py-2.5 whitespace-nowrap">
                            {item.acqPriority !== "-" ? (
                              <span className={`inline-flex px-2 py-0.5 rounded border text-[11px] font-medium ${
                                item.acqPriority === "Purchased"
                                  ? "border-primary/30 bg-primary/5 text-primary"
                                  : "border-chart-2/30 bg-chart-2/5 text-chart-2"
                              }`}>
                                {item.acqPriority}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-[12px] text-foreground whitespace-nowrap">{item.stockingUnit}</td>
                          <td className="px-4 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px] text-foreground">{item.altUnit}</span>
                              <span className="text-[11px] text-primary cursor-pointer hover:underline font-medium">+2 more</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.status === "Active" ? "bg-chart-2/10 text-chart-2" : "bg-chart-5/10 text-chart-5"
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
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-border bg-card text-[11px] text-foreground cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer">«</button>
                    <button className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer">← Prev</button>
                    <span className="h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground text-[11px] font-bold">1</span>
                    <button className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer">Next →</button>
                    <button className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer">»</button>
                  </div>
                </div>
              </div>
            )}

            {/* Vendors Tab */}
            {tab === "vendors" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3 shrink-0 bg-card border-b border-border">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="relative flex-1 max-w-[280px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                      <input type="text" placeholder="Search partners..." className="w-full pl-9 pr-3 h-8 text-[12px] bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground/60" />
                    </div>
                    <button className="h-8 px-3 rounded-lg border border-border bg-card text-[12px] font-medium text-foreground hover:bg-accent cursor-pointer transition-colors inline-flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-[12px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-secondary/60">
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border">Partner</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border">Type</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border">Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_VENDORS_TABLE.map((v) => {
                        const vTint = getAvatarTint(v.name);
                        const vInit = v.name.split(" ").map(w => w[0]).slice(0, 2).join("");
                        return (
                          <tr key={v.id} className="hover:bg-accent/40 transition-colors border-b border-border">
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
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-border shrink-0 bg-card">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-border bg-card text-[11px] text-foreground cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground text-[11px] font-bold">1</span>
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
