import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import {
  Search,
  X,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  SlidersHorizontal,
  AlignJustify,
  List as ListIcon,
  LayoutGrid,
  Package,
  Maximize2,
  Minimize2,
  Sparkles,
  Tag,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import type { Vendor } from "../../data/vendors";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface PartnerItemData {
  id: string;
  partNo: string;
  description: string;
  manufacturer: string;
  sku: string;
  category: string;
  additionalCategory: string;
  itemType: "Parts" | "Equipment - Capital" | "Equipment - Non-Capital" | "Miscellaneous";
  itemControlType: "Serialized" | "Non-Serialized";
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  onHand: number;
  onHandUnit: string;
  altUnits: string;
  inboundLocation: string;
  outboundLocation: string;
  acquisitionMethods: ("Purchased" | "Manufactured" | "Purchase")[];
  status: "Active" | "Inactive";
  tradeDirection: "sell" | "purchase" | "both";
  image: string;
  hasBlueDot: boolean;
}

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const ITEM_TYPES = ["Parts", "Equipment - Capital", "Equipment - Non-Capital", "Miscellaneous"] as const;

const STOCK_STATUS_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  "In Stock": { color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" },
  "Low Stock": { color: "#92400E", bg: "#FFFBEB", border: "#FDE68A" },
  "Out of Stock": { color: "#991B1B", bg: "#FEF2F2", border: "#FECACA" },
};

const ACQ_BADGE_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  "Purchased": { color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" },
  "Manufactured": { color: "#1E40AF", bg: "#EFF6FF", border: "#BFDBFE" },
  "Purchase": { color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0" },
};

const STATUS_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  "Active": { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  "Inactive": { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
};

const ITEM_IMAGES = [
  "https://images.unsplash.com/photo-1772209049802-cd0e0ff1a5d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXglMjBib2x0JTIwc2NyZXclMjBoYXJkd2FyZXxlbnwxfHx8fDE3NzMyNDY5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1713575882582-8938739db351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFpbmxlc3MlMjBzdGVlbCUyMGJhbGwlMjB2YWx2ZSUyMHBsdW1iaW5nfGVufDF8fHx8MTc3MzI0Njk5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1737223450913-2af6885945e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydWJiZXIlMjBvLXJpbmclMjBzZWFsJTIwZ2Fza2V0fGVufDF8fHx8MTc3MzI0Njk5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1759159091728-e2c87b9d9315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmQlMjBtaWxsJTIwY3V0dGluZyUyMHRvb2wlMjBjYXJiaWRlfGVufDF8fHx8MTc3MzI0Njk5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1661069387900-54d5843b704d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHVtaW51bSUyMHNoZWV0JTIwbWV0YWwlMjBpbmR1c3RyaWFsfGVufDF8fHx8MTc3MzI0Njk5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1758873263527-ca53b938fbd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxsJTIwYmVhcmluZyUyMG1lY2hhbmljYWwlMjBjb21wb25lbnR8ZW58MXx8fHwxNzczMjQ2OTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

const ITEM_DEFS = [
  { partNo: "FAST-HEX-001", desc: "Zinc-Plated Hex Head Screw, 1/4\"-20 x 1\"", mfr: "BoltMaster Inc.", sku: "BM-2520-100", cat: "Fasteners", addCat: "Hardware", ctrl: "Non-Serialized" as const, stock: "In Stock" as const, onHand: 15400, unit: "ea", alt: "Box (100)", inLoc: "Warehouse A, Row 01, Sh...", outLoc: "Warehouse A, Row 01, Sh...", acq: ["Purchased"] as ("Purchased" | "Manufactured" | "Purchase")[] },
  { partNo: "VALV-BAL-316", desc: "316 Stainless Steel Ball Valve, 2-Piece, 1\"", mfr: "FlowControl", sku: "SS-BV-100", cat: "Plumbing", addCat: "Industrial", ctrl: "Serialized" as const, stock: "Low Stock" as const, onHand: 12, unit: "ea", alt: "Carton (10)", inLoc: "Warehouse B, Row 04, Sh...", outLoc: "Warehouse B, Row 04, Sh...", acq: ["Purchased", "Manufactured"] as ("Purchased" | "Manufactured" | "Purchase")[] },
  { partNo: "SEAL-OR-012", desc: "Buna-N O-Ring, Dash Number 012, Hard", mfr: "SealTech", sku: "BN-70-012", cat: "Seals", addCat: "Rubber Goods", ctrl: "Non-Serialized" as const, stock: "In Stock" as const, onHand: 5000, unit: "pk", alt: "Bag (100)", inLoc: "Warehouse C, Bin 12", outLoc: "Warehouse C, Bin 12", acq: ["Purchased"] as ("Purchased" | "Manufactured" | "Purchase")[] },
  { partNo: "TOOL-EM-050", desc: "Solid Carbide Square End Mill, 1/2\" Cutti", mfr: "PrecisionTools", sku: "SC-EM-4F-500", cat: "Tools", addCat: "Carbide", ctrl: "Non-Serialized" as const, stock: "In Stock" as const, onHand: 45, unit: "ea", alt: "Tube (1)", inLoc: "Tool Room, Cabinet 5, Dra...", outLoc: "Tool Room, Cabinet 5, Dra...", acq: ["Purchase"] as ("Purchased" | "Manufactured" | "Purchase")[] },
  { partNo: "MAT-AL-6061", desc: "6061-T6 Aluminum Sheet, 12\" x 24\" x 0.", mfr: "AluSupply", sku: "AL-6061-125", cat: "Raw Materials", addCat: "Sheet Stock", ctrl: "Non-Serialized" as const, stock: "Out of Stock" as const, onHand: 0, unit: "sh", alt: "Pallet (50)", inLoc: "Yard, Rack 01", outLoc: "Yard, Rack 01", acq: ["Purchased", "Manufactured"] as ("Purchased" | "Manufactured" | "Purchase")[] },
  { partNo: "MECH-BRG-6204", desc: "Deep Groove Ball Bearing, 6204-2RS, St", mfr: "MotionPro", sku: "6204-2RS", cat: "Power Trans", addCat: "Mechanical", ctrl: "Serialized" as const, stock: "In Stock" as const, onHand: 240, unit: "ea", alt: "Box (10)", inLoc: "Parts Room, Row 02, Bin 12", outLoc: "Parts Room, Row 02, Bin 12", acq: ["Purchased"] as ("Purchased" | "Manufactured" | "Purchase")[] },
];

const EXTRA_DEFS = [
  { partNo: "ELEC-RLY-024", desc: "24V DC Relay, SPDT, 10A Contact Rating", mfr: "CircuitPro", sku: "RL-24-SPDT", cat: "Electrical", addCat: "Controls", ctrl: "Non-Serialized" as const },
  { partNo: "HYDR-CYL-350", desc: "Hydraulic Cylinder, 3.5\" Bore x 24\" Stroke", mfr: "HydraForce", sku: "HC-3524-D", cat: "Hydraulics", addCat: "Actuators", ctrl: "Serialized" as const },
  { partNo: "PNEU-FTG-038", desc: "Push-to-Connect Fitting, 3/8\" Tube OD", mfr: "AirLine", sku: "PTC-038-NPT", cat: "Pneumatics", addCat: "Fittings", ctrl: "Non-Serialized" as const },
  { partNo: "WELD-ROD-309", desc: "309L Stainless Welding Rod, 3/32\" x 36\"", mfr: "WeldPro", sku: "WR-309L-332", cat: "Welding", addCat: "Consumables", ctrl: "Non-Serialized" as const },
  { partNo: "ABRS-DSC-045", desc: "Flap Disc 4.5\" x 7/8\" Zirconia, 60 Grit", mfr: "GrindMaster", sku: "FD-45-Z60", cat: "Abrasives", addCat: "Discs", ctrl: "Non-Serialized" as const },
  { partNo: "SFTY-GLV-XL", desc: "Cut-Resistant Gloves, ANSI A4, XL, 12pk", mfr: "SafeHand", sku: "CR-A4-XL-12", cat: "Safety", addCat: "PPE", ctrl: "Non-Serialized" as const },
  { partNo: "LUBR-GRS-EP2", desc: "EP2 Lithium Complex Grease, 14oz Cart", mfr: "LubeTech", sku: "LC-EP2-14", cat: "Lubricants", addCat: "Grease", ctrl: "Non-Serialized" as const },
  { partNo: "FILT-HYD-010", desc: "Hydraulic Return Filter Element, 10 Micron", mfr: "FilterMax", sku: "HF-RET-10M", cat: "Filters", addCat: "Hydraulic", ctrl: "Non-Serialized" as const },
  { partNo: "BELT-VEE-B68", desc: "Classical V-Belt, B68, 71\" Outside Length", mfr: "DrivePro", sku: "VB-B68-71", cat: "Power Trans", addCat: "Belts", ctrl: "Non-Serialized" as const },
  { partNo: "SENS-PROX-M12", desc: "Inductive Proximity Sensor, M12, NPN, 4mm", mfr: "SenseLogic", sku: "IPS-M12-4N", cat: "Electrical", addCat: "Sensors", ctrl: "Serialized" as const },
  { partNo: "SPRI-COMP-25", desc: "Compression Spring, .750 OD x 2.5\" FL", mfr: "SpringWorks", sku: "CS-750-25", cat: "Hardware", addCat: "Springs", ctrl: "Non-Serialized" as const },
  { partNo: "SEAL-LIP-030", desc: "Double Lip Oil Seal, 30mm ID x 47mm OD", mfr: "SealTech", sku: "DL-3047-7", cat: "Seals", addCat: "Oil Seals", ctrl: "Non-Serialized" as const },
  { partNo: "CPLG-JAW-L99", desc: "Jaw Coupling Hub, L099, 3/4\" Bore, Keyway", mfr: "CouplingPro", sku: "JC-L99-075K", cat: "Power Trans", addCat: "Couplings", ctrl: "Non-Serialized" as const },
  { partNo: "CSTR-SWV-475", desc: "Heavy Duty Swivel Caster, 4\" x 2\", 750lb", mfr: "RollRight", sku: "HD-SWV-42", cat: "Material Handling", addCat: "Casters", ctrl: "Non-Serialized" as const },
  { partNo: "INSUL-FBR-R19", desc: "Fiberglass Insulation Batt, R-19, 6.25\"", mfr: "ThermoShield", sku: "FB-R19-23", cat: "Insulation", addCat: "Thermal", ctrl: "Non-Serialized" as const },
  { partNo: "PIPE-SS-150", desc: "304 Stainless Pipe, 1.5\" Sch 40, 20ft", mfr: "PipePro", sku: "SS304-150-40", cat: "Plumbing", addCat: "Pipe", ctrl: "Non-Serialized" as const },
  { partNo: "WIRE-THHN-12", desc: "THHN Wire, 12 AWG, Stranded, Black, 500ft", mfr: "WireTech", sku: "THHN-12-BK", cat: "Electrical", addCat: "Wire", ctrl: "Non-Serialized" as const },
  { partNo: "ADHV-EPXY-ST", desc: "Structural Epoxy Adhesive, 50ml Dual Cart", mfr: "BondMax", sku: "SE-50-DC", cat: "Adhesives", addCat: "Structural", ctrl: "Non-Serialized" as const },
];

const ALT_UNITS_LIST = ["Box (100)", "Carton (10)", "Bag (100)", "Tube (1)", "Pallet (50)", "Box (10)", "Case (24)", "Pack (12)", "Drum (55gal)", "Spool (1000ft)"];
const LOCATIONS = [
  "Warehouse A, Row 01, Sh...", "Warehouse B, Row 04, Sh...", "Warehouse C, Bin 12",
  "Tool Room, Cabinet 5, Dra...", "Yard, Rack 01", "Parts Room, Row 02, Bin 12",
  "Warehouse D, Bin 08", "Maint Shop, Cabinet 3", "Receiving Dock 2",
];

// Seeded RNG for deterministic data
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateItemsFromVendor(vendor: Vendor): PartnerItemData[] {
  const rng = seededRng(vendor.companyName.length * 31 + 7);
  const items: PartnerItemData[] = [];

  // First 6 use the detailed ITEM_DEFS
  for (let i = 0; i < ITEM_DEFS.length; i++) {
    const d = ITEM_DEFS[i];
    items.push({
      id: `item-${d.partNo}-${i}`,
      partNo: d.partNo,
      description: d.desc,
      manufacturer: d.mfr,
      sku: d.sku,
      category: d.cat,
      additionalCategory: d.addCat,
      itemType: ITEM_TYPES[Math.floor(rng() * ITEM_TYPES.length)],
      itemControlType: d.ctrl,
      stockStatus: d.stock,
      onHand: d.onHand,
      onHandUnit: d.unit,
      altUnits: d.alt,
      inboundLocation: d.inLoc,
      outboundLocation: d.outLoc,
      acquisitionMethods: d.acq,
      status: rng() > 0.1 ? "Active" : "Inactive",
      tradeDirection: (["sell", "purchase", "both"] as const)[Math.floor(rng() * 3)],
      image: ITEM_IMAGES[i % ITEM_IMAGES.length],
      hasBlueDot: rng() > 0.6,
    });
  }

  // Generate extra items using EXTRA_DEFS + random data
  const codes = vendor.itemCodes || [];
  const extraCount = Math.max(codes.length, 12);
  for (let i = 0; i < extraCount; i++) {
    const r = rng;
    const def = EXTRA_DEFS[i % EXTRA_DEFS.length];
    const partNo = def.partNo + (i >= EXTRA_DEFS.length ? `-${String(i).padStart(2, "0")}` : "");
    const stockStatuses: ("In Stock" | "Low Stock" | "Out of Stock")[] = ["In Stock", "In Stock", "In Stock", "Low Stock", "Out of Stock"];
    const acqOptions: ("Purchased" | "Manufactured" | "Purchase")[][] = [
      ["Purchased"], ["Manufactured"], ["Purchased", "Manufactured"], ["Purchase"], ["Purchased"],
    ];
    items.push({
      id: `item-${partNo}-${i + 6}`,
      partNo,
      description: def.desc,
      manufacturer: def.partNo.split("-")[0] + "Corp",
      sku: def.sku,
      category: def.cat,
      additionalCategory: def.addCat,
      itemType: ITEM_TYPES[Math.floor(r() * ITEM_TYPES.length)],
      itemControlType: def.ctrl,
      stockStatus: stockStatuses[Math.floor(r() * stockStatuses.length)],
      onHand: Math.floor(r() * 20000),
      onHandUnit: (["ea", "pk", "sh", "ft", "lb", "gal"] as const)[Math.floor(r() * 6)],
      altUnits: ALT_UNITS_LIST[Math.floor(r() * ALT_UNITS_LIST.length)],
      inboundLocation: LOCATIONS[Math.floor(r() * LOCATIONS.length)],
      outboundLocation: LOCATIONS[Math.floor(r() * LOCATIONS.length)],
      acquisitionMethods: acqOptions[Math.floor(r() * acqOptions.length)],
      status: r() > 0.12 ? "Active" : "Inactive",
      tradeDirection: (["sell", "purchase", "both"] as const)[Math.floor(r() * 3)],
      image: ITEM_IMAGES[Math.floor(r() * ITEM_IMAGES.length)],
      hasBlueDot: r() > 0.65,
    });
  }

  return items;
}

// Inventory items for the "Add Item" modal
function generateInventoryItems(): PartnerItemData[] {
  const rng = seededRng(42);
  const items: PartnerItemData[] = [];
  const allDefs = [...EXTRA_DEFS.slice(6), ...EXTRA_DEFS, ...EXTRA_DEFS.slice(0, 6)];
  for (let i = 0; i < 60; i++) {
    const r = rng;
    const def = allDefs[i % allDefs.length];
    const partNo = `INV-${def.partNo.split("-").slice(0, 2).join("-")}-${String(i).padStart(3, "0")}`;
    items.push({
      id: `inv-${partNo}-${i}`,
      partNo,
      description: def.desc,
      manufacturer: def.partNo.split("-")[0] + "Corp",
      sku: def.sku,
      category: def.cat,
      additionalCategory: def.addCat,
      itemType: ITEM_TYPES[Math.floor(r() * ITEM_TYPES.length)],
      itemControlType: def.ctrl,
      stockStatus: r() > 0.3 ? "In Stock" : (r() > 0.5 ? "Low Stock" : "Out of Stock"),
      onHand: Math.floor(r() * 15000),
      onHandUnit: "ea",
      altUnits: ALT_UNITS_LIST[Math.floor(r() * ALT_UNITS_LIST.length)],
      inboundLocation: LOCATIONS[Math.floor(r() * LOCATIONS.length)],
      outboundLocation: LOCATIONS[Math.floor(r() * LOCATIONS.length)],
      acquisitionMethods: ["Purchased"],
      status: "Active",
      tradeDirection: (["sell", "purchase", "both"] as const)[Math.floor(r() * 3)],
      image: ITEM_IMAGES[Math.floor(r() * ITEM_IMAGES.length)],
      hasBlueDot: false,
    });
  }
  return items;
}

const INVENTORY_ITEMS = generateInventoryItems();

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

function StockStatusDot({ status }: { status: string }) {
  const s = STOCK_STATUS_STYLES[status] || STOCK_STATUS_STYLES["In Stock"];
  return (
    <span className="inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap shrink-0" style={{ fontWeight: 500, backgroundColor: s.bg, color: s.color, borderColor: s.border }}>
      {status}
    </span>
  );
}

function AcqBadge({ method }: { method: string }) {
  const s = ACQ_BADGE_STYLES[method] || ACQ_BADGE_STYLES["Purchased"];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap border"
      style={{ color: s.color, backgroundColor: s.bg, borderColor: s.border, fontWeight: 500 }}
    >
      {method}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES["Active"];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap border"
      style={{ color: style.color, backgroundColor: style.bg, borderColor: style.border, fontWeight: 600 }}
    >
      {status}
    </span>
  );
}

function CategoryPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] whitespace-nowrap bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]" style={{ fontWeight: 500 }}>
      {label}
    </span>
  );
}

