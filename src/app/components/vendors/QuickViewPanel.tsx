import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Clock,
  ExternalLink,
  Warehouse,
  Tag,
  Hash,
  Layers,
  TrendingUp,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Star,
  Truck,
} from "lucide-react";
import { usePersonLightbox } from "./PersonAvatarLightbox";
import type { OverflowItem } from "./OverflowTooltip";

/* ─────────── Types ─────────── */

export type QuickViewType = "item" | "location" | "contact";

export interface QuickViewData {
  type: QuickViewType;
  item: OverflowItem;
  /** Vendor display name for context */
  vendorName: string;
}

interface QuickViewPanelProps {
  data: QuickViewData | null;
  onClose: () => void;
}

/* ─────────── Mock data generators ─────────── */

const ITEM_DATA: Record<string, { name: string; desc: string }> = {
  "100219-42": { name: "Industrial Steel Pipes", desc: "Heavy-gauge seamless carbon steel pipes — Schedule 40, ASTM A106 Grade B, suitable for high-pressure steam, oil, and gas applications in petrochemical and industrial piping systems" },
  "100219-43": { name: "Copper Fittings Kit", desc: "Professional-grade copper sweat fittings assortment — includes 90° elbows, tees, couplings, and reducers in 1/2\" to 1\" sizes, lead-free for potable water systems per NSF/ANSI 61" },
  "100219-44": { name: "Welding Rods Pack", desc: "E7018 low-hydrogen welding electrodes — 1/8\" diameter, 14\" length, all-position capable with smooth arc transfer, ideal for structural steel, pressure vessels, and heavy fabrication" },
  "100219-45": { name: "Aluminum Sheet Roll", desc: "6061-T6 aluminum alloy sheet — 0.125\" thickness, mill finish, excellent machinability and weldability for aerospace, marine, and precision manufacturing applications" },
  "100219-46": { name: "Stainless Steel Bolts", desc: "18-8 stainless steel hex cap screws — Grade A2-70, fully threaded, corrosion-resistant for outdoor, marine, and food-processing equipment assembly" },
  "100219-47": { name: "Hydraulic Hose Assembly", desc: "SAE 100R2AT twin-wire braided hydraulic hose — 3/8\" ID, 4800 PSI working pressure, with JIC 37° flare fittings, suitable for mobile equipment and industrial hydraulic systems" },
  "100219-48": { name: "Carbon Fiber Panel", desc: "3K twill-weave carbon fiber composite panel — 2mm thickness, high-gloss resin finish, exceptional stiffness-to-weight ratio for aerospace, motorsport, and precision instrument enclosures" },
  "100219-49": { name: "Titanium Bracket Set", desc: "Grade 5 (Ti-6Al-4V) precision CNC-machined mounting brackets — lightweight, high-strength, corrosion-proof, designed for aerospace structural and medical device applications" },
  "100219-50": { name: "Rubber Gasket Kit", desc: "Multi-material gasket assortment — Buna-N, Viton®, and EPDM compounds in standard flange sizes, temperature rated -40°F to +400°F for chemical processing and HVAC systems" },
  "100219-51": { name: "Precision Ball Bearings", desc: "ABEC-7 deep-groove ball bearings — 6204-2RS sealed, chrome steel races with synthetic grease fill, low-noise design for electric motors, pumps, and conveyor systems" },
  "100219-52": { name: "Electrical Wire Spool", desc: "THHN/THWN-2 stranded copper building wire — 12 AWG, 500 ft spool, dual-rated for wet and dry locations, UL listed for commercial and industrial electrical installations" },
  "100219-53": { name: "LED Circuit Board", desc: "High-density SMD LED driver PCB — 24V constant-current, aluminum-core substrate with thermal management, designed for commercial lighting fixtures and architectural illumination panels" },
};

const ITEM_CATEGORIES = ["Raw Material", "Component", "Assembly", "Consumable", "Finished Good"];
const ITEM_UOMS = ["EA", "FT", "PK", "RL", "KG", "LB", "BOX", "SET"];
const ITEM_STATUSES = ["In Stock", "Low Stock", "Out of Stock", "On Order"];

