import React, { useState, useMemo } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Search, X, SlidersHorizontal, MoreHorizontal, Eye, Pencil, Trash2, Copy,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, AlignJustify, List, Check, ChevronDown, Columns3,
} from "lucide-react";
import { getAvatarTint } from "../../utils/avatarTints";

/* ─── Column config ─── */
type ColKey = "quote_no" | "customer" | "poc" | "status" | "value" | "location" | "requested" | "created" | "respond_by" | "expires" | "confirmed" | "sales_rep" | "priority";

const ALL_COLUMNS: { key: ColKey; label: string; width: number; sticky?: "left"; align?: "right" }[] = [
  { key: "quote_no", label: "Quote No", width: 175, sticky: "left" },
  { key: "customer", label: "Customer Name", width: 230 },
  { key: "poc", label: "Point of Contact", width: 165 },
  { key: "status", label: "Status", width: 185 },
  { key: "value", label: "Quote Value", width: 135, align: "right" },
  { key: "location", label: "Delivery Location", width: 175 },
  { key: "requested", label: "Requested", width: 120 },
  { key: "created", label: "Created", width: 120 },
  { key: "respond_by", label: "Respond By", width: 120 },
  { key: "expires", label: "Expires", width: 120 },
  { key: "confirmed", label: "Confirmed", width: 120 },
  { key: "sales_rep", label: "Sales Rep", width: 165 },
  { key: "priority", label: "Priority", width: 100 },
];

const DEFAULT_VISIBLE: ColKey[] = ["quote_no", "customer", "poc", "status", "value", "location", "requested", "expires", "sales_rep", "priority"];

