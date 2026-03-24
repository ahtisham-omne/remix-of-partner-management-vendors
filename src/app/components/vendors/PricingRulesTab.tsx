import React, { useState, useMemo, useCallback } from "react";
import { FilterPills } from "./FilterPills";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Switch } from "../ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import {
  Search,
  X,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  AlertCircle,
  AlertTriangle,
  Clock,
  Package,
  FolderOpen,
  FileText,
  BookOpen,
  Eye,
  Pencil,
  Copy,
  Trash2,
  Archive,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Users,
  Paperclip,
  History,
  Activity,
  Info,
  MoreHorizontal,
  Grid3X3,
  Layers,
  CalendarDays,
  TrendingDown,
  TrendingUp,
  ToggleLeft,
  Maximize2,
  Minimize2,
  DollarSign,
  ChartColumn,
  Check,
  Lock,
  LayoutGrid,
  Rows3,
  Grid2X2,
  ExternalLink,
  Building2,
  Truck as TruckIcon,
  ShoppingCart,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import type { Vendor, VendorConfigData } from "../../data/vendors";
import { Textarea } from "../ui/textarea";
import {
  PRICING_RULE_PRESETS,
  type PricingRulePreset,
  type PricingRuleBasis,
} from "./partnerConstants";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

interface TierData {
  minQty: string;
  maxQty: string;
  discount: string;
  isFixRate?: boolean;
}

interface AssociatedItem {
  id: string;
  partNo: string;
  description: string;
  category: string;
  itemType: string;
  status: "Active" | "Inactive";
}

interface AssociatedCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  itemType: string;
  status: "Active" | "Inactive";
  linkedItems: number;
}

interface AssociatedPartner {
  id: string;
  name: string;
  avatar: string;
  types: string[];
  itemCount: string;
  additionalItems: string;
  status: "Active" | "Inactive";
}

interface PricingRule {
  id: string;
  ruleNo: string;
  name: string;
  category: "discount" | "premium";
  basis: "value" | "volume";
  tierType: "single" | "multiple";
  totalTiers: number;
  description: string;
  aboutText: string;
  status: "Active" | "Inactive";
  scope: "vendor" | "customer" | "both";
  validFrom: string;
  validTo: string;
  hasDateLimit: boolean;
  durationDays: number;
  itemCount: number;
  categoryCount: number;
  partnerCount: number;
  tiers: TierData[];
  createdBy: string;
  createdDate: string;
  warningText?: string;
  isPreset: boolean;
  items: AssociatedItem[];
  categories: AssociatedCategory[];
  partners: AssociatedPartner[];
}

// ──────────────────────────────────────────────
// Mock data constants
// ──────────────────────────────────────────────

const ITEM_DESCS = [
  "Front bulkhead cabinet lower cover", "Box walls inlay cabinet", "Box walls inlay cabinet with defibrillator",
  "Box closeout top cap inlay cabinet", "Toyota long cut, emergency brake", "Toyota long cut, brake line bracket",
  "Toyota long cut, 48 inch wide rear", "Toyota wide Black Diamond Tread", "Toyota long cut, second row seat",
  "Second row seat base, driver side", "Standard floor with kneeling system", "Phillips pan head screw steel black",
  "#10-16 x 3/4\" Phillips Drive Pan", "#10 x 1\" x .190\" 10N100TXPS/A", "Foam padding RF12 - 3/8\" X 72\"",
];

const PART_NOS = [
  "100219-42", "100219-51", "100219-51-01", "100219-51-01RC", "100219-51-02",
  "100219-52", "100219-52-02", "100120-70", "100120-71", "100120-72",
  "100120-73", "100120-74", "100120-75", "100120-75-01", "100150-20",
];

const ITEM_CATS = ["Electronics", "Hardware", "Cabinet", "Parts", "Fasteners", "Foam & Padding"];
const ITEM_TYPES = ["Parts", "Equipment + Capital", "Equipment + Non-Capital", "Miscellaneous"];
const CAT_NAMES = ["Ram Pro Master 2500", "Ram Pro Master 3500", "Ram Pro Master Default", "Ford Transit", "Sprinter Van"];
const CREATORS = ["Ahtisham Ahmad", "Sarah Chen", "Marcus Obi", "Elena Volkov"];
const PARTNER_NAMES = [
  "Toyota International", "Ford Motor Company", "General Motors (GM)", "Tesla, Inc.",
  "Chrysler (Stellantis N.V.)", "Rivian Automotive", "Lucid Motors",
  "Honda Motor Co., Ltd. (USA)", "Nissan North America", "BMW of North America",
  "Toyota China Motors", "Ford Motor Company", "General Motors (GM)", "Tesla, Inc.",
  "Chrysler (Stellantis N.V.)", "Rivian Automotive", "Lucid Motors",
  "Honda Motor Co., Ltd. (USA)", "Nissan North America", "BMW of North America",
];
const PARTNER_TYPE_SETS: string[][] = [
  ["Vendor", "Sub-Contractor", "Customer"], ["Vendor", "Service Provider"],
  ["Vendor", "Seller", "Customer"], ["Vendor", "Sub-Contractor"],
  ["Vendor", "Service Provider"], ["Vendor", "Seller"],
  ["Vendor", "Service Provider"], ["Vendor", "Seller"],
  ["Vendor", "Sub-Contractor"], ["Vendor", "Carrier", "Customer"],
  ["Vendor", "Service Provider"], ["Vendor", "Carrier"],
  ["Vendor", "Seller"], ["Vendor", "Seller", "Customer"],
  ["Vendor", "Sub-Contractor"], ["Vendor", "Seller"],
  ["Vendor", "Service Provider"], ["Vendor", "Seller"],
  ["Vendor", "Sub-Contractor"], ["Vendor", "Carrier", "Customer"],
];

// ──────────────────────────────────────────────
// Seeded RNG + Data generation
// ──────────────────────────────────────────────

function seededRng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function pickArr<T>(arr: T[], rng: () => number): T { return arr[Math.floor(rng() * arr.length)]; }

function genItems(rng: () => number, count: number): AssociatedItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    partNo: pickArr(PART_NOS, rng),
    description: pickArr(ITEM_DESCS, rng),
    category: pickArr(ITEM_CATS, rng),
    itemType: pickArr(ITEM_TYPES, rng),
    status: rng() > 0.2 ? "Active" as const : "Inactive" as const,
  }));
}

function genCategories(rng: () => number, count: number): AssociatedCategory[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `cat-${i}`,
    code: `CAT-${String(Math.floor(rng() * 900) + 100)}`,
    name: pickArr(CAT_NAMES, rng),
    description: pickArr(["Ambulance parts", "Electric platform", "Interior panels", "Exterior panels"], rng),
    itemType: "Parts",
    status: "Active" as const,
    linkedItems: Math.floor(rng() * 40) + 2,
  }));
}

function genPartners(rng: () => number, count: number): AssociatedPartner[] {
  return Array.from({ length: count }, (_, i) => {
    const name = PARTNER_NAMES[i % PARTNER_NAMES.length];
    const types = PARTNER_TYPE_SETS[i % PARTNER_TYPE_SETS.length];
    const extraTypes = Math.floor(rng() * 3);
    return {
      id: `partner-${i}`,
      name,
      avatar: name.charAt(0),
      types: types.slice(0, Math.min(types.length, 2 + (rng() > 0.5 ? 1 : 0))),
      itemCount: pickArr(PART_NOS, rng),
      additionalItems: `+${Math.floor(rng() * 50 + 2)} more`,
      status: rng() > 0.15 ? "Active" as const : "Inactive" as const,
    };
  });
}

// ── Hardcoded diverse pricing rules covering every combination ──
// Each rule: preset/custom × discount/premium × single/multi-tier × value/volume
// All data is realistic and accurate with proper tier structures

interface HardcodedRuleDef {
  id: string;
  name: string;
  category: "discount" | "premium";
  basis: "value" | "volume";
  tierType: "single" | "multiple";
  description: string;
  aboutText: string;
  isPreset: boolean;
  status: "Active" | "Inactive";
  scope: "vendor" | "customer" | "both";
  validFrom: string;
  validTo: string;
  hasDateLimit: boolean;
  durationDays: number;
  createdBy: string;
  createdDate: string;
  tiers: TierData[];
  itemCount: number;
  categoryCount: number;
  partnerCount: number;
}

