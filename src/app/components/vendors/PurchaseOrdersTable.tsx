import React, { useState, useMemo, useRef, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { OverflowTooltip } from "./OverflowTooltip";
import {
  Search, X, SlidersHorizontal, MoreHorizontal, Eye, Copy, Printer, FileDown,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, AlignJustify, List, Check, ChevronDown, Columns3, GripVertical,
} from "lucide-react";
import { getAvatarTint } from "../../utils/avatarTints";

/* ─── Column config ─── */
type ColKey = "po_no" | "vendor" | "status" | "items" | "poc" | "location" | "created_by" | "due_date" | "order_date";

interface ColDef { key: ColKey; label: string; defaultWidth: number; minWidth: number; sticky?: "left"; align?: "right"; locked?: boolean }

const COLUMN_DEFS: ColDef[] = [
  { key: "po_no", label: "PO No", defaultWidth: 160, minWidth: 120, sticky: "left", locked: true },
  { key: "vendor", label: "Vendor", defaultWidth: 220, minWidth: 160, sticky: "left" },
  { key: "status", label: "Status", defaultWidth: 195, minWidth: 120 },
  { key: "items", label: "Ordered Item(s)", defaultWidth: 180, minWidth: 130 },
  { key: "poc", label: "Point of Contact", defaultWidth: 180, minWidth: 130 },
  { key: "location", label: "Location", defaultWidth: 200, minWidth: 130 },
  { key: "created_by", label: "Created By", defaultWidth: 170, minWidth: 120 },
  { key: "due_date", label: "Due Delivery Date", defaultWidth: 150, minWidth: 110 },
  { key: "order_date", label: "Order Date", defaultWidth: 130, minWidth: 100 },
];

const colDef = (key: string) => COLUMN_DEFS.find(c => c.key === key)!;

/* ─── Person photo helper ─── */
function getCreatorPhoto(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const abs = Math.abs(hash);
  return `https://randomuser.me/api/portraits/${abs % 2 === 0 ? "men" : "women"}/${(abs % 99) + 1}.jpg`;
}

/* ─── Data ─── */
const PO_DATA = [
  { id: "395-9900", version: "v4", vendor: "General Motors (GM)", vendorCode: "GM", status: "Confirmed", items: "HYD-4420-A1", itemCount: 5, poc: "Richard Kowalski", location: "Omne Warehouse Network", createdBy: "Areeb Tanvir", dueDate: "Mar 22, 2026", orderDate: "Feb 20, 2026" },
  { id: "395-9825", version: "v1", vendor: "General Motors (GM)", vendorCode: "GM", status: "Draft", items: "BPA-4210-R2", itemCount: 1, poc: "Sherry Brown", location: "Pasadena, Oklahoma", createdBy: "Areeb Tanvir", dueDate: "Dec 22, 2024", orderDate: "Dec 08, 2024" },
  { id: "395-9823", version: "v1", vendor: "Toyota Technical Center", vendorCode: "TT", status: "Sent", items: "CLP-2290-M3", itemCount: 2, poc: "Cameron Williamson", location: "Great Falls, Maryland", createdBy: "Shehryar Hasan", dueDate: "Dec 08, 2024", orderDate: "Nov 24, 2024" },
  { id: "395-9824", version: "v1", vendor: "Ford Motor Company", vendorCode: "FM", status: "Active with Cancellation", items: "AFE-5520-K1", itemCount: 2, poc: "Leslie Alexander", location: "Lansing, Illinois", createdBy: "Nophil Anwer", dueDate: "Nov 24, 2024", orderDate: "Nov 10, 2024" },
  { id: "395-9826", version: "v1", vendor: "Tesla, Inc.", vendorCode: "TI", status: "Draft", items: "RDC-4450-CU", itemCount: 4, poc: "Jerome Bell", location: "Pasadena, Oklahoma", createdBy: "Irtaza Abid", dueDate: "Nov 10, 2024", orderDate: "Oct 27, 2024" },
  { id: "395-9827", version: "v1", vendor: "Chrysler (Stellantis N.V.)", vendorCode: "CS", status: "Sent", items: "CVJ-5590-ST", itemCount: 1, poc: "Marvin McKinney", location: "Portland, Illinois", createdBy: "Eli Rosenbloom", dueDate: "Oct 27, 2024", orderDate: "Oct 13, 2024" },
  { id: "395-9828", version: "v1", vendor: "Rivian Automotive", vendorCode: "RA", status: "Active with Cancellation", items: "BPA-4210-R2", itemCount: 1, poc: "Brooklyn Simmons", location: "Lafayette, California", createdBy: "—", dueDate: "Oct 13, 2024", orderDate: "Sep 29, 2024" },
  { id: "395-9829", version: "v1", vendor: "Lucid Motors", vendorCode: "LM", status: "Confirmed", items: "CLP-2290-M3", itemCount: 3, poc: "Savannah Nguyen", location: "Stockton, New Hampshire", createdBy: "Areeb Tanvir", dueDate: "Sep 15, 2024", orderDate: "Sep 15, 2024" },
  { id: "395-9830", version: "v1", vendor: "Honda Motor Co., Ltd.", vendorCode: "HM", status: "Partially Received", items: "AFE-5520-K1", itemCount: 4, poc: "Leslie Alexander", location: "Great Falls, Maryland", createdBy: "Shehryar Hasan", dueDate: "Sep 15, 2024", orderDate: "Sep 01, 2024" },
  { id: "395-9831", version: "v1", vendor: "Nissan North America", vendorCode: "NA", status: "Cancelled", items: "RDC-4450-CU", itemCount: 1, poc: "Jerome Bell", location: "Lansing, Illinois", createdBy: "Nophil Anwer", dueDate: "Sep 01, 2024", orderDate: "Aug 18, 2024" },
  { id: "395-9832", version: "v1", vendor: "BMW of North America", vendorCode: "BN", status: "Fully Received", items: "CVJ-5590-ST", itemCount: 2, poc: "Cameron Williamson", location: "Pasadena, Oklahoma", createdBy: "Irtaza Abid", dueDate: "Aug 18, 2024", orderDate: "Aug 04, 2024" },
  { id: "395-9833", version: "v1", vendor: "General Motors (GM)", vendorCode: "GM", status: "Confirmed", items: "BPA-4210-R2", itemCount: 3, poc: "Sherry Brown", location: "Pasadena, Oklahoma", createdBy: "Eli Rosenbloom", dueDate: "Aug 04, 2024", orderDate: "Jul 21, 2024" },
  { id: "395-9834", version: "v1", vendor: "Toyota Technical Center", vendorCode: "TT", status: "Partially Received", items: "CLP-2290-M3", itemCount: 4, poc: "Cameron Williamson", location: "Great Falls, Maryland", createdBy: "—", dueDate: "Jul 21, 2024", orderDate: "Jul 07, 2024" },
  { id: "395-9835", version: "v1", vendor: "Ford Motor Company", vendorCode: "FM", status: "Active with Cancellation", items: "AFE-5520-K1", itemCount: 0, poc: "Leslie Alexander", location: "Lansing, Illinois", createdBy: "Areeb Tanvir", dueDate: "Jul 07, 2024", orderDate: "Jun 23, 2024" },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Confirmed": { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  "Draft": { bg: "#F1F5F9", text: "#475569", border: "#CBD5E1" },
  "Sent": { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  "Active with Cancellation": { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  "Partially Received": { bg: "#F5F3FF", text: "#5B21B6", border: "#DDD6FE" },
  "Cancelled": { bg: "#FEF2F2", text: "#991B1B", border: "#FECACA" },
  "Fully Received": { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
};

const FILTER_TABS = [
  { key: "all", label: "Show All" }, { key: "Draft", label: "Draft" }, { key: "Sent", label: "Sent" },
  { key: "Confirmed", label: "Confirmed" }, { key: "Partially Received", label: "Partially Received" }, { key: "Fully Received", label: "Fully Received" },
];

const CHECKBOX_W = 40;
const ACTIONS_W = 60;
const MIN_COL_W = 80;

export function PurchaseOrdersTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [density, setDensity] = useState<"condensed" | "comfort">("condensed");
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = useState<ColKey[]>(COLUMN_DEFS.map(c => c.key));
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isResizing, setIsResizing] = useState(false);
  const [resizingColumnKey, setResizingColumnKey] = useState<string | null>(null);
  const [draggingColumnKey, setDraggingColumnKey] = useState<string | null>(null);

  const resizeRef = useRef<{ columnKey: string; startX: number; startWidth: number } | null>(null);
  const colDragRef = useRef<{ columnKey: string; startX: number; startY: number; isDragging: boolean; lastSwapTime: number } | null>(null);
  const suppressNextClickRef = useRef(false);
  const ghostElRef = useRef<HTMLDivElement>(null);

  const toggleColVis = (k: ColKey) => setColumnVisibility(prev => ({ ...prev, [k]: prev[k] === false ? true : (prev[k] === undefined ? false : !prev[k]) }));

  const visibleColumns = useMemo(() => {
    return columnOrder.filter(k => columnVisibility[k] !== false);
  }, [columnOrder, columnVisibility]);

  const getWidth = (key: string) => columnWidths[key] ?? colDef(key).defaultWidth;
  const isRelaxed = density === "comfort";
  const sz = isRelaxed ? "text-[13.5px]" : "text-sm";

  /* ─── Column resize ─── */
  const handleResizeStart = useCallback((e: React.MouseEvent, columnKey: string) => {
    e.preventDefault(); e.stopPropagation();
    resizeRef.current = { columnKey, startX: e.clientX, startWidth: getWidth(columnKey) };
    setIsResizing(true); setResizingColumnKey(columnKey);
    const onMove = (me: MouseEvent) => {
      if (!resizeRef.current) return;
      const nw = Math.max(MIN_COL_W, resizeRef.current.startWidth + (me.clientX - resizeRef.current.startX));
      setColumnWidths(prev => ({ ...prev, [resizeRef.current!.columnKey]: nw }));
    };
    const onUp = () => { resizeRef.current = null; setIsResizing(false); setResizingColumnKey(null); document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); document.body.style.cursor = ""; document.body.style.userSelect = ""; };
    document.addEventListener("mousemove", onMove); document.addEventListener("mouseup", onUp);
    document.body.style.cursor = "col-resize"; document.body.style.userSelect = "none";
  }, [columnWidths]);

  /* ─── Column drag reorder (matches ContactsDirectoryPage) ─── */
  const handleHeaderMouseDown = useCallback((e: React.MouseEvent, columnKey: string) => {
    if (colDef(columnKey).locked || isResizing || e.button !== 0) return;
    const startX = e.clientX;
    const startY = e.clientY;
    colDragRef.current = { columnKey, startX, startY, isDragging: false, lastSwapTime: 0 };

    const DRAG_THRESHOLD = 5;
    const SWAP_SETTLE_MS = 60;

    const onMove = (moveEvt: MouseEvent) => {
      if (!colDragRef.current) return;
      const dx = moveEvt.clientX - colDragRef.current.startX;
      const dy = moveEvt.clientY - colDragRef.current.startY;

      if (!colDragRef.current.isDragging) {
        if (Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) return;
        colDragRef.current.isDragging = true;
        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
        setDraggingColumnKey(colDragRef.current.columnKey);
      }

      // Update ghost position
      const ghost = ghostElRef.current;
      if (ghost) ghost.style.transform = `translate(${moveEvt.clientX}px, ${moveEvt.clientY}px)`;

      // Edge-trigger swap with cooldown
      const now = performance.now();
      if (now - colDragRef.current.lastSwapTime < SWAP_SETTLE_MS) return;

      const cursorX = moveEvt.clientX;
      const draggedKey = colDragRef.current.columnKey;
      const draggedTh = document.querySelector<HTMLElement>(`th[data-col-drag-key="${draggedKey}"]`);
      if (!draggedTh) return;
      const draggedRect = draggedTh.getBoundingClientRect();
      if (cursorX >= draggedRect.left && cursorX <= draggedRect.right) return;

      const allThs = document.querySelectorAll<HTMLElement>("th[data-col-drag-key]");
      for (const th of allThs) {
        const rect = th.getBoundingClientRect();
        if (cursorX < rect.left || cursorX > rect.right) continue;
        const k = th.getAttribute("data-col-drag-key");
        if (!k || k === draggedKey || colDef(k as ColKey)?.locked) break;
        setColumnOrder(prev => {
          const si = prev.indexOf(draggedKey as ColKey);
          const ti = prev.indexOf(k as ColKey);
          if (si === -1 || ti === -1 || si === ti) return prev;
          const n = [...prev]; n.splice(si, 1); n.splice(ti, 0, draggedKey as ColKey); return n;
        });
        colDragRef.current.lastSwapTime = now;
        break;
      }
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      if (colDragRef.current?.isDragging) {
        suppressNextClickRef.current = true;
        requestAnimationFrame(() => { suppressNextClickRef.current = false; });
      }
      colDragRef.current = null;
      setDraggingColumnKey(null);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [isResizing]);

  /* ─── Sticky offsets ─── */
  const { stickyOffsets, lastStickyKey } = useMemo(() => {
    const stickyCols = visibleColumns.filter(k => colDef(k).sticky === "left");
    const offsets: Record<string, number> = {};
    let left = CHECKBOX_W;
    for (const k of stickyCols) { offsets[k] = left; left += getWidth(k); }
    return { stickyOffsets: offsets, lastStickyKey: stickyCols[stickyCols.length - 1] || null };
  }, [visibleColumns, columnWidths]);

  const filtered = useMemo(() => {
    let rows = PO_DATA;
    if (statusFilter !== "all") rows = rows.filter(r => r.status === statusFilter);
    if (search) { const q = search.toLowerCase(); rows = rows.filter(r => r.id.toLowerCase().includes(q) || r.vendor.toLowerCase().includes(q) || r.poc.toLowerCase().includes(q)); }
    return rows;
  }, [search, statusFilter]);

  const filterCounts = useMemo(() => { const c: Record<string, number> = { all: PO_DATA.length }; PO_DATA.forEach(r => { c[r.status] = (c[r.status] || 0) + 1; }); return c; }, []);

  const totalW = CHECKBOX_W + visibleColumns.reduce((s, k) => s + getWidth(k), 0) + ACTIONS_W;
  const allSelected = filtered.length > 0 && filtered.every(r => selectedRows.has(r.id));
  const someSelected = filtered.some(r => selectedRows.has(r.id));

  const renderCell = (po: typeof PO_DATA[0], key: ColKey) => {
    const tint = getAvatarTint(po.vendor);
    switch (key) {
      case "po_no": return (<div className="flex items-center gap-2"><span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B]" style={{ fontWeight: 600 }}>{po.version}</span><span className={`${sz} text-[#0A77FF] cursor-pointer hover:underline`} style={{ fontWeight: 500 }}>{po.id}</span></div>);
      case "vendor": return (<div className={`flex items-center ${isRelaxed ? "gap-3" : "gap-2.5"}`}><div className={`${isRelaxed ? "w-8 h-8" : "w-7 h-7"} rounded-lg flex items-center justify-center shrink-0 text-[9px]`} style={{ backgroundColor: tint.bg, color: tint.fg, fontWeight: 700 }}>{po.vendorCode}</div><span className={`${sz} truncate`} style={{ fontWeight: 500, color: "#1E293B" }}>{po.vendor}</span></div>);
      case "status": { const ss = STATUS_STYLES[po.status] || STATUS_STYLES.Draft; return <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap" style={{ fontWeight: 500, backgroundColor: ss.bg, color: ss.text, borderColor: ss.border }}>{po.status}</span>; }
      case "items": {
        const overflowItems = po.itemCount > 0 ? Array.from({ length: po.itemCount }, (_, i) => ({
          id: `${po.id}-item-${i}`,
          name: `${po.items.replace(/\d+$/, String(Number(po.items.match(/\d+$/)?.[0] || "0") + i + 1))}`,
          subtitle: `Qty: ${Math.floor(Math.random() * 20) + 1}`,
        })) : [];
        return (
          <div className="flex items-center gap-1.5">
            <span className={`${sz} text-[#334155]`} style={{ fontWeight: 500 }}>{po.items}</span>
            {po.itemCount > 0 && po.itemCount < 10 ? (
              <OverflowTooltip category="Ordered Items" items={overflowItems}>
                <span className="text-[11px] shrink-0 cursor-default leading-none" style={{ fontWeight: 600, color: "#085FCC" }}>+{po.itemCount} more</span>
              </OverflowTooltip>
            ) : po.itemCount >= 10 ? (
              <span className="text-[11px] shrink-0 cursor-pointer leading-none hover:underline" style={{ fontWeight: 600, color: "#085FCC" }}>+{po.itemCount} more</span>
            ) : null}
          </div>
        );
      }
      case "poc": return <span className={`${sz} text-[#334155] truncate block`}>{po.poc}</span>;
      case "location": return <span className={`${sz} text-[#64748B] truncate block`}>{po.location}</span>;
      case "created_by": {
        if (po.createdBy === "—") return <span className={`${sz} text-[#64748B]`}>—</span>;
        const cbTint = getAvatarTint(po.createdBy);
        const cbInitials = po.createdBy.split(" ").map(w => w[0]).join("").toUpperCase();
        const cbPhoto = getCreatorPhoto(po.createdBy);
        return (
          <div className={`flex items-center ${isRelaxed ? "gap-2.5" : "gap-2"}`}>
            <div className={`${isRelaxed ? "w-7 h-7" : "w-6 h-6"} rounded-lg shrink-0 overflow-hidden`} style={{ backgroundColor: cbTint.bg }}>
              <img src={cbPhoto} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <span className={`${sz} text-[#334155] truncate`} style={{ fontWeight: 500 }}>{po.createdBy}</span>
          </div>
        );
      }
      case "due_date": return <span className={`${sz} text-[#64748B]`}>{po.dueDate}</span>;
      case "order_date": return <span className={`${sz} text-[#64748B]`}>{po.orderDate}</span>;
      default: return <span>—</span>;
    }
  };

  return (
    <div className="border border-border rounded-xl bg-card overflow-clip flex flex-col">
      {/* Toolbar */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-[#F1F5F9] flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
          <Input placeholder="Search by PO, partner, item..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-8 h-9 text-sm bg-white border-border/80 shadow-sm placeholder:text-muted-foreground/50" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <button className="inline-flex items-center justify-center h-9 gap-1.5 px-3 rounded-lg border border-border/80 bg-white shadow-sm hover:bg-muted/50 transition-colors text-foreground cursor-pointer"><SlidersHorizontal className="w-3.5 h-3.5" /><span className="text-sm" style={{ fontWeight: 500 }}>Filters</span></button>
        <span className="text-sm tabular-nums ml-auto" style={{ fontWeight: 500 }}><span className="text-foreground">{filtered.length}</span><span className="text-muted-foreground/70"> records</span></span>
        {/* Density */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild><button className="inline-flex items-center justify-center h-9 gap-2 px-3 rounded-lg border border-border bg-white shadow-sm hover:bg-muted/40 transition-colors cursor-pointer">{density === "condensed" ? <AlignJustify className="w-[18px] h-[18px] text-muted-foreground/80" /> : <List className="w-[18px] h-[18px] text-muted-foreground/80" />}<span className="text-sm hidden md:inline" style={{ fontWeight: 500 }}>{density === "condensed" ? "Condensed" : "Comfort"}</span><ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60" /></button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] p-1.5">
            {(["condensed", "comfort"] as const).map(d => (<DropdownMenuItem key={d} className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-md" onSelect={() => setDensity(d)}>{d === "condensed" ? <AlignJustify className="w-5 h-5 text-muted-foreground shrink-0" /> : <List className="w-5 h-5 text-muted-foreground shrink-0" />}<span className="text-sm flex-1" style={{ fontWeight: 500 }}>{d === "condensed" ? "Condensed" : "Comfort"}</span>{density === d && <Check className="w-4 h-4 shrink-0" style={{ color: "#0A77FF" }} />}</DropdownMenuItem>))}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Columns */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild><button className="inline-flex items-center justify-center h-9 gap-2 px-3 rounded-lg border border-border bg-white shadow-sm hover:bg-muted/40 transition-colors cursor-pointer"><Columns3 className="w-4 h-4 text-muted-foreground/80" /><span className="text-sm" style={{ fontWeight: 500 }}>Columns</span><span className="text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center bg-primary/10" style={{ fontWeight: 600, color: "#0A77FF" }}>{visibleColumns.length}</span></button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[220px] p-1.5 max-h-[300px] overflow-y-auto">
            {COLUMN_DEFS.map(c => (<DropdownMenuItem key={c.key} className="flex items-center gap-2.5 py-2 px-3 cursor-pointer rounded-md" onSelect={(e) => { e.preventDefault(); toggleColVis(c.key); }}><Checkbox checked={columnVisibility[c.key] !== false} className="pointer-events-none" /><span className="text-sm" style={{ fontWeight: 500 }}>{c.label}</span></DropdownMenuItem>))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Status tabs */}
      <div className="px-4 py-2 flex items-center gap-2 border-b border-[#F1F5F9] overflow-x-auto scrollbar-hide">
        {FILTER_TABS.map((tab) => { const isActive = statusFilter === tab.key; const count = filterCounts[tab.key] || 0; return (
          <button key={tab.key} onClick={() => setStatusFilter(tab.key)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${isActive ? "border-primary bg-[#EDF4FF]" : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground"}`} style={{ fontWeight: isActive ? 500 : 400, color: isActive ? "#0A77FF" : undefined }}>
            {tab.label}<span className={`text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center ${isActive ? "bg-primary/10" : "bg-muted"}`} style={{ fontWeight: 600, color: isActive ? "#0A77FF" : "#475569" }}>{count}</span>
          </button>
        ); })}
      </div>

      {/* Table */}
      <div className={`overflow-auto flex-1 ${isResizing || draggingColumnKey ? "select-none" : ""}`}>
        <Table style={{ tableLayout: "fixed", width: `${totalW}px` }}>
          <TableHeader className="sticky top-0 z-20 bg-card">
            <TableRow className={`bg-muted/30 hover:bg-muted/30 ${density === "condensed" ? "[&>th]:h-8" : "[&>th]:h-9"}`}>
              {/* Checkbox header */}
              <TableHead className="sticky left-0 z-20 bg-[#f8fafc]" style={{ width: CHECKBOX_W, minWidth: CHECKBOX_W, maxWidth: CHECKBOX_W, paddingLeft: 8, paddingRight: 0 }}>
                <Checkbox checked={allSelected ? true : someSelected ? "indeterminate" : false} onCheckedChange={() => { if (allSelected) setSelectedRows(new Set()); else setSelectedRows(new Set(filtered.map(r => r.id))); }} />
              </TableHead>
              {visibleColumns.map(key => {
                const def = colDef(key);
                const w = getWidth(key);
                const isSticky = def.sticky === "left";
                const isLastSticky = key === lastStickyKey;
                const isDragged = draggingColumnKey === key;
                const isDraggable = !def.locked;
                return (
                  <TableHead
                    key={key}
                    data-col-drag-key={key}
                    onMouseDown={isDraggable ? (e) => handleHeaderMouseDown(e, key) : undefined}
                    onClickCapture={isDraggable ? (e) => { if (suppressNextClickRef.current) { e.stopPropagation(); e.preventDefault(); } } : undefined}
                    className={`whitespace-nowrap relative group/colheader ${isSticky ? "sticky z-20 bg-[#f8fafc]" : ""} ${def.align === "right" ? "text-right" : ""} ${isDraggable ? "cursor-grab" : ""}`}
                    style={{ width: w, minWidth: w, maxWidth: w, overflow: "hidden", ...(isSticky ? { left: stickyOffsets[key], ...(!isDragged && isLastSticky ? { boxShadow: "inset -1px 0 0 0 rgba(0,0,0,0.08), 3px 0 6px -2px rgba(0,0,0,0.06)" } : {}) } : {}), ...(isDragged ? { background: "linear-gradient(180deg, rgba(10,119,255,0.08) 0%, rgba(10,119,255,0.03) 100%)" } : {}) }}
                  >
                    {/* Blue accent bar on dragged column */}
                    {isDragged && <div className="absolute top-0 left-0 right-0 h-[2px] rounded-b-full" style={{ backgroundColor: "#0A77FF" }} />}
                    {/* Drag grip icon */}
                    {isDraggable && <GripVertical className={`absolute left-1 top-1/2 -translate-y-1/2 w-3 h-3 transition-opacity z-[5] pointer-events-none ${isDragged ? "opacity-100 text-primary" : "opacity-0 group-hover/colheader:opacity-100 text-muted-foreground/40"}`} />}
                    <span className="text-[13px]">{def.label}</span>
                    {/* Resize handle */}
                    <div
                      onMouseDown={(e) => { e.stopPropagation(); handleResizeStart(e, key); }}
                      onClick={(e) => e.stopPropagation()}
                      onDoubleClick={(e) => { e.stopPropagation(); setColumnWidths(prev => ({ ...prev, [key]: def.defaultWidth })); }}
                      className="absolute right-0 top-0 bottom-0 w-[5px] cursor-col-resize z-10 group/resize"
                      style={{ touchAction: "none" }}
                    >
                      <div className={`absolute right-0 top-1 bottom-1 w-[2px] rounded-full transition-colors ${resizingColumnKey === key ? "bg-primary" : "bg-transparent group-hover/resize:bg-primary/40"}`} />
                    </div>
                  </TableHead>
                );
              })}
              {/* Actions header */}
              <TableHead className="whitespace-nowrap sticky right-0 z-20 bg-[#f8fafc] !pl-2 !pr-2" style={{ width: ACTIONS_W, minWidth: ACTIONS_W, maxWidth: ACTIONS_W, boxShadow: "inset 1px 0 0 0 rgba(0,0,0,0.08)" }}><span className="text-[13px]">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={visibleColumns.length + 2} className="text-center py-12 text-muted-foreground">No purchase orders found.</TableCell></TableRow>
            ) : filtered.map((po) => (
              <TableRow key={po.id + po.version} className={`cursor-pointer group hover:bg-[#F0F7FF] ${density === "condensed" ? "[&>td]:py-1 [&>td]:pl-4 [&>td]:pr-2" : "[&>td]:py-2 [&>td]:pl-4 [&>td]:pr-2"}`}>
                <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-[#F0F7FF]" style={{ width: CHECKBOX_W, minWidth: CHECKBOX_W, maxWidth: CHECKBOX_W, paddingLeft: 8, paddingRight: 0 }}>
                  <Checkbox checked={selectedRows.has(po.id)} onCheckedChange={() => setSelectedRows(prev => { const n = new Set(prev); if (n.has(po.id)) n.delete(po.id); else n.add(po.id); return n; })} onClick={(e) => e.stopPropagation()} />
                </TableCell>
                {visibleColumns.map(key => {
                  const def = colDef(key);
                  const w = getWidth(key);
                  const isSticky = def.sticky === "left";
                  const isLastSticky = key === lastStickyKey;
                  const isDragged = draggingColumnKey === key;
                  return (
                    <TableCell
                      key={key}
                      className={`${isSticky ? "sticky z-10 bg-card group-hover:bg-[#F0F7FF]" : ""} ${def.align === "right" ? "text-right tabular-nums" : ""}`}
                      style={{ width: w, minWidth: w, maxWidth: w, overflow: "hidden", textOverflow: "ellipsis", ...(isSticky ? { left: stickyOffsets[key], ...(isLastSticky ? { boxShadow: "inset -1px 0 0 0 rgba(0,0,0,0.08), 3px 0 6px -2px rgba(0,0,0,0.06)" } : {}) } : {}), ...(isDragged ? { backgroundColor: "rgba(10,119,255,0.035)" } : {}) }}
                    >
                      {renderCell(po, key)}
                    </TableCell>
                  );
                })}
                <TableCell className="sticky right-0 bg-card group-hover:bg-[#F0F7FF] z-10 !pl-2 !pr-2" style={{ boxShadow: "inset 1px 0 0 0 rgba(0,0,0,0.08)" }}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}><button className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer"><MoreHorizontal className="w-4 h-4" /></button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem>
                      <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Duplicate PO</DropdownMenuItem>
                      <DropdownMenuItem><Printer className="w-4 h-4 mr-2" /> Print PO</DropdownMenuItem>
                      <DropdownMenuItem><FileDown className="w-4 h-4 mr-2" /> Download PDF</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Drag ghost */}
      <div ref={ghostElRef} className="fixed top-0 left-0 z-[9999] pointer-events-none transition-none" style={{ opacity: draggingColumnKey ? 1 : 0 }}>
        {draggingColumnKey && (
          <div className="bg-white/95 backdrop-blur-sm border border-[#0A77FF]/20 shadow-lg rounded-lg px-3 py-1.5 -translate-x-1/2 -translate-y-full" style={{ marginTop: -8 }}>
            <span className="text-[12px] text-[#0A77FF]" style={{ fontWeight: 600 }}>{colDef(draggingColumnKey as ColKey)?.label}</span>
          </div>
        )}
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
