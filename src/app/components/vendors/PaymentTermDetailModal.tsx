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
  Shield,
  Receipt,
  Lock,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { getAvatarTint } from "../../utils/avatarTints";
import {
  type PaymentTermPreset,
  CREATE_PT_TYPES,
} from "./partnerConstants";

/* ─── Tab config ─── */
const PT_DETAIL_TABS = [
  { id: "items", label: "Items", icon: Package },
  { id: "vendors", label: "Vendors", icon: Building2 },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "files", label: "Files", icon: Paperclip },
  { id: "audit", label: "Audit", icon: Shield },
  { id: "activity", label: "Activity", icon: Clock },
];

/* ─── Mock items matching partner listing table ─── */
const PT_MOCK_ITEMS = [
  { id: "1", code: "FAST-HEX-001", desc: "Zinc-Plated Steel Hex Head Screw, 1/4\"-20 x 1\"", vendor: "BoltMaster Inc.", partNo: "BM-2520-100", status: "In Stock", controlType: "Non-Serialized", primaryCat: "Fasteners", additionalCat: ["Screws", "Hardware"], img: "🔩" },
  { id: "2", code: "VALV-BAL-316", desc: "316 Stainless Steel Ball Valve, 2-Piece, 1\"", vendor: "FlowControl", partNo: "SS-BV-100", status: "Low Stock", controlType: "Serialized", primaryCat: "Plumbing", additionalCat: ["Valves", "Industrial"], img: "🔧" },
  { id: "3", code: "SEAL-OR-012", desc: "Buna-N O-Ring, Dash Number 012, Hardness 70A", vendor: "SealTech", partNo: "BN-70-012", status: "In Stock", controlType: "Non-Serialized", primaryCat: "Seals", additionalCat: ["O-Rings", "Rubber Goods"], img: "⭕" },
  { id: "4", code: "TOOL-EM-050", desc: "Solid Carbide Square End Mill, 1/2\" Cutting Dia", vendor: "PrecisionTools", partNo: "SC-EM-4F-500", status: "In Stock", controlType: "Non-Serialized", primaryCat: "Tools", additionalCat: ["Milling", "Carbide"], img: "⚙️" },
  { id: "5", code: "MAT-AL-6061", desc: "6061-T6 Aluminum Sheet, 12\" x 24\" x 0.125\"", vendor: "AluSupply", partNo: "AL-6061-125", status: "Out of Stock", controlType: "Non-Serialized", primaryCat: "Raw Materials", additionalCat: ["Metals", "Sheet Stock"], img: "📦" },
  { id: "6", code: "MECH-BRG-6204", desc: "Deep Groove Ball Bearing, 6204-2RS, Sealed", vendor: "MotionPro", partNo: "6204-2RS", status: "In Stock", controlType: "Serialized", primaryCat: "Power Trans", additionalCat: ["Bearings", "Mechanical"], img: "🔘" },
];

/* ─── Vendors pulled from partner listing data ─── */
import { useVendors } from "../../context/VendorContext";
import { CATEGORY_LABELS } from "../../data/vendors";

function PTInfoLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] text-[#94A3B8] mb-px" style={{ fontWeight: 500 }}>{children}</p>;
}

interface PaymentTermDetailModalProps {
  term: PaymentTermPreset | null;
  open: boolean;
  onClose: () => void;
  /** "view" = read-only on details page, "create" = inside creation form with Use Template */
  mode?: "view" | "create";
  onDisable?: (term: PaymentTermPreset) => void;
}