// ──────────────────────────────────────────────
// Add Item Modal
// ──────────────────────────────────────────────

function AddItemModal({
  open,
  onOpenChange,
  existingItemIds,
  onItemsAdded,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existingItemIds: Set<string>;
  onItemsAdded: (items: PartnerItemData[]) => void;
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const perPage = 15;

  useEffect(() => {
    if (open) {
      setSearch("");
      setSelectedIds(new Set());
      setPage(1);
    }
  }, [open]);

  const available = useMemo(() => {
    return INVENTORY_ITEMS.filter((it) => !existingItemIds.has(it.id));
  }, [existingItemIds]);

  const filtered = useMemo(() => {
    if (!search.trim()) return available;
    const q = search.toLowerCase();
    return available.filter(
      (it) =>
        it.partNo.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        it.manufacturer.toLowerCase().includes(q)
    );
  }, [available, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function toggleItem(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAdd() {
    const items = INVENTORY_ITEMS.filter((it) => selectedIds.has(it.id));
    onItemsAdded(items);
    onOpenChange(false);
    toast.success(`${items.length} item${items.length !== 1 ? "s" : ""} added successfully`);
  }

  const modalBaseClass = "!fixed !inset-0 !translate-x-0 !translate-y-0 !m-auto !w-full !h-full transition-[max-width,max-height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]";
  const modalSizeClass = isFullScreen
    ? `${modalBaseClass} !max-w-[calc(100%-1rem)] sm:!max-w-[calc(100%-1.5rem)] lg:!max-w-[calc(100%-2rem)] !max-h-[calc(100%-1rem)] sm:!max-h-[calc(100%-1.5rem)] lg:!max-h-[calc(100%-2rem)] !rounded-2xl`
    : `${modalBaseClass} !max-w-[100%] sm:!max-w-[960px] lg:!max-w-[1040px] !max-h-[100dvh] sm:!max-h-[88vh] rounded-none sm:!rounded-2xl`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex flex-col p-0 gap-0 border-0 sm:border ${modalSizeClass}`}
        hideCloseButton
        style={{ boxShadow: "0 24px 48px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)" }}
      >
        <DialogTitle className="sr-only">Add Items from Inventory</DialogTitle>
        <DialogDescription className="sr-only">Select items from the inventory to associate with this partner.</DialogDescription>

        {/* Header */}
        <div className="px-3 sm:px-5 pt-3 sm:pt-4 pb-2.5 sm:pb-3 shrink-0 bg-white rounded-t-none sm:rounded-t-2xl border-b border-[#EEF2F6]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-[15px] sm:text-[17px] text-[#0F172A]" style={{ fontWeight: 700 }}>
                Add Items from Inventory
              </h2>
              <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5" style={{ fontWeight: 400 }}>
                Browse and select items to associate with this partner.
              </p>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                {isFullScreen ? "Exit full" : "Full view"}
              </button>
              <button
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="px-3 sm:px-5 py-2.5 border-b border-[#EEF2F6] bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
              <Input
                placeholder="Search by part no, description, or category..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9 pr-8 h-9 text-sm bg-white border-border/80 shadow-sm placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-primary/20"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); setPage(1); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            {selectedIds.size > 0 && (
              <span className="text-xs text-[#0A77FF] shrink-0" style={{ fontWeight: 600 }}>
                {selectedIds.size} selected
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-auto shrink-0" style={{ fontWeight: 500 }}>
              {filtered.length} items available
            </span>
          </div>
        </div>

        {/* Table — exact match to main items table */}
        <div className="flex-1 min-h-0 overflow-auto">
          <Table style={{ tableLayout: "fixed", minWidth: 1500 }}>
            <TableHeader className="sticky top-0 z-20 bg-card">
              <TableRow className="bg-muted/30 hover:bg-muted/30 [&>th]:h-8">
                <TableHead className="sticky left-0 z-20 bg-[#f8fafc] w-[40px] min-w-[40px] max-w-[40px] !pl-2 !pr-0" />
                <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 180 }}>Item</TableHead>
                <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 260 }}>Description</TableHead>
                <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 100 }}>Status</TableHead>
                <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 130 }}>Control Type</TableHead>
                <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 130 }}>Primary Cat.</TableHead>
                <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 130 }}>Additional Cat.</TableHead>
                <TableHead className="text-[13px] text-foreground !pl-3 text-right" style={{ fontWeight: 600, width: 100 }}>On-Hand</TableHead>
                <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 100 }}>Alt. Units</TableHead>
                <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 150 }}>Inbound Loc.</TableHead>
                <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 150 }}>Outbound Loc.</TableHead>
                <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 200 }}>Acquisition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-16 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="w-8 h-8" />
                      <p className="text-sm">No items found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <TableRow
                      key={item.id}
                      className={`cursor-pointer group hover:bg-[#F0F7FF] [&>td]:py-1 [&>td]:pl-3 [&>td]:pr-2 ${isSelected ? "bg-[#EDF4FF]/60" : ""}`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-[#F0F7FF] !pl-2 !pr-0" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleItem(item.id)} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] overflow-hidden shrink-0 border border-[#E8ECF1]">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="text-sm text-foreground font-mono whitespace-nowrap" style={{ fontWeight: 500 }}>{item.partNo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-foreground truncate" style={{ fontWeight: 400 }}>{item.description}</p>
                      </TableCell>
                      <TableCell><StockStatusDot status={item.stockStatus} /></TableCell>
                      <TableCell><span className="text-[13px] text-foreground whitespace-nowrap">{item.itemControlType}</span></TableCell>
                      <TableCell><span className="text-[13px] text-foreground whitespace-nowrap">{item.category}</span></TableCell>
                      <TableCell><CategoryPill label={item.additionalCategory} /></TableCell>
                      <TableCell className="text-right !pr-3">
                        <span className="text-[14px] text-foreground tabular-nums" style={{ fontWeight: 600 }}>{item.onHand.toLocaleString()}</span>
                        <p className="text-[10px] text-muted-foreground">{item.onHandUnit}</p>
                      </TableCell>
                      <TableCell><span className="text-[13px] text-foreground whitespace-nowrap">{item.altUnits}</span></TableCell>
                      <TableCell><span className="text-[13px] text-foreground truncate block max-w-[140px]">{item.inboundLocation}</span></TableCell>
                      <TableCell><span className="text-[13px] text-foreground truncate block max-w-[140px]">{item.outboundLocation}</span></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.acquisitionMethods.map((m) => <AcqBadge key={m} method={m} />)}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-center px-4 py-2.5 border-t border-border gap-3 shrink-0">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <span className="text-muted-foreground">Records per page</span>
            <select value={perPage} disabled className="h-8 px-2 pr-7 rounded-lg border border-border bg-white text-sm cursor-pointer outline-none">
              <option>{perPage}</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="h-8 px-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted/60 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default" style={{ fontWeight: 500 }}>Prev</button>
            {(() => {
              const pages: (number | "...")[] = [];
              if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
              else { pages.push(1); if (page > 3) pages.push("..."); for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i); if (page < totalPages - 2) pages.push("..."); pages.push(totalPages); }
              return pages.map((p, idx) => p === "..." ? <span key={`d${idx}`} className="px-1.5 text-muted-foreground text-sm">...</span> : (
                <button key={p} onClick={() => setPage(p as number)} className={`h-8 w-8 rounded-md text-sm transition-colors cursor-pointer ${page === p ? "bg-[#0A77FF] text-white" : "text-muted-foreground hover:bg-muted/60"}`} style={{ fontWeight: page === p ? 600 : 500 }}>{p}</button>
              ));
            })()}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="h-8 px-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted/60 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default" style={{ fontWeight: 500 }}>Next</button>
          </div>
        </div>

        {/* Footer — actions */}
        <div className="shrink-0 border-t border-[#EEF2F6] bg-white px-3 sm:px-5 py-2.5 flex items-center justify-end gap-2 sm:rounded-b-2xl">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] rounded-lg px-4 text-xs h-9">
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={selectedIds.size === 0}
              className="gap-1.5 rounded-lg px-4 text-xs h-9 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add {selectedIds.size > 0 ? `${selectedIds.size} Item${selectedIds.size !== 1 ? "s" : ""}` : "Items"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

type SubTab = "sell" | "purchase";
type Density = "condensed" | "comfort" | "card";
type ItemFilter = "all" | "Active" | "Inactive" | "Serialized" | "Non-Serialized";

const DENSITY_CONFIG: { key: Density; label: string; description: string; icon: "align-justify" | "list" | "layout-grid" }[] = [
  { key: "condensed", label: "Condensed", description: "Compact view", icon: "align-justify" },
  { key: "comfort", label: "Comfort", description: "Spacious view", icon: "list" },
  { key: "card", label: "Card View", description: "Grid layout", icon: "layout-grid" },
];

export function PartnerItemsTab({ vendor }: { vendor: Vendor }) {
  const generatedItems = useMemo(() => generateItemsFromVendor(vendor), [vendor]);
  const [addedItems, setAddedItems] = useState<PartnerItemData[]>([]);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());

  const allItems = useMemo(() => [...addedItems, ...generatedItems], [addedItems, generatedItems]);

  const [subTab, setSubTab] = useState<SubTab>("sell");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemFilter, setItemFilter] = useState<ItemFilter>("all");
  const [density, setDensity] = useState<Density>("condensed");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Sub-tab filtered
  const subTabFiltered = useMemo(() => {
    if (subTab === "sell") return allItems.filter((it) => it.tradeDirection === "sell" || it.tradeDirection === "both");
    if (subTab === "purchase") return allItems.filter((it) => it.tradeDirection === "purchase" || it.tradeDirection === "both");
    return allItems;
  }, [allItems, subTab]);

  // Quick filter counts
  const filterCounts = useMemo(() => {
    const c: Record<string, number> = { all: subTabFiltered.length };
    c["Active"] = subTabFiltered.filter((it) => it.status === "Active").length;
    c["Inactive"] = subTabFiltered.filter((it) => it.status === "Inactive").length;
    c["Serialized"] = subTabFiltered.filter((it) => it.itemControlType === "Serialized").length;
    c["Non-Serialized"] = subTabFiltered.filter((it) => it.itemControlType === "Non-Serialized").length;
    return c;
  }, [subTabFiltered]);

  // Apply filters
  const filtered = useMemo(() => {
    let list = subTabFiltered;
    if (itemFilter === "Active") list = list.filter((it) => it.status === "Active");
    else if (itemFilter === "Inactive") list = list.filter((it) => it.status === "Inactive");
    else if (itemFilter === "Serialized") list = list.filter((it) => it.itemControlType === "Serialized");
    else if (itemFilter === "Non-Serialized") list = list.filter((it) => it.itemControlType === "Non-Serialized");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (it) =>
          it.partNo.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q) ||
          it.category.toLowerCase().includes(q) ||
          it.manufacturer.toLowerCase().includes(q) ||
          it.sku.toLowerCase().includes(q)
      );
    }
    return list;
  }, [subTabFiltered, itemFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / recordsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginated = filtered.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  const handleSelectRow = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedRows.size === paginated.length) setSelectedRows(new Set());
    else setSelectedRows(new Set(paginated.map((it) => it.id)));
  }, [paginated, selectedRows]);

  const existingItemIds = useMemo(() => new Set(allItems.map((it) => it.id)), [allItems]);

  const handleItemsAdded = useCallback((items: PartnerItemData[]) => {
    setAddedItems((prev) => [...items, ...prev]);
    const newIds = new Set(items.map((it) => it.id));
    setHighlightedIds(newIds);
    setSubTab("all");
    setItemFilter("all");
    setSearchQuery("");
    setCurrentPage(1);
    setTimeout(() => setHighlightedIds(new Set()), 3500);
  }, []);

  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-[#FEF08A] rounded-sm px-px">{part}</span>
      ) : (
        part
      )
    );
  };

  const QUICK_FILTERS: { key: ItemFilter; label: string; count: number }[] = [
    { key: "all", label: "All Items", count: filterCounts["all"] || 0 },
    { key: "Active", label: "Active", count: filterCounts["Active"] || 0 },
    { key: "Inactive", label: "Inactive", count: filterCounts["Inactive"] || 0 },
    { key: "Serialized", label: "Serialized", count: filterCounts["Serialized"] || 0 },
    { key: "Non-Serialized", label: "Non-Serialized", count: filterCounts["Non-Serialized"] || 0 },
  ];

  const SUB_TABS: { key: SubTab; label: string }[] = [
    { key: "sell", label: "Items They Sell" },
    { key: "purchase", label: "Items They Purchase" },
  ];

  return (
    <>
      <div className="border border-border rounded-xl bg-card overflow-clip flex flex-col" style={{ minHeight: 400 }}>

        {/* Sub-tabs — modern segmented control */}
        <div className="px-4 pt-3.5 pb-2 shrink-0">
          <div className="inline-flex items-center rounded-xl bg-[#F1F5F9] p-1 w-full sm:w-auto">
          {([
            { key: "sell" as SubTab, label: "Items They Sell", icon: Tag },
            { key: "purchase" as SubTab, label: "Items They Purchase", icon: ShoppingCart },
          ]).map((t) => {
            const isActive = subTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => { setSubTab(t.key); setCurrentPage(1); }}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-[13px] transition-all cursor-pointer ${
                  isActive ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] text-[#0F172A]" : "text-[#64748B] hover:text-[#334155]"
                }`}
                style={{ fontWeight: isActive ? 600 : 500 }}
              >
                <t.icon className={`w-4 h-4 ${isActive ? "text-[#0A77FF]" : "text-[#94A3B8]"}`} />
                {t.label}
              </button>
            );
          })}
          </div>
        </div>

        {/* Row 1: Search + Filters ... Count + Density + Add */}
        <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2 shrink-0">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-8 h-9 text-sm bg-white border-border/80 shadow-sm placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-primary/20"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => toast.info("Advanced filters coming soon!")}
              className="inline-flex items-center justify-center h-9 gap-1.5 px-3 rounded-lg border border-border/80 bg-white shadow-sm hover:bg-muted/50 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 shrink-0 text-foreground"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-sm" style={{ fontWeight: 500 }}>Filters</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-sm tabular-nums mr-1 hidden sm:inline" style={{ fontWeight: 500 }}>
              {filtered.length !== allItems.length ? (
                <>
                  <span className="text-foreground">{filtered.length}</span>
                  <span className="text-muted-foreground/60"> of </span>
                  <span className="text-muted-foreground">{allItems.length}</span>
                  <span className="text-muted-foreground/70"> items</span>
                </>
              ) : (
                <>
                  <span className="text-foreground">{allItems.length}</span>
                  <span className="text-muted-foreground/70"> items</span>
                </>
              )}
            </span>

            <div className="w-px h-5 bg-border/60 mx-0.5 hidden sm:block" />

            {/* Density dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-9 gap-2 px-3 rounded-lg border border-border bg-white text-foreground shadow-sm hover:bg-muted/40 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  {density === "condensed" && <AlignJustify className="w-[18px] h-[18px] text-muted-foreground/80" />}
                  {density === "comfort" && <ListIcon className="w-[18px] h-[18px] text-muted-foreground/80" />}
                  {density === "card" && <LayoutGrid className="w-[18px] h-[18px] text-muted-foreground/80" />}
                  <span className="text-sm hidden md:inline" style={{ fontWeight: 500 }}>
                    {DENSITY_CONFIG.find((d) => d.key === density)?.label}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[230px] p-1.5">
                {DENSITY_CONFIG.map((opt) => (
                  <DropdownMenuItem
                    key={opt.key}
                    className="flex items-center gap-3 py-2.5 px-3 cursor-pointer rounded-md"
                    onSelect={() => setDensity(opt.key)}
                  >
                    {opt.icon === "align-justify" && <AlignJustify className="w-5 h-5 text-muted-foreground shrink-0" />}
                    {opt.icon === "list" && <ListIcon className="w-5 h-5 text-muted-foreground shrink-0" />}
                    {opt.icon === "layout-grid" && <LayoutGrid className="w-5 h-5 text-muted-foreground shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ fontWeight: 500 }}>{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.description}</p>
                    </div>
                    {density === opt.key && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-px h-5 bg-border/60 mx-0.5 hidden sm:block" />

            {/* Add Item Button */}
            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#0A77FF] hover:bg-[#0862D0] text-white text-sm shadow-sm transition-colors cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add new item</span>
            </button>
          </div>
        </div>

        {/* Row 2: Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-4 pb-3 shrink-0">
          {QUICK_FILTERS.map((f) => {
            const isActive = itemFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => { setItemFilter(f.key); setCurrentPage(1); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? "border-primary bg-[#EDF4FF] hover:bg-[#D6E8FF] active:bg-[#ADD1FF]"
                    : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:border-muted-foreground/30 active:bg-muted"
                }`}
                style={{ fontWeight: isActive ? 500 : 400, color: isActive ? "#0A77FF" : undefined }}
              >
                {f.label}
                <span
                  className={`text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center ${isActive ? "bg-primary/10" : "bg-muted"}`}
                  style={{ fontWeight: 600, color: isActive ? "#0A77FF" : "#475569" }}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-border shrink-0" />

        {/* Content */}
        {density === "card" ? (
          /* Card View */
          <div className="p-4 min-h-0 overflow-y-auto flex-1">
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
                <Package className="w-8 h-8" />
                <p className="text-sm">No items found</p>
                {searchQuery && (
                  <Button variant="link" size="sm" onClick={() => { setSearchQuery(""); setCurrentPage(1); }}>
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {paginated.map((item) => {
                  const isHighlighted = highlightedIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`bg-white border rounded-xl hover:border-[#BFDBFE] hover:shadow-[0_4px_16px_-4px_rgba(10,119,255,0.12)] transition-all duration-200 group/card flex flex-col ${
                        isHighlighted
                          ? "border-[#0A77FF] shadow-[0_0_0_2px_rgba(10,119,255,0.15)]"
                          : "border-[#E8ECF1]"
                      }`}
                    >
                      {/* Image banner */}
                      <div className="relative w-full h-[90px] overflow-hidden bg-[#F1F5F9] rounded-t-xl">
                        <img src={item.image} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105" />
                        <div className="absolute top-2 left-2">
                          <StockStatusDot status={item.stockStatus} />
                        </div>
                        {isHighlighted && (
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0A77FF] text-white text-[10px] uppercase shadow-sm" style={{ fontWeight: 700 }}>
                              <Sparkles className="w-3 h-3" />NEW
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Body */}
                      <div className="p-3.5 flex flex-col flex-1">
                        {/* Part no + description */}
                        <p className="text-[11px] text-[#0A77FF] font-mono" style={{ fontWeight: 600 }}>{item.partNo}</p>
                        <p className="text-[13px] text-[#0F172A] truncate mt-0.5" style={{ fontWeight: 600 }}>{item.description}</p>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5">{item.manufacturer} <span className="text-[#CBD5E1]">·</span> {item.sku}</p>

                        {/* Categories */}
                        <div className="flex items-center gap-1 mt-2.5 flex-wrap">
                          <CategoryPill label={item.category} />
                          {item.additionalCategory !== item.category && <CategoryPill label={item.additionalCategory} />}
                        </div>

                        {/* Footer: acquisition + on-hand */}
                        <div className="mt-auto pt-3 border-t border-[#F1F5F9] flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            {item.acquisitionMethods.map((m) => <AcqBadge key={m} method={m} />)}
                          </div>
                          <div className="text-right">
                            <span className="text-[14px] text-[#0F172A] tabular-nums" style={{ fontWeight: 600 }}>{item.onHand.toLocaleString()}</span>
                            <span className="text-[10px] text-[#94A3B8] ml-0.5">{item.onHandUnit}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Table View — Condensed / Comfort */
          <div className="min-h-0 overflow-auto flex-1">
            <Table style={{ tableLayout: "fixed", minWidth: 1500 }}>
              <TableHeader className="sticky top-0 z-20 bg-card">
                <TableRow className={`bg-muted/30 hover:bg-muted/30 ${density === "condensed" ? "[&>th]:h-8" : "[&>th]:h-9"}`}>
                  <TableHead className="sticky left-0 z-20 bg-[#f8fafc] w-[40px] min-w-[40px] max-w-[40px] !pl-2 !pr-0">
                    <Checkbox
                      checked={paginated.length > 0 && selectedRows.size === paginated.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 180 }}>Item</TableHead>
                  <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 260 }}>Description</TableHead>
                  <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 100 }}>Status</TableHead>
                  <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 130 }}>Control Type</TableHead>
                  <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 130 }}>Primary Cat.</TableHead>
                  <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 130 }}>Additional Cat.</TableHead>
                  <TableHead className="text-[13px] text-foreground !pl-3 text-right" style={{ fontWeight: 600, width: 100 }}>On-Hand</TableHead>
                  <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 100 }}>Alt. Units</TableHead>
                  <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 150 }}>Inbound Loc.</TableHead>
                  <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 150 }}>Outbound Loc.</TableHead>
                  <TableHead className="text-[13px] text-foreground !pl-3" style={{ fontWeight: 600, width: 200 }}>Acquisition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="w-8 h-8" />
                        <p className="text-sm">No items found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((item) => {
                    const isHighlighted = highlightedIds.has(item.id);
                    const isComfort = density === "comfort";
                    return (
                      <TableRow
                        key={item.id}
                        className={`group hover:bg-[#F0F7FF] ${
                          isComfort
                            ? "[&>td]:py-2 [&>td]:pl-3 [&>td]:pr-2"
                            : "[&>td]:py-1 [&>td]:pl-3 [&>td]:pr-2"
                        } ${isHighlighted ? "animate-row-flash bg-[#EDF4FF]/60" : ""}`}
                      >
                        <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-[#F0F7FF] !pl-2 !pr-0" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedRows.has(item.id)}
                            onCheckedChange={() => handleSelectRow(item.id)}
                          />
                        </TableCell>

                        {/* Item: thumbnail + part no */}
                        <TableCell>
                          <div className={`flex items-center ${isComfort ? "gap-3" : "gap-2.5"}`}>
                            <div className={`${isComfort ? "w-9 h-9" : "w-7 h-7"} rounded-lg bg-[#F1F5F9] overflow-hidden shrink-0 border border-[#E8ECF1]`}>
                              <img src={item.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className={`${isComfort ? "text-[13.5px]" : "text-sm"} text-foreground font-mono whitespace-nowrap block`} style={{ fontWeight: 500 }}>
                                {highlightText(item.partNo)}
                              </span>
                              {isComfort && <span className="text-xs text-muted-foreground block">{item.manufacturer}</span>}
                            </div>
                          </div>
                        </TableCell>

                        {/* Description: text + sku */}
                        <TableCell>
                          <div className="min-w-0">
                            <p className={`${isComfort ? "text-[13px]" : "text-sm"} text-foreground truncate`} style={{ fontWeight: 400 }}>
                              {highlightText(item.description)}
                            </p>
                            {isComfort && (
                              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                SKU: {item.sku}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <StockStatusDot status={item.stockStatus} />
                        </TableCell>

                        {/* Control Type */}
                        <TableCell>
                          <span className="text-[13px] text-foreground whitespace-nowrap">{item.itemControlType}</span>
                        </TableCell>

                        {/* Primary Cat */}
                        <TableCell>
                          <span className="text-[13px] text-foreground whitespace-nowrap">{highlightText(item.category)}</span>
                        </TableCell>

                        {/* Additional Cat */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CategoryPill label={item.additionalCategory} />
                            {item.category !== item.additionalCategory && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-xs border cursor-default" style={{ fontWeight: 600, backgroundColor: "#F1F5F9", color: "#475569", borderColor: "#E2E8F0" }}>+1</span>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="z-[300]">
                                  <span className="text-[11px]">{item.category}</span>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>

                        {/* On-Hand */}
                        <TableCell className="text-right !pr-3">
                          <div className="text-right">
                            <span className="text-[14px] text-foreground tabular-nums" style={{ fontWeight: 600 }}>
                              {item.onHand.toLocaleString()}
                            </span>
                            <p className="text-[10px] text-muted-foreground mt-px" style={{ fontWeight: 400 }}>{item.onHandUnit}</p>
                          </div>
                        </TableCell>

                        {/* Alt Units */}
                        <TableCell>
                          <span className="text-[13px] text-foreground whitespace-nowrap">{item.altUnits}</span>
                        </TableCell>

                        {/* Inbound Loc */}
                        <TableCell>
                          <span className="text-[13px] text-foreground truncate block max-w-[180px]">{item.inboundLocation}</span>
                        </TableCell>

                        {/* Outbound Loc */}
                        <TableCell>
                          <span className="text-[13px] text-foreground truncate block max-w-[180px]">{item.outboundLocation}</span>
                        </TableCell>

                        {/* Acquisition */}
                        <TableCell>
                          <div className="flex items-center gap-1 flex-wrap">
                            {item.acquisitionMethods.map((m) => (
                              <AcqBadge key={m} method={m} />
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination — matches partner listing page */}
        <div className="flex flex-col sm:flex-row items-center justify-center px-4 py-3 border-t border-border gap-3 shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Records per page</span>
            <select
              value={recordsPerPage}
              onChange={(e) => { setRecordsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="h-8 px-2 pr-7 rounded-lg border border-border bg-white text-sm text-foreground cursor-pointer outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="h-8 px-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted/60 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default" style={{ fontWeight: 500 }}>
              Prev
            </button>
            {(() => {
              const pages: (number | "...")[] = [];
              if (totalPages <= 7) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (currentPage > 3) pages.push("...");
                for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
                if (currentPage < totalPages - 2) pages.push("...");
                pages.push(totalPages);
              }
              return pages.map((p, idx) =>
                p === "..." ? (
                  <span key={`dots-${idx}`} className="px-1.5 text-muted-foreground text-sm">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={`h-8 w-8 rounded-md text-sm transition-colors cursor-pointer ${
                      currentPage === p
                        ? "bg-[#0A77FF] text-white"
                        : "text-muted-foreground hover:bg-muted/60"
                    }`}
                    style={{ fontWeight: currentPage === p ? 600 : 500 }}
                  >
                    {p}
                  </button>
                )
              );
            })()}
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="h-8 px-2.5 rounded-md text-sm text-muted-foreground hover:bg-muted/60 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default" style={{ fontWeight: 500 }}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        existingItemIds={existingItemIds}
        onItemsAdded={handleItemsAdded}
      />
    </>
  );
}