/** Product photos — deterministic per item code */
const ITEM_PHOTOS = [
  "https://images.unsplash.com/photo-1772209049802-cd0e0ff1a5d3?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1713575882582-8938739db351?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1737223450913-2af6885945e1?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1759159091728-e2c87b9d9315?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1661069387900-54d5843b704d?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1758873263527-ca53b938fbd4?w=600&h=400&fit=crop",
];
function getItemPhotos(code: string): string[] {
  const base = hashStr(code);
  const count = (base % 2) + 2; // 2 or 3 photos per item
  return Array.from({ length: count }, (_, i) => ITEM_PHOTOS[(base + i) % ITEM_PHOTOS.length]);
}
const STATUS_COLORS: Record<string, { bg: string; fg: string; border: string }> = {
  "In Stock": { bg: "#F0FDF4", fg: "#166534", border: "#BBF7D0" },
  "Low Stock": { bg: "#FFFBEB", fg: "#92400E", border: "#FDE68A" },
  "Out of Stock": { bg: "#FEF2F2", fg: "#991B1B", border: "#FECACA" },
  "On Order": { bg: "#EFF6FF", fg: "#1E40AF", border: "#BFDBFE" },
};

const LOCATION_TYPES = ["Warehouse", "Office", "Manufacturing", "Distribution", "R&D Center"];
const DEPARTMENTS = ["Supply Chain", "Procurement", "Finance", "Engineering", "Sales", "Operations", "Quality", "Logistics"];
const CONTACT_ROLES = ["Account Manager", "Supply Chain Lead", "Procurement Analyst", "Sales Director", "Operations Manager", "Quality Engineer", "Logistics Coordinator", "Finance Controller"];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}

function pick<T>(arr: T[], seed: string): T {
  return arr[hashStr(seed) % arr.length];
}

const GENERIC_DESCS = [
  "High-performance industrial component — precision-engineered from premium materials, designed for demanding operational environments with extended service life and low maintenance requirements",
  "Professional-grade supply item — manufactured to strict quality standards with full traceability, suitable for production lines, maintenance operations, and capital equipment assembly",
  "Certified industrial material — meets ASTM/ISO specifications, available in standard and custom sizes for fabrication, construction, and heavy manufacturing applications",
  "Multi-purpose operational consumable — tested for reliability across temperature and pressure ranges, compatible with industry-standard equipment and tooling systems",
  "Engineered precision part — tight-tolerance machining with quality-assured dimensional accuracy, designed for critical assemblies in automotive, aerospace, and energy sectors",
];

function mockItemData(code: string) {
  const entry = ITEM_DATA[code];
  const name = entry?.name || `Part ${code}`;
  const desc = entry?.desc || GENERIC_DESCS[hashStr(code) % GENERIC_DESCS.length];
  const category = pick(ITEM_CATEGORIES, code);
  const uom = pick(ITEM_UOMS, code + "u");
  const status = pick(ITEM_STATUSES, code + "s");
  const unitPrice = ((hashStr(code + "p") % 500) + 10) + 0.99;
  const stockQty = hashStr(code + "q") % 5000;
  const reorderPoint = Math.floor(stockQty * 0.2);
  const leadTime = (hashStr(code + "l") % 14) + 3;
  return { name, desc, category, uom, status, unitPrice, stockQty, reorderPoint, leadTime };
}

function mockLocationData(locationName: string) {
  const type = pick(LOCATION_TYPES, locationName);
  const street = `${(hashStr(locationName + "n") % 999) + 1} ${pick(["Industrial Blvd", "Commerce Dr", "Technology Way", "Supply Chain Ave", "Factory Rd"], locationName)}`;
  const cities = ["Plano, TX", "Detroit, MI", "San Jose, CA", "Seattle, WA", "Austin, TX", "Chicago, IL", "Atlanta, GA", "Denver, CO"];
  const city = pick(cities, locationName + "c");
  const operatingHours = pick(["Mon–Fri, 8AM–5PM", "Mon–Sat, 7AM–6PM", "24/7 Operations", "Mon–Fri, 9AM–6PM"], locationName + "h");
  const contactCount = (hashStr(locationName + "cc") % 8) + 1;
  const sqft = ((hashStr(locationName + "sf") % 200) + 10) * 1000;
  return { type, street, city, operatingHours, contactCount, sqft };
}

