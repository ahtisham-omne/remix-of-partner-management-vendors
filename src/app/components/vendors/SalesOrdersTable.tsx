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
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { getAvatarTint } from "../../utils/avatarTints";

/* ─── Column config ─── */
type ColKey = "so_no" | "quote_no" | "customer" | "status" | "poc" | "sales_rep" | "order_value" | "invoiced" | "payments" | "order_date" | "ship_by" | "delivery_date" | "created_on" | "created_by" | "priority" | "warehouse";

const ALL_COLUMNS: { key: ColKey; label: string; width: number; sticky?: "left"; align?: "right" }[] = [
  { key: "so_no", label: "Sales Order #", width: 180, sticky: "left" },
  { key: "quote_no", label: "Quote #", width: 150 },
  { key: "customer", label: "Customer Name", width: 230 },
  { key: "status", label: "Order Status", width: 165 },
  { key: "poc", label: "POC", width: 145 },
  { key: "sales_rep", label: "Sales Rep", width: 165 },
  { key: "order_value", label: "Order Value", width: 130, align: "right" },
  { key: "invoiced", label: "Invoiced Amount", width: 145, align: "right" },
  { key: "payments", label: "Payments Made", width: 140, align: "right" },
  { key: "order_date", label: "Order Date", width: 115 },
  { key: "ship_by", label: "Ship By", width: 115 },
  { key: "delivery_date", label: "Delivery Date", width: 120 },
  { key: "created_on", label: "Created On", width: 115 },
  { key: "created_by", label: "Created By", width: 155 },
  { key: "priority", label: "Priority", width: 110 },
  { key: "warehouse", label: "Warehouse", width: 155 },
];

const DEFAULT_VISIBLE: ColKey[] = ["so_no", "quote_no", "customer", "status", "poc", "sales_rep", "order_value", "invoiced", "payments"];