const HARDCODED_RULES: HardcodedRuleDef[] = [
  // ───── PRESET DISCOUNT RULES ─────
  {
    id: "hc-preset-disc-val-single",
    name: "Standard Discount – Value (Single-Tier)",
    category: "discount", basis: "value", tierType: "single",
    description: "10% off on orders over $1,000",
    aboutText: "The Standard Discount – Value (Single-Tier) pricing rule is a straightforward model where a fixed percentage discount is applied once the total purchase value exceeds a defined threshold. Commonly used for repeat customers.",
    isPreset: true, status: "Active", scope: "vendor",
    validFrom: "1 Jan 2025", validTo: "30 Jun 2025", hasDateLimit: true, durationDays: 180,
    createdBy: "Ahtisham Ahmad", createdDate: "15 Jan 2025",
    tiers: [{ minQty: "$1,000", maxQty: "$32,000", discount: "10%" }],
    itemCount: 12, categoryCount: 3, partnerCount: 8,
  },
  {
    id: "hc-preset-disc-vol-single",
    name: "Standard Discount – Volume (Single-Tier)",
    category: "discount", basis: "volume", tierType: "single",
    description: "15% off on orders of 100+ units",
    aboutText: "A volume-based single-tier discount that applies a fixed percentage when the order quantity meets or exceeds a set threshold. Ideal for bulk purchasing agreements.",
    isPreset: true, status: "Active", scope: "both",
    validFrom: "15 Feb 2025", validTo: "15 Aug 2025", hasDateLimit: true, durationDays: 180,
    createdBy: "Sarah Chen", createdDate: "10 Feb 2025",
    tiers: [{ minQty: "100 EA", maxQty: "500 EA", discount: "15%" }],
    itemCount: 8, categoryCount: 2, partnerCount: 5,
  },
  {
    id: "hc-preset-disc-val-multi",
    name: "Tiered Discount – Value (Multi-Tier)",
    category: "discount", basis: "value", tierType: "multiple",
    description: "5% off over $500, 10% over $2,000, 15% over $5,000",
    aboutText: "A multi-tier value-based discount model where different discount percentages are applied at various purchase value thresholds. Encourages larger order values with increasing savings.",
    isPreset: true, status: "Active", scope: "vendor",
    validFrom: "1 Mar 2025", validTo: "31 Dec 2025", hasDateLimit: true, durationDays: 305,
    createdBy: "Marcus Obi", createdDate: "28 Feb 2025",
    tiers: [
      { minQty: "$500", maxQty: "$1,999", discount: "5%" },
      { minQty: "$2,000", maxQty: "$4,999", discount: "10%", isFixRate: false },
      { minQty: "$5,000", maxQty: "$15,000", discount: "15%" },
      { minQty: "$15,001", maxQty: "$50,000", discount: "20%" },
    ],
    itemCount: 15, categoryCount: 4, partnerCount: 12,
  },
  {
    id: "hc-preset-disc-vol-multi",
    name: "Tiered Discount – Volume (Multi-Tier)",
    category: "discount", basis: "volume", tierType: "multiple",
    description: "5% off 50+ units, 10% over 200, 18% over 500",
    aboutText: "A multi-tier volume-based discount model offering increasing discounts at higher quantity breakpoints. Perfect for incentivizing large batch orders.",
    isPreset: true, status: "Active", scope: "vendor",
    validFrom: "10 Jan 2025", validTo: "10 Jul 2025", hasDateLimit: true, durationDays: 180,
    createdBy: "Elena Volkov", createdDate: "5 Jan 2025",
    tiers: [
      { minQty: "50 EA", maxQty: "199 EA", discount: "5%" },
      { minQty: "200 EA", maxQty: "499 EA", discount: "10%" },
      { minQty: "500 EA", maxQty: "1,000 EA", discount: "18%" },
    ],
    itemCount: 10, categoryCount: 3, partnerCount: 7,
  },

  // ───── PRESET PREMIUM RULES ─────
  {
    id: "hc-preset-prem-val-single",
    name: "Standard Premium – Value (Single-Tier)",
    category: "premium", basis: "value", tierType: "single",
    description: "30% surcharge on exclusive orders over $200",
    aboutText: "A value-based premium surcharge applied to exclusive product lines and VIP offerings. Automate pricing increases to enhance exclusivity and maximize profitability.",
    isPreset: true, status: "Active", scope: "customer",
    validFrom: "1 Apr 2025", validTo: "30 Sep 2025", hasDateLimit: true, durationDays: 182,
    createdBy: "Sarah Chen", createdDate: "25 Mar 2025",
    tiers: [{ minQty: "$200", maxQty: "$12,000", discount: "30%" }],
    itemCount: 6, categoryCount: 1, partnerCount: 4,
  },
  {
    id: "hc-preset-prem-vol-single",
    name: "Standard Premium – Volume (Single-Tier)",
    category: "premium", basis: "volume", tierType: "single",
    description: "16% markup for orders of 10–400 units",
    aboutText: "A volume-based premium surcharge applied to small-to-medium order quantities. Ensures profitability on orders that don't qualify for bulk pricing.",
    isPreset: true, status: "Inactive", scope: "both",
    validFrom: "20 Mar 2025", validTo: "20 Sep 2025", hasDateLimit: true, durationDays: 184,
    createdBy: "Marcus Obi", createdDate: "15 Mar 2025",
    tiers: [{ minQty: "10 EA", maxQty: "400 EA", discount: "16%" }],
    itemCount: 5, categoryCount: 2, partnerCount: 3,
  },
  {
    id: "hc-preset-prem-val-multi",
    name: "Tiered Premium – Value (Multi-Tier)",
    category: "premium", basis: "value", tierType: "multiple",
    description: "8% surcharge under $500, 15% under $200, 22% under $100",
    aboutText: "A multi-tier value-based premium model where different surcharges are applied at decreasing purchase value thresholds. Protects margins on smaller deals.",
    isPreset: true, status: "Active", scope: "vendor",
    validFrom: "5 Feb 2025", validTo: "5 Nov 2025", hasDateLimit: true, durationDays: 273,
    createdBy: "Ahtisham Ahmad", createdDate: "1 Feb 2025",
    tiers: [
      { minQty: "$100", maxQty: "$199", discount: "22%" },
      { minQty: "$200", maxQty: "$499", discount: "15%", isFixRate: true },
      { minQty: "$500", maxQty: "$1,500", discount: "8%" },
    ],
    itemCount: 9, categoryCount: 2, partnerCount: 6,
  },
  {
    id: "hc-preset-prem-vol-multi",
    name: "Tiered Premium – Volume (Multi-Tier)",
    category: "premium", basis: "volume", tierType: "multiple",
    description: "Add $50 for <25 units, $25 for <50, $10 for <100",
    aboutText: "A multi-tier volume-based premium model where surcharges are applied at lower order quantity brackets. Encourages customers to order in larger quantities.",
    isPreset: true, status: "Active", scope: "customer",
    validFrom: "1 Jan 2025", validTo: "31 Dec 2025", hasDateLimit: false, durationDays: 365,
    createdBy: "Elena Volkov", createdDate: "28 Dec 2024",
    tiers: [
      { minQty: "1 EA", maxQty: "24 EA", discount: "25%" },
      { minQty: "25 EA", maxQty: "49 EA", discount: "15%" },
      { minQty: "50 EA", maxQty: "99 EA", discount: "8%" },
      { minQty: "100 EA", maxQty: "250 EA", discount: "3%" },
    ],
    itemCount: 14, categoryCount: 5, partnerCount: 10,
  },

  // ───── CUSTOM DISCOUNT RULES ─────
  {
    id: "hc-custom-disc-val-single",
    name: "Q2 Loyalty Value Discount",
    category: "discount", basis: "value", tierType: "single",
    description: "12% off on orders over $2,500 for loyal partners",
    aboutText: "A custom single-tier value-based discount created specifically for Q2 2025 to reward long-standing partners who consistently place high-value orders. Fully configurable tiers and settings.",
    isPreset: false, status: "Active", scope: "vendor",
    validFrom: "1 Apr 2025", validTo: "30 Jun 2025", hasDateLimit: true, durationDays: 90,
    createdBy: "Ahtisham Ahmad", createdDate: "20 Mar 2025",
    tiers: [{ minQty: "$2,500", maxQty: "$45,000", discount: "12%" }],
    itemCount: 7, categoryCount: 2, partnerCount: 6,
  },
  {
    id: "hc-custom-disc-vol-single",
    name: "Bulk Fastener Discount",
    category: "discount", basis: "volume", tierType: "single",
    description: "20% off on fastener orders of 250+ units",
    aboutText: "Custom volume discount targeting fastener and hardware categories. Applied automatically when order quantity exceeds the minimum threshold for eligible SKUs.",
    isPreset: false, status: "Active", scope: "both",
    validFrom: "15 Jan 2025", validTo: "15 Jul 2025", hasDateLimit: true, durationDays: 181,
    createdBy: "Sarah Chen", createdDate: "10 Jan 2025",
    tiers: [{ minQty: "250 EA", maxQty: "2,000 EA", discount: "20%" }],
    itemCount: 18, categoryCount: 1, partnerCount: 9,
  },
  {
    id: "hc-custom-disc-val-multi",
    name: "Annual Value-Based Savings Plan",
    category: "discount", basis: "value", tierType: "multiple",
    description: "Progressive savings: 3% at $750, 8% at $3K, 14% at $10K",
    aboutText: "A comprehensive multi-tier value-based savings program designed for annual contracts. Each tier offers increasing discounts to incentivize higher purchase commitments throughout the year.",
    isPreset: false, status: "Active", scope: "vendor",
    validFrom: "1 Jan 2025", validTo: "31 Dec 2025", hasDateLimit: true, durationDays: 365,
    createdBy: "Marcus Obi", createdDate: "28 Dec 2024",
    tiers: [
      { minQty: "$750", maxQty: "$2,999", discount: "3%" },
      { minQty: "$3,000", maxQty: "$9,999", discount: "8%" },
      { minQty: "$10,000", maxQty: "$24,999", discount: "14%" },
      { minQty: "$25,000", maxQty: "$100,000", discount: "19%", isFixRate: true },
    ],
    itemCount: 22, categoryCount: 5, partnerCount: 15,
  },
  {
    id: "hc-custom-disc-vol-multi",
    name: "Seasonal Volume Clearance",
    category: "discount", basis: "volume", tierType: "multiple",
    description: "7% off 75+ units, 12% over 300, 22% over 750",
    aboutText: "Custom seasonal clearance discount with three volume tiers designed to move excess inventory. Configured with aggressive discounts at higher quantities to accelerate stock turnover.",
    isPreset: false, status: "Active", scope: "customer",
    validFrom: "1 May 2025", validTo: "31 Aug 2025", hasDateLimit: true, durationDays: 122,
    createdBy: "Elena Volkov", createdDate: "20 Apr 2025",
    tiers: [
      { minQty: "75 EA", maxQty: "299 EA", discount: "7%" },
      { minQty: "300 EA", maxQty: "749 EA", discount: "12%" },
      { minQty: "750 EA", maxQty: "3,000 EA", discount: "22%" },
    ],
    itemCount: 11, categoryCount: 3, partnerCount: 8,
  },

  // ───── CUSTOM PREMIUM RULES ─────
  {
    id: "hc-custom-prem-val-single",
    name: "Expedited Processing Fee",
    category: "premium", basis: "value", tierType: "single",
    description: "18% surcharge for rush orders under $5,000",
    aboutText: "Custom premium rule applying an expedited processing surcharge on orders requiring priority handling. Covers additional logistics and labor costs for rush fulfillment.",
    isPreset: false, status: "Active", scope: "vendor",
    validFrom: "1 Mar 2025", validTo: "28 Feb 2026", hasDateLimit: false, durationDays: 365,
    createdBy: "Ahtisham Ahmad", createdDate: "25 Feb 2025",
    tiers: [{ minQty: "$50", maxQty: "$5,000", discount: "18%" }],
    itemCount: 4, categoryCount: 1, partnerCount: 11,
  },
  {
    id: "hc-custom-prem-vol-single",
    name: "Small Order Handling Fee",
    category: "premium", basis: "volume", tierType: "single",
    description: "12% markup on orders under 30 units",
    aboutText: "A custom volume-based premium applied to small quantity orders. Offsets the per-unit overhead costs of handling, packaging, and shipping small batches.",
    isPreset: false, status: "Inactive", scope: "both",
    validFrom: "10 Feb 2025", validTo: "10 Aug 2025", hasDateLimit: true, durationDays: 181,
    createdBy: "Sarah Chen", createdDate: "5 Feb 2025",
    tiers: [{ minQty: "1 EA", maxQty: "29 EA", discount: "12%" }],
    itemCount: 0, categoryCount: 0, partnerCount: 5,
  },
  {
    id: "hc-custom-prem-val-multi",
    name: "VIP Exclusive Tiered Markup",
    category: "premium", basis: "value", tierType: "multiple",
    description: "5% on $1K+, 10% on $5K+, 18% on $20K+ exclusives",
    aboutText: "A multi-tier value-based premium for exclusive product lines available only through VIP channels. Higher-value orders carry progressively higher premiums reflecting product exclusivity.",
    isPreset: false, status: "Active", scope: "customer",
    validFrom: "15 Jan 2025", validTo: "15 Jan 2026", hasDateLimit: false, durationDays: 365,
    createdBy: "Marcus Obi", createdDate: "10 Jan 2025",
    tiers: [
      { minQty: "$1,000", maxQty: "$4,999", discount: "5%" },
      { minQty: "$5,000", maxQty: "$19,999", discount: "10%" },
      { minQty: "$20,000", maxQty: "$75,000", discount: "18%", isFixRate: true },
    ],
    itemCount: 3, categoryCount: 1, partnerCount: 4,
  },
  {
    id: "hc-custom-prem-vol-multi",
    name: "Micro-Batch Premium Tiers",
    category: "premium", basis: "volume", tierType: "multiple",
    description: "30% for 1–5 units, 20% for 6–15, 10% for 16–40",
    aboutText: "Custom multi-tier volume premium for micro-batch and sample orders. Highest surcharge on the smallest quantities, tapering off as order size increases toward standard thresholds.",
    isPreset: false, status: "Active", scope: "vendor",
    validFrom: "1 Feb 2025", validTo: "31 Jul 2025", hasDateLimit: true, durationDays: 180,
    createdBy: "Elena Volkov", createdDate: "25 Jan 2025",
    tiers: [
      { minQty: "1 EA", maxQty: "5 EA", discount: "30%" },
      { minQty: "6 EA", maxQty: "15 EA", discount: "20%", isFixRate: true },
      { minQty: "16 EA", maxQty: "40 EA", discount: "10%" },
    ],
    itemCount: 8, categoryCount: 2, partnerCount: 7,
  },
];

function generatePricingRules(vendor: Vendor, cfg?: VendorConfigData): PricingRule[] {
  const rng = seededRng(vendor.companyName.length * 17 + 3);
  const rules: PricingRule[] = [];

  // First, add cfg-based rules (these come from tenant config, always preset)
  const cfgRules = cfg?.pricingRules || [];
  cfgRules.forEach((cr) => {
    const p = PRICING_RULE_PRESETS.find((x) => x.id === cr.id);
    const itemCount = Math.floor(rng() * 14) + 3;
    const catCount = Math.floor(rng() * 4) + 1;
    const partnerCount = Math.floor(rng() * 10) + 3;
    const durDays = [60, 90, 180, 365][Math.floor(rng() * 4)];
    const start = new Date(2025, Math.floor(rng() * 4), Math.floor(rng() * 25) + 1);
    const end = new Date(start.getTime() + durDays * 86400000);
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

    const srcTiers = p?.tiers.map((t) => ({ minValue: t.minValue, maxValue: t.maxValue, discount: t.discount }))
      || [{ minValue: cr.basis === "volume" ? "35 EA" : "$1,000", maxValue: cr.basis === "volume" ? "500 EA" : "$32,000", discount: "13%" }];
    const tiers: TierData[] = srcTiers.map((t) => ({ minQty: t.minValue, maxQty: t.maxValue, discount: t.discount }));
    if ((p?.tierType === "multiple") && (p?.totalTiers || 1) > 1) {
      for (let ti = 1; ti < Math.min(p.totalTiers, 4); ti++) {
        const base = parseInt(srcTiers[0]?.maxValue.replace(/[^0-9]/g, "") || "100") * (ti + 1);
        tiers.push({
          minQty: p.basis === "volume" ? `${base} EA` : `$${base.toLocaleString()}`,
          maxQty: p.basis === "volume" ? `${base * 2} EA` : `$${(base * 2).toLocaleString()}`,
          discount: `${parseInt(srcTiers[0]?.discount || "5") + ti * 3}%`,
          isFixRate: ti === 1 && rng() > 0.7,
        });
      }
    }

    rules.push({
      id: cr.id,
      ruleNo: `VPR# ${23400 + rules.length + Math.floor(rng() * 200)}`,
      name: cr.name,
      category: (cr.type === "premium" ? "premium" : "discount") as "discount" | "premium",
      basis: (cr.basis === "volume" ? "volume" : "value") as "value" | "volume",
      tierType: (p?.tierType || "single") as "single" | "multiple",
      totalTiers: p?.totalTiers || 1,
      description: cr.description,
      aboutText: p?.aboutText || cr.description,
      status: rng() > 0.2 ? "Active" : "Inactive",
      scope: (["vendor", "customer", "both"] as const)[Math.floor(rng() * 3)],
      validFrom: fmt(start), validTo: fmt(end),
      hasDateLimit: rng() > 0.3, durationDays: durDays,
      itemCount, categoryCount: catCount, partnerCount, tiers,
      createdBy: pickArr(CREATORS, rng),
      createdDate: new Date(2025, Math.floor(rng() * 3), Math.floor(rng() * 28) + 1).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      warningText: undefined,
      isPreset: true,
      items: genItems(rng, itemCount),
      categories: genCategories(rng, catCount),
      partners: genPartners(rng, partnerCount),
    });
  });

  // Now add ALL hardcoded rules (diverse mix of preset/custom × discount/premium × single/multi × value/volume)
  const usedIds = new Set(rules.map((r) => r.id));
  HARDCODED_RULES.forEach((hr) => {
    if (usedIds.has(hr.id)) return;
    rules.push({
      id: hr.id,
      ruleNo: `VPR# ${23400 + rules.length + Math.floor(rng() * 300)}`,
      name: hr.name,
      category: hr.category,
      basis: hr.basis,
      tierType: hr.tierType,
      totalTiers: hr.tiers.length,
      description: hr.description,
      aboutText: hr.aboutText,
      status: hr.status,
      scope: hr.scope,
      validFrom: hr.validFrom,
      validTo: hr.validTo,
      hasDateLimit: hr.hasDateLimit,
      durationDays: hr.durationDays,
      itemCount: hr.itemCount,
      categoryCount: hr.categoryCount,
      partnerCount: hr.partnerCount,
      tiers: hr.tiers,
      createdBy: hr.createdBy,
      createdDate: hr.createdDate,
      warningText: hr.itemCount === 0 && hr.categoryCount === 0 ? "No items or categories assigned. Add them to activate." : undefined,
      isPreset: hr.isPreset,
      items: genItems(rng, hr.itemCount),
      categories: genCategories(rng, hr.categoryCount),
      partners: genPartners(rng, hr.partnerCount),
    });
  });

  return rules;
}

// ──────────────────────────────────────────────
// Compact Pricing Rule Card (v1-style reimagined)
// ──────────────────────────────────────────────