function PaymentTermDetailModal({ term, open, onClose }: PaymentTermDetailModalProps) {
  const [tab, setTab] = useState("items");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [itemFilter, setItemFilter] = useState("all");
  const { vendors } = useVendors();

  if (!term) return null;

  const ptDuration = term.duration || (term.name.match(/\d+/) ? term.name.match(/\d+/)![0] : "30");
  const ptTypeLabel = CREATE_PT_TYPES.find((t) => t.id === term.category)?.label || "NET Terms";
  const badgeColor = term.badgeColor;
  const isPreset = true;
  const isCustom = !isPreset;

  const modalBaseClass = "!fixed !inset-0 !translate-x-0 !translate-y-0 !m-auto !w-full !h-full transition-[max-width,max-height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]";
  const modalSizeClass = isFullscreen
    ? `${modalBaseClass} !max-w-[calc(100%-1rem)] sm:!max-w-[calc(100%-1.5rem)] lg:!max-w-[calc(100%-2rem)] !max-h-[calc(100%-1rem)] sm:!max-h-[calc(100%-1.5rem)] lg:!max-h-[calc(100%-2rem)] !rounded-2xl`
    : `${modalBaseClass} !max-w-[100%] sm:!max-w-[960px] lg:!max-w-[1080px] !max-h-[100dvh] sm:!max-h-[90vh] rounded-none sm:!rounded-2xl`;

  const itemCount = PT_MOCK_ITEMS.length;
  // Use first 7 vendors from real data
  const ptVendors = vendors.slice(0, 7);
  const vendorCount = ptVendors.length;
  const creatorTint = getAvatarTint("Omnesoft");

  const filteredItems = PT_MOCK_ITEMS;

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
        <div className="shrink-0 bg-white rounded-t-none sm:rounded-t-2xl border-b border-[#E2E8F0]">
          <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={onClose} className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center hover:bg-[#F8FAFC] transition-colors cursor-pointer shrink-0">
                <ArrowLeft className="w-3.5 h-3.5 text-[#334155]" />
              </button>
              <h2 className="text-sm text-[#0F172A] truncate" style={{ fontWeight: 600 }}>Payment Term Details</h2>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => isCustom && toast.info("Edit coming soon")}
                disabled={isPreset}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                style={{ fontWeight: 500 }}
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => isCustom && toast.info("Archive coming soon")}
                disabled={isPreset}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                style={{ fontWeight: 500 }}
              >
                <Archive className="w-3.5 h-3.5" /> Archive
              </button>
              <button
                onClick={() => isCustom && toast.info("Disable coming soon")}
                disabled={isPreset}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                style={{ fontWeight: 500 }}
              >
                <Ban className="w-3.5 h-3.5" /> Disable
              </button>
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:text-[#334155] hover:bg-[#F8FAFC] transition-all cursor-pointer">
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => { onClose(); setIsFullscreen(false); setTab("items"); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#334155] hover:bg-[#F8FAFC] transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Body: LEFT = Tabs+Content, RIGHT = Info Cards ─── */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* ─── LEFT: TABS + DATA ─── */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
            {/* Tabs */}
            <div className="flex items-center border-b border-[#E2E8F0] shrink-0 px-1 bg-white">
              {PT_DETAIL_TABS.map((t) => {
                const active = tab === t.id;
                const count = t.id === "items" ? itemCount : t.id === "vendors" ? vendorCount : 0;
                const TabIcon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-3 text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      active ? "border-[#0A77FF] text-[#0A77FF] font-semibold" : "border-transparent text-[#64748B] hover:text-[#334155] font-medium"
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5" />
                    {t.label}
                    {count > 0 && (
                      <span className={`text-[9px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${active ? "bg-[#EDF4FF] text-[#0A77FF]" : "bg-[#F1F5F9] text-[#64748B]"}`} style={{ fontWeight: 600 }}>
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
                <div className="px-4 py-3 shrink-0 bg-white border-b border-[#E2E8F0]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="relative flex-1 max-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
                        <input type="text" placeholder="Search items..." className="w-full pl-9 pr-3 h-8 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20 transition-colors placeholder:text-[#94A3B8]" />
                      </div>
                      <button className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] cursor-pointer transition-colors inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                        <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                      </button>
                    </div>
                    <button className="h-8 px-3 rounded-lg bg-[#0A77FF] text-white text-xs hover:bg-[#0A77FF]/90 cursor-pointer transition-colors inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                      + Add Item
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-[#F8FAFC]">
                        <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Item</th>
                        <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Description</th>
                        <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Status</th>
                        <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Control Type</th>
                        <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Primary Cat.</th>
                        <th className="text-left pl-4 pr-4 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Additional Cat.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item) => {
                        const statusColor = item.status === "In Stock"
                          ? { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0", dot: "#16A34A" }
                          : item.status === "Low Stock"
                            ? { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A", dot: "#D97706" }
                            : { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA", dot: "#DC2626" };
                        return (
                          <tr key={item.id} className="bg-white hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9]">
                            <td className="pl-4 pr-2 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-base shrink-0 border border-[#E2E8F0]">
                                  {item.img}
                                </div>
                                <span className="font-mono text-[12px] text-[#0F172A] whitespace-nowrap" style={{ fontWeight: 600 }}>{item.code}</span>
                              </div>
                            </td>
                            <td className="pl-4 pr-2 py-3 max-w-[220px]">
                              <p className="text-[12px] text-[#0F172A] truncate" style={{ fontWeight: 500 }}>{item.desc}</p>
                              <p className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                                {item.vendor} <span className="mx-1">·</span> {item.partNo}
                              </p>
                            </td>
                            <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ fontWeight: 600, backgroundColor: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor.dot }} />
                                {item.status}
                              </span>
                            </td>
                            <td className="pl-4 pr-2 py-3 text-[12px] text-[#334155] whitespace-nowrap" style={{ fontWeight: 500 }}>{item.controlType}</td>
                            <td className="pl-4 pr-2 py-3 text-[12px] text-[#334155] whitespace-nowrap" style={{ fontWeight: 500 }}>{item.primaryCat}</td>
                            <td className="pl-4 pr-4 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                {item.additionalCat.map((cat) => (
                                  <span key={cat} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]" style={{ fontWeight: 500 }}>{cat}</span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E2E8F0] shrink-0 bg-white">
                  <span className="text-[11px] text-[#64748B]">Showing <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{filteredItems.length}</span> of <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{itemCount}</span> items</span>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-[#E2E8F0] bg-white text-[11px] text-[#334155] cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Vendors Tab */}
            {tab === "vendors" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-3 shrink-0 bg-white border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-[240px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
                      <input type="text" placeholder="Search partners..." className="w-full pl-9 pr-3 h-8 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20 transition-colors placeholder:text-[#94A3B8]" />
                    </div>
                    <button className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] cursor-pointer transition-colors inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-[#F8FAFC]">
                        <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Partner</th>
                        <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Description</th>
                        <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Status</th>
                        <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Type</th>
                        <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Category</th>
                        <th className="text-left pl-4 pr-4 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Country</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ptVendors.map((v) => {
                        const vTint = getAvatarTint(v.companyName);
                        const vInit = v.companyName.split(" ").map(w => w[0]).slice(0, 2).join("");
                        const statusColor = v.status === "active"
                          ? { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0", dot: "#16A34A" }
                          : v.status === "inactive"
                            ? { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A", dot: "#D97706" }
                            : { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA", dot: "#DC2626" };
                        return (
                          <tr key={v.id} className="bg-white hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9]">
                            <td className="pl-4 pr-2 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] shrink-0" style={{ backgroundColor: vTint.bg, color: vTint.fg, fontWeight: 700 }}>
                                  {vInit}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[12px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}>{v.companyName}</p>
                                  <p className="text-[10px] text-[#94A3B8] mt-0.5 font-mono">{v.code}</p>
                                </div>
                              </div>
                            </td>
                            <td className="pl-4 pr-2 py-3 max-w-[180px]">
                              <p className="text-[12px] text-[#334155] truncate" style={{ fontWeight: 500 }}>{v.description || v.services}</p>
                              <p className="text-[10px] text-[#94A3B8] mt-0.5">{v.country}</p>
                            </td>
                            <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ fontWeight: 600, backgroundColor: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor.dot }} />
                                {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                              </span>
                            </td>
                            <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-1">
                                {v.partnerTypes.map((t) => (
                                  <span key={t} className={`text-[10px] px-2 py-0.5 rounded-md border ${t === "vendor" ? "bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]" : "bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]"}`} style={{ fontWeight: 500 }}>
                                    {t === "vendor" ? "Vendor" : "Customer"}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="pl-4 pr-2 py-3 text-[12px] text-[#334155] whitespace-nowrap" style={{ fontWeight: 500 }}>{CATEGORY_LABELS[v.category]}</td>
                            <td className="pl-4 pr-4 py-3 whitespace-nowrap">
                              <span className="text-[12px] text-[#334155]" style={{ fontWeight: 500 }}>{v.countryFlag} {v.country}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E2E8F0] shrink-0 bg-white">
                  <span className="text-[11px] text-[#64748B]">Showing <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{vendorCount}</span> of <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{vendorCount}</span> partners</span>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-[#E2E8F0] bg-white text-[11px] text-[#334155] cursor-pointer outline-none">
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
                  <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
                    {(() => { const T = PT_DETAIL_TABS.find((x) => x.id === tab); return T ? <T.icon className="w-5 h-5 text-[#94A3B8]" /> : null; })()}
                  </div>
                  <p className="text-sm text-[#0F172A]" style={{ fontWeight: 600 }}>{PT_DETAIL_TABS.find((x) => x.id === tab)?.label || tab}</p>
                  <p className="text-[11px] text-[#94A3B8] mt-1">Coming soon</p>
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT SIDEBAR: Flat info card ─── */}
          <div className="w-[280px] xl:w-[300px] border-l border-[#E2E8F0] shrink-0 overflow-y-auto bg-[#F8FAFC]">
            <div className="p-3.5">
              <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                {/* Card header */}
                <div className="px-3.5 py-2.5 border-b border-[#F1F5F9] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#EDF4FF] flex items-center justify-center shrink-0">
                    <Receipt className="w-3 h-3 text-[#0A77FF]" />
                  </div>
                  <span className="text-[12px] text-[#0F172A]" style={{ fontWeight: 600 }}>Term Overview</span>
                </div>

                <div className="px-3.5 py-3 space-y-3">
                  {/* Term Name */}
                  <div>
                    <PTInfoLabel>Term Name</PTInfoLabel>
                    <p className="text-[12.5px] text-[#0F172A]" style={{ fontWeight: 600 }}>{term.name}</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                      {term.description || `Payment is due ${ptDuration} days after the ${(term.trigger || "invoice date").toLowerCase()}.`}
                    </p>
                  </div>

                  {/* Term Type */}
                  <div>
                    <PTInfoLabel>Term Type</PTInfoLabel>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md border"
                        style={{ fontWeight: 500, backgroundColor: badgeColor + "12", borderColor: badgeColor + "30", color: badgeColor }}
                      >
                        <Receipt className="w-3 h-3" />
                        {term.typeBadge}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md border border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B]" style={{ fontWeight: 600 }}>
                        <Lock className="w-2.5 h-2.5" /> PRESET
                      </span>
                    </div>
                  </div>

                  {/* Duration + Trigger */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    <div className="min-w-0">
                      <PTInfoLabel>Duration</PTInfoLabel>
                      <p className="text-[12.5px] text-[#0F172A]" style={{ fontWeight: 600 }}>{ptDuration} days</p>
                    </div>
                    <div className="min-w-0">
                      <PTInfoLabel>Trigger Event</PTInfoLabel>
                      <p className="text-[12px] text-[#334155]" style={{ fontWeight: 500 }}>{term.trigger || "Invoice Date"}</p>
                    </div>
                  </div>

                  {/* Status + Vendors Using */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    <div className="min-w-0">
                      <PTInfoLabel>Status</PTInfoLabel>
                      <div className="mt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]" style={{ fontWeight: 600 }}>Active</span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <PTInfoLabel>Vendors Using</PTInfoLabel>
                      <p className="text-[12.5px] text-[#0F172A]" style={{ fontWeight: 600 }}>{vendorCount}</p>
                    </div>
                  </div>

                  {/* Early Payment Discount */}
                  {(term.applyDiscount || term.discountPercent) && (
                    <div className="pt-2.5 border-t border-[#F1F5F9]">
                      <PTInfoLabel>Early Payment Discount</PTInfoLabel>
                      <p className="text-[12px] text-[#334155] mt-0.5" style={{ fontWeight: 500 }}>
                        {term.discountPercent || "2"}% if paid within {term.discountPeriod || "10"} days
                      </p>
                    </div>
                  )}

                  {/* Created By + Last Updated */}
                  <div className="grid grid-cols-2 gap-x-4 pt-2.5 border-t border-[#F1F5F9]">
                    <div className="min-w-0">
                      <PTInfoLabel>Created By</PTInfoLabel>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] shrink-0 bg-[#EDF4FF] text-[#0A77FF]" style={{ fontWeight: 700 }}>
                          OS
                        </div>
                        <span className="text-[12px] text-[#334155] truncate" style={{ fontWeight: 500 }}>Omnesoft</span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <PTInfoLabel>Last Updated</PTInfoLabel>
                      <p className="text-[12px] text-[#334155] mt-0.5 truncate" style={{ fontWeight: 500 }}>Dec 15, 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Footer ─── */}
        <div className="shrink-0 border-t border-[#E2E8F0] bg-white rounded-b-none sm:rounded-b-2xl">
          <div className="px-5 py-2.5 flex items-center justify-between">
            <span className="text-[11px] text-[#64748B]">Reviewing: <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{term.name}</span></span>
            <div className="flex items-center gap-2">
              <button className="h-8 px-3.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              <button className="h-8 px-3.5 rounded-lg bg-[#0A77FF] text-white text-xs hover:bg-[#0A77FF]/90 transition-colors cursor-pointer inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}>
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
