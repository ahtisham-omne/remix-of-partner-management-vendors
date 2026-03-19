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

/* ─── Mock items matching reference screenshots ─── */
const PT_MOCK_ITEMS = [
  { id: "1", partNo: "100219-42", description: "Front bulkhead cabinet lower cov...", category: "Ram Pro Master 2500...", controlType: "Non-Serialized", acquisitionMethod: "Both", acqPriority: "Purchased", stockingUnit: "m (Meter)", altUnit: "ly (Light Y...", status: "Active" },
  { id: "2", partNo: "100219-51", description: "Box walls inlay cabinet", category: "Hardware", controlType: "Non-Serialized", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "km (Kilometer)", altUnit: "ly (Light Y...", status: "Active" },
  { id: "3", partNo: "100219-51-01", description: "Box walls inlay cabinet with defib...", category: "Cabinet", controlType: "Serialized", acquisitionMethod: "Both", acqPriority: "Manufactured", stockingUnit: "in (Inch)", altUnit: "cm (centi...", status: "Active" },
  { id: "4", partNo: "100219-51-01RC", description: "Box walls inlay cabinet with defib...", category: "Electronics", controlType: "Non-Serialized", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "ft (Feet)", altUnit: "EA (Each)", status: "Active" },
  { id: "5", partNo: "100219-51-02", description: "Box walls inlay cabinet with refrig...", category: "Hardware", controlType: "Serialized", acquisitionMethod: "Manufactured", acqPriority: "-", stockingUnit: "ly (Light Year)", altUnit: "kg (Kilogra...", status: "Active" },
  { id: "6", partNo: "100219-52", description: "Box closeout top cap inlay cabinet", category: "Electronics", controlType: "Non-Serialized", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "mm (millimeters)", altUnit: "EA (Each)", status: "Active" },
  { id: "7", partNo: "100219-52-02", description: "Box closeout top cap inlay cabin...", category: "Cabinet", controlType: "Serialized", acquisitionMethod: "Both", acqPriority: "Purchased", stockingUnit: "cm (centimeters)", altUnit: "Roll100m (...", status: "Active" },
  { id: "8", partNo: "100120-70", description: "Toyota long cut, emergency brak...", category: "Hardware", controlType: "Non-Serialized", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "yd (yards)", altUnit: "EA (Each)", status: "Active" },
  { id: "9", partNo: "100120-71", description: "Toyota long cut, brake line bracket", category: "Electronics", controlType: "Serialized", acquisitionMethod: "Manufactured", acqPriority: "-", stockingUnit: "mi (miles)", altUnit: "EA (Each)", status: "Active" },
  { id: "10", partNo: "100120-72", description: "Toyota long cut, 48 inch wide, re...", category: "Cabinet", controlType: "Non-Serialized", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "nmi (nautical mi...", altUnit: "EA (Each)", status: "Active" },
  { id: "11", partNo: "100120-73", description: "Toyota long cut, 48 inch wide, re...", category: "Hardware", controlType: "Serialized", acquisitionMethod: "Both", acqPriority: "Manufactured", stockingUnit: "kg (Kilogram)", altUnit: "EA (Each)", status: "Active" },
  { id: "12", partNo: "100120-74", description: "Toyota wide Black Diamond Trea...", category: "Electronics", controlType: "Serialized", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "g (Gram)", altUnit: "EA (Each)", status: "Active" },
  { id: "13", partNo: "100120-75", description: "Toyota long cut, second row seat...", category: "Cabinet", controlType: "Non-Serialized", acquisitionMethod: "Manufactured", acqPriority: "-", stockingUnit: "mg (Milligram)", altUnit: "EA (Each)", status: "Active" },
  { id: "14", partNo: "100120-75-01", description: "Second row seat base, driver sid...", category: "Hardware", controlType: "Non-Serialized", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "Roll100m (Roll...", altUnit: "EA (Each)", status: "Active" },
  { id: "15", partNo: "100150-20", description: "Standard floor with kneeling syst...", category: "Electronics", controlType: "Serialized", acquisitionMethod: "Both", acqPriority: "Purchased", stockingUnit: "Bo12 (Box of 12)", altUnit: "EA (Each)", status: "Active" },
  { id: "16", partNo: "000G110808T", description: "Phillips pan head screw steel, bla...", category: "Cabinet", controlType: "Non-Serialized", acquisitionMethod: "Manufactured", acqPriority: "-", stockingUnit: "Bo24 (Box of 24)", altUnit: "EA (Each)", status: "Active" },
  { id: "17", partNo: "000G111012D", description: "#10-16 x 3/4* Phillips Drive Pan H...", category: "Hardware", controlType: "Serialized", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "cm (centimeters)", altUnit: "EA (Each)", status: "Active" },
  { id: "18", partNo: "000G391016T", description: "#10 x 1° x .190* 10N100TXPS/A -...", category: "Electronics", controlType: "Non-Serialized", acquisitionMethod: "Both", acqPriority: "Manufactured", stockingUnit: "m (Meter)", altUnit: "EA (Each)", status: "Active" },
  { id: "19", partNo: "02901201000", description: "Foam padding RF12 - 3/8\" X 72\"...", category: "Hardware", controlType: "Serialized", acquisitionMethod: "Purchased", acqPriority: "-", stockingUnit: "mg (Milligram)", altUnit: "EA (Each)", status: "Active" },
  { id: "20", partNo: "100120-79", description: "Toyota long cut, brake line bracket", category: "Electronics", controlType: "Non-Serialized", acquisitionMethod: "Manufactured", acqPriority: "-", stockingUnit: "in (Inch)", altUnit: "EA (Each)", status: "Active" },
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

/* ─── Filter pill options for items ─── */
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
  const [itemFilter, setItemFilter] = useState("all");

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
              <span className="text-[14px] font-semibold text-foreground truncate">{term.name}</span>
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
              <button onClick={() => { onClose(); setIsFullscreen(false); setTab("items"); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Body ─── */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* ─── LEFT SIDEBAR ─── */}
          <div className="w-[340px] border-r border-border flex flex-col shrink-0 overflow-y-auto bg-secondary/30">
            {/* Hero section */}
            <div className="p-5 pb-4">
              {/* Duration hero */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[40px] font-extrabold text-foreground leading-none tabular-nums tracking-tight">{ptDuration}</span>
                <span className="text-[15px] text-muted-foreground font-medium">days</span>
              </div>

              {/* Pills row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                  style={{ backgroundColor: `${badgeColor}12`, color: badgeColor, borderColor: `${badgeColor}30` }}
                >
                  {term.typeBadge}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-border bg-card text-foreground">
                  <CalendarDays className="w-3 h-3 text-muted-foreground" />
                  {term.trigger}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-chart-2/10 text-chart-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                  Active
                </span>
              </div>

              {/* Description */}
              <p className="text-[12px] text-muted-foreground mt-3 leading-relaxed">{term.description}</p>
            </div>

            {/* Details section */}
            <div className="border-t border-border">
              <button onClick={() => setAboutOpen(!aboutOpen)} className="w-full flex items-center justify-between px-5 py-3 text-[11px] font-semibold text-muted-foreground cursor-pointer hover:bg-accent/50 transition-colors uppercase tracking-wider">
                Details
                {aboutOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {aboutOpen && (
                <div className="px-5 pb-5 space-y-3">
                  {[
                    { label: "Type", value: ptTypeLabel },
                    { label: "Duration", value: `${ptDuration} days` },
                    { label: "Trigger", value: term.trigger },
                    { label: "Discount", value: term.description?.includes("discount") ? "2% / 10 days" : "None" },
                    { label: "Vendors Applied", value: String(vendorCount) },
                    { label: "Items", value: String(itemCount) },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">{row.label}</span>
                      <span className="text-[12px] font-medium text-foreground">{row.value}</span>
                    </div>
                  ))}

                  {/* Separator */}
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                        style={{ backgroundColor: creatorTint.bg, color: creatorTint.fg }}
                      >
                        JD
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-medium text-foreground">John Doe</span>
                        <span className="text-[11px] text-muted-foreground ml-1.5">· Dec 15, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── RIGHT PANEL ─── */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
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
                {/* Search + Filters bar */}
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
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-[11px] tabular-nums font-medium">{itemCount}</span>
                    </div>
                  </div>
                  <FilterPills options={ITEM_FILTER_OPTIONS} activeKey={itemFilter} onSelect={setItemFilter} />
                </div>

                {/* Data table */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-[12px]">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-secondary/60">
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Part No. ↓</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap w-[32px]"></th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Item Description</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Category ↓</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Item Control Type</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Acquisition Method</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Acq. Method 1st Priority</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Default Stocking Unit</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Alt. Stocking Unit</th>
                        <th className="text-left px-4 py-2 text-muted-foreground text-[11px] font-medium border-b border-border whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PT_MOCK_ITEMS.map((item) => (
                        <tr key={item.id} className="hover:bg-accent/40 transition-colors border-b border-border">
                          <td className="px-4 py-2.5 text-[12px] text-foreground font-medium whitespace-nowrap">{item.partNo}</td>
                          <td className="px-1 py-2.5">
                            <div className="w-7 h-7 rounded bg-secondary border border-border flex items-center justify-center shrink-0">
                              <ImageIcon className="w-3 h-3 text-muted-foreground/60" />
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-[12px] text-foreground max-w-[220px] truncate">{item.description}</td>
                          <td className="px-4 py-2.5 text-[12px] text-foreground font-medium whitespace-nowrap">{item.category}</td>
                          <td className="px-4 py-2.5 text-[12px] text-foreground whitespace-nowrap">{item.controlType}</td>
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
                              <span className="text-[12px] text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-[12px] text-foreground whitespace-nowrap">{item.stockingUnit}</td>
                          <td className="px-4 py-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px] text-foreground font-medium">{item.altUnit}</span>
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