function PricingRuleCard({ rule, onClick }: { rule: PricingRule; onClick: () => void }) {
  const [activeTier, setActiveTier] = useState(0);
  const isDis = rule.category === "discount";
  const isMulti = rule.tierType === "multiple" && rule.tiers.length > 1;
  const t0 = rule.tiers[0];
  const shownTier = rule.tiers[isMulti ? activeTier : 0];
  const isPreset = rule.isPreset;

  // Color ONLY for the type pill — card body stays neutral
  const pill = isDis
    ? { text: "#047857", bg: "#ECFDF5", border: "#D1FAE5" }
    : { text: "#6D28D9", bg: "#F5F3FF", border: "#EDE9FE" };

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#E2E8F0] rounded-xl cursor-pointer group transition-all duration-200 flex flex-col relative h-[260px]"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#BFDBFE";
        e.currentTarget.style.boxShadow = "0 4px 16px -4px rgba(10,119,255,0.10), 0 0 0 1px #BFDBFE";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#E2E8F0";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="p-3.5 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Row 1: Type pill left · Preset lock / Custom badge right */}
        <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
          <span className="inline-flex items-stretch rounded-full overflow-hidden border shrink-0" style={{ borderColor: pill.border }}>
            <span
              className="inline-flex items-center gap-1 px-2 py-[2px] text-[10px]"
              style={{ fontWeight: 600, color: pill.text, backgroundColor: pill.bg }}
            >
              {isDis ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
              {isDis ? "Discount" : "Premium"}
            </span>
            <span className="inline-flex items-center px-2 py-[2px] text-[10px] bg-white text-[#64748B] border-l" style={{ fontWeight: 500, borderColor: pill.border }}>
              {rule.basis === "volume" ? "Volume" : "Value"}
            </span>
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {isPreset ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 px-1.5 py-[3px] rounded-md bg-[#F1F5F9] border border-[#E2E8F0] text-[9px] text-[#94A3B8]" style={{ fontWeight: 600 }}>
                    <Lock className="w-2.5 h-2.5" /> PRESET
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6} className="z-[300] !bg-white !text-[#334155] !border !border-[#E2E8F0] !shadow-sm rounded-lg text-[11px] px-2.5 py-1.5 max-w-[220px]" style={{ fontWeight: 500 }}>
                  System preset — tiers & config are locked. You can assign items, categories, and partners.
                </TooltipContent>
              </Tooltip>
            ) : (
              <span className="px-1.5 py-[2px] rounded-md text-[10px] border border-[#E2E8F0] bg-white text-[#64748B]" style={{ fontWeight: 500 }}>Custom</span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-[#CBD5E1] group-hover:text-[#94A3B8] hover:!text-[#475569] hover:bg-[#F1F5F9] transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] p-1 z-[200]">
                <DropdownMenuItem className="gap-2 py-1.5 cursor-pointer text-[13px]" onSelect={onClick}>
                  <Eye className="w-3.5 h-3.5 text-[#64748B]" /> View Details
                </DropdownMenuItem>
                {!isPreset && (
                  <DropdownMenuItem className="gap-2 py-1.5 cursor-pointer text-[13px]" onSelect={() => toast.info("Edit coming soon")}>
                    <Pencil className="w-3.5 h-3.5 text-[#64748B]" /> Edit Rule
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="gap-2 py-1.5 cursor-pointer text-[13px]" onSelect={() => toast.info("Duplicate coming soon")}>
                  <Copy className="w-3.5 h-3.5 text-[#64748B]" /> Duplicate as Custom
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 py-1.5 cursor-pointer text-[13px]" onSelect={() => toast.info("Toggle coming soon")}>
                  <ToggleLeft className="w-3.5 h-3.5 text-[#64748B]" /> {rule.status === "Active" ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                {!isPreset && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 py-1.5 cursor-pointer text-[13px] text-red-600 focus:text-red-600" onSelect={() => toast.info("Delete coming soon")}>
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Row 2: Name */}
        <div className="shrink-0 mb-1">
          <p className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}>{rule.name}</p>
        </div>

        {/* Row 3: Description — fixed 2-line height */}
        <div className="h-[32px] shrink-0 mb-2">
          <p className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed" style={{ fontWeight: 400 }}>{rule.description}</p>
        </div>

        {/* Row 4: Hero value */}
        <div className="flex items-baseline gap-2 shrink-0">
          <span className="text-[22px] text-[#0F172A] tabular-nums leading-none tracking-tight" style={{ fontWeight: 600 }}>
            {t0?.discount ?? "—"}
          </span>
          <span className="text-[11px] text-[#94A3B8]" style={{ fontWeight: 500 }}>
            {isDis ? "off" : "markup"}
          </span>
          {rule.warningText && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="ml-auto"><AlertTriangle className="w-3.5 h-3.5 text-[#D97706]" /></span>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="z-[300] !bg-white !text-[#92400E] !border !border-[#FDE68A] !shadow-sm rounded-lg text-[11px] px-2.5 py-1.5 max-w-[220px]" style={{ fontWeight: 500 }}>
                {rule.warningText}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Row 5: Tier display — fixed height region, pushed to bottom */}
        <div className="mt-auto pt-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Tier selector strip for multi-tier */}
          <div className={`h-[24px] mb-1.5 ${isMulti ? "flex items-center gap-[3px]" : ""}`}>
            {isMulti && rule.tiers.map((_, i) => {
              const isActive = activeTier === i;
              return (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveTier(i); }}
                  className={`h-[22px] rounded-md text-[10px] tabular-nums transition-all duration-200 cursor-pointer flex items-center justify-center px-2 ${
                    isActive
                      ? "bg-[#F1F5F9] text-[#334155] ring-1 ring-[#CBD5E1]"
                      : "bg-transparent text-[#C0C9D4] hover:bg-[#F8FAFC] hover:text-[#94A3B8]"
                  }`}
                  style={{ fontWeight: isActive ? 600 : 500 }}
                >
                  T{i + 1}
                  {isActive && (
                    <span className="ml-1 text-[9px] text-[#94A3B8]" style={{ fontWeight: 400 }}>
                      {shownTier.discount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {/* Tier detail row */}
          <div className="flex items-center justify-between px-3 py-[6px] rounded-lg border border-[#E8ECF1] bg-[#FAFBFC] text-[11px] tabular-nums min-w-0">
            <div className="flex items-center gap-1.5 text-[#64748B] min-w-0">
              <span style={{ fontWeight: 400 }}>{shownTier?.minQty}</span>
              <span className="text-[#CBD5E1]">–</span>
              <span style={{ fontWeight: 400 }}>{shownTier?.maxQty}</span>
            </div>
            <span className="shrink-0 ml-2 text-[#0F172A]" style={{ fontWeight: 600 }}>{shownTier?.discount}</span>
          </div>
        </div>
      </div>

      {/* Footer — pinned to bottom */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-t border-[#F1F5F9] shrink-0">
        <span className="inline-flex items-center gap-1 text-[10px] text-[#94A3B8]" style={{ fontWeight: 500 }}>
          <Package className="w-3 h-3" /> {rule.itemCount}
        </span>
        <span className="w-px h-3 bg-[#E8ECF1]" />
        <span className="inline-flex items-center gap-1 text-[10px] text-[#94A3B8]" style={{ fontWeight: 500 }}>
          <Layers className="w-3 h-3" /> {rule.categoryCount}
        </span>
        <span className="w-px h-3 bg-[#E8ECF1]" />
        <span className="inline-flex items-center gap-1 text-[10px] text-[#94A3B8]" style={{ fontWeight: 500 }}>
          <Users className="w-3 h-3" /> {rule.partnerCount}
        </span>
        <span
          className="ml-auto px-2 py-[2px] rounded-full text-[10px] border"
          style={{
            fontWeight: 500,
            color: rule.status === "Active" ? "#059669" : "#D97706",
            backgroundColor: rule.status === "Active" ? "#F0FDF4" : "#FFFBEB",
            borderColor: rule.status === "Active" ? "#BBF7D0" : "#FDE68A",
          }}
        >
          {rule.status}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────���────────────
// Detail Modal — Clean modern split panel
// ──────────────────────────────────────────────

const DETAIL_TABS_VISIBLE = [
  { id: "items", label: "Items", icon: Package },
  { id: "categories", label: "Categories", icon: Layers },
  { id: "partner", label: "Partner", icon: Users },
  { id: "attachments", label: "Attachments", icon: Paperclip },
  { id: "audit", label: "Audit log", icon: History },
  { id: "activity", label: "Recent Activity", icon: Activity },
] as const;

const DETAIL_TABS_OVERFLOW = [
  { id: "notes", label: "Notes" },
  { id: "history", label: "History" },
  { id: "compliance", label: "Compliance" },
  { id: "analytics", label: "Analytics" },
  { id: "approvals", label: "Approvals" },
  { id: "exceptions", label: "Exceptions" },
  { id: "reports", label: "Reports" },
] as const;

const PARTNER_TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Vendor": { bg: "#EFF6FF", text: "#0A77FF", border: "#BFDBFE" },
  "Seller": { bg: "#EFF6FF", text: "#0A77FF", border: "#BFDBFE" },
  "Sub-Contractor": { bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE" },
  "Service Provider": { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
  "Customer": { bg: "#FEF3C7", text: "#D97706", border: "#FDE68A" },
  "Carrier": { bg: "#FFF1F2", text: "#E11D48", border: "#FECDD3" },
};

function ItemTypeBadge({ type }: { type: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    "Parts": { bg: "#EFF6FF", text: "#0A77FF", border: "#BFDBFE" },
    "Equipment + Capital": { bg: "#ECFDF5", text: "#059669", border: "#A7F3D0" },
    "Equipment + Non-Capital": { bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE" },
    "Miscellaneous": { bg: "#FFFBEB", text: "#D97706", border: "#FDE68A" },
  };
  const c = colors[type] || colors["Parts"];
  return (
    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] border" style={{ fontWeight: 500, color: c.text, backgroundColor: c.bg, borderColor: c.border }}>
      {type}
    </span>
  );
}

function DetailModal({ rule, open, onClose, mode = "create", onApply, onDuplicate, onDisable }: { rule: PricingRule | null; open: boolean; onClose: () => void; mode?: "view" | "create"; onApply?: (rule: PricingRule) => void; onDuplicate?: (rule: PricingRule) => void; onDisable?: (rule: PricingRule) => void }) {
  const [tab, setTab] = useState<string>("items");
  const [itemSearch, setItemSearch] = useState("");
  const [catSearch, setCatSearch] = useState("");
  const [partnerSearch, setPartnerSearch] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!rule) return null;
  const isDis = rule.category === "discount";
  const isPreset = rule.isPreset;
  const theme = isDis
    ? { text: "#047857", pillBg: "#ECFDF5", pillBorder: "#D1FAE5" }
    : { text: "#6D28D9", pillBg: "#F5F3FF", pillBorder: "#EDE9FE" };

  const modalBaseClass = "!fixed !inset-0 !translate-x-0 !translate-y-0 !m-auto !w-full !h-full transition-[max-width,max-height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]";
  const modalSizeClass = isFullscreen
    ? `${modalBaseClass} !max-w-[calc(100%-1rem)] sm:!max-w-[calc(100%-1.5rem)] lg:!max-w-[calc(100%-2rem)] !max-h-[calc(100%-1rem)] sm:!max-h-[calc(100%-1.5rem)] lg:!max-h-[calc(100%-2rem)] !rounded-2xl`
    : `${modalBaseClass} !max-w-[100%] sm:!max-w-[960px] lg:!max-w-[1080px] !max-h-[100dvh] sm:!max-h-[90vh] rounded-none sm:!rounded-2xl`;

  const filteredItems = rule.items.filter((it) =>
    !itemSearch.trim() || it.partNo.toLowerCase().includes(itemSearch.toLowerCase()) || it.description.toLowerCase().includes(itemSearch.toLowerCase())
  );
  const filteredCats = rule.categories.filter((c) =>
    !catSearch.trim() || c.name.toLowerCase().includes(catSearch.toLowerCase())
  );
  const filteredPartners = rule.partners.filter((p) =>
    !partnerSearch.trim() || p.name.toLowerCase().includes(partnerSearch.toLowerCase())
  );

  const PR_DETAIL_TABS = [
    { id: "items", label: "Items", icon: Package, count: rule.itemCount },
    { id: "categories", label: "Categories", icon: Layers, count: rule.categoryCount },
    { id: "partner", label: "Partners", icon: Users, count: rule.partnerCount },
    { id: "notes", label: "Notes", icon: FileText, count: 0 },
    { id: "files", label: "Files", icon: Paperclip, count: 0 },
    { id: "activity", label: "Activity", icon: Activity, count: 0 },
  ];

  const creatorInitials = rule.createdBy.split(" ").map((n) => n[0]).join("");

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); setIsFullscreen(false); setTab("items"); } }}>
      <DialogContent
        className={`flex flex-col p-0 gap-0 border-0 sm:border z-[200] ${modalSizeClass}`}
        hideCloseButton
        style={{ boxShadow: "0 24px 48px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)" }}
      >
        <DialogTitle className="sr-only">Pricing Rule Details — {rule.name}</DialogTitle>
        <DialogDescription className="sr-only">Detailed view of pricing rule {rule.name}</DialogDescription>

        {/* ─── Header ─── */}
        <div className="shrink-0 bg-white rounded-t-none sm:rounded-t-2xl border-b border-[#E2E8F0]">
          <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={onClose} className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center hover:bg-[#F8FAFC] transition-colors cursor-pointer shrink-0">
                <ArrowLeft className="w-3.5 h-3.5 text-[#334155]" />
              </button>
              <h2 className="text-sm text-[#0F172A] truncate" style={{ fontWeight: 600 }}>Pricing Rule Details</h2>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {mode === "view" && (
                <>
                  <button
                    onClick={() => !isPreset && toast.info("Edit coming soon")}
                    disabled={isPreset}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                    style={{ fontWeight: 500 }}
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => !isPreset && toast.info("Archive coming soon")}
                    disabled={isPreset}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                    style={{ fontWeight: 500 }}
                  >
                    <Archive className="w-3.5 h-3.5" /> Archive
                  </button>
                  <button
                    onClick={() => {
                      if (rule && onDisable) {
                        onDisable(rule);
                        toast.success(`"${rule.name}" has been disabled`);
                        onClose();
                      } else {
                        toast.info("Disable coming soon");
                      }
                    }}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    style={{ fontWeight: 500 }}
                  >
                    <ToggleLeft className="w-3.5 h-3.5" /> Disable
                  </button>
                </>
              )}
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
              {PR_DETAIL_TABS.map((t) => {
                const active = tab === t.id;
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
                    {t.count > 0 && (
                      <span className={`text-[9px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center ${active ? "bg-[#EDF4FF] text-[#0A77FF]" : "bg-[#F1F5F9] text-[#64748B]"}`} style={{ fontWeight: 600 }}>
                        {t.count}
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
                        <input type="text" value={itemSearch} onChange={(e) => setItemSearch(e.target.value)} placeholder="Search items..." className="w-full pl-9 pr-3 h-8 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20 transition-colors placeholder:text-[#94A3B8]" />
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
                  {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-[#94A3B8]">
                      <Package className="w-8 h-8" />
                      <p className="text-[13px]" style={{ fontWeight: 500 }}>No items assigned</p>
                    </div>
                  ) : (
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-[#F8FAFC]">
                          <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Item</th>
                          <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Description</th>
                          <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Category</th>
                          <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Item Type</th>
                          <th className="text-left pl-4 pr-4 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredItems.map((item) => {
                          const statusColor = item.status === "Active"
                            ? { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0", dot: "#16A34A" }
                            : { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA", dot: "#DC2626" };
                          return (
                            <tr key={item.id} className="bg-white hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9]">
                              <td className="pl-4 pr-2 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0 border border-[#E2E8F0]">
                                    <Package className="w-3.5 h-3.5 text-[#94A3B8]" />
                                  </div>
                                  <span className="font-mono text-[12px] text-[#0F172A] whitespace-nowrap" style={{ fontWeight: 600 }}>{item.partNo}</span>
                                </div>
                              </td>
                              <td className="pl-4 pr-2 py-3 max-w-[220px]">
                                <p className="text-[12px] text-[#0F172A] truncate" style={{ fontWeight: 500 }}>{item.description}</p>
                              </td>
                              <td className="pl-4 pr-2 py-3 text-[12px] text-[#334155] whitespace-nowrap" style={{ fontWeight: 500 }}>{item.category}</td>
                              <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                                <ItemTypeBadge type={item.itemType} />
                              </td>
                              <td className="pl-4 pr-4 py-3 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ fontWeight: 600, backgroundColor: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor.dot }} />
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E2E8F0] shrink-0 bg-white">
                  <span className="text-[11px] text-[#64748B]">Showing <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{filteredItems.length}</span> of <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{rule.itemCount}</span> items</span>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-[#E2E8F0] bg-white text-[11px] text-[#334155] cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {tab === "categories" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-3 shrink-0 bg-white border-b border-[#E2E8F0]">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="relative flex-1 max-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
                        <input type="text" value={catSearch} onChange={(e) => setCatSearch(e.target.value)} placeholder="Search categories..." className="w-full pl-9 pr-3 h-8 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20 transition-colors placeholder:text-[#94A3B8]" />
                      </div>
                      <button className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] cursor-pointer transition-colors inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                        <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                      </button>
                    </div>
                    <button className="h-8 px-3 rounded-lg bg-[#0A77FF] text-white text-xs hover:bg-[#0A77FF]/90 cursor-pointer transition-colors inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                      + Add Category
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  {filteredCats.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-[#94A3B8]">
                      <Layers className="w-8 h-8" />
                      <p className="text-[13px]" style={{ fontWeight: 500 }}>No categories assigned</p>
                    </div>
                  ) : (
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-[#F8FAFC]">
                          <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Code</th>
                          <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Name</th>
                          <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Description</th>
                          <th className="text-right pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Linked Items</th>
                          <th className="text-left pl-4 pr-4 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCats.map((cat) => {
                          const statusColor = cat.status === "Active"
                            ? { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0", dot: "#16A34A" }
                            : { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA", dot: "#DC2626" };
                          return (
                            <tr key={cat.id} className="bg-white hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9]">
                              <td className="pl-4 pr-2 py-3">
                                <span className="font-mono text-[12px] text-[#0F172A]" style={{ fontWeight: 600 }}>{cat.code}</span>
                              </td>
                              <td className="pl-4 pr-2 py-3 text-[12px] text-[#334155]" style={{ fontWeight: 500 }}>{cat.name}</td>
                              <td className="pl-4 pr-2 py-3 max-w-[180px]">
                                <p className="text-[12px] text-[#475569] truncate">{cat.description}</p>
                              </td>
                              <td className="pl-4 pr-2 py-3 text-right">
                                <span className="text-[14px] text-[#0F172A] tabular-nums" style={{ fontWeight: 600 }}>{cat.linkedItems}</span>
                              </td>
                              <td className="pl-4 pr-4 py-3 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ fontWeight: 600, backgroundColor: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor.dot }} />
                                  {cat.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E2E8F0] shrink-0 bg-white">
                  <span className="text-[11px] text-[#64748B]">Showing <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{filteredCats.length}</span> of <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{rule.categoryCount}</span> categories</span>
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span>Records per page</span>
                    <select className="h-6 px-1.5 rounded border border-[#E2E8F0] bg-white text-[11px] text-[#334155] cursor-pointer outline-none">
                      <option>20</option><option>50</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Partners Tab */}
            {tab === "partner" && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-3 shrink-0 bg-white border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 max-w-[240px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none" />
                      <input type="text" value={partnerSearch} onChange={(e) => setPartnerSearch(e.target.value)} placeholder="Search partners..." className="w-full pl-9 pr-3 h-8 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20 transition-colors placeholder:text-[#94A3B8]" />
                    </div>
                    <button className="h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] cursor-pointer transition-colors inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}>
                      <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  {filteredPartners.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-[#94A3B8]">
                      <Users className="w-8 h-8" />
                      <p className="text-[13px]" style={{ fontWeight: 500 }}>No partners found</p>
                    </div>
                  ) : (
                    <table className="w-full text-xs">
                      <thead className="sticky top-0 z-10">
                        <tr className="bg-[#F8FAFC]">
                          <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Partner</th>
                          <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Type</th>
                          <th className="text-left pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Status</th>
                          <th className="text-right pl-4 pr-2 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Items</th>
                          <th className="text-right pl-4 pr-4 py-2.5 text-[#64748B] text-[11px] border-b border-[#E2E8F0] whitespace-nowrap" style={{ fontWeight: 500 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPartners.map((partner) => {
                          const statusColor = partner.status === "Active"
                            ? { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0", dot: "#16A34A" }
                            : { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA", dot: "#DC2626" };
                          return (
                            <tr key={partner.id} className="bg-white hover:bg-[#F8FAFC] transition-colors border-b border-[#F1F5F9]">
                              <td className="pl-4 pr-2 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-[#EBF3FF] flex items-center justify-center text-[10px] text-[#0A77FF] shrink-0" style={{ fontWeight: 600 }}>
                                    {partner.avatar}
                                  </div>
                                  <span className="text-[12px] text-[#0F172A] truncate" style={{ fontWeight: 500 }}>{partner.name}</span>
                                </div>
                              </td>
                              <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-1 flex-wrap">
                                  {partner.types.slice(0, 2).map((type) => {
                                    const tc = PARTNER_TYPE_COLORS[type] || PARTNER_TYPE_COLORS["Vendor"];
                                    return (
                                      <span key={type} className="inline-flex px-1.5 py-0.5 rounded text-[10px] border" style={{ fontWeight: 500, color: tc.text, backgroundColor: tc.bg, borderColor: tc.border }}>
                                        {type}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                              <td className="pl-4 pr-2 py-3 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]" style={{ fontWeight: 600, backgroundColor: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor.dot }} />
                                  {partner.status}
                                </span>
                              </td>
                              <td className="pl-4 pr-2 py-3 text-right">
                                <span className="text-[14px] text-[#0F172A] tabular-nums" style={{ fontWeight: 600 }}>{partner.itemCount}</span>
                              </td>
                              <td className="pl-4 pr-4 py-3 text-right">
                                <button className="w-6 h-6 rounded flex items-center justify-center text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
                                  <MoreHorizontal className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#E2E8F0] shrink-0 bg-white">
                  <span className="text-[11px] text-[#64748B]">Showing <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{filteredPartners.length}</span> of <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{rule.partnerCount}</span> partners</span>
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
            {tab !== "items" && tab !== "categories" && tab !== "partner" && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
                    {(() => { const T = PR_DETAIL_TABS.find((x) => x.id === tab); return T ? <T.icon className="w-5 h-5 text-[#94A3B8]" /> : null; })()}
                  </div>
                  <p className="text-sm text-[#0F172A]" style={{ fontWeight: 600 }}>{PR_DETAIL_TABS.find((x) => x.id === tab)?.label || tab}</p>
                  <p className="text-[11px] text-[#94A3B8] mt-1">Coming soon</p>
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT SIDEBAR: Info card ─── */}
          <div className="w-[280px] xl:w-[300px] border-l border-[#E2E8F0] shrink-0 overflow-y-auto bg-[#F8FAFC]">
            <div className="p-3.5">
              <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                {/* Card header */}
                <div className="px-3.5 py-2.5 border-b border-[#F1F5F9] flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: theme.pillBg }}>
                    <ChartColumn className="w-3 h-3" style={{ color: theme.text }} />
                  </div>
                  <span className="text-[12px] text-[#0F172A]" style={{ fontWeight: 600 }}>Rule Overview</span>
                </div>

                <div className="px-3.5 py-3 space-y-3">
                  {/* Rule Name */}
                  <div>
                    <p className="text-[10px] text-[#94A3B8] mb-px" style={{ fontWeight: 500 }}>Rule Name</p>
                    <p className="text-[12.5px] text-[#0F172A]" style={{ fontWeight: 600 }}>{rule.name}</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">{rule.description}</p>
                  </div>

                  {/* Type pills */}
                  <div>
                    <p className="text-[10px] text-[#94A3B8] mb-1" style={{ fontWeight: 500 }}>Rule Type</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md border"
                        style={{ fontWeight: 500, backgroundColor: theme.pillBg, borderColor: theme.pillBorder, color: theme.text }}
                      >
                        {isDis ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        {isDis ? "Discount" : "Premium"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]" style={{ fontWeight: 500 }}>
                        {rule.basis === "volume" ? <ChartColumn className="w-3 h-3" /> : <DollarSign className="w-3 h-3" />}
                        {rule.basis === "volume" ? "Volume" : "Value"}-Based
                      </span>
                      {isPreset && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md border border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B]" style={{ fontWeight: 600 }}>
                          <Lock className="w-2.5 h-2.5" /> PRESET
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Hero discount value */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#94A3B8] mb-px" style={{ fontWeight: 500 }}>{isDis ? "Discount" : "Premium"}</p>
                      <p className="text-[16px] text-[#0F172A] tabular-nums" style={{ fontWeight: 600 }}>{rule.tiers[0]?.discount || "—"}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#94A3B8] mb-px" style={{ fontWeight: 500 }}>Tiers</p>
                      <p className="text-[12.5px] text-[#0F172A]" style={{ fontWeight: 600 }}>{rule.tiers.length} {rule.tiers.length === 1 ? "tier" : "tiers"}</p>
                    </div>
                  </div>

                  {/* Status + Scope */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#94A3B8] mb-0.5" style={{ fontWeight: 500 }}>Status</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px]" style={{ fontWeight: 600, backgroundColor: rule.status === "Active" ? "#F0FDF4" : "#FFFBEB", color: rule.status === "Active" ? "#16A34A" : "#D97706", border: `1px solid ${rule.status === "Active" ? "#BBF7D0" : "#FDE68A"}` }}>
                        {rule.status}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#94A3B8] mb-px" style={{ fontWeight: 500 }}>Scope</p>
                      <p className="text-[12px] text-[#334155] capitalize" style={{ fontWeight: 500 }}>{rule.scope}</p>
                    </div>
                  </div>

                  {/* Date range */}
                  {rule.hasDateLimit && (
                    <div className="grid grid-cols-2 gap-x-4 pt-2.5 border-t border-[#F1F5F9]">
                      <div className="min-w-0">
                        <p className="text-[10px] text-[#94A3B8] mb-px" style={{ fontWeight: 500 }}>Valid From</p>
                        <p className="text-[12px] text-[#334155]" style={{ fontWeight: 500 }}>{rule.validFrom}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-[#94A3B8] mb-px" style={{ fontWeight: 500 }}>Valid To</p>
                        <p className="text-[12px] text-[#334155]" style={{ fontWeight: 500 }}>{rule.validTo}</p>
                      </div>
                    </div>
                  )}

                  {/* Tiers detail */}
                  <div className="pt-2.5 border-t border-[#F1F5F9] space-y-1.5">
                    <p className="text-[10px] text-[#94A3B8]" style={{ fontWeight: 500 }}>Tier Breakdown</p>
                    {rule.tiers.map((tier, idx) => (
                      <div key={idx} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-[#E8ECF1] bg-[#FAFBFC] text-[11px] tabular-nums">
                        <div className="flex items-center gap-1.5 text-[#64748B]">
                          <span className="w-4 h-4 rounded flex items-center justify-center text-[9px]" style={{ backgroundColor: theme.pillBg, color: theme.text, fontWeight: 700 }}>{idx + 1}</span>
                          <span>{tier.minQty}</span>
                          <span className="text-[#CBD5E1]">–</span>
                          <span>{tier.maxQty}</span>
                        </div>
                        <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{tier.discount}</span>
                      </div>
                    ))}
                  </div>

                  {/* Created By + Date */}
                  <div className="grid grid-cols-2 gap-x-4 pt-2.5 border-t border-[#F1F5F9]">
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#94A3B8] mb-0.5" style={{ fontWeight: 500 }}>Created By</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] shrink-0" style={{ backgroundColor: isPreset ? "#EDF4FF" : theme.pillBg, color: isPreset ? "#0A77FF" : theme.text, fontWeight: 700 }}>
                          {isPreset ? "OS" : creatorInitials}
                        </div>
                        <span className="text-[12px] text-[#334155] truncate" style={{ fontWeight: 500 }}>{isPreset ? "Omnesoft" : rule.createdBy}</span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-[#94A3B8] mb-px" style={{ fontWeight: 500 }}>Created On</p>
                      <p className="text-[12px] text-[#334155] mt-0.5" style={{ fontWeight: 500 }}>{rule.createdDate}</p>
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
            <span className="text-[11px] text-[#64748B]">Reviewing: <span className="text-[#0F172A]" style={{ fontWeight: 600 }}>{rule.name}</span></span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (rule && onDuplicate) { onDuplicate(rule); onClose(); }
                  else { toast.info("Duplicate coming soon"); }
                }}
                className="h-8 px-3.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}
              >
                <Copy className="w-3.5 h-3.5" /> Duplicate
              </button>
              {mode === "create" && (
                <button
                  onClick={() => {
                    if (rule && onApply) { onApply(rule); onClose(); }
                  }}
                  className="h-8 px-3.5 rounded-lg bg-[#0A77FF] text-white text-xs hover:bg-[#0A77FF]/90 transition-colors cursor-pointer inline-flex items-center gap-1.5" style={{ fontWeight: 500 }}
                >
                  <Check className="w-3.5 h-3.5" /> Use Template
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ──────────────────────────────────────────────
// Main Component
// ───────────────────────��──────────────────────

type SubTab = "vendor" | "customer";
type CategoryView = "discount" | "premium";
type QuickFilter = "all" | "preset" | "custom" | "active" | "inactive";

const QUICK_FILTER_DEFS: { key: QuickFilter; label: string; showCount: boolean }[] = [
  { key: "all", label: "All", showCount: true },
  { key: "preset", label: "Preset", showCount: true },
  { key: "custom", label: "Custom", showCount: true },
  { key: "active", label: "Active", showCount: true },
  { key: "inactive", label: "Inactive", showCount: true },
];

export function PricingRulesTabNew({ vendor, cfg }: { vendor: Vendor; cfg?: VendorConfigData }) {
  const allRules = useMemo(() => generatePricingRules(vendor, cfg), [vendor, cfg]);

  const [subTab, setSubTab] = useState<SubTab>("vendor");
  const [categoryView, setCategoryView] = useState<CategoryView>("discount");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [selectedRule, setSelectedRule] = useState<PricingRule | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMode, setDetailMode] = useState<"view" | "create">("view");

  // ── Explore Presets Modal state ──
  const [explorePresetsOpen, setExplorePresetsOpen] = useState(false);
  const [explorePresetsFullscreen, setExplorePresetsFullscreen] = useState(false);
  const [explorePresetsSidebar, setExplorePresetsSidebar] = useState("all");
  const [exploreCategoryTab, setExploreCategoryTab] = useState<"discount" | "premium">("discount");
  const [explorePresetsSearch, setExplorePresetsSearch] = useState("");
  const [exploreActiveTiers, setExploreActiveTiers] = useState<Record<string, number>>({});

  const exploreCards = useMemo<PricingRule[]>(() => {
    const expandedTiers: Record<string, TierData[]> = {
      "pr-3": [
        { minQty: "$ 500", maxQty: "$ 2,300", discount: "5%" },
        { minQty: "$ 2,300", maxQty: "$ 5,000", discount: "10%" },
        { minQty: "$ 5,000", maxQty: "$ 10,000", discount: "15%" },
        { minQty: "$ 10,000", maxQty: "$ 25,000", discount: "20%" },
      ],
      "pr-4": [
        { minQty: "35 EA", maxQty: "100 EA", discount: "5%" },
        { minQty: "100 EA", maxQty: "250 EA", discount: "10%" },
        { minQty: "250 EA", maxQty: "500 EA", discount: "15%" },
        { minQty: "500 EA", maxQty: "1,000 EA", discount: "20%" },
      ],
      "pr-7": [
        { minQty: "$ 0", maxQty: "$ 200", discount: "10%" },
        { minQty: "$ 200", maxQty: "$ 500", discount: "7%" },
        { minQty: "$ 500", maxQty: "$ 1,000", discount: "5%" },
        { minQty: "$ 1,000", maxQty: "$ 5,000", discount: "3%" },
      ],
      "pr-8": [
        { minQty: "1 EA", maxQty: "25 EA", discount: "$50" },
        { minQty: "25 EA", maxQty: "50 EA", discount: "$25" },
        { minQty: "50 EA", maxQty: "100 EA", discount: "$15" },
        { minQty: "100 EA", maxQty: "250 EA", discount: "$10" },
      ],
    };
    const mk = (id: string, ruleNo: string, name: string, cat: "discount"|"premium", basis: "value"|"volume", tierType: "single"|"multiple", tiers: TierData[], desc: string, about: string, preset: boolean, by: string, scope: "vendor"|"customer"|"both"): PricingRule => {
      const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 1000;
      const rng = seededRng(seed);
      const ic = Math.floor(rng() * 12) + 3, cc = Math.floor(rng() * 4) + 1, pc = Math.floor(rng() * 6) + 1;
      return { id, ruleNo, name, category: cat, basis, tierType, totalTiers: tiers.length, description: desc, aboutText: about, status: "Active", scope, validFrom: "Jan 01, 2026", validTo: "Dec 31, 2026", hasDateLimit: false, durationDays: 365, itemCount: ic, categoryCount: cc, partnerCount: pc, tiers, createdBy: by, createdDate: "Mar 01, 2026", isPreset: preset, items: genItems(rng, ic), categories: genCategories(rng, cc), partners: genPartners(rng, pc) };
    };
    const presetRules = PRICING_RULE_PRESETS.map(p => {
      const tiers = expandedTiers[p.id] || p.tiers.map(t => ({ minQty: t.minValue, maxQty: t.maxValue, discount: t.discount }));
      return mk(p.id, `PRE-${(p.id.split("-")[1] || "0").padStart(3, "0")}`, p.name, p.category as "discount" | "premium", p.basis, p.tierType, tiers, p.description, p.aboutText || "", true, "System", "both");
    });
    const byMe: PricingRule[] = [
      mk("cust-me-1", "CUS-001", "Early Payment Discount", "discount", "value", "single", [{ minQty: "$ 5,000", maxQty: "$ 50,000", discount: "8%" }], "8% discount for payments made within 10 days of invoice", "Encourages early payment by offering a percentage discount when partners pay invoices within a specified early window.", false, "Ahtisham Ahmad", "vendor"),
      mk("cust-me-2", "CUS-002", "Rush Order Premium", "premium", "volume", "single", [{ minQty: "1 EA", maxQty: "50 EA", discount: "12%" }], "12% surcharge on expedited orders under 50 units", "Applies a premium surcharge for rush orders requiring expedited processing and shipping for small quantities.", false, "Ahtisham Ahmad", "vendor"),
      mk("cust-me-3", "CUS-003", "Seasonal Volume Discount", "discount", "volume", "multiple", [{ minQty: "100 EA", maxQty: "300 EA", discount: "5%" }, { minQty: "300 EA", maxQty: "750 EA", discount: "10%" }, { minQty: "750 EA", maxQty: "2,000 EA", discount: "18%" }], "Tiered discounts for Q4 seasonal bulk ordering", "A multi-tier seasonal promotion offering increasing discounts at higher volume breakpoints during the Q4 ordering season.", false, "Ahtisham Ahmad", "both"),
    ];
    const byOthers: PricingRule[] = [
      mk("cust-oth-1", "CUS-004", "VIP Client Premium", "premium", "value", "single", [{ minQty: "$ 0", maxQty: "$ 10,000", discount: "15%" }], "15% premium for exclusive VIP-tier partnerships", "A value-based premium applied to VIP client orders, reflecting the enhanced service level and priority handling.", false, "Sarah Chen", "customer"),
      mk("cust-oth-2", "CUS-005", "Loyalty Tier Discount", "discount", "value", "multiple", [{ minQty: "$ 10,000", maxQty: "$ 25,000", discount: "3%" }, { minQty: "$ 25,000", maxQty: "$ 75,000", discount: "7%" }, { minQty: "$ 75,000", maxQty: "$ 200,000", discount: "12%" }], "Progressive discounts based on cumulative order value", "Rewards long-term partners with increasing discounts as their cumulative purchase value crosses defined thresholds.", false, "Marcus Obi", "both"),
      mk("cust-oth-3", "CUS-006", "Small Batch Surcharge", "premium", "volume", "single", [{ minQty: "1 EA", maxQty: "20 EA", discount: "$75" }], "Flat $75 handling fee for orders under 20 units", "Covers additional handling and logistics costs incurred when processing small batch orders below the minimum efficient quantity.", false, "Elena Volkov", "vendor"),
    ];
    return [...presetRules, ...byMe, ...byOthers];
  }, []);

  // ── Create Pricing Rule Modal state ──
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createFullscreen, setCreateFullscreen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createCategory, setCreateCategory] = useState<"discount" | "premium">("discount");
  const [createBasis, setCreateBasis] = useState<PricingRuleBasis>("value");
  const [createLimitDate, setCreateLimitDate] = useState(false);
  const [createValidFrom, setCreateValidFrom] = useState("");
  const [createValidTo, setCreateValidTo] = useState("");
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [createItemsTab, setCreateItemsTab] = useState<"items" | "categories" | "attachments">("items");

  interface CreateTierState {
    discount: string;
    fixRate: boolean;
    qtyLimits: boolean;
    minQty: string;
    maxQty: string;
  }
  const makeTier = (): CreateTierState => ({ discount: "", fixRate: false, qtyLimits: false, minQty: "", maxQty: "" });
  const [createTiers, setCreateTiers] = useState<CreateTierState[]>([makeTier()]);

  function updateTier(idx: number, patch: Partial<CreateTierState>) {
    setCreateTiers(prev => prev.map((t, i) => i === idx ? { ...t, ...patch } : t));
  }
  function addTier() { setCreateTiers(prev => [...prev, makeTier()]); }
  function removeTier(idx: number) { setCreateTiers(prev => prev.filter((_, i) => i !== idx)); }

  function resetCreateForm() {
    setCreateName(""); setCreateDescription(""); setCreateCategory("discount");
    setCreateBasis("value"); setCreateLimitDate(false); setCreateValidFrom("");
    setCreateValidTo(""); setCreateStep(1); setCreateItemsTab("items");
    setCreateTiers([makeTier()]);
  }
  function handleSaveRule() {
    if (!createName.trim()) return;
    toast.success("Pricing rule created successfully.");
    setCreateModalOpen(false);
    resetCreateForm();
    setCreateFullscreen(false);
  }
  const openDetail = useCallback((rule: PricingRule, openMode: "view" | "create" = "view") => {
    setSelectedRule(rule);
    setDetailMode(openMode);
    setDetailOpen(true);
  }, []);

  const subTabFiltered = useMemo(() => {
    if (subTab === "vendor") return allRules.filter((r) => r.scope === "vendor" || r.scope === "both");
    return allRules.filter((r) => r.scope === "customer" || r.scope === "both");
  }, [allRules, subTab]);

  // Category-scoped counts (used for the Discount/Premium toggle pills)
  const categoryCounts = useMemo(() => ({
    discount: subTabFiltered.filter((r) => r.category === "discount").length,
    premium: subTabFiltered.filter((r) => r.category === "premium").length,
  }), [subTabFiltered]);

  // The base list after category view is applied
  const categoryFiltered = useMemo(
    () => subTabFiltered.filter((r) => r.category === categoryView),
    [subTabFiltered, categoryView],
  );

  const filterCounts = useMemo(() => ({
    all: categoryFiltered.length,
    preset: categoryFiltered.filter((r) => r.isPreset).length,
    custom: categoryFiltered.filter((r) => !r.isPreset).length,
    active: categoryFiltered.filter((r) => r.status === "Active").length,
    inactive: categoryFiltered.filter((r) => r.status === "Inactive").length,
  }), [categoryFiltered]);

  const filtered = useMemo(() => {
    let list = categoryFiltered;
    if (quickFilter === "preset") list = list.filter((r) => r.isPreset);
    else if (quickFilter === "custom") list = list.filter((r) => !r.isPreset);
    else if (quickFilter === "active") list = list.filter((r) => r.status === "Active");
    else if (quickFilter === "inactive") list = list.filter((r) => r.status === "Inactive");

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.ruleNo.toLowerCase().includes(q));
    }
    // Sort: presets first, then custom; Active before Inactive; then alphabetical
    list = [...list].sort((a, b) => {
      if (a.isPreset !== b.isPreset) return a.isPreset ? -1 : 1;
      if (a.status !== b.status) return a.status === "Active" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [categoryFiltered, quickFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / recordsPerPage));
  const paginated = filtered.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  return (
    <div className="border border-border rounded-xl bg-card overflow-clip flex flex-col" style={{ minHeight: 400 }}>
      <DetailModal rule={selectedRule} open={detailOpen} onClose={() => setDetailOpen(false)} mode={detailMode} onApply={(r) => { toast.success(`"${r.name}" applied to this partner.`); }} onDuplicate={(r) => toast.info(`Duplicated "${r.name}"`)} onDisable={(r) => toast.success(`"${r.name}" disabled`)} />

      {/* Sub-tabs */}
      <div className="flex items-center border-b border-[#EEF2F6] bg-[#F8FAFC] shrink-0">
        {(["vendor", "customer"] as SubTab[]).map((t) => {
          const active = subTab === t;
          return (
            <button
              key={t}
              onClick={() => { setSubTab(t); setCurrentPage(1); setQuickFilter("all"); setCategoryView("discount"); }}
              className={`flex-1 text-center py-2.5 text-sm transition-all cursor-pointer relative ${active ? "text-[#0A77FF] bg-white" : "text-[#64748B] hover:text-[#334155]"}`}
              style={{ fontWeight: active ? 600 : 500 }}
            >
              {t === "vendor" ? "Vendor" : "Customer"}
              {active && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0A77FF]" />}
            </button>
          );
        })}
      </div>

      {/* Row 1: Search + Filters | Count + CTAs */}
      <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2 shrink-0">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
            <Input
              placeholder="Search pricing rules..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-8 h-9 text-sm bg-white border-border/80 shadow-sm placeholder:text-muted-foreground/50 focus-visible:border-primary focus-visible:ring-primary/20"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button type="button" onClick={() => toast.info("Advanced filters coming soon!")} className="inline-flex items-center justify-center h-9 gap-1.5 px-3 rounded-lg border border-border/80 bg-white shadow-sm hover:bg-muted/50 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 shrink-0 text-foreground">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm" style={{ fontWeight: 500 }}>Filters</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-sm tabular-nums mr-1 hidden sm:inline" style={{ fontWeight: 500 }}>
            {filtered.length !== categoryFiltered.length ? (
              <>
                <span className="text-foreground">{filtered.length}</span>
                <span className="text-muted-foreground/60"> of </span>
                <span className="text-muted-foreground">{categoryFiltered.length}</span>
                <span className="text-muted-foreground/70"> rules</span>
              </>
            ) : (
              <>
                <span className="text-foreground">{categoryFiltered.length}</span>
                <span className="text-muted-foreground/70"> rules</span>
              </>
            )}
          </span>

          <div className="w-px h-5 bg-border/60 mx-0.5 hidden sm:block" />

          <button type="button" onClick={() => { setExplorePresetsOpen(true); setExplorePresetsSidebar("all"); setExploreCategoryTab("discount"); setExplorePresetsSearch(""); }} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC] text-sm transition-colors cursor-pointer" style={{ fontWeight: 600 }}>
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Templates</span>
          </button>
          <button type="button" onClick={() => { resetCreateForm(); setCreateModalOpen(true); }} className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#0A77FF] hover:bg-[#0862D0] text-white text-sm shadow-sm transition-colors cursor-pointer" style={{ fontWeight: 600 }}>
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create new</span>
          </button>
        </div>
      </div>

      {/* Row 2: Category toggle (Discount / Premium) + Quick Filter Pills */}
      <div className="flex items-center gap-3 overflow-x-auto px-4 pb-3 shrink-0">
        {/* Category View Toggle */}
        <div className="inline-flex items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-0.5 shrink-0">
          {([
            { key: "discount" as CategoryView, label: "Discounts", icon: TrendingDown, color: "#047857", bg: "#ECFDF5", border: "#D1FAE5" },
            { key: "premium" as CategoryView, label: "Premiums", icon: TrendingUp, color: "#6D28D9", bg: "#F5F3FF", border: "#EDE9FE" },
          ]).map((cat) => {
            const active = categoryView === cat.key;
            const count = categoryCounts[cat.key];
            return (
              <button
                key={cat.key}
                onClick={() => { setCategoryView(cat.key); setQuickFilter("all"); setCurrentPage(1); }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                  active ? "bg-white shadow-sm" : "hover:bg-white/60"
                }`}
                style={{
                  fontWeight: active ? 600 : 500,
                  color: active ? cat.color : "#64748B",
                }}
              >
                <cat.icon className="w-3 h-3" />
                {cat.label}
                <span
                  className="text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center"
                  style={{
                    fontWeight: 600,
                    color: active ? cat.color : "#94A3B8",
                    backgroundColor: active ? cat.bg : "#F1F5F9",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Vertical divider */}
        <div className="w-px h-5 bg-[#E2E8F0] shrink-0" />

        {/* Quick Sort/Filter Pills */}
        <FilterPills
          options={QUICK_FILTER_DEFS.map((f) => ({
            key: f.key,
            label: f.label,
            count: filterCounts[f.key],
            showCount: f.showCount,
          }))}
          activeKey={quickFilter}
          onSelect={(k) => { setQuickFilter(k as QuickFilter); setCurrentPage(1); }}
        />
      </div>

      {/* Divider */}
      <div className="border-t border-border shrink-0" />

      {/* Card Grid — single category at a time, grouped by preset/custom */}
      <div className="p-4 min-h-0 overflow-y-auto flex-1">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF1] flex items-center justify-center">
              <FileText className="w-7 h-7 text-[#94A3B8]" />
            </div>
            <div className="text-center">
              <p className="text-sm text-[#334155]" style={{ fontWeight: 600 }}>No {categoryView} rules found</p>
              <p className="text-[13px] text-[#94A3B8] mt-1" style={{ fontWeight: 400 }}>
                {searchQuery ? "Try a different search term" : `Create a new ${categoryView} rule or browse templates to get started.`}
              </p>
            </div>
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }} className="text-xs text-[#0A77FF] hover:text-[#0862D0] cursor-pointer transition-colors" style={{ fontWeight: 500 }}>
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            {(() => {
              const presets = paginated.filter((r) => r.isPreset);
              const custom = paginated.filter((r) => !r.isPreset);
              const showSubHeaders = presets.length > 0 && custom.length > 0;
              return (
                <>
                  {presets.length > 0 && (
                    <div>
                      {showSubHeaders && (
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <Lock className="w-3 h-3 text-[#94A3B8]" />
                          <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider" style={{ fontWeight: 600 }}>System Presets</span>
                          <span className="text-[10px] text-[#0A77FF] bg-[#EDF4FF] px-1.5 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{presets.length}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                        {presets.map((rule) => (
                          <PricingRuleCard key={rule.id} rule={rule} onClick={() => openDetail(rule)} />
                        ))}
                      </div>
                    </div>
                  )}
                  {custom.length > 0 && (
                    <div>
                      {showSubHeaders && (
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <Pencil className="w-3 h-3 text-[#94A3B8]" />
                          <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider" style={{ fontWeight: 600 }}>Custom Rules</span>
                          <span className="text-[10px] text-[#0A77FF] bg-[#EDF4FF] px-1.5 py-0.5 rounded-full" style={{ fontWeight: 600 }}>{custom.length}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                        {custom.map((rule) => (
                          <PricingRuleCard key={rule.id} rule={rule} onClick={() => openDetail(rule)} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="border-t border-border shrink-0" />
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 shrink-0 bg-white">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="hidden sm:inline" style={{ fontWeight: 500 }}>Records per page</span>
          <select value={recordsPerPage} onChange={(e) => { setRecordsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="h-8 px-2 pr-7 rounded-lg border border-border bg-white text-sm text-foreground cursor-pointer outline-none focus:border-primary focus:ring-1 focus:ring-primary/20">
            {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-muted/60 disabled:opacity-30 text-muted-foreground cursor-pointer disabled:cursor-default transition-colors">
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-muted/60 disabled:opacity-30 text-muted-foreground text-xs cursor-pointer disabled:cursor-default transition-colors" style={{ fontWeight: 500 }}>
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>
          {(() => {
            const pages: (number | "...")[] = [];
            if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i); }
            else {
              pages.push(1);
              if (currentPage > 3) pages.push("...");
              for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
              if (currentPage < totalPages - 2) pages.push("...");
              pages.push(totalPages);
            }
            return pages.map((p, idx) =>
              p === "..." ? <span key={`d-${idx}`} className="px-1 text-muted-foreground text-xs">...</span> : (
                <button key={p} onClick={() => setCurrentPage(p as number)} className={`min-w-[32px] h-8 rounded-lg text-xs transition-colors cursor-pointer ${currentPage === p ? "bg-[#0A77FF] text-white shadow-sm" : "text-muted-foreground hover:bg-muted/60"}`} style={{ fontWeight: currentPage === p ? 600 : 500 }}>{p}</button>
              ));
          })()}
          <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-muted/60 disabled:opacity-30 text-muted-foreground text-xs cursor-pointer disabled:cursor-default transition-colors" style={{ fontWeight: 500 }}>
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-muted/60 disabled:opacity-30 text-muted-foreground cursor-pointer disabled:cursor-default transition-colors">
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Create New Pricing Rule Modal ── */}
      <Dialog open={createModalOpen} onOpenChange={(v) => { setCreateModalOpen(v); if (!v) { setCreateFullscreen(false); setCreateStep(1); } }}>
        <DialogContent
          className="p-0 gap-0 overflow-hidden z-[200] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] border-0 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.18)]"
          style={createFullscreen
            ? { maxWidth: "calc(100% - 1rem)", width: "calc(100% - 1rem)", height: "calc(100dvh - 1rem)", maxHeight: "calc(100dvh - 1rem)", borderRadius: 16 }
            : { maxWidth: 860, width: "92vw", height: "auto", maxHeight: "88vh", borderRadius: 16 }
          }
          hideCloseButton
        >
          <DialogTitle className="sr-only">Create New Pricing Rule</DialogTitle>
          <DialogDescription className="sr-only">Create a new pricing rule for this vendor.</DialogDescription>

          {/* Header — matching CreatePartnerModal pattern */}
          <div className="px-3 sm:px-4 lg:px-5 pt-3 sm:pt-4 pb-0 shrink-0 bg-white rounded-t-none sm:rounded-t-2xl border-b border-[#EEF2F6]">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[15px] sm:text-[17px] text-[#0F172A]" style={{ fontWeight: 700 }}>Create New Pricing Rule</h2>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F1F5F9] text-[11px] text-[#64748B]" style={{ fontWeight: 500 }}>
                    <ChartColumn className="w-3 h-3" /> Vendor Pricing Rule
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#64748B] mt-0.5" style={{ fontWeight: 400 }}>
                  Configure the type, tiers, and assign items for the new rule.
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => setCreateFullscreen(!createFullscreen)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer"
                  style={{ fontWeight: 500 }}
                >
                  {createFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  {createFullscreen ? "Exit full" : "Full view"}
                </button>
                <button
                  onClick={() => { setCreateModalOpen(false); setCreateFullscreen(false); resetCreateForm(); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Step tabs */}
            <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-3.5 overflow-x-auto -mb-px">
              {[
                { num: 1 as const, label: "Rule Setup", shortLabel: "Setup", active: createStep === 1, completed: createStep === 2 },
                { num: 2 as const, label: "Items & Attachments", shortLabel: "Items", active: createStep === 2, completed: false },
              ].map((tab) => (
                <div
                  key={tab.num}
                  className={`relative flex items-center gap-2 pb-2.5 sm:pb-3 ${
                    tab.num < createStep ? "cursor-pointer" : "cursor-default"
                  }`}
                  onClick={() => {
                    if (tab.num < createStep) setCreateStep(tab.num);
                  }}
                >
                  <div
                    className={`w-[22px] h-[22px] sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[11px] sm:text-[12px] shrink-0 transition-all duration-200 ${
                      tab.completed
                        ? "bg-[#10B981] text-white"
                        : tab.active
                        ? "bg-[#0A77FF] text-white"
                        : "border-[1.5px] border-[#CBD5E1] text-[#64748B] bg-white"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {tab.completed ? <Check className="w-3 h-3" /> : tab.num}
                  </div>
                  <span
                    className={`text-[12px] sm:text-[13px] whitespace-nowrap transition-colors ${
                      tab.active
                        ? "text-[#0A77FF]"
                        : tab.completed
                        ? "text-[#10B981]"
                        : "text-[#334155]"
                    }`}
                    style={{ fontWeight: tab.active || tab.completed ? 600 : 500 }}
                  >
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </span>
                  {(tab.active || tab.completed) && (
                    <div className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full ${tab.completed ? "bg-[#10B981]" : "bg-[#0A77FF]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-[#FAFBFC] scrollbar-hide">
            <div className="px-4 py-4 transition-all duration-300 ease-out">

              {/* ─── Step 1: Rule Setup ─── */}
              {createStep === 1 && (
                <div className="space-y-5">
                  {/* Pricing Rule Type — Clean gradient cards (CreatePartnerModal style) */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-sm text-[#0F172A]" style={{ fontWeight: 600 }}>Pricing Rule Type</span>
                      <Tooltip><TooltipTrigger asChild><span><Info className="w-3.5 h-3.5 text-[#CBD5E1]" /></span></TooltipTrigger><TooltipContent className="z-[300]"><p className="text-xs">Choose whether this rule decreases or increases prices.</p></TooltipContent></Tooltip>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Discount card — green accents */}
                      <div
                        onClick={() => setCreateCategory("discount")}
                        className={`group relative rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${
                          createCategory === "discount"
                            ? "border-[#86EFAC]/70 bg-white shadow-[0_1px_4px_rgba(4,120,87,0.06)]"
                            : "border-[#E2E8F0] bg-white hover:border-[#BBF7D0] hover:shadow-[0_4px_16px_-4px_rgba(4,120,87,0.10)]"
                        }`}
                      >
                        <div className={`absolute inset-0 transition-all duration-300 pointer-events-none ${
                          createCategory === "discount"
                            ? "bg-gradient-to-br from-[#F0FDF4]/50 to-transparent"
                            : "bg-gradient-to-br from-[#F0FDF4]/0 to-[#F0FDF4]/0 group-hover:from-[#F0FDF4]/60 group-hover:to-transparent"
                        }`} />
                        <div className="relative flex items-center gap-3 pl-3.5 pr-3 py-3">
                          <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 transition-all duration-200 ${
                            createCategory === "discount"
                              ? "bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] text-[#15803D]"
                              : "bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] text-[#16A34A] group-hover:scale-105"
                          }`}>
                            <TrendingDown className="w-[18px] h-[18px]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[13px] transition-colors duration-150 ${
                              createCategory === "discount" ? "text-[#166534]" : "text-[#0F172A] group-hover:text-[#1E293B]"
                            }`} style={{ fontWeight: 600 }}>Discount</p>
                            <p className={`text-[11px] mt-0.5 truncate transition-colors duration-150 ${
                              createCategory === "discount" ? "text-[#22C55E]" : "text-[#94A3B8]"
                            }`}>Lower price adjustment</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
                            createCategory === "discount"
                              ? ""
                              : "border-[1.5px] border-[#D1D5DB] bg-white group-hover:border-[#86EFAC]"
                          }`} style={createCategory === "discount" ? { backgroundColor: "#16A34A", boxShadow: "0 0 0 2px rgba(22,163,74,0.15)" } : {}}>
                            {createCategory === "discount" && <Check className="w-3 h-3 text-white" strokeWidth={2.5} />}
                          </div>
                        </div>
                      </div>

                      {/* Premium card — purple accents */}
                      <div
                        onClick={() => setCreateCategory("premium")}
                        className={`group relative rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${
                          createCategory === "premium"
                            ? "border-[#C4B5FD]/70 bg-white shadow-[0_1px_4px_rgba(124,58,237,0.06)]"
                            : "border-[#E2E8F0] bg-white hover:border-[#DDD6FE] hover:shadow-[0_4px_16px_-4px_rgba(124,58,237,0.10)]"
                        }`}
                      >
                        <div className={`absolute inset-0 transition-all duration-300 pointer-events-none ${
                          createCategory === "premium"
                            ? "bg-gradient-to-br from-[#F5F3FF]/50 to-transparent"
                            : "bg-gradient-to-br from-[#F5F3FF]/0 to-[#F5F3FF]/0 group-hover:from-[#F5F3FF]/60 group-hover:to-transparent"
                        }`} />
                        <div className="relative flex items-center gap-3 pl-3.5 pr-3 py-3">
                          <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 transition-all duration-200 ${
                            createCategory === "premium"
                              ? "bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] text-[#7C3AED]"
                              : "bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] text-[#8B5CF6] group-hover:scale-105"
                          }`}>
                            <TrendingUp className="w-[18px] h-[18px]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[13px] transition-colors duration-150 ${
                              createCategory === "premium" ? "text-[#5B21B6]" : "text-[#0F172A] group-hover:text-[#1E293B]"
                            }`} style={{ fontWeight: 600 }}>Premium</p>
                            <p className={`text-[11px] mt-0.5 truncate transition-colors duration-150 ${
                              createCategory === "premium" ? "text-[#8B5CF6]" : "text-[#94A3B8]"
                            }`}>Higher price adjustment</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 ${
                            createCategory === "premium"
                              ? ""
                              : "border-[1.5px] border-[#D1D5DB] bg-white group-hover:border-[#C4B5FD]"
                          }`} style={createCategory === "premium" ? { backgroundColor: "#8B5CF6", boxShadow: "0 0 0 2px rgba(139,92,246,0.15)" } : {}}>
                            {createCategory === "premium" && <Check className="w-3 h-3 text-white" strokeWidth={2.5} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Basis selector pills */}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[12px] text-[#64748B] mr-1" style={{ fontWeight: 500 }}>Basis:</span>
                      {(["volume", "value"] as const).map((b) => (
                        <button
                          key={b}
                          onClick={() => setCreateBasis(b)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] transition-all cursor-pointer ${
                            createBasis === b
                              ? createCategory === "discount"
                                ? "border-[#16A34A]/30 bg-[#F0FDF4] text-[#15803D]"
                                : "border-[#7C3AED]/30 bg-[#F5F3FF] text-[#6D28D9]"
                              : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                          }`}
                          style={{ fontWeight: createBasis === b ? 600 : 500 }}
                        >
                          {b === "volume" ? <ChartColumn className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
                          {b === "volume" ? "Volume-Based" : "Value-Based"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Rule Details */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-sm text-[#0F172A]" style={{ fontWeight: 600 }}>Pricing Rule Details</span>
                      <Tooltip><TooltipTrigger asChild><span><Info className="w-3.5 h-3.5 text-[#CBD5E1]" /></span></TooltipTrigger><TooltipContent className="z-[300]"><p className="text-xs">Name and describe this pricing rule.</p></TooltipContent></Tooltip>
                    </div>
                    <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[12px] text-[#0F172A] mb-1.5 block" style={{ fontWeight: 600 }}>{createCategory === "discount" ? "Discount" : "Premium"} Name</label>
                          <Input
                            value={createName}
                            onChange={(e) => setCreateName(e.target.value)}
                            placeholder={`e.g. ${createCategory === "discount" ? "Volume Discount for Q4" : "Premium Markup for VIP"}`}
                            className="rounded-lg border-[#E2E8F0] bg-white text-[13px]"
                          />
                        </div>
                        <div>
                          <label className="text-[12px] text-[#0F172A] mb-1.5 block" style={{ fontWeight: 600 }}>Description</label>
                          <Textarea
                            value={createDescription}
                            onChange={(e) => setCreateDescription(e.target.value.slice(0, 150))}
                            placeholder="Type here..."
                            className="rounded-lg border-[#E2E8F0] bg-white min-h-[38px] resize-none text-[13px]"
                            rows={2}
                          />
                          <p className="text-right text-[10px] text-[#94A3B8] mt-0.5">{createDescription.length}/150</p>
                        </div>
                      </div>

                      {/* Limit to date range toggle + conditional fields */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <Switch checked={createLimitDate} onCheckedChange={setCreateLimitDate} />
                          <span className="text-[13px] text-[#0F172A]" style={{ fontWeight: 500 }}>Limit Rule to Date Range</span>
                        </div>
                        {createLimitDate && (
                          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#F1F5F9]">
                            <div>
                              <div className="flex items-center gap-1 mb-1.5">
                                <label className="text-[12px] text-[#0F172A]" style={{ fontWeight: 600 }}>Valid From</label>
                                <Tooltip><TooltipTrigger asChild><span><Info className="w-3 h-3 text-[#CBD5E1]" /></span></TooltipTrigger><TooltipContent className="z-[300]"><p className="text-xs">Start date for this rule.</p></TooltipContent></Tooltip>
                              </div>
                              <Input
                                type="date"
                                value={createValidFrom}
                                onChange={(e) => setCreateValidFrom(e.target.value)}
                                className="rounded-lg border-[#E2E8F0] bg-white text-[13px]"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1 mb-1.5">
                                <label className="text-[12px] text-[#0F172A]" style={{ fontWeight: 600 }}>Valid To</label>
                                <Tooltip><TooltipTrigger asChild><span><Info className="w-3 h-3 text-[#CBD5E1]" /></span></TooltipTrigger><TooltipContent className="z-[300]"><p className="text-xs">End date for this rule.</p></TooltipContent></Tooltip>
                              </div>
                              <Input
                                type="date"
                                value={createValidTo}
                                onChange={(e) => setCreateValidTo(e.target.value)}
                                className="rounded-lg border-[#E2E8F0] bg-white text-[13px]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tiers — multiple, with add/remove */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-[#0F172A]" style={{ fontWeight: 600 }}>{createCategory === "discount" ? "Discount" : "Premium"} Tiers</span>
                        <span className="text-[11px] text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded" style={{ fontWeight: 600 }}>{createTiers.length}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {createTiers.map((tier, idx) => (
                        <div key={idx} className="rounded-xl border border-[#E2E8F0] bg-white p-4 relative">
                          {/* Tier header row */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[#94A3B8]" style={{ fontWeight: 600 }}>#{idx + 1}</span>
                              <span className="text-[13px] text-[#0F172A]" style={{ fontWeight: 600 }}>{createCategory === "discount" ? "Discount" : "Premium"} Tier</span>
                            </div>
                            {idx > 0 && (
                              <button
                                onClick={() => removeTier(idx)}
                                className="w-7 h-7 rounded-full border border-[#FEE2E2] bg-[#FEF2F2] flex items-center justify-center text-[#EF4444] hover:bg-[#FEE2E2] hover:border-[#FECACA] transition-all cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Percentage / Price row */}
                          <div className="flex items-start gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-1 mb-1.5">
                                <label className="text-[12px] text-[#0F172A]" style={{ fontWeight: 500 }}>
                                  {tier.fixRate
                                    ? `${createCategory === "discount" ? "Discount" : "Premium"} Price ($)`
                                    : `${createCategory === "discount" ? "Discount" : "Premium"} Percentage (%)`}
                                </label>
                                <Tooltip><TooltipTrigger asChild><span><Info className="w-3 h-3 text-[#CBD5E1]" /></span></TooltipTrigger><TooltipContent className="z-[300]"><p className="text-xs">{tier.fixRate ? "Fixed dollar amount adjustment." : "Percentage-based adjustment."}</p></TooltipContent></Tooltip>
                              </div>
                              <div className="relative">
                                <Input
                                  value={tier.discount}
                                  onChange={(e) => updateTier(idx, { discount: e.target.value })}
                                  placeholder={tier.fixRate ? "Enter price (e.g., 5$)" : "Enter percentage (e.g., 50%)"}
                                  className="rounded-lg border-[#E2E8F0] bg-white text-[13px] pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-[#94A3B8]">{tier.fixRate ? "$" : "%"}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 pt-7">
                              <Switch checked={tier.fixRate} onCheckedChange={(v) => updateTier(idx, { fixRate: v })} />
                              <div className="flex items-center gap-1">
                                <span className="text-[12px] text-[#0F172A] whitespace-nowrap" style={{ fontWeight: 500 }}>Fix {createCategory === "discount" ? "Discount" : "Premium"} Rate ($)</span>
                                <Tooltip><TooltipTrigger asChild><span><Info className="w-3 h-3 text-[#CBD5E1]" /></span></TooltipTrigger><TooltipContent className="z-[300]"><p className="text-xs">Toggle between percentage and fixed dollar amount.</p></TooltipContent></Tooltip>
                              </div>
                            </div>
                          </div>

                          {/* Quantity limits toggle + conditional fields */}
                          <div>
                            <div className="flex items-center gap-2.5">
                              <Switch checked={tier.qtyLimits} onCheckedChange={(v) => updateTier(idx, { qtyLimits: v })} />
                              <span className="text-[13px] text-[#0F172A]" style={{ fontWeight: 500 }}>Enable order quantity limits</span>
                            </div>
                            {tier.qtyLimits && (
                              <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#F1F5F9]">
                                <div>
                                  <div className="flex items-center gap-1 mb-1.5">
                                    <label className="text-[12px] text-[#0F172A]" style={{ fontWeight: 500 }}>Minimum Order Quantity</label>
                                    <Tooltip><TooltipTrigger asChild><span><Info className="w-3 h-3 text-[#CBD5E1]" /></span></TooltipTrigger><TooltipContent className="z-[300]"><p className="text-xs">Minimum units for this tier to apply.</p></TooltipContent></Tooltip>
                                  </div>
                                  <Input
                                    value={tier.minQty}
                                    onChange={(e) => updateTier(idx, { minQty: e.target.value })}
                                    placeholder="Enter minimum units"
                                    className="rounded-lg border-[#E2E8F0] bg-white text-[13px]"
                                  />
                                </div>
                                <div>
                                  <div className="flex items-center gap-1 mb-1.5">
                                    <label className="text-[12px] text-[#0F172A]" style={{ fontWeight: 500 }}>Maximum Order Quantity</label>
                                    <Tooltip><TooltipTrigger asChild><span><Info className="w-3 h-3 text-[#CBD5E1]" /></span></TooltipTrigger><TooltipContent className="z-[300]"><p className="text-xs">Maximum units for this tier to apply.</p></TooltipContent></Tooltip>
                                  </div>
                                  <Input
                                    value={tier.maxQty}
                                    onChange={(e) => updateTier(idx, { maxQty: e.target.value })}
                                    placeholder="Enter maximum units"
                                    className="rounded-lg border-[#E2E8F0] bg-white text-[13px]"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={addTier}
                      className={`inline-flex items-center gap-1.5 mt-3 text-[12px] transition-colors cursor-pointer ${createCategory === "discount" ? "text-[#16A34A] hover:text-[#15803D]" : "text-[#7C3AED] hover:text-[#6D28D9]"}`}
                      style={{ fontWeight: 600 }}
                    >
                      <Plus className="w-3.5 h-3.5" /> Add {createCategory === "discount" ? "Discount" : "Premium"} Tier
                    </button>
                  </div>
                </div>
              )}

              {/* ─── Step 2: Items, Categories & Attachments ─── */}
              {createStep === 2 && (
                <div className="space-y-5">
                  {/* Summary banner */}
                  <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 ${createCategory === "discount" ? "bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0]" : "bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE]"}`}>
                      {createCategory === "discount" ? <TrendingDown className="w-4.5 h-4.5 text-[#15803D]" /> : <TrendingUp className="w-4.5 h-4.5 text-[#7C3AED]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}>{createName || "Untitled Rule"}</p>
                      <p className="text-[11px] text-[#64748B] truncate">{createCategory === "discount" ? "Discount" : "Premium"} · {createBasis === "volume" ? "Volume-Based" : "Value-Based"} · {createTiers.length} tier{createTiers.length !== 1 ? "s" : ""}{createTiers[0]?.discount ? ` · ${createTiers[0].discount}${createTiers[0].fixRate ? "$" : "%"}` : ""}</p>
                    </div>
                    <button
                      onClick={() => setCreateStep(1)}
                      className="text-[11px] text-[#0A77FF] hover:text-[#0862D0] transition-colors cursor-pointer shrink-0"
                      style={{ fontWeight: 600 }}
                    >
                      Edit Setup
                    </button>
                  </div>

                  {/* Items & Categories card */}
                  <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
                    <div className="flex items-center gap-0 border-b border-[#E2E8F0] px-4">
                      {([
                        { key: "items" as const, label: "Items", icon: Package, count: 0 },
                        { key: "categories" as const, label: "Categories", icon: FolderOpen, count: 0 },
                        { key: "attachments" as const, label: "Attachments", icon: Paperclip, count: 0 },
                      ]).map((t) => (
                        <button
                          key={t.key}
                          onClick={() => setCreateItemsTab(t.key)}
                          className={`relative px-3 py-2.5 text-[12px] flex items-center gap-1.5 transition-colors cursor-pointer ${createItemsTab === t.key ? "text-[#0A77FF]" : "text-[#64748B] hover:text-[#334155]"}`}
                          style={{ fontWeight: createItemsTab === t.key ? 600 : 500 }}
                        >
                          <t.icon className="w-3.5 h-3.5" />
                          {t.label}
                          <span className={`px-1.5 py-0.5 rounded text-[10px] ${createItemsTab === t.key ? "bg-[#DBEAFE] text-[#0A77FF]" : "bg-[#F1F5F9] text-[#94A3B8]"}`} style={{ fontWeight: 700 }}>{t.count}</span>
                          {createItemsTab === t.key && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[#0A77FF]" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Tab content — Items */}
                    {createItemsTab === "items" && (
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                            <Input placeholder="Search items to assign..." className="pl-9 rounded-lg border-[#E2E8F0] bg-[#F8FAFC] text-[13px] h-9" />
                          </div>
                          <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#0A77FF] hover:bg-[#0862D0] text-white text-[12px] shadow-sm transition-colors cursor-pointer" style={{ fontWeight: 600 }}>
                            <Plus className="w-3.5 h-3.5" /> Add Items
                          </button>
                        </div>
                        <div className="py-8 text-center">
                          <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E8ECF1] flex items-center justify-center mx-auto mb-3">
                            <Package className="w-5.5 h-5.5 text-[#94A3B8]" />
                          </div>
                          <p className="text-[13px] text-[#334155] mb-1" style={{ fontWeight: 600 }}>No items assigned yet</p>
                          <p className="text-[11px] text-[#94A3B8] max-w-[260px] mx-auto">Search and add items that should be affected by this pricing rule.</p>
                        </div>
                      </div>
                    )}

                    {/* Tab content — Categories */}
                    {createItemsTab === "categories" && (
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                            <Input placeholder="Search categories to assign..." className="pl-9 rounded-lg border-[#E2E8F0] bg-[#F8FAFC] text-[13px] h-9" />
                          </div>
                          <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#0A77FF] hover:bg-[#0862D0] text-white text-[12px] shadow-sm transition-colors cursor-pointer" style={{ fontWeight: 600 }}>
                            <Plus className="w-3.5 h-3.5" /> Add Categories
                          </button>
                        </div>
                        <div className="py-8 text-center">
                          <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E8ECF1] flex items-center justify-center mx-auto mb-3">
                            <FolderOpen className="w-5.5 h-5.5 text-[#94A3B8]" />
                          </div>
                          <p className="text-[13px] text-[#334155] mb-1" style={{ fontWeight: 600 }}>No categories assigned yet</p>
                          <p className="text-[11px] text-[#94A3B8] max-w-[260px] mx-auto">Assign categories to apply this pricing rule to all items within them.</p>
                        </div>
                      </div>
                    )}

                    {/* Tab content — Attachments */}
                    {createItemsTab === "attachments" && (
                      <div className="p-4">
                        <div className="py-8 text-center">
                          <div className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-[#E8ECF1] border-dashed flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-5.5 h-5.5 text-[#94A3B8]" />
                          </div>
                          <p className="text-[13px] text-[#334155] mb-1" style={{ fontWeight: 600 }}>No attachments yet</p>
                          <p className="text-[11px] text-[#94A3B8] max-w-[280px] mx-auto mb-3">Upload supporting documents, contracts, or approval files for this pricing rule.</p>
                          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#334155] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors cursor-pointer" style={{ fontWeight: 600 }}>
                            <Upload className="w-3.5 h-3.5" /> Upload Files
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer — step-aware */}
          <div className="shrink-0 border-t border-[#EEF2F6] bg-white px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 flex items-center justify-end gap-2 sm:gap-2.5 sm:rounded-b-2xl">
            {createStep === 1 ? (
              <>
                <button
                  onClick={() => { setCreateModalOpen(false); resetCreateForm(); setCreateFullscreen(false); }}
                  className="px-3 sm:px-5 py-2 rounded-lg border border-[#E2E8F0] text-xs sm:text-[13px] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  style={{ fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { if (createName.trim()) setCreateStep(2); }}
                  disabled={!createName.trim()}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-2 rounded-lg bg-[#0A77FF] text-white text-xs sm:text-[13px] hover:bg-[#0862D0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                  style={{ fontWeight: 600 }}
                >
                  Continue
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCreateStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] text-[#64748B] hover:text-[#0F172A] transition-colors mr-auto cursor-pointer"
                  style={{ fontWeight: 500 }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back</span>
                </button>
                <button
                  onClick={() => { setCreateModalOpen(false); resetCreateForm(); setCreateFullscreen(false); }}
                  className="px-3 sm:px-5 py-2 rounded-lg border border-[#E2E8F0] text-xs sm:text-[13px] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  style={{ fontWeight: 600 }}
                >
                  Discard
                </button>
                <button
                  onClick={handleSaveRule}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-2 rounded-lg bg-[#0A77FF] text-white text-xs sm:text-[13px] hover:bg-[#0862D0] transition-colors shadow-sm cursor-pointer"
                  style={{ fontWeight: 600 }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Save & Create</span>
                  <span className="sm:hidden">Create</span>
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Explore Presets Modal ─── */}
      <Dialog open={explorePresetsOpen} onOpenChange={(v) => { if (!v) { setExplorePresetsOpen(false); setExplorePresetsFullscreen(false); } }}>
        <DialogContent
          className={`flex flex-col gap-0 overflow-hidden border-0 sm:border p-0 sm:!rounded-2xl shadow-2xl z-[200] transition-[max-width,max-height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            explorePresetsFullscreen
              ? "!fixed !inset-0 !max-w-full !max-h-full !rounded-none !translate-x-0 !translate-y-0 !top-0 !left-0"
              : "sm:max-w-[960px] sm:max-h-[85vh]"
          }`}
          hideCloseButton
        >
          <DialogTitle className="sr-only">Pricing Rule Presets</DialogTitle>
          <DialogDescription className="sr-only">Browse and apply pricing rules</DialogDescription>

          {/* Header area — white background, no bottom border yet */}
          <div className="shrink-0 bg-white px-4 sm:px-5 pt-4 sm:pt-5 pb-0 sm:!rounded-t-2xl">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="min-w-0">
                <h2 className="text-[15px] text-[#0F172A]" style={{ fontWeight: 700 }}>Pricing Rule Presets</h2>
                <p className="text-[12px] text-[#94A3B8] mt-0.5">Browse and apply pricing rules to this vendor</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setExplorePresetsFullscreen(f => !f)}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors cursor-pointer"
                  style={{ fontWeight: 500 }}
                >
                  {explorePresetsFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{explorePresetsFullscreen ? "Exit full view" : "Full view"}</span>
                </button>
                <button
                  onClick={() => { setExplorePresetsOpen(false); setExplorePresetsFullscreen(false); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search row */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-1 max-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                <Input
                  value={explorePresetsSearch}
                  onChange={(e) => setExplorePresetsSearch(e.target.value)}
                  placeholder="Search pricing rules..."
                  className="pl-9 h-9 rounded-lg border-[#E2E8F0] bg-[#FAFBFC] text-[13px]"
                />
                {explorePresetsSearch && (
                  <button onClick={() => setExplorePresetsSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 ml-auto shrink-0">
                <span className="inline-flex items-center justify-center min-w-7 h-7 px-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[12px] text-[#64748B] tabular-nums" style={{ fontWeight: 600 }}>
                  {exploreCards.length}
                </span>
                <button
                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[12px] text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-colors cursor-pointer"
                  style={{ fontWeight: 500 }}
                  onClick={() => toast.info("Sort options coming soon")}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Name</span>
                  <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                </button>
                <button
                  onClick={() => {
                    setExplorePresetsOpen(false);
                    setExplorePresetsFullscreen(false);
                    resetCreateForm();
                    setCreateModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-[#0A77FF] hover:bg-[#0862D0] text-white text-[12px] shadow-sm transition-colors cursor-pointer"
                  style={{ fontWeight: 600 }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Create New</span>
                </button>
              </div>
            </div>

            {/* Type Toggle + Status Filter Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-3">
              {/* Type Toggle (mutually exclusive tabs) */}
              <div className="inline-flex items-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-0.5 shrink-0">
                {([
                  { key: "discount" as const, label: "Discounts", color: "#047857", bg: "#ECFDF5", icon: TrendingDown },
                  { key: "premium" as const, label: "Premiums", color: "#6D28D9", bg: "#F5F3FF", icon: TrendingUp },
                ]).map((cat) => {
                  const active = exploreCategoryTab === cat.key;
                  const count = exploreCards.filter((c) => c.category === cat.key).length;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setExploreCategoryTab(cat.key)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer ${
                        active ? "bg-white shadow-sm" : "hover:bg-white/60"
                      }`}
                      style={{ fontWeight: active ? 600 : 500, color: active ? cat.color : "#64748B" }}
                    >
                      <cat.icon className="w-3 h-3" />
                      {cat.label}
                      <span
                        className="text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center"
                        style={{ fontWeight: 600, color: active ? cat.color : "#94A3B8", backgroundColor: active ? cat.bg : "#F1F5F9" }}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="w-px h-5 bg-[#E2E8F0] shrink-0" />

              {/* Status pills (parallel with type tabs) */}
              <FilterPills
                options={(() => {
                  const base = exploreCards.filter((c) => c.category === exploreCategoryTab);
                  return [
                    { key: "all", label: "All", count: base.length, showCount: true },
                    { key: "preset", label: "Preset", count: base.filter((c) => c.isPreset).length, showCount: true },
                    { key: "custom", label: "Custom", count: base.filter((c) => !c.isPreset).length, showCount: true },
                    { key: "created_by_me", label: "Created by Me", count: base.filter((c) => !c.isPreset && c.createdBy === "Ahtisham Ahmad").length, showCount: true },
                    { key: "vendors_applied", label: "Vendors Applied", count: base.filter((c) => c.partnerCount >= 3).length, showCount: true },
                  ];
                })()}
                activeKey={explorePresetsSidebar}
                onSelect={(k) => setExplorePresetsSidebar(k)}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#EEF2F6] shrink-0" />

          {/* Card Grid — scrollable */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#FAFBFC]">
            {(() => {
              let cards = exploreCards;

              // Type tab filter (mutually exclusive)
              cards = cards.filter(c => c.category === exploreCategoryTab);

              // Status filter (parallel)
              if (explorePresetsSidebar === "preset") cards = cards.filter(c => c.isPreset);
              else if (explorePresetsSidebar === "custom") cards = cards.filter(c => !c.isPreset);
              else if (explorePresetsSidebar === "created_by_me") cards = cards.filter(c => !c.isPreset && c.createdBy === "Ahtisham Ahmad");
              else if (explorePresetsSidebar === "vendors_applied") cards = cards.filter(c => c.partnerCount >= 3);

              if (explorePresetsSearch.trim()) {
                const q = explorePresetsSearch.toLowerCase();
                cards = cards.filter(c =>
                  c.name.toLowerCase().includes(q) ||
                  c.category.toLowerCase().includes(q) ||
                  c.basis.toLowerCase().includes(q) ||
                  c.description.toLowerCase().includes(q) ||
                  c.ruleNo.toLowerCase().includes(q) ||
                  c.createdBy.toLowerCase().includes(q)
                );
              }

              if (cards.length === 0) {
                return (
                  <div className="py-16 text-center">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#E8ECF1] border-dashed flex items-center justify-center mx-auto mb-3">
                      <Search className="w-5 h-5 text-[#CBD5E1]" />
                    </div>
                    <p className="text-[13px] text-[#334155] mb-1" style={{ fontWeight: 600 }}>No rules found</p>
                    <p className="text-[11px] text-[#94A3B8] max-w-[260px] mx-auto">Try adjusting your search or selecting a different filter.</p>
                  </div>
                );
              }

              return (
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                  }}
                >
                  {cards.map((card) => {
                    const isDis = card.category === "discount";
                    const isMulti = card.tierType === "multiple" && card.tiers.length > 1;
                    const activeTier = exploreActiveTiers[card.id] || 0;
                    const shownTier = card.tiers[isMulti ? activeTier : 0];
                    const t0 = card.tiers[0];
                    const ePill = isDis
                      ? { text: "#047857", bg: "#ECFDF5", border: "#D1FAE5" }
                      : { text: "#6D28D9", bg: "#F5F3FF", border: "#EDE9FE" };

                    return (
                      <div
                        key={card.id}
                        onClick={() => {
                          setSelectedRule(card);
                          setDetailMode("create");
                          setDetailOpen(true);
                        }}
                        className="bg-white border border-[#E2E8F0] rounded-xl cursor-pointer group transition-all duration-200 flex flex-col relative"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#BFDBFE";
                          e.currentTarget.style.boxShadow = "0 4px 16px -4px rgba(10,119,255,0.10), 0 0 0 1px #BFDBFE";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E2E8F0";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div className="p-3.5 flex-1 flex flex-col min-h-0">
                          {/* Row 1: Type pill + lock/custom badge */}
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <span className="inline-flex items-stretch rounded-full overflow-hidden border shrink-0" style={{ borderColor: ePill.border }}>
                              <span className="inline-flex items-center gap-1 px-2 py-[2px] text-[10px]" style={{ fontWeight: 600, color: ePill.text, backgroundColor: ePill.bg }}>
                                {isDis ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                                {isDis ? "Discount" : "Premium"}
                              </span>
                              <span className="inline-flex items-center px-2 py-[2px] text-[10px] bg-white text-[#64748B] border-l" style={{ fontWeight: 500, borderColor: ePill.border }}>
                                {card.basis === "volume" ? "Volume" : "Value"}
                              </span>
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {card.isPreset ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-[3px] rounded-md bg-[#F1F5F9] border border-[#E2E8F0] text-[9px] text-[#94A3B8]" style={{ fontWeight: 600 }}>
                                  <Lock className="w-2.5 h-2.5" /> PRESET
                                </span>
                              ) : (
                                <span className="px-1.5 py-[2px] rounded-md text-[10px] border border-[#E2E8F0] bg-white text-[#64748B]" style={{ fontWeight: 500 }}>Custom</span>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-6 h-6 rounded-md flex items-center justify-center text-[#CBD5E1] group-hover:text-[#94A3B8] hover:!text-[#475569] hover:bg-[#F1F5F9] transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                                  >
                                    <MoreVertical className="w-3.5 h-3.5" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[180px] p-1 z-[200]">
                                  <DropdownMenuItem className="gap-2 py-1.5 cursor-pointer text-[13px]" onSelect={() => { setSelectedRule(card); setDetailMode("create"); setDetailOpen(true); }}>
                                    <Eye className="w-3.5 h-3.5 text-[#64748B]" /> View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2 py-1.5 cursor-pointer text-[13px]" onSelect={() => {
                                    toast.success(`"${card.name}" applied to this partner.`);
                                  }}>
                                    <Check className="w-3.5 h-3.5 text-[#64748B]" /> Apply to Partner
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="gap-2 py-1.5 cursor-pointer text-[13px]" onSelect={() => {
                                    resetCreateForm();
                                    setCreateName(`${card.name} (Copy)`);
                                    setCreateDescription(card.description);
                                    setCreateCategory(card.category);
                                    setCreateBasis(card.basis);
                                    setCreateTiers(card.tiers.map(t => ({ discount: t.discount, fixRate: false, qtyLimits: true, minQty: t.minQty, maxQty: t.maxQty })));
                                    setExplorePresetsOpen(false);
                                    setExplorePresetsFullscreen(false);
                                    setCreateModalOpen(true);
                                  }}>
                                    <Copy className="w-3.5 h-3.5 text-[#64748B]" /> Duplicate as Custom
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          {/* Row 2: Name */}
                          <p className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}>{card.name}</p>
                          <p className="text-[11px] text-[#64748B] mt-1 line-clamp-2 leading-relaxed" style={{ fontWeight: 400 }}>{card.description}</p>

                          {/* Row 3: Hero value — neutral */}
                          {t0 && (
                            <div className="flex items-baseline gap-2 mt-3">
                              <span className="text-[22px] text-[#0F172A] tabular-nums leading-none tracking-tight" style={{ fontWeight: 600 }}>
                                {t0.discount}
                              </span>
                              <span className="text-[11px] text-[#94A3B8]" style={{ fontWeight: 500 }}>
                                {isDis ? "off" : "markup"}
                              </span>
                            </div>
                          )}

                          {/* Row 4: Tier display — clickable segments */}
                          {shownTier && (
                            <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
                              {isMulti ? (
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-1">
                                    {card.tiers.map((_, i) => {
                                      const isActive = activeTier === i;
                                      return (
                                        <button
                                          key={i}
                                          onClick={(e) => { e.stopPropagation(); setExploreActiveTiers(prev => ({ ...prev, [card.id]: i })); }}
                                          className={`h-[22px] rounded-md text-[10px] tabular-nums transition-all duration-200 cursor-pointer flex items-center justify-center ${
                                            isActive
                                              ? "bg-[#0A77FF] text-white px-2.5 shadow-sm"
                                              : "bg-[#F1F5F9] text-[#94A3B8] hover:bg-[#E2E8F0] hover:text-[#64748B] px-2"
                                          }`}
                                          style={{ fontWeight: isActive ? 600 : 500 }}
                                        >
                                          T{i + 1}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="flex items-center justify-between px-3 py-[6px] rounded-lg border border-[#E8ECF1] bg-[#FAFBFC] text-[11px] tabular-nums min-w-0">
                                    <div className="flex items-center gap-1.5 text-[#64748B] min-w-0">
                                      <span style={{ fontWeight: 400 }}>{shownTier.minQty}</span>
                                      <span className="text-[#CBD5E1]">–</span>
                                      <span style={{ fontWeight: 400 }}>{shownTier.maxQty}</span>
                                    </div>
                                    <span className="shrink-0 ml-2 text-[#0F172A]" style={{ fontWeight: 600 }}>{shownTier.discount}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between px-3 py-[6px] rounded-lg border border-[#E8ECF1] bg-[#FAFBFC] text-[11px] tabular-nums min-w-0">
                                  <div className="flex items-center gap-1.5 text-[#64748B] min-w-0">
                                    <span style={{ fontWeight: 400 }}>{shownTier.minQty}</span>
                                    <span className="text-[#CBD5E1]">–</span>
                                    <span style={{ fontWeight: 400 }}>{shownTier.maxQty}</span>
                                  </div>
                                  <span className="shrink-0 ml-2 text-[#0F172A]" style={{ fontWeight: 600 }}>{shownTier.discount}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Row 5: Footer meta */}
                          <div className="flex items-center gap-2 pt-3 border-t border-[#F1F5F9] mt-3">
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#94A3B8]" style={{ fontWeight: 500 }}>
                              <Package className="w-3 h-3" /> {card.itemCount} items
                            </span>
                            <span className="w-px h-3 bg-[#E8ECF1]" />
                            <span className="inline-flex items-center gap-1 text-[10px] text-[#94A3B8]" style={{ fontWeight: 500 }}>
                              <Users className="w-3 h-3" />
                              {card.partnerCount} applied
                            </span>
                            {!card.isPreset && (
                              <>
                                <span className="w-px h-3 bg-[#E8ECF1]" />
                                <span className="text-[10px] text-[#94A3B8] truncate" style={{ fontWeight: 500 }}>
                                  by {card.createdBy.split(" ")[0]}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Action buttons footer */}
                        <div className="border-t border-[#F1F5F9] px-3 py-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.success(`"${card.name}" applied to this partner.`);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] text-[#64748B] hover:text-[#0A77FF] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                            style={{ fontWeight: 600 }}
                          >
                            <Check className="w-3 h-3" /> Apply
                          </button>
                          <div className="w-px h-4 bg-[#E8ECF1]" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              resetCreateForm();
                              setCreateName(`${card.name} (Copy)`);
                              setCreateDescription(card.description);
                              setCreateCategory(card.category);
                              setCreateBasis(card.basis);
                              setCreateTiers(card.tiers.map(t => ({ discount: t.discount, fixRate: false, qtyLimits: true, minQty: t.minQty, maxQty: t.maxQty })));
                              setExplorePresetsOpen(false);
                              setExplorePresetsFullscreen(false);
                              setCreateModalOpen(true);
                              toast.info(`Duplicated "${card.name}" — rename and customize as needed.`);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] text-[#64748B] hover:text-[#475569] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                            style={{ fontWeight: 600 }}
                          >
                            <Copy className="w-3 h-3" /> Duplicate
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