function mockContactData(name: string) {
  const role = pick(CONTACT_ROLES, name);
  const dept = pick(DEPARTMENTS, name + "d");
  const email = name.toLowerCase().replace(/\s+/g, ".") + "@company.com";
  const phone = `+1 (${(hashStr(name + "p1") % 900) + 100}) ${(hashStr(name + "p2") % 900) + 100}-${(hashStr(name + "p3") % 9000) + 1000}`;
  const timezone = pick(["EST", "CST", "PST", "MST"], name + "tz");
  const lastActive = pick(["2 hours ago", "Today", "Yesterday", "3 days ago", "1 week ago"], name + "la");
  return { role, dept, email, phone, timezone, lastActive };
}

/* ─────────── Formatting ─────────── */

function formatCurrency(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

/* ─────────── Sub-components ─────────── */

function KpiCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex-1 min-w-0 rounded-lg border border-border/50 px-3 py-2.5" style={{ backgroundColor: `${color}08` }}>
      <div className="text-[11px] mb-0.5" style={{ color, fontWeight: 600 }}>{label}</div>
      <div className="text-[15px] text-foreground truncate" style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      <div className="w-7 h-7 rounded-md bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60" style={{ fontWeight: 500 }}>{label}</div>
        <div className="text-[13px] text-foreground truncate" style={{ fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

/* ─────────── Item Quick View — large image carousel + detail card ─────────── */

function ItemQuickView({ code, vendorName, tableImageUrl }: { code: string; vendorName: string; tableImageUrl?: string }) {
  const d = mockItemData(code);
  const sc = STATUS_COLORS[d.status] || STATUS_COLORS["In Stock"];
  // Use the table's image as the first photo so images match; append others from the pool
  const poolPhotos = getItemPhotos(code);
  const photos = tableImageUrl
    ? [tableImageUrl.replace(/w=80&h=80/, "w=600&h=400"), ...poolPhotos.filter((p) => !tableImageUrl.includes(p.split("?")[0]))]
    : poolPhotos;
  const [photoIdx, setPhotoIdx] = useState(0);
  const { openLightbox } = usePersonLightbox();
  const currentPhoto = photos[photoIdx % photos.length];
  return (
    <>
      {/* Image carousel — responsive height: compact on small screens, generous on large */}
      <div className="relative overflow-hidden bg-[#0C1222] select-none shrink-0" style={{ height: "clamp(200px, 45vh, 420px)" }}>
        <img
          src={currentPhoto}
          alt={d.name}
          className="w-full h-full object-cover transition-opacity duration-200"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Status pill — top-left */}
        <span
          className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] border backdrop-blur-sm"
          style={{ fontWeight: 600, backgroundColor: sc.bg + "E6", color: sc.fg, borderColor: sc.border }}
        >
          {d.status}
        </span>

        {/* Zoom button — top-right (offset from close) */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openLightbox({ src: currentPhoto, name: d.name, subtitle: `${code} · ${vendorName}` }); }}
          className="absolute top-3 right-14 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-black/50 hover:text-white transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Prev / Next carousel arrows */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setPhotoIdx((prev) => (prev - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-black/50 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setPhotoIdx((prev) => (prev + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-black/50 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot indicators + counter — bottom-right */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 right-4 flex items-center gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPhotoIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${i === photoIdx ? "bg-white w-3" : "bg-white/40 hover:bg-white/60"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Data area: code + description + stat cards + vendor */}
      <div className="px-5 pt-4 pb-4">
        {/* Item code + category context pill */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[15px] font-mono text-[#0F172A]" style={{ fontWeight: 700 }}>{code}</span>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] border"
            style={{ fontWeight: 500, backgroundColor: "#F1F5F9", color: "#475569", borderColor: "#E2E8F0" }}
          >
            <Star className="w-3 h-3" />
            Primary: {d.category}
          </span>
        </div>

        {/* Long description */}
        <p className="text-[13px] text-[#475569] mt-2 leading-relaxed line-clamp-3" style={{ fontWeight: 400 }}>
          {d.desc}
        </p>

        {/* 4-column stat cards — responsive: 2×2 on tiny screens, 4-col on md+ */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E2E8F0] rounded-xl border border-[#E2E8F0] overflow-hidden [&>*:nth-child(n+3)]:border-t [&>*:nth-child(n+3)]:sm:border-t-0">
          <div className="px-2.5 py-2.5 text-center">
            <div className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 700 }}>{vendorName.split(" ").slice(0, 2).join(" ")}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5" style={{ fontWeight: 500 }}>Partner</div>
          </div>
          <div className="px-2.5 py-2.5 text-center">
            <div className="text-[15px] text-[#0F172A]" style={{ fontWeight: 700 }}>{formatCurrency(d.unitPrice)}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5" style={{ fontWeight: 500 }}>Unit Price</div>
          </div>
          <div className="px-2.5 py-2.5 text-center">
            <div className="text-[15px] text-[#0F172A]" style={{ fontWeight: 700 }}>{formatNumber(d.stockQty)}<span className="text-[11px] text-[#64748B] ml-0.5">{d.uom}</span></div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5" style={{ fontWeight: 500 }}>In Stock</div>
          </div>
          <div className="px-2.5 py-2.5 text-center">
            <div className="text-[15px] text-[#0F172A]" style={{ fontWeight: 700 }}>{d.leadTime}<span className="text-[11px] text-[#64748B] ml-0.5">days</span></div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5" style={{ fontWeight: 500 }}>Lead Time</div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────── Location Quick View ─────────── */

/** Deterministic location photos */
const LOCATION_PHOTOS = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
];
function getLocationPhoto(name: string): string {
  return LOCATION_PHOTOS[hashStr(name) % LOCATION_PHOTOS.length];
}

function LocationQuickView({ locationName, vendorName, subtitle }: { locationName: string; vendorName: string; subtitle?: string }) {
  const d = mockLocationData(locationName);
  const { openLightbox } = usePersonLightbox();
  const photo = getLocationPhoto(locationName);
  const isCarrier = subtitle?.toLowerCase().includes("carrier");
  return (
    <>
      {/* Image area — same layout for both carriers and locations */}
      <div className="relative overflow-hidden bg-[#052E16] shrink-0" style={{ height: "clamp(180px, 40vh, 360px)" }}>
        <img src={photo} alt={locationName} className="w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openLightbox({ src: photo, name: locationName, subtitle: `${isCarrier ? subtitle : d.type} · ${vendorName}` }); }}
          className="absolute top-3 right-14 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-black/50 hover:text-white transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-[16px] text-white truncate" style={{ fontWeight: 700 }}>{locationName}</p>
          <div className="text-[12px] text-white/70 mt-0.5" style={{ fontWeight: 500 }}>{isCarrier ? subtitle : d.type}</div>
        </div>
      </div>

      {/* Data area */}
      <div className="px-5 pt-3 pb-4">
        <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] mb-3">
          <Building2 className="w-3 h-3" />
          <span style={{ fontWeight: 500 }}>{vendorName}</span>
        </div>
        {/* Stat row */}
        <div className="grid grid-cols-3 divide-x divide-[#E2E8F0] rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="px-3 py-2.5 text-center">
          <div className="text-[15px] text-[#0F172A]" style={{ fontWeight: 700 }}>{d.type}</div>
          <div className="text-[10px] text-[#94A3B8] mt-0.5" style={{ fontWeight: 500 }}>Facility</div>
        </div>
        <div className="px-3 py-2.5 text-center">
          <div className="text-[15px] text-[#0F172A]" style={{ fontWeight: 700 }}>{d.contactCount}</div>
          <div className="text-[10px] text-[#94A3B8] mt-0.5" style={{ fontWeight: 500 }}>Contacts</div>
        </div>
        <div className="px-3 py-2.5 text-center">
          <div className="text-[15px] text-[#0F172A]" style={{ fontWeight: 700 }}>{formatNumber(d.sqft)}<span className="text-[11px] text-[#64748B] ml-0.5">sqft</span></div>
          <div className="text-[10px] text-[#94A3B8] mt-0.5" style={{ fontWeight: 500 }}>Area</div>
        </div>
        </div>

        {/* Details */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2.5">
            <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.street}, ${d.city}`)}`} target="_blank" rel="noopener noreferrer" className="text-[13px] text-foreground hover:text-[#0A77FF] hover:underline transition-colors truncate" style={{ fontWeight: 500 }}>{d.street}, {d.city}</a>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <span className="text-[13px] text-foreground" style={{ fontWeight: 500 }}>{d.operatingHours}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <User className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <span className="text-[13px] text-foreground" style={{ fontWeight: 500 }}>{d.contactCount} people on-site</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────── Contact Quick View ─────────── */

/** Deterministic person photos for QuickView */
const PERSON_PHOTOS = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/46.jpg",
  "https://randomuser.me/api/portraits/women/28.jpg",
  "https://randomuser.me/api/portraits/men/85.jpg",
  "https://randomuser.me/api/portraits/women/91.jpg",
];
function getPersonPhotoUrl(name: string): string {
  return PERSON_PHOTOS[hashStr(name) % PERSON_PHOTOS.length];
}

function ContactQuickView({ contactName, initials, avatarBg, avatarFg, vendorName }: { contactName: string; initials?: string; avatarBg?: string; avatarFg?: string; vendorName: string }) {
  const d = mockContactData(contactName);
  const { openLightbox } = usePersonLightbox();
  const photo = getPersonPhotoUrl(contactName);
  return (
    <>
      {/* Image area — person photo, matching Items card layout (~70/30) */}
      <div className="relative overflow-hidden bg-[#1E1B4B] shrink-0" style={{ height: "clamp(200px, 45vh, 420px)" }}>
        <img src={photo} alt={contactName} className="w-full h-full object-cover" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Zoom button */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openLightbox({ src: photo, name: contactName, subtitle: `${d.role} · ${d.dept}` }); }}
          className="absolute top-3 right-14 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-black/50 hover:text-white transition-colors cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        {/* Name + role over gradient */}
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-[16px] text-white truncate" style={{ fontWeight: 700 }}>{contactName}</p>
          <div className="text-[12px] text-white/70 mt-0.5" style={{ fontWeight: 500 }}>{d.role}</div>
        </div>
      </div>

      {/* Data area */}
      <div className="px-5 pt-4 pb-4">
        {/* Context */}
        <div className="flex items-center gap-3 text-[12px] text-[#64748B] mb-3">
          <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{vendorName}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{d.dept}</span>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-3 divide-x divide-[#E2E8F0] rounded-xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-3 py-2.5 text-center">
            <div className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 700 }}>{d.dept}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5" style={{ fontWeight: 500 }}>Department</div>
          </div>
          <div className="px-3 py-2.5 text-center">
            <div className="text-[13px] text-[#0F172A]" style={{ fontWeight: 700 }}>{d.timezone}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5" style={{ fontWeight: 500 }}>Timezone</div>
          </div>
          <div className="px-3 py-2.5 text-center">
            <div className="text-[13px] text-[#0F172A]" style={{ fontWeight: 700 }}>{d.lastActive}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5" style={{ fontWeight: 500 }}>Last Active</div>
          </div>
        </div>

        {/* Contact details */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2.5">
            <Mail className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <span className="text-[13px] text-foreground truncate" style={{ fontWeight: 500 }}>{d.email}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
            <span className="text-[13px] text-foreground" style={{ fontWeight: 500 }}>{d.phone}</span>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────── Main Panel ─────────── */

export function QuickViewPanel({ data, onClose }: QuickViewPanelProps) {
  // Close on Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!data) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [data, handleKeyDown]);

  if (!data) return null;

  const { type, item, vendorName } = data;

  const navLabel = type === "item" ? "Go to Item" : type === "location" ? "Go to Location" : "Go to Contact";

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/50 animate-modal-overlay"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed z-[210] top-1/2 left-1/2 w-[calc(100vw-32px)] sm:w-[480px] md:w-[540px] lg:w-[600px] max-h-[calc(100vh-48px)] bg-card rounded-2xl border border-border/50 overflow-hidden flex flex-col"
        style={{
          transform: "translate(-50%, -50%)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.03), 0 8px 20px rgba(0,0,0,0.08), 0 24px 56px rgba(0,0,0,0.14)",
          animation: "quickViewIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Close button — pinned top-right, above everything. White pill for visibility over both dark images and light content. */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 hover:bg-white shadow-md transition-all cursor-pointer border border-[#E2E8F0]"
        >
          <X className="w-4 h-4 text-[#334155]" />
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {type === "item" && <ItemQuickView code={item.name} vendorName={vendorName} tableImageUrl={item.imageUrl} />}
          {type === "location" && <LocationQuickView locationName={item.name} vendorName={vendorName} subtitle={item.subtitle} />}
          {type === "contact" && (
            <ContactQuickView
              contactName={item.name}
              initials={item.initials}
              avatarBg={item.avatarBg}
              avatarFg={item.avatarFg}
              vendorName={vendorName}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border/40 flex items-center justify-between bg-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] text-white transition-colors cursor-pointer"
            style={{ fontWeight: 600, backgroundColor: "#0A77FF" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0862D4")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0A77FF")}
          >
            {navLabel}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}