/* ─── Data ─── */
const SO_DATA = [
  { id: "SO-000-000-000", version: "v1", quoteNo: "Q-000-100-001", customer: "Metro City Fire & Rescue", customerCode: "MC", status: "Draft", poc: "Meredith", pocExtra: 0, salesRep: "Sarah Lindquist", salesRepCode: "SL", orderValue: 206232, invoiced: null as number | null, payments: null as number | null, orderDate: "01/10/2025", shipBy: "03/10/2025", deliveryDate: "04/10/2025", createdOn: "01/07/2025", createdBy: "Emily Chen", createdByCode: "EC", priority: "Low", warehouse: "Main Warehouse" },
  { id: "SO-000-000-001", version: "v2", quoteNo: "—", customer: "Tri-County EMS Authority", customerCode: "TE", status: "Draft", poc: "Toby", pocExtra: 0, salesRep: "Michael Tran", salesRepCode: "MT", orderValue: 162594, invoiced: null, payments: null, orderDate: "02/11/2025", shipBy: "04/11/2025", deliveryDate: "05/11/2025", createdOn: "02/08/2025", createdBy: "Adrian User", createdByCode: "AU", priority: "Standard", warehouse: "Main Warehouse" },
  { id: "SO-000-000-002", version: "v3", quoteNo: "Q-000-102-007", customer: "Lakewood Community Hospital", customerCode: "LC", status: "Pending Review", poc: "Robert", pocExtra: 1, salesRep: "Emily Rios", salesRepCode: "ER", orderValue: 77981, invoiced: 38991, payments: null, orderDate: "03/12/2025", shipBy: "05/12/2025", deliveryDate: "06/12/2025", createdOn: "03/09/2025", createdBy: "System Import", createdByCode: "SI", priority: "High", warehouse: "Main Warehouse" },
  { id: "SO-000-000-003", version: "v4", quoteNo: "Q-000-103-010", customer: "Pinecrest Volunteer Fire", customerCode: "PV", status: "Cleared by Ops", poc: "Ryan", pocExtra: 0, salesRep: "David Kowalski", salesRepCode: "DK", orderValue: 74493, invoiced: null, payments: 18623, orderDate: "04/13/2025", shipBy: "06/13/2025", deliveryDate: "07/13/2025", createdOn: "04/10/2025", createdBy: "Marcus Taylor", createdByCode: "MT", priority: "Low", warehouse: "Main Warehouse" },
  { id: "SO-000-000-004", version: "v1", quoteNo: "—", customer: "Summit Regional Medical", customerCode: "SR", status: "Cleared by Ops", poc: "Kevin", pocExtra: 1, salesRep: "Jessica Mbeki", salesRepCode: "JM", orderValue: 174101, invoiced: 174102, payments: null, orderDate: "05/14/2025", shipBy: "07/14/2025", deliveryDate: "08/14/2025", createdOn: "05/11/2025", createdBy: "Adrian User", createdByCode: "AU", priority: "Standard", warehouse: "East Hub" },
  { id: "SO-000-000-005", version: "v2", quoteNo: "Q-000-105-016", customer: "Eagle County Sheriff's Office", customerCode: "EC", status: "Partially Shipped", poc: "Pam", pocExtra: 0, salesRep: "Robert Navarro", salesRepCode: "RN", orderValue: 48438, invoiced: null, payments: 24219, orderDate: "06/15/2025", shipBy: "08/15/2025", deliveryDate: "09/15/2025", createdOn: "06/12/2025", createdBy: "David Park", createdByCode: "DP", priority: "High", warehouse: "Main Warehouse" },
  { id: "SO-000-000-006", version: "v1", quoteNo: "Q-000-106-019", customer: "Pacific Northwest Ambulance", customerCode: "PN", status: "Shipped", poc: "Holly", pocExtra: 1, salesRep: "Amanda Chen", salesRepCode: "AC", orderValue: 66042, invoiced: 33021, payments: 16511, orderDate: "07/16/2025", shipBy: "10/16/2025", deliveryDate: "10/16/2025", createdOn: "07/13/2025", createdBy: "Emily Chen", createdByCode: "EC", priority: "Low", warehouse: "West Depot" },
  { id: "SO-000-000-007", version: "v4", quoteNo: "—", customer: "Riverside Utility District", customerCode: "RU", status: "Shipped", poc: "Creed", pocExtra: 0, salesRep: "James Hatfield", salesRepCode: "JH", orderValue: 89370, invoiced: null, payments: null, orderDate: "08/17/2025", shipBy: "10/17/2025", deliveryDate: "11/17/2025", createdOn: "08/14/2025", createdBy: "Emily Chen", createdByCode: "EC", priority: "Standard", warehouse: "Main Warehouse" },
  { id: "SO-000-000-008", version: "v1", quoteNo: "Q-000-108-025", customer: "Heartland Air Ambulance", customerCode: "HA", status: "Shipped", poc: "Meredith", pocExtra: 1, salesRep: "Sarah Lindquist", salesRepCode: "SL", orderValue: 300672, invoiced: 300672, payments: null, orderDate: "09/18/2025", shipBy: "11/18/2025", deliveryDate: "12/18/2025", createdOn: "09/15/2025", createdBy: "System Import", createdByCode: "SI", priority: "High", warehouse: "Main Warehouse" },
  { id: "SO-000-000-009", version: "v2", quoteNo: "Q-000-109-028", customer: "Great Plains Fire Protection", customerCode: "GP", status: "Cancelled", poc: "Ryan", pocExtra: 0, salesRep: "Michael Tran", salesRepCode: "MT", orderValue: 344039, invoiced: null, payments: 86010, orderDate: "10/19/2025", shipBy: "12/19/2025", deliveryDate: "12/19/2025", createdOn: "10/16/2025", createdBy: "Marcus Taylor", createdByCode: "MT", priority: "Low", warehouse: "East Hub" },
  { id: "SO-000-000-010", version: "v3", quoteNo: "—", customer: "Coastal Search & Rescue", customerCode: "CS", status: "Cleared by Ops", poc: "Kevin", pocExtra: 0, salesRep: "Emily Rios", salesRepCode: "ER", orderValue: 150012, invoiced: 75006, payments: 75006, orderDate: "11/20/2025", shipBy: "12/20/2025", deliveryDate: "12/20/2025", createdOn: "11/17/2025", createdBy: "James Rodriguez", createdByCode: "JR", priority: "Standard", warehouse: "Main Warehouse" },
  { id: "SO-000-000-011", version: "v4", quoteNo: "Q-000-111-034", customer: "Valley Health Systems", customerCode: "VH", status: "Cleared by Ops", poc: "Robert", pocExtra: 1, salesRep: "David Kowalski", salesRepCode: "DK", orderValue: 162594, invoiced: null, payments: null, orderDate: "12/21/2025", shipBy: "12/21/2025", deliveryDate: "12/21/2025", createdOn: "12/18/2025", createdBy: "Emily Chen", createdByCode: "EC", priority: "High", warehouse: "Main Warehouse" },
  { id: "SO-000-000-012", version: "v1", quoteNo: "Q-000-112-037", customer: "Northern Plains Medical", customerCode: "NP", status: "Partially Shipped", poc: "Holly", pocExtra: 0, salesRep: "Jessica Mbeki", salesRepCode: "JM", orderValue: 74191, invoiced: 74190, payments: 18548, orderDate: "01/22/2025", shipBy: "03/22/2025", deliveryDate: "04/22/2025", createdOn: "01/19/2025", createdBy: "Emily Chen", createdByCode: "EC", priority: "Low", warehouse: "Main Warehouse" },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Draft": { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
  "Pending Review": { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  "Cleared by Ops": { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  "Partially Shipped": { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  "Shipped": { bg: "#F0FDFA", text: "#115E59", border: "#99F6E4" },
  "Cancelled": { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
};

const PRIORITY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Low": { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  "Standard": { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  "High": { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
};

const FILTER_TABS = [
  { key: "all", label: "Show All" }, { key: "Draft", label: "Draft" }, { key: "Pending Review", label: "Pending Review" },
  { key: "Cleared by Ops", label: "Cleared by Ops" }, { key: "Partially Shipped", label: "Partially Shipped" },
  { key: "Shipped", label: "Shipped" }, { key: "Cancelled", label: "Cancelled" },
];

const CHECKBOX_W = 40;
const ACTIONS_W = 60;
const fmt = (n: number | null) => n == null ? "—" : `$${n.toLocaleString()}`;

export function SalesOrdersTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [density, setDensity] = useState<"condensed" | "comfort">("condensed");
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(new Set(DEFAULT_VISIBLE));
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const toggleCol = (k: ColKey) => setVisibleCols(prev => { const n = new Set(prev); if (n.has(k)) { if (n.size > 1) n.delete(k); } else n.add(k); return n; });
  const cols = ALL_COLUMNS.filter(c => visibleCols.has(c.key));
  const isRelaxed = density === "comfort";

  const filtered = useMemo(() => {
    let rows = SO_DATA;
    if (statusFilter !== "all") rows = rows.filter(r => r.status === statusFilter);
    if (search) { const q = search.toLowerCase(); rows = rows.filter(r => r.id.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q) || r.salesRep.toLowerCase().includes(q)); }
    return rows;
  }, [search, statusFilter]);

  const filterCounts = useMemo(() => {
    const c: Record<string, number> = { all: SO_DATA.length };
    SO_DATA.forEach(r => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, []);

  const totalW = CHECKBOX_W + cols.reduce((s, c) => s + c.width, 0) + ACTIONS_W;
  const allSelected = filtered.length > 0 && filtered.every(r => selectedRows.has(r.id));
  const someSelected = filtered.some(r => selectedRows.has(r.id));

  const renderCell = (so: typeof SO_DATA[0], key: ColKey) => {
    const tint = getAvatarTint(so.customer);
    const repTint = getAvatarTint(so.salesRep);
    const cbTint = getAvatarTint(so.createdBy);
    const sz = isRelaxed ? "text-[13.5px]" : "text-sm";
    switch (key) {
      case "so_no": return (<div className="flex items-center gap-2"><span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]" style={{ fontWeight: 600 }}>{so.version}</span><span className={`${sz} text-[#0A77FF] cursor-pointer hover:underline`} style={{ fontWeight: 500 }}>{so.id}</span></div>);
      case "quote_no": return <span className={`${sz} text-[#64748B]`}>{so.quoteNo}</span>;
      case "customer": return (<div className={`flex items-center ${isRelaxed ? "gap-3" : "gap-2.5"}`}><div className={`${isRelaxed ? "w-8 h-8" : "w-7 h-7"} rounded-lg flex items-center justify-center shrink-0 text-[9px]`} style={{ backgroundColor: tint.bg, color: tint.fg, fontWeight: 700 }}>{so.customerCode}</div><span className={`${sz} truncate`} style={{ fontWeight: 500, color: "#1E293B" }}>{so.customer}</span></div>);
      case "status": { const ss = STATUS_STYLES[so.status] || STATUS_STYLES.Draft; return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap" style={{ fontWeight: 500, backgroundColor: ss.bg, color: ss.text, borderColor: ss.border }}>{so.status}</span>; }
      case "poc": return (<div className="flex items-center gap-1"><span className={`${sz} text-[#334155]`}>{so.poc}</span>{so.pocExtra > 0 && <Tooltip><TooltipTrigger asChild><span className="text-[11px] shrink-0 cursor-default leading-none hover:underline" style={{ fontWeight: 600, color: "#085FCC" }}>+{so.pocExtra} more</span></TooltipTrigger><TooltipContent side="bottom" className="z-[300]"><span className="text-[11px]">{so.pocExtra} more contact{so.pocExtra > 1 ? "s" : ""}</span></TooltipContent></Tooltip>}</div>);
      case "sales_rep": return (<div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[8px]" style={{ backgroundColor: repTint.bg, color: repTint.fg, fontWeight: 700 }}>{so.salesRepCode}</div><span className={`${sz} text-[#334155] truncate`}>{so.salesRep}</span></div>);
      case "order_value": return <span className={sz} style={{ fontWeight: 500 }}>{fmt(so.orderValue)}</span>;
      case "invoiced": return <span className={`${sz} text-[#64748B]`}>{fmt(so.invoiced)}</span>;
      case "payments": return <span className={`${sz} text-[#64748B]`}>{fmt(so.payments)}</span>;
      case "order_date": return <span className={`${sz} text-[#64748B]`}>{so.orderDate}</span>;
      case "ship_by": return <span className={`${sz} text-[#64748B]`}>{so.shipBy}</span>;
      case "delivery_date": return <span className={`${sz} text-[#64748B]`}>{so.deliveryDate}</span>;
      case "created_on": return <span className={`${sz} text-[#64748B]`}>{so.createdOn}</span>;
      case "created_by": return (<div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[8px]" style={{ backgroundColor: cbTint.bg, color: cbTint.fg, fontWeight: 700 }}>{so.createdByCode}</div><span className={`${sz} text-[#334155] truncate`}>{so.createdBy}</span></div>);
      case "priority": { const ps = PRIORITY_STYLES[so.priority] || PRIORITY_STYLES.Low; return <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] whitespace-nowrap" style={{ fontWeight: 500, backgroundColor: ps.bg, color: ps.text, borderColor: ps.border }}>{so.priority}</span>; }
      case "warehouse": return <span className={`${sz} text-[#64748B] truncate block`}>{so.warehouse}</span>;
      default: return <span>—</span>;
    }
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-clip flex flex-col">
      {/* Toolbar */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-[#F1F5F9] flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-8 h-9 text-sm bg-white border-border/80 shadow-sm placeholder:text-muted-foreground/50" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <button className="inline-flex items-center justify-center h-9 gap-1.5 px-3 rounded-lg border border-border/80 bg-white shadow-sm hover:bg-muted/50 transition-colors text-foreground cursor-pointer"><SlidersHorizontal className="w-3.5 h-3.5" /><span className="text-sm" style={{ fontWeight: 500 }}>Filters</span></button>
        <span className="text-sm tabular-nums ml-auto" style={{ fontWeight: 500 }}><span className="text-foreground">{filtered.length}</span><span className="text-muted-foreground/70"> orders</span></span>
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
              <TableRow><TableCell colSpan={cols.length + 2} className="text-center py-12 text-muted-foreground">No sales orders found.</TableCell></TableRow>
            ) : filtered.map((so) => (
              <TableRow key={so.id} className={`cursor-pointer group hover:bg-[#F0F7FF] ${density === "condensed" ? "[&>td]:py-1 [&>td]:pl-4 [&>td]:pr-2" : "[&>td]:py-2 [&>td]:pl-4 [&>td]:pr-2"}`}>
                <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-[#F0F7FF]" style={{ width: CHECKBOX_W, minWidth: CHECKBOX_W, maxWidth: CHECKBOX_W, paddingLeft: 8, paddingRight: 0 }}>
                  <Checkbox checked={selectedRows.has(so.id)} onCheckedChange={() => setSelectedRows(prev => { const n = new Set(prev); if (n.has(so.id)) n.delete(so.id); else n.add(so.id); return n; })} onClick={(e) => e.stopPropagation()} />
                </TableCell>
                {cols.map(c => (
                  <TableCell key={c.key} className={`${c.sticky === "left" ? "sticky z-10 bg-card group-hover:bg-[#F0F7FF]" : ""} ${c.align === "right" ? "text-right tabular-nums" : ""}`} style={{ width: c.width, minWidth: c.width, maxWidth: c.width, overflow: "hidden", textOverflow: "ellipsis", ...(c.sticky === "left" ? { left: CHECKBOX_W, boxShadow: "inset -1px 0 0 0 rgba(0,0,0,0.08), 3px 0 6px -2px rgba(0,0,0,0.06)" } : {}) }}>
                    {renderCell(so, c.key)}
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