/* ─── Data ─── */
const QT_DATA = [
  { id: "Q-000-000-000", version: "v4", customer: "Metro City Fire & Rescue", customerCode: "MC", poc: "Sarah Moore", pocCode: "SM", status: "Draft", value: 230500, location: "Station 1 HQ", requested: "Jan 21, 2026", created: "Jan 22, 2026", respondBy: "—", expires: "Apr 22, 2026", confirmed: "—", salesRep: "Sarah Lindquist", salesRepCode: "SL", priority: "Urgent" },
  { id: "Q-000-000-001", version: "v5", customer: "Tri-County EMS Authority", customerCode: "TE", poc: "William Davis", pocCode: "WD", status: "Sent", value: 95900, location: "Central Dispatch", requested: "Jan 29, 2026", created: "Jan 30, 2026", respondBy: "Mar 07, 2026", expires: "Mar 03, 2026", confirmed: "—", salesRep: "Michael Tran", salesRepCode: "MT", priority: "Medium" },
  { id: "Q-000-000-002", version: "v2", customer: "Lakewood Community Hospital", customerCode: "LC", poc: "Emma Lee", pocCode: "EL", status: "Draft", value: 51600, location: "Fleet Services", requested: "Dec 29, 2025", created: "Dec 30, 2025", respondBy: "—", expires: "Feb 25, 2026", confirmed: "—", salesRep: "Emily Rios", salesRepCode: "ER", priority: "Low" },
  { id: "Q-000-000-003", version: "v1", customer: "Pinecrest Volunteer Fire", customerCode: "PV", poc: "Chris Rodriguez", pocCode: "CR", status: "Converted to SO", value: 430300, location: "Main Station", requested: "Feb 06, 2026", created: "Feb 06, 2026", respondBy: "—", expires: "Apr 20, 2026", confirmed: "Feb 25, 2026", salesRep: "David Kowalski", salesRepCode: "DK", priority: "Urgent" },
  { id: "Q-000-000-004", version: "v4", customer: "Summit Regional Medical", customerCode: "SR", poc: "Jane Davis", pocCode: "JD", status: "Confirmed by Customer", value: 425100, location: "Transport Division", requested: "Oct 29, 2025", created: "Oct 29, 2025", respondBy: "—", expires: "Jan 05, 2026", confirmed: "Nov 13, 2025", salesRep: "Jessica Mbeki", salesRepCode: "JM", priority: "Medium" },
  { id: "Q-000-000-005", version: "v1", customer: "Eagle County Sheriff's Office", customerCode: "EC", poc: "Amy Williams", pocCode: "AW", status: "Sent", value: 289800, location: "Fleet Management", requested: "Dec 14, 2025", created: "Dec 18, 2025", respondBy: "Jan 27, 2026", expires: "Feb 04, 2026", confirmed: "—", salesRep: "Robert Navarro", salesRepCode: "RN", priority: "Low" },
  { id: "Q-000-000-006", version: "v2", customer: "Pacific Northwest Ambulance", customerCode: "PN", poc: "Chris Lee", pocCode: "CL", status: "Draft", value: 213500, location: "Portland Base", requested: "Nov 24, 2025", created: "Nov 27, 2025", respondBy: "—", expires: "Mar 25, 2026", confirmed: "—", salesRep: "Amanda Chen", salesRepCode: "AC", priority: "Urgent" },
  { id: "Q-000-000-007", version: "v3", customer: "Riverside Utility District", customerCode: "RU", poc: "Jennifer Wilson", pocCode: "JW", status: "Cancelled", value: 338400, location: "Operations Yard", requested: "Feb 06, 2026", created: "Feb 07, 2026", respondBy: "—", expires: "Apr 04, 2026", confirmed: "—", salesRep: "James Hatfield", salesRepCode: "JH", priority: "Medium" },
  { id: "Q-000-000-008", version: "v4", customer: "Heartland Air Ambulance", customerCode: "HA", poc: "Lisa Taylor", pocCode: "LT", status: "Sent", value: 324400, location: "Hangar/Fleet HQ", requested: "Dec 26, 2025", created: "Dec 30, 2025", respondBy: "Jan 19, 2026", expires: "Mar 05, 2026", confirmed: "—", salesRep: "Sarah Lindquist", salesRepCode: "SL", priority: "Low" },
  { id: "Q-000-000-009", version: "v4", customer: "Great Plains Fire Protection", customerCode: "GP", poc: "Amy Miller", pocCode: "AM", status: "Converted to SO", value: 317900, location: "District Office", requested: "Oct 18, 2025", created: "Oct 23, 2025", respondBy: "—", expires: "Feb 09, 2026", confirmed: "Nov 08, 2025", salesRep: "Michael Tran", salesRepCode: "MT", priority: "Urgent" },
  { id: "Q-000-000-010", version: "v2", customer: "Coastal Search & Rescue", customerCode: "CS", poc: "Chris Davis", pocCode: "CD", status: "Confirmed by Customer", value: 409800, location: "Galveston Station", requested: "Jan 31, 2026", created: "Jan 31, 2026", respondBy: "—", expires: "Apr 29, 2026", confirmed: "Feb 07, 2026", salesRep: "Emily Rios", salesRepCode: "ER", priority: "Medium" },
  { id: "Q-000-000-011", version: "v1", customer: "Valley Health System", customerCode: "VH", poc: "Sarah Davis", pocCode: "SD", status: "Draft", value: 446400, location: "Central Supply", requested: "Nov 08, 2025", created: "Nov 11, 2025", respondBy: "—", expires: "Feb 08, 2026", confirmed: "—", salesRep: "David Kowalski", salesRepCode: "DK", priority: "Low" },
  { id: "Q-000-000-012", version: "v3", customer: "Cedar Falls Township", customerCode: "CF", poc: "Jennifer Lee", pocCode: "JL", status: "Sent", value: 296000, location: "Station 3", requested: "Nov 27, 2025", created: "Nov 29, 2025", respondBy: "Dec 18, 2025", expires: "Feb 16, 2026", confirmed: "—", salesRep: "Jessica Mbeki", salesRepCode: "JM", priority: "Urgent" },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Draft": { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
  "Sent": { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  "Confirmed by Customer": { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  "Converted to SO": { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  "Cancelled": { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
};

const PRIORITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Urgent": { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
  "Medium": { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  "Low": { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
};

const FILTER_TABS = [
  { key: "all", label: "Show All" }, { key: "Draft", label: "Draft" }, { key: "Sent", label: "Sent to Customer" },
  { key: "Confirmed by Customer", label: "Confirmed by Customer" }, { key: "Converted to SO", label: "Converted to SO" }, { key: "Cancelled", label: "Cancelled" },
];

const CHECKBOX_W = 40;
const ACTIONS_W = 60;
const fmt = (n: number) => `$ ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function QuotesTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [density, setDensity] = useState<"condensed" | "comfort">("condensed");
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(new Set(DEFAULT_VISIBLE));
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleCol = (k: ColKey) => setVisibleCols(prev => { const n = new Set(prev); if (n.has(k)) { if (n.size > 1) n.delete(k); } else n.add(k); return n; });
  const cols = ALL_COLUMNS.filter(c => visibleCols.has(c.key));
  const isRelaxed = density === "comfort";

  const filtered = useMemo(() => {
    let rows = QT_DATA;
    if (statusFilter !== "all") rows = rows.filter(r => r.status === statusFilter);
    if (search) { const q = search.toLowerCase(); rows = rows.filter(r => r.id.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q) || r.poc.toLowerCase().includes(q)); }
    return rows;
  }, [search, statusFilter]);

  const filterCounts = useMemo(() => {
    const c: Record<string, number> = { all: QT_DATA.length };
    QT_DATA.forEach(r => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, []);

  const totalW = CHECKBOX_W + cols.reduce((s, c) => s + c.width, 0) + ACTIONS_W;
  const allSelected = filtered.length > 0 && filtered.every(r => selectedRows.has(r.id));
  const someSelected = filtered.some(r => selectedRows.has(r.id));

  const renderCell = (qt: typeof QT_DATA[0], key: ColKey) => {
    const tint = getAvatarTint(qt.customer);
    const pocTint = getAvatarTint(qt.poc);
    const repTint = getAvatarTint(qt.salesRep);
    const sz = isRelaxed ? "text-[13.5px]" : "text-sm";
    switch (key) {
      case "quote_no": return (<div className="flex items-center gap-2"><span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]" style={{ fontWeight: 600 }}>{qt.version}</span><span className={`${sz} text-[#0A77FF] cursor-pointer hover:underline`} style={{ fontWeight: 500 }}>{qt.id}</span></div>);
      case "customer": return (<div className={`flex items-center ${isRelaxed ? "gap-3" : "gap-2.5"}`}><div className={`${isRelaxed ? "w-8 h-8" : "w-7 h-7"} rounded-lg flex items-center justify-center shrink-0 text-[9px]`} style={{ backgroundColor: tint.bg, color: tint.fg, fontWeight: 700 }}>{qt.customerCode}</div><span className={`${sz} truncate`} style={{ fontWeight: 500, color: "#1E293B" }}>{qt.customer}</span></div>);
      case "poc": return (<div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[8px]" style={{ backgroundColor: pocTint.bg, color: pocTint.fg, fontWeight: 700 }}>{qt.pocCode}</div><span className={`${sz} text-[#334155] truncate`}>{qt.poc}</span></div>);
      case "status": { const ss = STATUS_STYLES[qt.status] || STATUS_STYLES.Draft; return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap" style={{ fontWeight: 500, backgroundColor: ss.bg, color: ss.text, borderColor: ss.border }}>{qt.status}</span>; }
      case "value": return <span className={sz} style={{ fontWeight: 500 }}>{fmt(qt.value)}</span>;
      case "location": return <span className={`${sz} text-[#64748B] truncate block`}>{qt.location}</span>;
      case "requested": return <span className={`${sz} text-[#64748B]`}>{qt.requested}</span>;
      case "created": return <span className={`${sz} text-[#64748B]`}>{qt.created}</span>;
      case "respond_by": return <span className={`${sz} text-[#64748B]`}>{qt.respondBy}</span>;
      case "expires": return <span className={`${sz} text-[#64748B]`}>{qt.expires}</span>;
      case "confirmed": return <span className={`${sz} text-[#64748B]`}>{qt.confirmed}</span>;
      case "sales_rep": return (<div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[8px]" style={{ backgroundColor: repTint.bg, color: repTint.fg, fontWeight: 700 }}>{qt.salesRepCode}</div><span className={`${sz} text-[#334155] truncate`}>{qt.salesRep}</span></div>);
      case "priority": { const ps = PRIORITY_STYLES[qt.priority] || PRIORITY_STYLES.Low; return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] whitespace-nowrap" style={{ fontWeight: 500, backgroundColor: ps.bg, color: ps.text, borderColor: ps.border }}>{qt.priority}</span>; }
      default: return <span>—</span>;
    }
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-clip flex flex-col">
      {/* Toolbar */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-[#F1F5F9] flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
          <Input placeholder="Search by quote no, customer, or rep..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-8 h-9 text-sm bg-white border-border/80 shadow-sm placeholder:text-muted-foreground/50" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <button className="inline-flex items-center justify-center h-9 gap-1.5 px-3 rounded-lg border border-border/80 bg-white shadow-sm hover:bg-muted/50 transition-colors text-foreground cursor-pointer"><SlidersHorizontal className="w-3.5 h-3.5" /><span className="text-sm" style={{ fontWeight: 500 }}>Filters</span></button>
        <span className="text-sm tabular-nums ml-auto" style={{ fontWeight: 500 }}><span className="text-foreground">{filtered.length}</span><span className="text-muted-foreground/70"> quotes</span></span>
        {/* Density */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center justify-center h-9 gap-2 px-3 rounded-lg border border-border bg-white shadow-sm hover:bg-muted/40 transition-colors cursor-pointer">
              {density === "condensed" ? <AlignJustify className="w-[18px] h-[18px] text-muted-foreground/80" /> : <List className="w-[18px] h-[18px] text-muted-foreground/80" />}
              <span className="text-sm hidden md:inline" style={{ fontWeight: 500 }}>{density === "condensed" ? "Condensed" : "Comfort"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] p-1.5">
            {(["condensed", "comfort"] as const).map(d => (
              <DropdownMenuItem key={d} className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-md" onSelect={() => setDensity(d)}>
                {d === "condensed" ? <AlignJustify className="w-5 h-5 text-muted-foreground shrink-0" /> : <List className="w-5 h-5 text-muted-foreground shrink-0" />}
                <span className="text-sm flex-1" style={{ fontWeight: 500 }}>{d === "condensed" ? "Condensed" : "Comfort"}</span>
                {density === d && <Check className="w-4 h-4 shrink-0" style={{ color: "#0A77FF" }} />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Columns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center justify-center h-9 gap-2 px-3 rounded-lg border border-border bg-white shadow-sm hover:bg-muted/40 transition-colors cursor-pointer">
              <Columns3 className="w-4 h-4 text-muted-foreground/80" /><span className="text-sm" style={{ fontWeight: 500 }}>Columns</span>
              <span className="text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center bg-primary/10" style={{ fontWeight: 600, color: "#0A77FF" }}>{visibleCols.size}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px] p-1.5 max-h-[300px] overflow-y-auto">
            {ALL_COLUMNS.map(c => (
              <DropdownMenuItem key={c.key} className="flex items-center gap-2.5 py-2 px-3 cursor-pointer rounded-md" onSelect={(e) => { e.preventDefault(); toggleCol(c.key); }}>
                <Checkbox checked={visibleCols.has(c.key)} className="pointer-events-none" /><span className="text-sm" style={{ fontWeight: 500 }}>{c.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status tabs */}
      <div className="px-4 py-2 flex items-center gap-2 border-b border-[#F1F5F9] overflow-x-auto scrollbar-hide">
        {FILTER_TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          const count = filterCounts[tab.key] || 0;
          return (
            <button key={tab.key} onClick={() => setStatusFilter(tab.key)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${isActive ? "border-primary bg-[#EDF4FF]" : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`} style={{ fontWeight: isActive ? 500 : 400, color: isActive ? "#0A77FF" : undefined }}>
              {tab.label}<span className={`text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center ${isActive ? "bg-primary/10" : "bg-muted"}`} style={{ fontWeight: 600, color: isActive ? "#0A77FF" : "#475569" }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-auto flex-1">
        <Table style={{ tableLayout: "fixed", width: `${totalW}px` }}>
          <TableHeader className="sticky top-0 z-20 bg-card">
            <TableRow className={`bg-muted/30 hover:bg-muted/30 ${density === "condensed" ? "[&>th]:h-8" : "[&>th]:h-9"}`}>
              <TableHead className="sticky left-0 z-20 bg-[#f8fafc]" style={{ width: CHECKBOX_W, minWidth: CHECKBOX_W, maxWidth: CHECKBOX_W, paddingLeft: 8, paddingRight: 0 }}>
                <Checkbox checked={allSelected ? true : someSelected ? "indeterminate" : false} onCheckedChange={() => { if (allSelected) setSelectedRows(new Set()); else setSelectedRows(new Set(filtered.map(r => r.id))); }} />
              </TableHead>
              {cols.map(c => (
                <TableHead key={c.key} className={`whitespace-nowrap ${c.sticky === "left" ? "sticky z-20 bg-[#f8fafc]" : ""} ${c.align === "right" ? "text-right" : ""}`} style={{ width: c.width, minWidth: c.width, maxWidth: c.width, ...(c.sticky === "left" ? { left: CHECKBOX_W, boxShadow: "inset -1px 0 0 0 rgba(0,0,0,0.08), 3px 0 6px -2px rgba(0,0,0,0.06)" } : {}) }}>
                  {c.label}
                </TableHead>
              ))}
              <TableHead className="whitespace-nowrap sticky right-0 z-20 bg-[#f8fafc] !pl-2 !pr-2" style={{ width: ACTIONS_W, minWidth: ACTIONS_W, maxWidth: ACTIONS_W, boxShadow: "inset 1px 0 0 0 rgba(0,0,0,0.08)" }}><span className="text-[13px]">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={cols.length + 2} className="text-center py-12 text-muted-foreground">No quotes found.</TableCell></TableRow>
            ) : filtered.map((qt) => (
              <TableRow key={qt.id} className={`cursor-pointer group hover:bg-[#F0F7FF] ${density === "condensed" ? "[&>td]:py-1 [&>td]:pl-4 [&>td]:pr-2" : "[&>td]:py-2 [&>td]:pl-4 [&>td]:pr-2"}`}>
                <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-[#F0F7FF]" style={{ width: CHECKBOX_W, minWidth: CHECKBOX_W, maxWidth: CHECKBOX_W, paddingLeft: 8, paddingRight: 0 }}>
                  <Checkbox checked={selectedRows.has(qt.id)} onCheckedChange={() => setSelectedRows(prev => { const n = new Set(prev); if (n.has(qt.id)) n.delete(qt.id); else n.add(qt.id); return n; })} onClick={(e) => e.stopPropagation()} />
                </TableCell>
                {cols.map(c => (
                  <TableCell key={c.key} className={`${c.sticky === "left" ? "sticky z-10 bg-card group-hover:bg-[#F0F7FF]" : ""} ${c.align === "right" ? "text-right tabular-nums" : ""}`} style={{ width: c.width, minWidth: c.width, maxWidth: c.width, overflow: "hidden", textOverflow: "ellipsis", ...(c.sticky === "left" ? { left: CHECKBOX_W, boxShadow: "inset -1px 0 0 0 rgba(0,0,0,0.08), 3px 0 6px -2px rgba(0,0,0,0.06)" } : {}) }}>
                    {renderCell(qt, c.key)}
                  </TableCell>
                ))}
                <TableCell className="sticky right-0 bg-card group-hover:bg-[#F0F7FF] z-10 !pl-2 !pr-2" style={{ boxShadow: "inset 1px 0 0 0 rgba(0,0,0,0.08)" }}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}><button className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer"><MoreHorizontal className="w-4 h-4" /></button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem>
                      <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-[#DC2626] focus:text-[#DC2626] focus:bg-[#FEF2F2]"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center px-4 py-3 border-t border-border gap-3">
        <span className="text-sm text-muted-foreground">Records per page</span>
        <span className="text-sm px-2 py-1 border border-border rounded-md" style={{ fontWeight: 500 }}>20</span>
        <div className="flex items-center gap-1 ml-4">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled><ChevronsLeft className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-sm text-muted-foreground" disabled><ChevronLeft className="w-3.5 h-3.5" /> Prev</Button>
          <Button size="sm" className="h-8 w-8 p-0 text-sm bg-primary text-primary-foreground">1</Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-sm text-muted-foreground" disabled>Next <ChevronRight className="w-3.5 h-3.5" /></Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled><ChevronsRight className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}
