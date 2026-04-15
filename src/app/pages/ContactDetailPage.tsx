import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  Pencil,
  Archive,
  CircleSlash,
  FileText,
  Paperclip,
  Activity,
  StickyNote,
  Users,
  Clock,
  Download,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Globe,
  ExternalLink,
  Calendar,
  CircleCheck,
  Link2,
  MessageSquare,
  Briefcase,
  ShoppingCart,
  Receipt,
  ClipboardList,
  Search,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Star,
  Package,
  GripVertical,
  Trash2,
  Info,
  X,
  Plus,
  Check,
  Sliders,
  ToggleLeft,
  ToggleRight,
  PhoneCall,
  Shield,
  Maximize2,
  Minimize2,
  Linkedin,
  Twitter,
  Send,
  MessageCircle,
  Upload,
  LayoutGrid,
  List,
  AlignJustify,
  MoreVertical,
  Image as ImageIcon,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip as ReTooltip,
} from "recharts";
import { CONTACT_DICTIONARY, type ContactPerson, type ContactPhone, type ContactEmail, type ContactSocial } from "../components/vendors/partnerConstants";
import { PurchaseOrdersTable } from "../components/vendors/PurchaseOrdersTable";
import { SalesOrdersTable } from "../components/vendors/SalesOrdersTable";
import { QuotesTable } from "../components/vendors/QuotesTable";
import { AttachmentsTab } from "../components/vendors/AttachmentsTab";
import { VendorsListPage } from "./VendorsListPage";
import { getAvatarTint } from "../utils/avatarTints";
import { useVendors } from "../context/VendorContext";
import { usePersonLightbox } from "../components/vendors/PersonAvatarLightbox";
import { ALL_KPI_DEFINITIONS, DEFAULT_ACTIVE_KPIS, computeKpiValue } from "../components/vendors/KpiInsightsPanel";
import { CreatePocModal } from "../components/vendors/PocModals";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "../components/ui/alert-dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../components/ui/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

/* ─── Person Avatar Photos ─── */
const PERSON_AVATARS: Record<string, string> = {
  "Sarah": "https://randomuser.me/api/portraits/women/44.jpg",
  "Michael": "https://randomuser.me/api/portraits/men/32.jpg",
  "Emily": "https://randomuser.me/api/portraits/women/65.jpg",
  "David": "https://randomuser.me/api/portraits/men/75.jpg",
  "Rachel": "https://randomuser.me/api/portraits/women/28.jpg",
  "James": "https://randomuser.me/api/portraits/men/46.jpg",
  "Lisa": "https://randomuser.me/api/portraits/women/17.jpg",
  "Robert": "https://randomuser.me/api/portraits/men/22.jpg",
  "Amanda": "https://randomuser.me/api/portraits/women/56.jpg",
  "Kevin": "https://randomuser.me/api/portraits/men/64.jpg",
  "Maria": "https://randomuser.me/api/portraits/women/33.jpg",
  "Chris": "https://randomuser.me/api/portraits/men/85.jpg",
  "Jessica": "https://randomuser.me/api/portraits/women/91.jpg",
  "Andrew": "https://randomuser.me/api/portraits/men/41.jpg",
  "Nicole": "https://randomuser.me/api/portraits/women/72.jpg",
  "Thomas": "https://randomuser.me/api/portraits/men/55.jpg",
  "Stephanie": "https://randomuser.me/api/portraits/women/15.jpg",
  "Daniel": "https://randomuser.me/api/portraits/men/18.jpg",
  "Karen": "https://randomuser.me/api/portraits/women/48.jpg",
  "Brian": "https://randomuser.me/api/portraits/men/67.jpg",
  "Ahtisham": "https://randomuser.me/api/portraits/men/36.jpg",
  "Abdullah": "https://randomuser.me/api/portraits/men/29.jpg",
  "Issac": "https://randomuser.me/api/portraits/men/52.jpg",
  "Elena": "https://randomuser.me/api/portraits/women/39.jpg",
  "Marcus": "https://randomuser.me/api/portraits/men/71.jpg",
  "Priya": "https://randomuser.me/api/portraits/women/63.jpg",
  "Omar": "https://randomuser.me/api/portraits/men/43.jpg",
  "Mei": "https://randomuser.me/api/portraits/women/25.jpg",
  "Carlos": "https://randomuser.me/api/portraits/men/59.jpg",
  "Fatima": "https://randomuser.me/api/portraits/women/81.jpg",
  "Raj": "https://randomuser.me/api/portraits/men/88.jpg",
  "Anna": "https://randomuser.me/api/portraits/women/12.jpg",
  "Viktor": "https://randomuser.me/api/portraits/men/37.jpg",
  "Yuki": "https://randomuser.me/api/portraits/women/50.jpg",
  "Ahmed": "https://randomuser.me/api/portraits/men/94.jpg",
};

function getPersonPhoto(name: string): string | undefined {
  const firstName = name.split(" ")[0];
  return PERSON_AVATARS[firstName];
}

/* ─── Partner name pool for linked partners ─── */
const PARTNER_NAMES = [
  "Acme Corp", "TechVault", "NexGen Solutions", "Apex Industries", "Summit Group",
  "Vertex Labs", "Pioneer Systems", "Atlas Logistics", "Beacon Analytics", "Cascade Networks",
  "Delta Manufacturing", "Echo Enterprises", "Falcon Dynamics", "Granite Holdings", "Horizon Partners",
  "Ionic Solutions", "Jade Innovations", "Keystone Global", "Lumen Corp", "Metro Supply",
];

/* ─── Department pill styles ─── */
const DEPT_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Sales: { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  "Supply Chain Management": { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  Finance: { bg: "#F5F3FF", text: "#5B21B6", border: "#DDD6FE" },
};

/* ─── Enrichment helper ─── */
interface EnrichedContact extends ContactPerson {
  status: "active" | "inactive";
  linkedPartners: string[];
  createdByName: string;
  createdByInitials: string;
  createdOn: string;
}

function enrichContact(c: ContactPerson): EnrichedContact {
  let hash = 0;
  for (let j = 0; j < c.id.length; j++) hash = c.id.charCodeAt(j) + ((hash << 5) - hash);
  const absHash = Math.abs(hash);
  const status: "active" | "inactive" = absHash % 5 === 0 ? "inactive" : "active";
  const partnerCount = 1 + (absHash % 5);
  const linkedPartners: string[] = [];
  for (let p = 0; p < partnerCount; p++) {
    linkedPartners.push(PARTNER_NAMES[(absHash + p * 7) % PARTNER_NAMES.length]);
  }
  return { ...c, status, linkedPartners };
}

function enrichContactWithNames(c: ContactPerson, names: string[]): EnrichedContact {
  let hash = 0;
  for (let j = 0; j < c.id.length; j++) hash = c.id.charCodeAt(j) + ((hash << 5) - hash);
  const absHash = Math.abs(hash);
  const status: "active" | "inactive" = absHash % 5 === 0 ? "inactive" : "active";
  const partnerCount = 1 + (absHash % 5);
  const linkedPartners: string[] = [];
  for (let p = 0; p < partnerCount; p++) {
    linkedPartners.push(names[(absHash + p * 7) % names.length]);
  }
  const CREATORS = ["Ahtisham Ahmad", "Sarah Johnson", "David Kim", "Emily Chen", "Marcus Obi", "Elena Volkov"];
  const createdByName = CREATORS[absHash % CREATORS.length];
  const createdByInitials = createdByName.split(" ").map(w => w[0]).join("").toUpperCase();
  const month = (absHash % 12) + 1;
  const day = (absHash % 28) + 1;
  const year = absHash % 3 === 0 ? 2025 : 2026;
  const createdOn = new Date(year, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return { ...c, status, linkedPartners, createdByName, createdByInitials, createdOn };
}

/* ─── Dummy data ─── */
const ACTIVITY_LOG = [
  { id: 1, action: "Purchase Order PO-3021 was approved", user: "Sarah Johnson", date: "2026-03-28T10:15:00Z", icon: "create" },
  { id: 2, action: "Email sent to issacarcher@toyota.technical.com", user: "System", date: "2026-03-25T14:00:00Z", icon: "email" },
  { id: 3, action: "Quote QT-4501 accepted", user: "Issac Archer", date: "2026-03-25T09:30:00Z", icon: "create" },
  { id: 4, action: "Sales Order SO-1102 fulfilled", user: "System", date: "2026-03-26T11:00:00Z", icon: "create" },
  { id: 5, action: "Phone number updated", user: "Admin", date: "2026-03-20T10:05:00Z", icon: "edit" },
  { id: 6, action: "Linked to NexGen Solutions", user: "Sarah Johnson", date: "2026-03-15T16:33:00Z", icon: "link" },
  { id: 7, action: "Quote QT-4487 sent for review", user: "Michael Lee", date: "2026-03-18T14:30:00Z", icon: "create" },
  { id: 8, action: "Email address updated", user: "Admin", date: "2026-02-14T11:45:00Z", icon: "edit" },
  { id: 9, action: "Linked to Acme Corp", user: "Sarah Johnson", date: "2026-01-08T16:33:00Z", icon: "link" },
  { id: 10, action: "Contact created", user: "System", date: "2025-11-02T09:15:00Z", icon: "create" },
];

const NOTES_DATA = [
  { id: 1, author: "Sarah Johnson", date: "2026-03-15T09:00:00Z", text: "Confirmed preferred communication channel is email. Direct phone line available for urgent matters only." },
  { id: 2, author: "Michael Lee", date: "2026-02-20T14:30:00Z", text: "Attended annual vendor review meeting. Contact expressed interest in expanding partnership to include logistics services." },
  { id: 3, author: "Admin", date: "2026-01-10T11:15:00Z", text: "Verified contact details during quarterly data cleanup. All information current and accurate." },
];

const PURCHASE_ORDERS_DATA = [
  { id: "PO-3021", vendor: "Acme Corp", amount: "$18,500", status: "Approved", date: "2026-03-28T09:00:00Z" },
  { id: "PO-2984", vendor: "TechVault", amount: "$7,200", status: "Pending", date: "2026-03-22T14:00:00Z" },
  { id: "PO-2951", vendor: "NexGen Solutions", amount: "$34,800", status: "Delivered", date: "2026-03-15T10:30:00Z" },
  { id: "PO-2913", vendor: "Apex Industries", amount: "$12,100", status: "Delivered", date: "2026-03-08T11:00:00Z" },
  { id: "PO-2887", vendor: "Summit Group", amount: "$5,600", status: "Approved", date: "2026-02-28T16:00:00Z" },
  { id: "PO-2845", vendor: "Vertex Labs", amount: "$22,400", status: "Delivered", date: "2026-02-20T09:30:00Z" },
];

const SALES_ORDERS_DATA = [
  { id: "SO-1102", customer: "Acme Corp", amount: "$9,800", status: "Fulfilled", date: "2026-03-26T10:00:00Z" },
  { id: "SO-1089", customer: "Pioneer Systems", amount: "$15,300", status: "Processing", date: "2026-03-20T14:30:00Z" },
  { id: "SO-1074", customer: "Atlas Logistics", amount: "$6,400", status: "Fulfilled", date: "2026-03-14T09:00:00Z" },
  { id: "SO-1058", customer: "Beacon Analytics", amount: "$28,700", status: "Shipped", date: "2026-03-08T11:00:00Z" },
  { id: "SO-1041", customer: "Cascade Networks", amount: "$11,200", status: "Fulfilled", date: "2026-02-28T16:30:00Z" },
  { id: "SO-1029", customer: "Delta Manufacturing", amount: "$4,500", status: "Fulfilled", date: "2026-02-22T10:00:00Z" },
];

const QUOTES_DATA = [
  { id: "QT-4501", partner: "Acme Corp", amount: "$24,000", status: "Accepted", validUntil: "2026-04-30T00:00:00Z", date: "2026-03-25T09:00:00Z" },
  { id: "QT-4487", partner: "TechVault", amount: "$8,900", status: "Pending", validUntil: "2026-04-15T00:00:00Z", date: "2026-03-18T14:00:00Z" },
  { id: "QT-4472", partner: "NexGen Solutions", amount: "$41,200", status: "Expired", validUntil: "2026-03-01T00:00:00Z", date: "2026-02-15T10:00:00Z" },
  { id: "QT-4458", partner: "Summit Group", amount: "$6,750", status: "Accepted", validUntil: "2026-05-01T00:00:00Z", date: "2026-03-10T11:30:00Z" },
  { id: "QT-4441", partner: "Vertex Labs", amount: "$19,300", status: "Rejected", validUntil: "2026-03-20T00:00:00Z", date: "2026-02-28T09:00:00Z" },
];

const COMMUNICATIONS_DATA = [
  { id: 1, type: "Email", subject: "Q1 Review Meeting Follow-up", from: "Sarah Johnson", date: "2026-03-28T10:15:00Z", status: "Sent" },
  { id: 2, type: "Call", subject: "Pricing Discussion", from: "Contact", date: "2026-03-25T14:00:00Z", status: "Completed" },
  { id: 3, type: "Email", subject: "Updated Contract Terms", from: "Michael Lee", date: "2026-03-20T09:30:00Z", status: "Sent" },
  { id: 4, type: "Email", subject: "Invoice #INV-2026-0342", from: "System", date: "2026-03-15T08:00:00Z", status: "Sent" },
  { id: 5, type: "Call", subject: "Onboarding Walkthrough", from: "Sarah Johnson", date: "2026-03-10T11:00:00Z", status: "Missed" },
  { id: 6, type: "Email", subject: "Partnership Renewal Notice", from: "Admin", date: "2026-03-01T09:00:00Z", status: "Sent" },
];

const ATTACHMENTS_DATA = [
  { id: 1, name: "NDA_Agreement_2026.pdf", size: "1.2 MB", date: "2026-03-10T09:00:00Z", type: "pdf", uploadedBy: "Sarah Johnson" },
  { id: 2, name: "Contact_Onboarding_Form.docx", size: "340 KB", date: "2026-01-15T14:20:00Z", type: "doc", uploadedBy: "Admin" },
  { id: 3, name: "ID_Verification.png", size: "2.8 MB", date: "2025-12-05T10:45:00Z", type: "img", uploadedBy: "Michael Lee" },
  { id: 4, name: "Meeting_Notes_Q1.pdf", size: "520 KB", date: "2026-03-28T16:00:00Z", type: "pdf", uploadedBy: "Sarah Johnson" },
  { id: 5, name: "Vendor_Agreement_v2.xlsx", size: "890 KB", date: "2026-02-20T11:30:00Z", type: "xlsx", uploadedBy: "Elena Volkov" },
  { id: 6, name: "Partnership_Contract.pdf", size: "3.4 MB", date: "2026-01-05T08:30:00Z", type: "pdf", uploadedBy: "Daniel Adams" },
  { id: 7, name: "Company_Logo.jpg", size: "1.8 MB", date: "2025-11-20T15:00:00Z", type: "img", uploadedBy: "Alex Morgan" },
  { id: 8, name: "Financial_Report_Q4.xlsx", size: "2.1 MB", date: "2026-02-10T09:45:00Z", type: "xlsx", uploadedBy: "Lisa Park" },
];

/* ─── Tab definitions ─── */
const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "linked_partners", label: "Linked Partners", icon: Link2 },
  { id: "communications", label: "Communications", icon: MessageSquare },
  { id: "purchase_orders", label: "Purchase Orders", icon: ShoppingCart },
  { id: "sales_orders", label: "Sales Orders", icon: Receipt },
  { id: "quotes", label: "Quotes", icon: ClipboardList },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "attachments", label: "Attachments", icon: Paperclip },
  { id: "activity", label: "Activity History", icon: Activity },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ─── Format date helper ─── */
function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) + " at " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return dateStr;
  }
}

/* ═══════════════════════════════════════════════════════════════ */
/*  ContactDetailPage                                             */
/* ═══════════════════════════════════════════════════════════════ */
/* ─── DnD KPI Card ─── */
const DND_CONTACT_KPI = "CONTACT_KPI";

function DraggableContactKpi({ index, kpiKey, label, value, icon: Icon, change, moveCard, onRemove }: {
  index: number; kpiKey: string; label: string; value: string; icon: React.ElementType; change: string | null; moveCard: (from: number, to: number) => void; onRemove?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, preview] = useDrag({ type: DND_CONTACT_KPI, item: () => ({ index }), collect: (m) => ({ isDragging: m.isDragging() }) });
  const [{ isOver }, drop] = useDrop({
    accept: DND_CONTACT_KPI,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIdx = item.index;
      if (dragIdx === index) return;
      const rect = ref.current.getBoundingClientRect();
      const midX = (rect.right - rect.left) / 2;
      const midY = (rect.bottom - rect.top) / 2;
      const offset = monitor.getClientOffset();
      if (!offset) return;
      const cx = offset.x - rect.left;
      const cy = offset.y - rect.top;
      if (dragIdx < index && cy < midY && cx < midX) return;
      if (dragIdx > index && cy > midY && cx > midX) return;
      moveCard(dragIdx, index);
      item.index = index;
    },
    collect: (m) => ({ isOver: m.isOver() }),
  });
  preview(drop(ref));
  drag(ref);
  if (isDragging) return <div ref={ref} className="rounded-lg border border-dashed border-primary/20 bg-primary/[0.02] min-h-[52px] pointer-events-none" />;
  return (
    <div ref={ref} className={`border rounded-lg bg-white group relative min-w-0 transition-all duration-200 select-none overflow-hidden cursor-grab active:cursor-grabbing ${isOver ? "border-primary/30 bg-primary/[0.03] shadow-[0_0_0_2px_rgba(10,119,255,0.08)] scale-[1.02]" : "border-border hover:-translate-y-[1px] hover:border-[#93B8F7] hover:shadow-[0_2px_8px_-3px_rgba(10,119,255,0.06)]"}`}>
      {isOver && <div className="absolute inset-0 rounded-lg bg-primary/[0.02] pointer-events-none" />}
      <div className="px-3 py-2">
        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center bg-muted rounded-md p-1 z-10 pointer-events-none"><GripVertical className="w-3.5 h-3.5 text-slate-500" /></div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <p className="text-[10.5px] text-slate-500 whitespace-nowrap" style={{ fontWeight: 500 }}>{label}</p>
          <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: "#94A3B8" }} />
        </div>
        <div className="flex items-baseline gap-1.5">
          {change && <span className="text-[10px] shrink-0" style={{ fontWeight: 500, color: change.startsWith("\u2191") ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>{change}</span>}
          <p className="text-[15px] text-slate-700 tracking-tight whitespace-nowrap" style={{ fontWeight: 600, lineHeight: 1.2 }}>{value}</p>
        </div>
      </div>
      {/* Remove button — bottom-right, hover-revealed (mirrors partner KPI card) */}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-150 p-1 rounded cursor-pointer hover:bg-red-50 z-10"
          title={`Remove ${label}`}
        >
          <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
        </button>
      )}
    </div>
  );
}

/* ─── Contact Widget Definitions ─── */
interface ContactWidgetDef {
  key: string;
  label: string;
  type: "chart" | "list" | "gauge" | "contact" | "text" | "donut" | "bars" | "line";
  description: string;
  category: "Performance" | "Activity" | "Orders" | "Notes";
}

const CONTACT_WIDGET_DEFS: ContactWidgetDef[] = [
  { key: "interaction_activity", label: "Interaction Activity", type: "chart", description: "Daily call & email volume by weekday", category: "Performance" },
  { key: "communication_trend", label: "Communication Trend", type: "line", description: "Yearly communication trend (line chart)", category: "Performance" },
  { key: "recent_communications", label: "Recent Communications", type: "list", description: "Latest emails, calls and messages", category: "Activity" },
  { key: "order_summary", label: "Order Summary", type: "bars", description: "Aggregated stats across all orders", category: "Orders" },
  { key: "purchase_orders", label: "Purchase Orders", type: "list", description: "POs linked to this contact", category: "Orders" },
  { key: "sales_orders", label: "Sales Orders", type: "list", description: "SOs linked to this contact", category: "Orders" },
  { key: "activity_timeline", label: "Activity Timeline", type: "list", description: "Chronological event history", category: "Activity" },
  { key: "notes", label: "Notes", type: "text", description: "Internal notes & comments on this contact", category: "Notes" },
];

const CONTACT_WIDGET_CATEGORY_ORDER: ContactWidgetDef["category"][] = ["Performance", "Activity", "Orders", "Notes"];

const DEFAULT_CONTACT_WIDGETS = [
  "interaction_activity", "communication_trend",
  "recent_communications", "order_summary",
  "purchase_orders", "sales_orders",
  "activity_timeline", "notes",
];

const CONTACT_WIDGET_DEFAULT_SPANS: Record<string, "full" | "half"> = {
  interaction_activity: "full",
  communication_trend: "full",
  recent_communications: "half",
  order_summary: "half",
  purchase_orders: "half",
  sales_orders: "half",
  activity_timeline: "half",
  notes: "full",
};

/* ─── Content Card — entire header is the drag handle ─── */
function ContactContentCard({ title, icon: Icon, count, children, currentSize, onSizeChange, isDragging, isOver }: {
  title: string;
  icon?: React.ElementType;
  count?: number;
  children: React.ReactNode;
  currentSize?: "sm" | "md" | "lg";
  onSizeChange?: (size: "sm" | "md" | "lg") => void;
  isDragging?: boolean;
  isOver?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`rounded-xl border bg-white overflow-hidden h-full flex flex-col transition-[box-shadow,border-color] duration-300 ${
        isOver && !isDragging
          ? "border-primary/30 shadow-[0_0_0_2px_rgba(10,119,255,0.10)]"
          : "border-border shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header — entire bar is the drag handle */}
      <div className="px-4 py-2.5 border-b border-muted flex items-center justify-between shrink-0 cursor-grab active:cursor-grabbing select-none">
        <div className="flex items-center gap-2 pointer-events-none">
          {Icon && (
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-primary" />
            </div>
          )}
          <span className="text-[13px] text-foreground" style={{ fontWeight: 600 }}>{title}</span>
          {count != null && (
            <span className="text-[10px] text-primary px-1.5 py-0.5 rounded-md bg-accent" style={{ fontWeight: 600 }}>{count}</span>
          )}
        </div>
        {/* Size toggle — slides in on hover */}
        <div
          className={`flex items-center transition-all duration-200 ease-out pointer-events-auto ${
            hovered && onSizeChange ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          {onSizeChange && currentSize && (
            <div className="flex items-center h-7 rounded-lg border border-border bg-slate-50 p-0.5 gap-0.5">
              {(["sm", "md", "lg"] as const).map((s) => (
                <button
                  key={s}
                  onClick={(e) => { e.stopPropagation(); onSizeChange(s); }}
                  className={`h-6 px-2.5 rounded-md text-[11px] cursor-pointer transition-all duration-150 ${
                    currentSize === s
                      ? "bg-white text-primary shadow-sm border border-border"
                      : "text-slate-400 hover:text-slate-700 hover:bg-white/60 border border-transparent"
                  }`}
                  style={{ fontWeight: currentSize === s ? 600 : 500 }}
                >
                  {s === "sm" ? "Small" : s === "md" ? "Medium" : "Large"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Body — natural height, flex stretches to match siblings */}
      <div className={`flex-1 flex flex-col justify-between ${currentSize === "sm" ? "p-3" : currentSize === "lg" ? "p-5" : "p-4"}`}>
        {children}
      </div>
    </div>
  );
}

/* ─── Sidebar Card (matches VendorDetailsPage DashInfoCard — collapsible with icon) ─── */
function ContactSidebarCard({ title, icon: Icon, count, children, defaultOpen = true }: {
  title: string; icon?: React.ElementType; count?: number; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <button
        type="button"
        className="w-full px-3.5 py-2.5 flex items-center gap-2 cursor-pointer hover:bg-[#FAFBFC] transition-colors"
        style={{ borderBottom: isOpen ? "1px solid #F1F5F9" : "none" }}
        onClick={() => setIsOpen((v) => !v)}
      >
        {Icon && (
          <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center shrink-0">
            <Icon className="w-3 h-3 text-primary" />
          </div>
        )}
        <span className="text-[12px] text-slate-700 text-left" style={{ fontWeight: 600 }}>{title}</span>
        {count != null && (
          <span className="text-[10px] text-primary px-1.5 py-0.5 rounded-md bg-accent" style={{ fontWeight: 600 }}>{count}</span>
        )}
        <ChevronDown
          className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)" }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{
          maxHeight: isOpen ? (contentHeight != null ? contentHeight + 24 + "px" : "1000px") : "0px",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="px-3.5 py-3">{children}</div>
      </div>
    </div>
  );
}

function ContactSidebarRow({ icon: Icon, label, value, isLink }: { icon: React.ElementType; label: string; value: string; isLink?: boolean }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400" style={{ fontWeight: 500 }}>{label}</p>
        {isLink ? (
          <a href={`mailto:${value}`} className="text-[12px] text-primary hover:underline break-all" style={{ fontWeight: 500 }}>{value}</a>
        ) : (
          <p className="text-[12px] text-slate-700 break-words" style={{ fontWeight: 500 }}>{value}</p>
        )}
      </div>
    </div>
  );
}

function ContactStatBox({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color?: string }) {
  return (
    <div className="rounded-lg bg-slate-50 border border-muted p-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3" style={{ color: color || "#94A3B8" }} />
        <span className="text-[10px] text-slate-400" style={{ fontWeight: 500 }}>{label}</span>
      </div>
      <p className="text-[14px] text-slate-700" style={{ fontWeight: 700 }}>{value}</p>
    </div>
  );
}

/* ─── Draggable Widget Card ─── */
const WIDGET_DND_TYPE = "CONTACT_WIDGET";

function DraggableContactWidget({ widgetKey, index, moveWidget, children }: {
  widgetKey: string;
  index: number;
  moveWidget: (from: number, to: number) => void;
  children: (isDragging: boolean, isOver: boolean) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, preview] = useDrag({
    type: WIDGET_DND_TYPE,
    item: () => ({ key: widgetKey, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  const [{ isOver }, drop] = useDrop({
    accept: WIDGET_DND_TYPE,
    drop(item: { key: string; index: number }) {
      if (item.index !== index) {
        moveWidget(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });
  preview(drop(ref));
  // Attach drag to the ref too — the header will call drag() separately
  drag(ref);
  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out rounded-xl ${isOver && !isDragging ? "ring-2 ring-primary/20 ring-offset-2 scale-[1.005]" : ""}`}
      style={{ opacity: isDragging ? 0.3 : 1, transform: isDragging ? "scale(0.97) rotate(-0.5deg)" : undefined }}
    >
      {children(isDragging, isOver)}
    </div>
  );
}

/* ─── Contact Customize Panel (KPIs + Widgets tabs) ─── */
/** Visual preview for a widget by type. Uses light Tailwind 200/300-equivalent
 *  tints (e.g. blue-300, orange-200, green-300) so the preview feels airy and
 *  matches the soft pastel palette of the dashboard previews. Inactive cards
 *  fall back to a neutral slate. */
function WidgetTypeVisual({ type, isActive }: { type: ContactWidgetDef["type"]; isActive: boolean }) {
  // Light pastel tints (Tailwind 200/300 family) used when active
  const C = {
    blue:    isActive ? "#93C5FD" : "hsl(var(--border))",  // blue-300 / slate-200
    orange:  isActive ? "#FDBA74" : "hsl(var(--border))",  // orange-300 / slate-200
    purple:  isActive ? "#C4B5FD" : "hsl(var(--border))",  // purple-300 / slate-200
    green:   isActive ? "#86EFAC" : "hsl(var(--border))",  // green-300 / slate-200
    red:     isActive ? "#FCA5A5" : "hsl(var(--border))",  // red-300 / slate-200
    slate:   isActive ? "#CBD5E1" : "hsl(var(--border))",  // slate-300 / slate-200
    needle:  isActive ? "#64748B" : "#94A3B8",  // slate-500 / slate-400 — gauge needle
    lineFg:  isActive ? "#93C5FD" : "#CBD5E1",  // line stroke
  };
  if (type === "chart") {
    const data: { h: number; c: string }[] = [
      { h: 14, c: C.blue },
      { h: 24, c: C.blue },
      { h: 18, c: C.orange },
      { h: 28, c: C.blue },
      { h: 16, c: C.orange },
      { h: 22, c: C.blue },
    ];
    return (
      <div className="flex items-end gap-[3px] h-full w-full px-3 pb-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 rounded-t-[2px]" style={{ height: d.h, backgroundColor: d.c }} />
        ))}
      </div>
    );
  }
  if (type === "list") {
    const dots = [C.blue, C.orange, C.green];
    return (
      <div className="flex flex-col gap-1.5 w-full px-3.5">
        {[82, 64, 72].map((w, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dots[i] }} />
            <div className="h-1.5 rounded-sm" style={{ width: `${w}%`, backgroundColor: C.slate }} />
          </div>
        ))}
      </div>
    );
  }
  if (type === "donut") {
    return (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="16" stroke={C.orange} strokeWidth="6" strokeDasharray="30 100" transform="rotate(-90 22 22)" />
        <circle cx="22" cy="22" r="16" stroke={C.purple} strokeWidth="6" strokeDasharray="25 100" strokeDashoffset="-30" transform="rotate(-90 22 22)" />
        <circle cx="22" cy="22" r="16" stroke={C.green} strokeWidth="6" strokeDasharray="25 100" strokeDashoffset="-55" transform="rotate(-90 22 22)" />
        <circle cx="22" cy="22" r="16" stroke={C.blue} strokeWidth="6" strokeDasharray="20 100" strokeDashoffset="-80" transform="rotate(-90 22 22)" />
      </svg>
    );
  }
  if (type === "gauge") {
    return (
      <svg width="64" height="36" viewBox="0 0 64 36" fill="none">
        <path d="M6 30 A 26 26 0 0 1 22 8" stroke={C.red} strokeWidth="5" strokeLinecap="round" />
        <path d="M22 8 A 26 26 0 0 1 42 8" stroke={C.orange} strokeWidth="5" strokeLinecap="round" />
        <path d="M42 8 A 26 26 0 0 1 58 30" stroke={C.green} strokeWidth="5" strokeLinecap="round" />
        <line x1="32" y1="30" x2="40" y2="14" stroke={C.needle} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="32" cy="30" r="2" fill={C.needle} />
      </svg>
    );
  }
  if (type === "bars") {
    const rows = [
      [{ w: 50, c: C.orange }, { w: 25, c: C.green }, { w: 15, c: C.purple }],
      [{ w: 35, c: C.orange }, { w: 30, c: C.green }, { w: 20, c: C.purple }],
      [{ w: 45, c: C.orange }, { w: 20, c: C.green }, { w: 25, c: C.purple }],
    ];
    return (
      <div className="flex flex-col gap-1.5 w-full px-3">
        {rows.map((row, i) => (
          <div key={i} className="flex h-1.5 gap-px">
            {row.map((seg, j) => (
              <div key={j} className="rounded-sm" style={{ width: `${seg.w}%`, backgroundColor: seg.c }} />
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (type === "contact") {
    return (
      <div className="flex items-center gap-2 w-full px-3">
        <div className="w-7 h-7 rounded-full shrink-0" style={{ backgroundColor: C.blue }} />
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-1.5 rounded-sm" style={{ width: "70%", backgroundColor: C.slate }} />
          <div className="h-1.5 rounded-sm" style={{ width: "50%", backgroundColor: C.slate, opacity: 0.7 }} />
        </div>
      </div>
    );
  }
  if (type === "line") {
    return (
      <svg width="80%" height="34" viewBox="0 0 80 32" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.lineFg} stopOpacity="0.45" />
            <stop offset="100%" stopColor={C.lineFg} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M2 26 L 12 22 L 22 24 L 32 18 L 42 14 L 52 16 L 62 10 L 72 8 L 78 6 L 78 30 L 2 30 Z" fill="url(#g-line)" />
        <path d="M2 26 L 12 22 L 22 24 L 32 18 L 42 14 L 52 16 L 62 10 L 72 8 L 78 6" stroke={C.lineFg} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // text — sticky-note style for the Notes widget
  return (
    <div className="flex flex-col gap-1.5 w-full px-4">
      {[92, 78, 86, 60].map((w, i) => (
        <div key={i} className="h-1.5 rounded-sm" style={{ width: `${w}%`, backgroundColor: C.slate, opacity: i === 0 ? 1 : 0.65 }} />
      ))}
    </div>
  );
}

function ContactCustomizePanel({ open, onOpenChange, contactKpis, hiddenKpis, onToggleKpi, activeWidgets, onToggleWidget, widgetSizes, onWidgetSizeChange }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** All possible contact KPIs — the same definitions rendered in the strip. */
  contactKpis: { key: string; label: string; value: string; icon: React.ElementType; description: string }[];
  /** Keys the user has hidden from the strip; "active" = NOT in this set. */
  hiddenKpis: Set<string>;
  onToggleKpi: (key: string) => void;
  activeWidgets: string[];
  onToggleWidget: (key: string) => void;
  widgetSizes: Record<string, "sm" | "md" | "lg">;
  onWidgetSizeChange: (key: string, size: "sm" | "md" | "lg") => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [panelTab, setPanelTab] = useState<"kpis" | "widgets">("kpis");
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      timeoutRef.current = setTimeout(() => setMounted(false), 280);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [open]);

  const filteredKpis = useMemo(() => {
    if (!searchQuery) return contactKpis;
    return contactKpis.filter((k) => k.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, contactKpis]);

  const filteredWidgets = useMemo(() => {
    if (!searchQuery) return CONTACT_WIDGET_DEFS;
    return CONTACT_WIDGET_DEFS.filter(w => w.label.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const allItems = panelTab === "kpis" ? contactKpis : CONTACT_WIDGET_DEFS;
  const activeKpiCount = contactKpis.filter((k) => !hiddenKpis.has(k.key)).length;
  const activeItemsCount = panelTab === "kpis" ? activeKpiCount : activeWidgets.length;

  if (!mounted) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[200] transition-opacity duration-[250ms] ease-in-out"
        style={{ backgroundColor: visible ? "rgba(0,0,0,0.25)" : "rgba(0,0,0,0)", pointerEvents: visible ? "auto" : "none" }}
        onClick={() => onOpenChange(false)}
      />
      <div
        className="fixed right-0 top-0 bottom-0 z-[200] w-full max-w-[400px] bg-white flex flex-col shadow-2xl transition-transform duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ transform: visible ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-0 shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "hsl(var(--accent))" }}>
                <Sliders className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
              </div>
              <div>
                <h2 className="text-base text-foreground" style={{ fontWeight: 600 }}>Customize Widgets</h2>
                <p className="text-[13px] text-muted-foreground mt-0.5">Manage your dashboard KPI widgets.</p>
              </div>
            </div>
            <button onClick={() => onOpenChange(false)} className="p-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer -mt-0.5 -mr-1">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          {/* Toggle all */}
          <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>
              {activeItemsCount} of {allItems.length} {panelTab === "kpis" ? "KPIs" : "widgets"} active
            </span>
            <button
              onClick={() => {
                if (panelTab === "kpis") {
                  const hidden = contactKpis.filter((k) => hiddenKpis.has(k.key));
                  const visible = contactKpis.filter((k) => !hiddenKpis.has(k.key));
                  // If everything visible → hide all; otherwise show all hidden
                  if (hidden.length === 0) visible.forEach((k) => onToggleKpi(k.key));
                  else hidden.forEach((k) => onToggleKpi(k.key));
                } else {
                  const allKeys = CONTACT_WIDGET_DEFS.map((k) => k.key);
                  const allActive = allKeys.every((k) => activeWidgets.includes(k));
                  if (allActive) activeWidgets.forEach((k) => onToggleWidget(k));
                  else allKeys.filter((k) => !activeWidgets.includes(k)).forEach((k) => onToggleWidget(k));
                }
              }}
              className={`flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                activeItemsCount === allItems.length
                  ? "bg-[#EBF3FF] border-primary/25 text-primary hover:bg-[#DCEAFF] hover:border-primary/40 shadow-sm shadow-primary/10"
                  : activeItemsCount === 0
                  ? "bg-slate-50 border-border text-slate-400 hover:bg-muted hover:border-slate-300 hover:text-slate-500"
                  : "bg-slate-50 border-border text-slate-500 hover:bg-[#EBF3FF] hover:border-primary/25 hover:text-primary"
              }`}
              style={{ fontWeight: 600 }}
            >
              {activeItemsCount === allItems.length ? (
                <><ToggleRight className="w-4 h-4 text-primary" /><span>All On</span></>
              ) : activeItemsCount === 0 ? (
                <><ToggleLeft className="w-4 h-4" /><span>All Off</span></>
              ) : (
                <><ToggleLeft className="w-4 h-4" /><span>Enable All</span></>
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pt-3.5 pb-0 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
            <input
              placeholder="Search metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-lg border border-border bg-white text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-colors"
            />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-0 px-5 border-b border-muted shrink-0 mt-3">
          {(["kpis", "widgets"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPanelTab(t)}
              className={`px-4 py-2.5 border-b-2 text-[13px] transition-all duration-200 cursor-pointer whitespace-nowrap ${
                panelTab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
              style={{ fontWeight: panelTab === t ? 600 : 400 }}
            >
              {t === "kpis" ? "KPIs" : "Widgets"}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
          {panelTab === "kpis" ? (
            <>
              {filteredKpis.length === 0 && (
                <div className="flex flex-col items-center py-12 text-muted-foreground">
                  <Search className="w-5 h-5 mb-2 opacity-40" />
                  <p className="text-xs text-muted-foreground/60">No metrics found</p>
                </div>
              )}
              {filteredKpis.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[12px] text-muted-foreground/70 uppercase tracking-wide" style={{ fontWeight: 600 }}>Contact Insights</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredKpis.map((kpi) => {
                      const isActive = !hiddenKpis.has(kpi.key);
                      return (
                        <button
                          key={kpi.key}
                          onClick={() => onToggleKpi(kpi.key)}
                          className={`relative text-left rounded-lg border px-3 py-2.5 transition-all duration-150 cursor-pointer group ${
                            isActive
                              ? "border-primary/25 bg-primary/[0.04] shadow-[0_0_0_1px_rgba(10,119,255,0.08)]"
                              : "border-border/60 bg-white hover:border-border hover:bg-muted/20 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-[11.5px] truncate transition-colors ${isActive ? "text-primary" : "text-muted-foreground/70"}`} style={{ fontWeight: 500 }} title={kpi.label}>{kpi.label}</span>
                            <div className="shrink-0">
                              {isActive ? <Check className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} /> : <Plus className="w-3.5 h-3.5 text-muted-foreground/25 group-hover:text-muted-foreground/50 transition-colors" />}
                            </div>
                          </div>
                          <p className={`text-[15px] mt-1 transition-colors ${isActive ? "text-foreground" : "text-foreground/80"}`} style={{ fontWeight: 550 }}>{kpi.value}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="mt-2">
              {filteredWidgets.length === 0 && (
                <div className="flex flex-col items-center py-12 text-muted-foreground">
                  <Search className="w-5 h-5 mb-2 opacity-40" />
                  <p className="text-xs text-muted-foreground/60">No widgets found</p>
                </div>
              )}
              {filteredWidgets.length > 0 && CONTACT_WIDGET_CATEGORY_ORDER.map((cat) => {
                const inCat = filteredWidgets.filter((w) => w.category === cat);
                if (inCat.length === 0) return null;
                const CatIcon = cat === "Performance" ? Activity : cat === "Activity" ? Clock : cat === "Orders" ? Package : Sliders;
                return (
                  <div key={cat} className="mt-5 first:mt-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <CatIcon className="w-3.5 h-3.5 text-muted-foreground/70" />
                      <span className="text-[12px] text-muted-foreground/70 uppercase tracking-wide" style={{ fontWeight: 600 }}>{cat}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {inCat.map((w) => {
                        const isActive = activeWidgets.includes(w.key);
                        const sz = widgetSizes[w.key] || "md";
                        return (
                          <button
                            key={w.key}
                            onClick={() => onToggleWidget(w.key)}
                            className={`relative text-left rounded-xl border overflow-hidden transition-all duration-150 cursor-pointer group ${
                              isActive
                                ? "border-primary/30 bg-white shadow-[0_0_0_1px_rgba(10,119,255,0.08)]"
                                : "border-border/60 bg-white hover:border-border hover:shadow-sm"
                            }`}
                          >
                            <div className={`h-[68px] flex items-center justify-center transition-colors ${isActive ? "bg-[#F8FAFF]" : "bg-slate-50"}`}>
                              <WidgetTypeVisual type={w.type} isActive={isActive} />
                            </div>
                            <div className="absolute top-1.5 right-1.5">
                              {isActive ? (
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-white border border-border flex items-center justify-center group-hover:border-slate-300 transition-colors">
                                  <Plus className="w-3 h-3 text-slate-400" />
                                </div>
                              )}
                            </div>
                            <div className="px-3 py-2.5 border-t border-muted">
                              <p className="text-[12.5px] text-foreground truncate" style={{ fontWeight: 600 }} title={w.label}>{w.label}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-snug" title={w.description}>{w.description}</p>
                              {isActive && (
                                <div className="mt-2 flex items-center h-6 rounded-md border border-border bg-slate-50 p-0.5 gap-0.5" onClick={(e) => e.stopPropagation()}>
                                  {(["sm", "md", "lg"] as const).map((s) => (
                                    <button
                                      key={s}
                                      onClick={(e) => { e.stopPropagation(); onWidgetSizeChange(w.key, s); }}
                                      className={`flex-1 h-5 rounded text-[9.5px] transition-all duration-150 cursor-pointer ${
                                        sz === s ? "bg-white text-primary shadow-sm" : "text-slate-400 hover:text-slate-700"
                                      }`}
                                      style={{ fontWeight: sz === s ? 600 : 500 }}
                                    >
                                      {s.toUpperCase()}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export function ContactDetailPage() {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const { vendors } = useVendors();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // KPI drag-drop state
  const CONTACT_KPIS = [
    { key: "linked_partners", label: "Linked Partners", value: "0", icon: Link2, change: null, description: "Companies linked to this contact" },
    { key: "total_orders", label: "Total Orders", value: "24", icon: Package, change: "\u2191 12%", description: "All purchase & sales orders" },
    { key: "email_interactions", label: "Email Interactions", value: "156", icon: Mail, change: "\u2191 8%", description: "Total email volume sent & received" },
    { key: "last_active", label: "Last Active", value: "Mar 01, 2026", icon: Clock, change: null, description: "Date of most recent interaction" },
    { key: "avg_response", label: "Avg. Response", value: "4.2 hrs", icon: Activity, change: "\u2193 15%", description: "Mean reply time across channels" },
    { key: "satisfaction", label: "Satisfaction", value: "4.8 / 5", icon: Star, change: null, description: "Customer satisfaction (CSAT) score" },
  ];
  const [kpiOrder, setKpiOrder] = useState<string[]>(CONTACT_KPIS.map(k => k.key));
  const [hiddenKpis, setHiddenKpis] = useState<Set<string>>(new Set());
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const moveKpi = useCallback((from: number, to: number) => {
    setKpiOrder((prev) => { const next = [...prev]; const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next; });
  }, []);
  const toggleKpi = useCallback((key: string) => {
    setHiddenKpis((prev) => { const next = new Set(prev); if (next.has(key)) next.delete(key); else next.add(key); return next; });
  }, []);

  // Widget state (matches VendorDetailsPage pattern)
  const [activeWidgets, setActiveWidgets] = useState<string[]>([...DEFAULT_CONTACT_WIDGETS]);
  const [widgetSizes, setWidgetSizes] = useState<Record<string, "sm" | "md" | "lg">>({});
  const handleToggleWidget = useCallback((key: string) => {
    setActiveWidgets((prev) => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  }, []);
  const handleWidgetSizeChange = useCallback((key: string, size: "sm" | "md" | "lg") => {
    setWidgetSizes((prev) => ({ ...prev, [key]: size }));
  }, []);
  const moveWidget = useCallback((fromIndex: number, toIndex: number) => {
    setActiveWidgets((prev) => { const next = [...prev]; const [moved] = next.splice(fromIndex, 1); next.splice(toIndex, 0, moved); return next; });
  }, []);
  const [imgFailed, setImgFailed] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const { openLightbox } = usePersonLightbox();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsCompact(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editPocName, setEditPocName] = useState("");
  const [editPocDepartment, setEditPocDepartment] = useState("");
  const [editPocRole, setEditPocRole] = useState("");
  const [editPocLandline, setEditPocLandline] = useState("");
  const [editPocLandlineCode, setEditPocLandlineCode] = useState("+1");
  const [editPocExt, setEditPocExt] = useState("");
  const [editPocMobile, setEditPocMobile] = useState("");
  const [editPocMobileCode, setEditPocMobileCode] = useState("+1");
  const [editPocEmail, setEditPocEmail] = useState("");
  const [editSaveAnother, setEditSaveAnother] = useState(false);

  // Confirmation modals
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  // Status dropdown state (matches VendorDetailsPage)
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  // Email compose box
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeMinimized, setComposeMinimized] = useState(false);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  // Use real vendor names for linked partners
  const vendorNames = useMemo(() => vendors.length > 0 ? vendors.map((v) => v.displayName) : PARTNER_NAMES, [vendors]);
  const partnerNameToId = useMemo(() => {
    const map: Record<string, string> = {};
    vendors.forEach((v) => { map[v.displayName] = v.id; map[v.companyName] = v.id; });
    return map;
  }, [vendors]);

  const contact = useMemo(() => {
    const raw = CONTACT_DICTIONARY.find((c) => c.id === contactId);
    if (!raw) return null;
    return enrichContactWithNames(raw, vendorNames);
  }, [contactId, vendorNames]);

  const handleOpenEdit = () => {
    if (!contact) return;
    setEditPocName(contact.name);
    setEditPocDepartment(contact.department);
    setEditPocRole(contact.role || "");
    setEditPocEmail(contact.emails && contact.emails.length > 0 ? contact.emails[0].address : contact.email);
    const phoneList = contact.phones && contact.phones.length > 0 ? contact.phones : [{ id: "fb", type: "Office" as const, code: "+1", number: contact.phone, ext: contact.phoneExt || "" }];
    setEditPocLandline(phoneList[0].number);
    setEditPocLandlineCode(phoneList[0].code || "+1");
    setEditPocExt(phoneList[0].ext || "");
    if (phoneList.length > 1) {
      setEditPocMobile(phoneList[1].number);
      setEditPocMobileCode(phoneList[1].code || "+1");
    } else {
      setEditPocMobile(contact.secondaryPhone || "");
      setEditPocMobileCode("+1");
    }
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    toast.success(`Contact "${editPocName}" updated successfully`);
    setEditModalOpen(false);
  };

  if (!contact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <User className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 text-sm">Contact not found.</p>
        <Button variant="outline" onClick={() => navigate("/partners/contacts")} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Back to Contacts
        </Button>
      </div>
    );
  }

  const tint = getAvatarTint(contact.name);
  const photo = getPersonPhoto(contact.name);
  const initials = contact.name.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const deptStyle = DEPT_STYLES[contact.department] || DEPT_STYLES.Sales;
  const shortDept = (d: string) => d === "Supply Chain Management" ? "Supply Chain" : d;
  const departments = contact.departments || [contact.department];
  const primaryDept = departments[0];
  const extraDepts = departments.slice(1);
  const primaryDeptStyle = DEPT_STYLES[primaryDept] || DEPT_STYLES.Sales;
  const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
    active: { color: "#065F46", bg: "#ECFDF5", border: "#A7F3D0", label: "Active" },
    inactive: { color: "#92400E", bg: "#FFFBEB", border: "#FDE68A", label: "Inactive" },
  };
  const currentStatus = statusConfig[contact.status] || statusConfig.active;
  const sStyle = contact.status === "active" ? { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" } : { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" };

  // Multi-field data
  const phoneList: ContactPhone[] = contact.phones && contact.phones.length > 0
    ? contact.phones
    : [{ id: "p1", type: "Office" as const, code: "+1", number: contact.phone, ext: contact.phoneExt || "" }, ...(contact.secondaryPhone ? [{ id: "p2", type: "Mobile" as const, code: "+1", number: contact.secondaryPhone, ext: contact.secondaryPhoneExt || "" }] : [])];
  const emailList: ContactEmail[] = contact.emails && contact.emails.length > 0
    ? contact.emails
    : [{ id: "e1", type: "Work" as const, address: contact.email }];
  const socialList: ContactSocial[] = contact.socials || [];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-y-auto">
      {/* Top Nav Bar — breadcrumb + search + user profile */}
      <div className="bg-white border-b border-border shrink-0 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 lg:px-6 h-11">
          <div className="flex items-center gap-2 text-[13px] text-slate-500">
            <button onClick={() => navigate("/partners")} className="hover:text-foreground transition-colors cursor-pointer" style={{ fontWeight: 500 }}>Partners Management</button>
            <span className="text-slate-300">/</span>
            <button onClick={() => navigate("/partners/contacts")} className="hover:text-foreground transition-colors cursor-pointer" style={{ fontWeight: 500 }}>Contacts Directory</button>
            <span className="text-slate-300">/</span>
            <span className="text-foreground" style={{ fontWeight: 500 }}>{contact.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search contacts..." className="pl-9 w-[220px] h-8 bg-slate-50 border-border text-[13px] placeholder:text-slate-400 rounded-lg" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border-2 border-border" style={{ backgroundColor: "hsl(var(--primary))" }}>
                <span className="text-[11px] text-white" style={{ fontWeight: 600 }}>AA</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-[13px] text-foreground" style={{ fontWeight: 500 }}>Ahtisham Ahmad</p>
                <p className="text-[11px] text-slate-400 leading-tight">Product Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sentinel */}
      <div ref={sentinelRef} className="shrink-0 h-px" />

      {/* Sticky Header Card — VendorDetailsPage pattern */}
      <div className="shrink-0 sticky top-[44px] z-20 bg-slate-50">
        <div style={{ paddingTop: isCompact ? "8px" : "12px", paddingBottom: "4px", transition: "padding-top 250ms ease" }}>
          <div className={`mx-auto px-4 lg:px-6 xl:px-8 transition-all duration-300 ${isFullscreen ? "max-w-full" : "max-w-[1440px] 2xl:max-w-[1600px]"}`}>
            <div className={`bg-white border border-border rounded-xl overflow-hidden transition-shadow duration-250 ${isCompact ? "shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.05)]" : "shadow-sm"}`}>
              {/* Main header row */}
              <div className="flex items-start justify-between gap-4 transition-all duration-250 ease-in-out" style={{ padding: isCompact ? "8px 16px" : "18px 20px" }}>
                <div className="flex items-start min-w-0 transition-all duration-250" style={{ gap: isCompact ? 10 : 16 }}>
                  <button onClick={() => navigate("/partners/contacts")} className="rounded-xl border border-border bg-white hover:bg-slate-50 flex items-center justify-center shrink-0 cursor-pointer shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.03)] transition-all duration-250" style={{ width: isCompact ? 32 : 44, height: isCompact ? 32 : 44 }}>
                    <ChevronLeft className="text-slate-400 transition-all duration-250" style={{ width: isCompact ? 16 : 20, height: isCompact ? 16 : 20 }} />
                  </button>
                  {/* Avatar — 120px expanded, 42px compact; click to open lightbox */}
                  <button
                    type="button"
                    onClick={() => { if (photo && !imgFailed) openLightbox({ src: photo, name: contact.name, subtitle: `${contact.department} · ${contact.company}` }); }}
                    className="rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border-[3px] border-white shadow-[0_4px_16px_-4px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.04)] transition-all duration-250 focus:outline-none"
                    style={{ width: isCompact ? 42 : 120, height: isCompact ? 42 : 120, backgroundColor: tint.bg, cursor: photo && !imgFailed ? "zoom-in" : "default" }}
                  >
                    {photo && !imgFailed ? (<img src={photo} alt="" className="w-full h-full object-cover" onError={() => setImgFailed(true)} />) : (<span className="transition-all duration-250" style={{ fontSize: isCompact ? 14 : 36, fontWeight: 700, color: tint.fg }}>{initials}</span>)}
                  </button>
                  <div className="min-w-0 flex-1">
                    {/* Row 1: Name + Status dropdown + Department badges */}
                    <div className="flex items-center flex-wrap transition-all duration-250" style={{ gap: isCompact ? 6 : 8 }}>
                      <h1 className="text-foreground truncate transition-all duration-250" style={{ fontSize: isCompact ? 14 : 19, fontWeight: 700, lineHeight: 1.3 }}>{contact.name}</h1>
                      {/* Status pill — clickable dropdown to change status */}
                      <Popover open={statusDropdownOpen} onOpenChange={setStatusDropdownOpen}>
                        <PopoverTrigger asChild>
                          <button
                            className={`inline-flex items-center rounded-full border cursor-pointer transition-all duration-150 hover:ring-2 hover:ring-offset-1 hover:ring-border ${isCompact ? "px-1.5 py-px text-[10px] gap-0.5" : "px-2 py-0.5 text-[11px] gap-1"}`}
                            style={{ fontWeight: 500, backgroundColor: currentStatus.bg, color: currentStatus.color, borderColor: currentStatus.border }}
                          >
                            {currentStatus.label}
                            <ChevronDown className={isCompact ? "w-2.5 h-2.5" : "w-3 h-3"} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent side="bottom" align="start" sideOffset={6} className="w-[170px] p-1.5 z-[300]" onOpenAutoFocus={(e) => e.preventDefault()}>
                          <div className="space-y-1">
                            {(["active", "inactive"] as const).map((s) => {
                              const sc = statusConfig[s];
                              const isCurrent = s === contact.status;
                              return (
                                <button
                                  key={s}
                                  onClick={() => {
                                    if (!isCurrent) {
                                      if (s === "inactive") { setShowDeactivateModal(true); }
                                      else { toast.success("Contact activated"); }
                                      setStatusDropdownOpen(false);
                                    }
                                  }}
                                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors cursor-pointer ${isCurrent ? "bg-slate-50" : "hover:bg-slate-50"}`}
                                >
                                  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px]" style={{ fontWeight: 500, backgroundColor: sc.bg, color: sc.color, borderColor: sc.border }}>{sc.label}</span>
                                  {isCurrent && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
                                </button>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                      {/* Primary department */}
                      {primaryDeptStyle && <span className="inline-flex items-center rounded-md border transition-all duration-250" style={{ padding: isCompact ? "1px 6px" : "2px 8px", fontSize: isCompact ? 10 : 11, fontWeight: 600, backgroundColor: primaryDeptStyle.bg, color: primaryDeptStyle.text, borderColor: primaryDeptStyle.border }}>{shortDept(primaryDept)}</span>}
                      {/* Extra departments — +X more with hover */}
                      {extraDepts.length > 0 && (() => {
                        const [deptHover, setDeptHover] = React.useState(false);
                        const deptTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
                        const handleEnter = () => { if (deptTimer.current) clearTimeout(deptTimer.current); setDeptHover(true); };
                        const handleLeave = () => { deptTimer.current = setTimeout(() => setDeptHover(false), 200); };
                        return (
                          <Popover open={deptHover} onOpenChange={(o) => { if (!o) setDeptHover(false); }}>
                            <PopoverTrigger
                              onMouseEnter={handleEnter}
                              onMouseLeave={handleLeave}
                              className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] border border-border bg-muted text-primary cursor-default transition-colors hover:bg-border"
                              style={{ fontWeight: 600 }}
                            >
                              +{extraDepts.length} more
                            </PopoverTrigger>
                            <PopoverContent
                              side="bottom"
                              align="start"
                              sideOffset={6}
                              className="w-[200px] p-2 z-[300]"
                              onOpenAutoFocus={(e) => e.preventDefault()}
                              onMouseEnter={handleEnter}
                              onMouseLeave={handleLeave}
                            >
                              <p className="text-[10px] text-slate-400 mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Additional Departments</p>
                              <div className="space-y-1.5">
                                {extraDepts.map((d, i) => {
                                  const ds = DEPT_STYLES[d] || DEPT_STYLES.Sales;
                                  return (
                                    <span key={i} className="inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] mr-1.5" style={{ fontWeight: 600, backgroundColor: ds.bg, color: ds.text, borderColor: ds.border }}>{shortDept(d)}</span>
                                  );
                                })}
                              </div>
                            </PopoverContent>
                          </Popover>
                        );
                      })()}
                    </div>
                    {/* Row 2: Role · Company — always visible */}
                    <p className="text-slate-500 truncate transition-all duration-250" style={{ fontSize: isCompact ? 11 : 13.5, marginTop: isCompact ? 1 : 4, fontWeight: 400 }}>
                      {contact.role || "Contact"} <span className="text-slate-300 mx-0.5">·</span> {(contact.companies || [contact.company])[0]}
                    </p>
                    {/* Row 3: Contact data — collapses on scroll */}
                    <div className="overflow-hidden transition-all duration-250 ease-in-out" style={{ maxHeight: isCompact ? 0 : 24, opacity: isCompact ? 0 : 1, marginTop: isCompact ? 0 : 8 }}>
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Email */}
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <button
                            onClick={() => { setComposeTo(emailList[0].address); setComposeSubject(""); setComposeBody(""); setComposeOpen(true); setComposeMinimized(false); }}
                            className="text-[11.5px] text-slate-700 hover:text-primary hover:underline transition-colors cursor-pointer bg-transparent border-0 p-0"
                            style={{ fontWeight: 500 }}
                          >
                            {emailList[0].address}
                          </button>
                          {emailList.length > 1 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-[11px] shrink-0 cursor-default leading-none" style={{ fontWeight: 600, color: "#085FCC" }}>+{emailList.length - 1} more</span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="z-[300] max-w-[300px]">
                                <div className="space-y-1.5">
                                  {emailList.map((e) => (
                                    <button key={e.id} onClick={() => { setComposeTo(e.address); setComposeSubject(""); setComposeBody(""); setComposeOpen(true); setComposeMinimized(false); }} className="w-full flex items-center gap-2 text-left hover:bg-slate-50 rounded px-1 py-0.5 transition-colors cursor-pointer bg-transparent border-0">
                                      <span className="text-[10px] text-slate-400 shrink-0" style={{ fontWeight: 500 }}>{e.type}</span>
                                      <span className="text-[11px] hover:text-primary hover:underline transition-colors">{e.address}</span>
                                    </button>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <div className="w-px h-3.5 bg-border" />
                        {/* Phone */}
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-[11.5px] text-slate-700" style={{ fontWeight: 500 }}>{phoneList[0].code} {phoneList[0].number}{phoneList[0].ext ? ` ext. ${phoneList[0].ext}` : ""}</span>
                          {phoneList.length > 1 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-[11px] shrink-0 cursor-default leading-none" style={{ fontWeight: 600, color: "#085FCC" }}>+{phoneList.length - 1} more</span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="z-[300] max-w-[300px]">
                                <div className="space-y-1.5">
                                  {phoneList.slice(1).map((p) => (
                                    <div key={p.id} className="flex items-center gap-2">
                                      <span className="text-[10px] text-slate-400 shrink-0" style={{ fontWeight: 500 }}>{p.type}</span>
                                      <span className="text-[11px] text-slate-700">{p.code} {p.number}{p.ext ? ` ext. ${p.ext}` : ""}</span>
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        {/* Socials — grey icons, brand color on hover */}
                        {socialList.length > 0 && (
                          <>
                            <div className="w-px h-3.5 bg-border" />
                            <div className="flex items-center gap-1.5">
                              {socialList.map((s) => {
                                const socialMeta: Record<string, { icon: React.ElementType; color: string; label: string }> = {
                                  "LinkedIn": { icon: Linkedin, color: "#0A66C2", label: "LinkedIn" },
                                  "Twitter / X": { icon: Twitter, color: "#000000", label: "X (Twitter)" },
                                  "Website": { icon: Globe, color: "hsl(var(--primary))", label: "Website" },
                                  "Skype": { icon: MessageCircle, color: "#00AFF0", label: "Skype" },
                                  "WhatsApp": { icon: MessageCircle, color: "#25D366", label: "WhatsApp" },
                                  "Other": { icon: ExternalLink, color: "#64748B", label: "Link" },
                                };
                                const meta = socialMeta[s.type] || socialMeta.Other;
                                const SIcon = meta.icon;
                                return (
                                  <Tooltip key={s.id}>
                                    <TooltipTrigger asChild>
                                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="group/social relative w-5 h-5 rounded flex items-center justify-center transition-all duration-150 hover:bg-muted">
                                        <SIcon className="w-3.5 h-3.5 text-slate-400 group-hover/social:opacity-0 transition-opacity duration-150" />
                                        <SIcon className="w-3.5 h-3.5 absolute opacity-0 group-hover/social:opacity-100 transition-opacity duration-150" style={{ color: meta.color }} />
                                      </a>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="z-[300]"><span className="text-[11px]">{meta.label}</span></TooltipContent>
                                  </Tooltip>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Right: Fullscreen + Actions + Edit CTA */}
                <div className="flex items-center shrink-0 transition-all duration-250" style={{ gap: isCompact ? 6 : 8 }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="rounded-lg border border-border bg-white hover:bg-slate-50 flex items-center justify-center cursor-pointer shadow-sm transition-all duration-250"
                        style={{ width: isCompact ? 32 : 36, height: isCompact ? 32 : 36 }}
                      >
                        {isFullscreen ? (
                          <Minimize2 className="text-slate-500 transition-all duration-250" style={{ width: isCompact ? 14 : 16, height: isCompact ? 14 : 16 }} />
                        ) : (
                          <Maximize2 className="text-slate-500 transition-all duration-250" style={{ width: isCompact ? 14 : 16, height: isCompact ? 14 : 16 }} />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[300]">{isFullscreen ? "Exit Full Screen" : "Full Screen"}</TooltipContent>
                  </Tooltip>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={`rounded-lg border border-border bg-white hover:bg-slate-50 text-slate-700 inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm ${isCompact ? "h-8 px-3 text-[12px]" : "h-9 px-3.5 text-[13px]"}`} style={{ fontWeight: 500 }}>Actions <ChevronDown className="w-3.5 h-3.5 text-slate-400" /></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }}><Link2 className="w-4 h-4 mr-2" /> Copy Link</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-amber-800 focus:text-amber-800 focus:bg-amber-50" onClick={() => setShowDeactivateModal(true)}><CircleSlash className="w-4 h-4 mr-2 text-amber-800" /> {contact.status === "active" ? "Deactivate" : "Activate"}</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-red-50" onClick={() => setShowArchiveModal(true)}><Archive className="w-4 h-4 mr-2 text-destructive" /> Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button onClick={handleOpenEdit} className={`rounded-lg bg-primary hover:bg-[#0862D0] text-white inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm ${isCompact ? "h-8 px-3.5 text-[12px]" : "h-9 px-4 text-[13px]"}`} style={{ fontWeight: 600 }}><Pencil className={isCompact ? "w-3 h-3" : "w-3.5 h-3.5"} /> Edit Contact</button>
                </div>
              </div>

              {/* Tab bar — icons + labels */}
              <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide border-t border-muted px-4 lg:px-5">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`border-b-2 transition-all duration-200 whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "border-primary text-primary"
                          : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                      }`}
                      style={{
                        padding: isCompact ? "7px 12px" : "9px 12px",
                        fontSize: isCompact ? 12 : 12.5,
                        fontWeight: isActive ? 600 : 500,
                        transition: "padding 250ms ease, font-size 250ms ease",
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none transition-opacity duration-300" style={{ height: 8, background: "linear-gradient(to bottom, rgba(248,250,252,0.8) 0%, rgba(248,250,252,0.4) 40%, rgba(248,250,252,0) 100%)", opacity: isCompact ? 1 : 0 }} />
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className={`mx-auto w-full px-4 lg:px-6 xl:px-8 pt-3 pb-5 flex-1 flex flex-col min-h-0 transition-all duration-300 ${isFullscreen ? "max-w-full" : "max-w-[1440px] 2xl:max-w-[1600px]"}`}>
          {activeTab === "overview" && (
            <ContactOverviewTab
              contact={contact}
              sStyle={sStyle}
              partnerNameToId={partnerNameToId}
              kpiOrder={kpiOrder}
              hiddenKpis={hiddenKpis}
              moveKpi={moveKpi}
              toggleKpi={toggleKpi}
              CONTACT_KPIS={CONTACT_KPIS}
              activeWidgets={activeWidgets}
              widgetSizes={widgetSizes}
              onWidgetSizeChange={handleWidgetSizeChange}
              moveWidget={moveWidget}
              setCustomizeOpen={setCustomizeOpen}
            />
          )}

          {/* OLD overview cards removed */}
          {activeTab === "_removed" && (
            <div className="grid grid-cols-2 gap-5">
              {/* Contact Information Card */}
              <div className="bg-white border border-border rounded-xl p-5">
                <h3 className="text-[13px] text-foreground mb-4" style={{ fontWeight: 600 }}>Contact Information</h3>
                <div className="space-y-3.5">
                  {/* Primary Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-0.5" style={{ fontWeight: 500 }}>Primary Phone</p>
                      <p className="text-[13px] text-slate-700" style={{ fontWeight: 500 }}>
                        {contact.phone}
                        {contact.phoneExt && <span className="text-slate-400 ml-1.5">ext. {contact.phoneExt}</span>}
                      </p>
                    </div>
                  </div>
                  {/* Secondary Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-0.5" style={{ fontWeight: 500 }}>Secondary Phone</p>
                      <p className="text-[13px] text-slate-700" style={{ fontWeight: 500 }}>
                        {contact.secondaryPhone}
                        {contact.secondaryPhoneExt && <span className="text-slate-400 ml-1.5">ext. {contact.secondaryPhoneExt}</span>}
                      </p>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-0.5" style={{ fontWeight: 500 }}>Email</p>
                      <a href={`mailto:${contact.email}`} className="text-[13px] text-primary hover:underline" style={{ fontWeight: 500 }}>
                        {contact.email}
                      </a>
                    </div>
                  </div>
                  {/* Department */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-0.5" style={{ fontWeight: 500 }}>Department</p>
                      <p className="text-[13px] text-slate-700" style={{ fontWeight: 500 }}>{contact.department}</p>
                    </div>
                  </div>
                  {/* Role / Title */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-0.5" style={{ fontWeight: 500 }}>Role / Title</p>
                      <p className="text-[13px] text-slate-700" style={{ fontWeight: 500 }}>{contact.role || `${contact.department} Representative`}</p>
                    </div>
                  </div>
                  {/* Company */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 mb-0.5" style={{ fontWeight: 500 }}>Company</p>
                      <p className="text-[13px] text-slate-700" style={{ fontWeight: 500 }}>{contact.company}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partner Information Card */}
              <div className="bg-white border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] text-foreground" style={{ fontWeight: 600 }}>Partner Information</h3>
                  <span className="text-[11px] text-slate-400 bg-muted rounded-full px-2.5 py-0.5" style={{ fontWeight: 600 }}>
                    {contact.linkedPartners.length} linked
                  </span>
                </div>
                <div className="space-y-2.5">
                  {contact.linkedPartners.map((partner, idx) => {
                    const pTint = getAvatarTint(partner);
                    const pInitials = partner.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
                    const partnerId = partnerNameToId[partner];
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border border-muted hover:border-blue-200 hover:bg-[#F0F7FF] transition-all ${partnerId ? "cursor-pointer" : ""}`}
                        onClick={() => { if (partnerId) window.open(`/vendors/${partnerId}`, "_blank"); }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: pTint.bg }}
                        >
                          <span className="text-[10px]" style={{ fontWeight: 700, color: pTint.fg }}>{pInitials}</span>
                        </div>
                        <span className={`text-[13px] text-slate-700 ${partnerId ? "hover:text-primary hover:underline" : ""}`} style={{ fontWeight: 500 }}>{partner}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "linked_partners" && (() => {
            // Filter the full vendors list down to those linked to this contact (case-insensitive name match against displayName / companyName)
            const linkedNames = new Set(contact.linkedPartners.map(n => n.trim().toLowerCase()));
            const linkedVendors = vendors.filter(v =>
              linkedNames.has(v.displayName.trim().toLowerCase()) ||
              linkedNames.has(v.companyName.trim().toLowerCase())
            );
            // Trimmed default column visibility for the sub-tab — all columns remain available via the column selector
            const linkedPartnersDefaultVisibility: Record<string, boolean> = {
              partner_name: true,
              partner_type: true,
              vendor_sub_types: true,
              customer_sub_types: true,
              num_items: false,
              partner_locations: false,
              global_contacts: true,
              partner_group: true,
              net_profit: false,
              credit_limit: false,
              credit_utilization: false,
              services: false,
              carrier_vendor: false,
              carrier_customer: false,
              country: true,
              website: false,
              email: true,
              created_by: false,
              created_on: false,
              status: true,
            };
            return (
              <VendorsListPage
                embedded
                embeddedVendors={linkedVendors}
                embeddedDefaultColumnVisibility={linkedPartnersDefaultVisibility}
                embeddedDefaultDensity="condensed"
              />
            );
          })()}

          {activeTab === "communications" && (
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-muted flex items-center justify-between">
                <h3 className="text-[13px] text-foreground" style={{ fontWeight: 600 }}>Communications</h3>
                <span className="text-[11px] shrink-0" style={{ fontWeight: 600, color: "#085FCC" }}>{COMMUNICATIONS_DATA.length} records</span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-muted">
                    <th className="text-left text-[11px] text-slate-400 px-5 py-2" style={{ fontWeight: 600 }}>Type</th>
                    <th className="text-left text-[11px] text-slate-400 px-5 py-2" style={{ fontWeight: 600 }}>Subject</th>
                    <th className="text-left text-[11px] text-slate-400 px-5 py-2" style={{ fontWeight: 600 }}>From</th>
                    <th className="text-left text-[11px] text-slate-400 px-5 py-2" style={{ fontWeight: 600 }}>Date</th>
                    <th className="text-left text-[11px] text-slate-400 px-5 py-2" style={{ fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {COMMUNICATIONS_DATA.map((item) => (
                    <tr key={item.id} className="border-b border-muted last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer">
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-1.5">
                          {item.type === "Email" ? <Mail className="w-3.5 h-3.5 text-slate-400" /> : <Phone className="w-3.5 h-3.5 text-slate-400" />}
                          <span className="text-[12px] text-slate-700" style={{ fontWeight: 500 }}>{item.type}</span>
                        </div>
                      </td>
                      <td className="px-5 py-2.5"><span className="text-[12px] text-slate-700" style={{ fontWeight: 500 }}>{item.subject}</span></td>
                      <td className="px-5 py-2.5"><span className="text-[12px] text-slate-500">{item.from}</span></td>
                      <td className="px-5 py-2.5"><span className="text-[12px] text-slate-500">{formatDate(item.date)}</span></td>
                      <td className="px-5 py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] border" style={{ fontWeight: 500, ...(item.status === "Sent" ? { backgroundColor: "#EFF6FF", color: "#1E40AF", borderColor: "#BFDBFE" } : item.status === "Completed" ? { backgroundColor: "#ECFDF5", color: "#065F46", borderColor: "#A7F3D0" } : { backgroundColor: "#FFFBEB", color: "#92400E", borderColor: "#FDE68A" }) }}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "purchase_orders" && <PurchaseOrdersTable />}

          {activeTab === "sales_orders" && <SalesOrdersTable />}

          {activeTab === "quotes" && <QuotesTable />}

          {activeTab === "notes" && <NotesTab />}
          {activeTab === "attachments" && <AttachmentsTab />}
          {activeTab === "activity" && <ActivityTab />}
        </div>
      </div>

      {/* Edit Contact Modal */}
      <CreatePocModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        editMode
        editContactName={contact.name}
        editContact={CONTACT_DICTIONARY.find(c => c.id === contactId) || null}
        newPocName={editPocName}
        onNewPocNameChange={setEditPocName}
        newPocDepartment={editPocDepartment}
        onNewPocDepartmentChange={setEditPocDepartment}
        newPocRole={editPocRole}
        onNewPocRoleChange={setEditPocRole}
        newPocLandline={editPocLandline}
        onNewPocLandlineChange={setEditPocLandline}
        newPocLandlineCode={editPocLandlineCode}
        onNewPocLandlineCodeChange={setEditPocLandlineCode}
        newPocExt={editPocExt}
        onNewPocExtChange={setEditPocExt}
        newPocMobile={editPocMobile}
        onNewPocMobileChange={setEditPocMobile}
        newPocMobileCode={editPocMobileCode}
        onNewPocMobileCodeChange={setEditPocMobileCode}
        newPocEmail={editPocEmail}
        onNewPocEmailChange={setEditPocEmail}
        saveAndCreateAnother={editSaveAnother}
        onSaveAndCreateAnotherChange={setEditSaveAnother}
        onSave={handleSaveEdit}
      />

      {/* Customize Widgets Panel — rendered at root level for correct overlay alignment */}
      {activeTab === "overview" && (
        <ContactCustomizePanel
          open={customizeOpen}
          onOpenChange={setCustomizeOpen}
          contactKpis={CONTACT_KPIS.map((k) => ({
            key: k.key,
            label: k.label,
            value: k.key === "linked_partners" ? String(contact.linkedPartners.length) : k.value,
            icon: k.icon,
            description: k.description,
          }))}
          hiddenKpis={hiddenKpis}
          onToggleKpi={toggleKpi}
          activeWidgets={activeWidgets}
          onToggleWidget={handleToggleWidget}
          widgetSizes={widgetSizes}
          onWidgetSizeChange={handleWidgetSizeChange}
        />
      )}

      {/* Archive Confirmation Modal */}
      <AlertDialog open={showArchiveModal} onOpenChange={setShowArchiveModal}>
        <AlertDialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <Archive className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-[16px] text-foreground" style={{ fontWeight: 700 }}>
              Archive Contact
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] mt-2 max-w-[300px] mx-auto" style={{ color: "hsl(var(--muted-foreground))", lineHeight: "1.65" }}>
              Are you sure you want to archive <strong>{contact.name}</strong>? This contact will be removed from active listings but records will be preserved.
            </AlertDialogDescription>
          </div>
          <div className="px-6 pb-6 flex flex-col gap-2">
            <button onClick={() => { toast.success("Contact archived"); setShowArchiveModal(false); navigate("/partners/contacts"); }} className="w-full h-11 text-[14px] rounded-xl border-0 cursor-pointer transition-colors hover:opacity-90" style={{ fontWeight: 600, backgroundColor: "hsl(var(--destructive))", color: "#fff" }}>
              Archive Contact
            </button>
            <AlertDialogCancel className="w-full h-11 text-[14px] rounded-xl border border-border bg-white text-slate-700 hover:bg-slate-50 cursor-pointer" style={{ fontWeight: 500 }}>
              Cancel
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Confirmation Modal */}
      <AlertDialog open={showDeactivateModal} onOpenChange={setShowDeactivateModal}>
        <AlertDialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <CircleSlash className="w-6 h-6 text-[#F97316]" />
            </div>
            <AlertDialogTitle className="text-[16px] text-foreground" style={{ fontWeight: 700 }}>
              Deactivate Contact
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] mt-2 max-w-[300px] mx-auto" style={{ color: "hsl(var(--muted-foreground))", lineHeight: "1.65" }}>
              Are you sure you want to deactivate <strong>{contact.name}</strong>? This contact will be marked as inactive and excluded from new assignments.
            </AlertDialogDescription>
          </div>
          <div className="px-6 pb-6 flex flex-col gap-2">
            <button onClick={() => { toast.success("Contact deactivated"); setShowDeactivateModal(false); }} className="w-full h-11 text-[14px] rounded-xl border-0 cursor-pointer transition-colors hover:opacity-90" style={{ fontWeight: 600, backgroundColor: "#F97316", color: "#FFFFFF" }}>
              Deactivate Contact
            </button>
            <AlertDialogCancel className="w-full h-11 text-[14px] rounded-xl border border-border bg-white text-slate-700 hover:bg-slate-50 cursor-pointer" style={{ fontWeight: 500 }}>
              Cancel
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>


      {/* ── Gmail-style Compose Email Box ── */}
      {composeOpen && (
        <div
          className="fixed z-[400] transition-all duration-200 ease-out"
          style={{
            bottom: 0,
            right: 24,
            width: composeMinimized ? 280 : 420,
            boxShadow: "0 -4px 24px -6px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.06)",
            borderRadius: "12px 12px 0 0",
            overflow: "hidden",
          }}
        >
          {/* Header bar */}
          <div
            className="flex items-center justify-between px-4 h-10 cursor-pointer select-none"
            style={{ backgroundColor: "#1E293B" }}
            onClick={() => setComposeMinimized(!composeMinimized)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="w-3.5 h-3.5 text-white/70 shrink-0" />
              <span className="text-[13px] text-white truncate" style={{ fontWeight: 600 }}>
                {composeMinimized ? `To: ${composeTo}` : "New Message"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setComposeMinimized(!composeMinimized); }}
                className="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {composeMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setComposeOpen(false); }}
                className="w-6 h-6 rounded flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {/* Body — hidden when minimized */}
          <div
            className="bg-white overflow-hidden transition-all duration-200 ease-out"
            style={{ maxHeight: composeMinimized ? 0 : 340, opacity: composeMinimized ? 0 : 1 }}
          >
            {/* To */}
            <div className="flex items-center border-b border-muted px-4 h-9">
              <span className="text-[12px] text-slate-400 shrink-0 w-8" style={{ fontWeight: 500 }}>To</span>
              <input
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                className="flex-1 text-[13px] text-slate-700 bg-transparent border-0 outline-none placeholder:text-slate-300"
                placeholder="recipient@email.com"
              />
            </div>
            {/* Subject */}
            <div className="flex items-center border-b border-muted px-4 h-9">
              <span className="text-[12px] text-slate-400 shrink-0 w-8" style={{ fontWeight: 500 }}>Sub</span>
              <input
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                className="flex-1 text-[13px] text-slate-700 bg-transparent border-0 outline-none placeholder:text-slate-300"
                placeholder="Subject"
              />
            </div>
            {/* Body */}
            <textarea
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              className="w-full h-[180px] px-4 py-3 text-[13px] text-slate-700 bg-transparent border-0 outline-none resize-none placeholder:text-slate-300"
              placeholder="Write your message..."
            />
            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-muted">
              <button
                onClick={() => { toast.success(`Email sent to ${composeTo}`); setComposeOpen(false); }}
                className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-primary hover:bg-[#0862D0] text-white text-[13px] transition-colors cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                <Send className="w-3.5 h-3.5" />
                Send
              </button>
              <button
                onClick={() => setComposeOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-destructive hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Contact Overview Tab (with draggable, resizable widgets) ─── */
function ContactOverviewTab({ contact, sStyle, partnerNameToId, kpiOrder, hiddenKpis, moveKpi, toggleKpi, CONTACT_KPIS, activeWidgets, widgetSizes, onWidgetSizeChange, moveWidget, setCustomizeOpen }: {
  contact: EnrichedContact;
  sStyle: { bg: string; text: string; border: string };
  partnerNameToId: Record<string, string>;
  kpiOrder: string[];
  hiddenKpis: Set<string>;
  moveKpi: (from: number, to: number) => void;
  toggleKpi: (key: string) => void;
  CONTACT_KPIS: { key: string; label: string; value: string; icon: React.ElementType; change: string | null }[];
  activeWidgets: string[];
  widgetSizes: Record<string, "sm" | "md" | "lg">;
  onWidgetSizeChange: (key: string, size: "sm" | "md" | "lg") => void;
  moveWidget: (from: number, to: number) => void;
  setCustomizeOpen: (open: boolean) => void;
}) {
  const CH: Record<string, number> = { sm: 140, md: 200, lg: 280 };

  const statRow = (stats: { label: string; value: string; color?: string }[], compact?: boolean) => (
    <div className={`flex items-center ${compact ? "gap-3 mt-1.5 pt-1.5" : "gap-4 mt-2 pt-2"} border-t border-muted`}>
      {stats.map((s, i) => (
        <div key={i}>
          <p className={`${compact ? "text-[9px]" : "text-[10px]"} text-slate-400`} style={{ fontWeight: 500 }}>{s.label}</p>
          <p className={compact ? "text-[11px]" : "text-[13px]"} style={{ fontWeight: 700, color: s.color || "#334155" }}>{s.value}</p>
        </div>
      ))}
    </div>
  );

  /* Build widget nodes — every widget uses the same fixed height per size */
  const renderWidgetContent = (wKey: string, sz: "sm" | "md" | "lg") => {
    const h = CH[sz];
    const isSmall = sz === "sm";

    const ttStyle = { borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 12 };

    const widgetBody = (() => {
    switch (wKey) {
      case "interaction_activity": {
        const barData = [
          { day: "Mon", emails: 3, calls: 1 },
          { day: "Tue", emails: 7, calls: 3 },
          { day: "Wed", emails: 5, calls: 2 },
          { day: "Thu", emails: 8, calls: 4 },
          { day: "Fri", emails: 4, calls: 2 },
          { day: "Sat", emails: 1, calls: 0 },
          { day: "Sun", emails: 2, calls: 1 },
        ];
        return (
          <>
            <div className="flex-1 min-h-0 -ml-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: isSmall ? 9 : 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  {!isSmall && <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={24} />}
                  <ReTooltip contentStyle={ttStyle} cursor={{ fill: "rgba(10,119,255,0.04)" }} />
                  <Bar dataKey="emails" name="Emails" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={isSmall ? 14 : 24} />
                  <Bar dataKey="calls" name="Calls" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={isSmall ? 14 : 24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="shrink-0">
              {statRow([
                { label: "Total Emails", value: "30" },
                { label: "Total Calls", value: "13" },
                ...(!isSmall ? [{ label: "Avg/Day", value: "6.1" }] : []),
              ], isSmall)}
            </div>
          </>
        );
      }

      case "communication_trend": {
        const trendData = [
          { month: "Jan", value: 12 }, { month: "Feb", value: 18 }, { month: "Mar", value: 22 },
          { month: "Apr", value: 28 }, { month: "May", value: 32 }, { month: "Jun", value: 26 },
          { month: "Jul", value: 30 }, { month: "Aug", value: 35 }, { month: "Sep", value: 38 },
          { month: "Oct", value: 42 }, { month: "Nov", value: 34 }, { month: "Dec", value: 45 },
        ];
        return (
          <>
            <div className="flex-1 min-h-0 -ml-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="ctAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: isSmall ? 9 : 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  {!isSmall && <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={24} />}
                  <ReTooltip contentStyle={ttStyle} formatter={(v: number) => [`${v}`, "Interactions"]} />
                  <Area type="monotone" dataKey="value" name="Interactions" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#ctAreaGrad)" dot={false} activeDot={{ r: 4, fill: "hsl(var(--primary))", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="shrink-0">
              {statRow([
                { label: "YTD Total", value: "342" },
                { label: "Monthly Avg", value: "28.5" },
                ...(!isSmall ? [{ label: "Peak Month", value: "Dec" }] : []),
              ], isSmall)}
            </div>
          </>
        );
      }

      case "purchase_orders": {
        const pos = [
          { id: "PO-3021", vendor: "Acme Corp", amount: "$18,500", status: "Approved", date: "Mar 28, 2026" },
          { id: "PO-2984", vendor: "TechVault", amount: "$7,200", status: "Pending", date: "Mar 22, 2026" },
          { id: "PO-2951", vendor: "NexGen Solutions", amount: "$34,800", status: "Delivered", date: "Mar 15, 2026" },
          { id: "PO-2913", vendor: "Apex Industries", amount: "$12,100", status: "Delivered", date: "Mar 08, 2026" },
          { id: "PO-2887", vendor: "Summit Group", amount: "$5,600", status: "Approved", date: "Feb 28, 2026" },
          { id: "PO-2845", vendor: "Vertex Labs", amount: "$22,400", status: "Delivered", date: "Feb 20, 2026" },
        ];
        return (
          <>
            <div className="space-y-1 flex-1 min-h-0 overflow-hidden">
              {pos.slice(0, isSmall ? 4 : sz === "lg" ? 6 : 5).map((o) => (
                <div key={o.id} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer">
                  <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center shrink-0">
                    <ShoppingCart className="w-3 h-3 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-700 truncate" style={{ fontWeight: 500 }}>{o.id} &middot; {o.vendor}</p>
                    {!isSmall && <p className="text-[10px] text-slate-400 mt-0.5">{o.date}</p>}
                  </div>
                  <span className="text-[11px] text-slate-700 shrink-0" style={{ fontWeight: 600 }}>{o.amount}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md shrink-0 ${
                    o.status === "Delivered" ? "bg-green-50 text-[#166534]" :
                    o.status === "Approved" ? "bg-blue-50 text-blue-800" : "bg-amber-50 text-amber-800"
                  }`} style={{ fontWeight: 500 }}>{o.status}</span>
                </div>
              ))}
            </div>
            <div className="shrink-0">{statRow([
              { label: "Total POs", value: "18" },
              { label: "Total Value", value: "$186.2K" },
              ...(!isSmall ? [{ label: "Pending", value: "3", color: "hsl(var(--warning))" }] : []),
            ], isSmall)}</div>
          </>
        );
      }

      case "sales_orders": {
        const sos = [
          { id: "SO-1102", customer: "Acme Corp", amount: "$9,800", status: "Fulfilled", date: "Mar 26, 2026" },
          { id: "SO-1089", customer: "Pioneer Systems", amount: "$15,300", status: "Processing", date: "Mar 20, 2026" },
          { id: "SO-1074", customer: "Atlas Logistics", amount: "$6,400", status: "Fulfilled", date: "Mar 14, 2026" },
          { id: "SO-1058", customer: "Beacon Analytics", amount: "$28,700", status: "Shipped", date: "Mar 08, 2026" },
          { id: "SO-1041", customer: "Cascade Networks", amount: "$11,200", status: "Fulfilled", date: "Feb 28, 2026" },
          { id: "SO-1029", customer: "Delta Mfg", amount: "$4,500", status: "Fulfilled", date: "Feb 22, 2026" },
        ];
        return (
          <>
            <div className="space-y-1 flex-1 min-h-0 overflow-hidden">
              {sos.slice(0, isSmall ? 4 : sz === "lg" ? 6 : 5).map((o) => (
                <div key={o.id} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer">
                  <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center shrink-0">
                    <Receipt className="w-3 h-3 text-green-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-700 truncate" style={{ fontWeight: 500 }}>{o.id} &middot; {o.customer}</p>
                    {!isSmall && <p className="text-[10px] text-slate-400 mt-0.5">{o.date}</p>}
                  </div>
                  <span className="text-[11px] text-slate-700 shrink-0" style={{ fontWeight: 600 }}>{o.amount}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md shrink-0 ${
                    o.status === "Fulfilled" ? "bg-green-50 text-[#166534]" :
                    o.status === "Shipped" ? "bg-blue-50 text-blue-800" : "bg-amber-50 text-amber-800"
                  }`} style={{ fontWeight: 500 }}>{o.status}</span>
                </div>
              ))}
            </div>
            <div className="shrink-0">{statRow([
              { label: "Total SOs", value: "12" },
              { label: "Revenue", value: "$142.8K" },
              ...(!isSmall ? [{ label: "Processing", value: "2", color: "hsl(var(--warning))" }] : []),
            ], isSmall)}</div>
          </>
        );
      }

      case "recent_communications": {
        const comms = [
          { type: "email", subject: "Q1 Report Follow-up", date: "Mar 28, 2026", from: contact.name },
          { type: "call", subject: "Contract Discussion", date: "Mar 25, 2026", from: "Sarah Johnson" },
          { type: "email", subject: "Invoice #2847 Clarification", date: "Mar 22, 2026", from: contact.name },
          { type: "email", subject: "Meeting Reschedule", date: "Mar 20, 2026", from: "Admin" },
          { type: "call", subject: "Quarterly Review", date: "Mar 18, 2026", from: contact.name },
        ];
        return (
          <>
            <div className="space-y-1.5 flex-1 min-h-0 overflow-hidden">
              {comms.slice(0, isSmall ? 3 : sz === "lg" ? 5 : 4).map((c, i) => (
                <div key={i} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: c.type === "email" ? "hsl(var(--accent))" : "#FFF7ED" }}>
                    {c.type === "email" ? <Mail className="w-3 h-3 text-primary" /> : <PhoneCall className="w-3 h-3 text-amber-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-700 truncate" style={{ fontWeight: 500 }}>{c.subject}</p>
                    {!isSmall && <p className="text-[10px] text-slate-400 mt-0.5">{c.from} &middot; {c.date}</p>}
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      }

      case "order_summary": {
        const orders = [
          { id: "PO-2847", amount: "$12,400", status: "Delivered", date: "Mar 15" },
          { id: "PO-2831", amount: "$8,750", status: "In Transit", date: "Mar 08" },
          { id: "PO-2819", amount: "$23,100", status: "Delivered", date: "Feb 28" },
          { id: "SO-1045", amount: "$5,200", status: "Processing", date: "Mar 22" },
        ];
        return (
          <>
            <div className="space-y-1.5 flex-1 min-h-0 overflow-hidden">
              {orders.slice(0, isSmall ? 3 : 4).map((o, i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-all cursor-pointer">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-700" style={{ fontWeight: 500 }}>{o.id}</p>
                    {!isSmall && <p className="text-[10px] text-slate-400 mt-0.5">{o.date}</p>}
                  </div>
                  <span className="text-[11px] text-slate-700 shrink-0" style={{ fontWeight: 600 }}>{o.amount}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md shrink-0 ${
                    o.status === "Delivered" ? "bg-green-50 text-[#166534]" :
                    o.status === "In Transit" ? "bg-blue-50 text-blue-800" : "bg-amber-50 text-amber-800"
                  }`} style={{ fontWeight: 500 }}>{o.status}</span>
                </div>
              ))}
            </div>
            {!isSmall && <div className="shrink-0">{statRow([
              { label: "Total Orders", value: "24" },
              { label: "Total Value", value: "$128.4K" },
            ])}</div>}
          </>
        );
      }

      case "activity_timeline":
        return (
          <div className="space-y-2.5 flex-1 min-h-0 overflow-hidden">
            {ACTIVITY_LOG.slice(0, isSmall ? 3 : sz === "lg" ? 6 : 4).map((e) => (
              <div key={e.id} className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  {e.icon === "create" ? <User className="w-3 h-3 text-primary" /> : e.icon === "link" ? <Link2 className="w-3 h-3 text-violet" /> : <Pencil className="w-3 h-3 text-amber-500" />}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-700" style={{ fontWeight: 500 }}>{e.action}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{!isSmall ? `${e.user} \u00B7 ` : ""}{formatDate(e.date)}</p>
                </div>
              </div>
            ))}
          </div>
        );

      case "notes":
        return (
          <div className="space-y-2.5 flex-1 min-h-0 overflow-hidden">
            {NOTES_DATA.slice(0, isSmall ? 1 : sz === "lg" ? 3 : 2).map((note) => (
              <div key={note.id} className="px-3 py-2.5 rounded-lg border border-muted hover:border-border transition-all">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center"><User className="w-2.5 h-2.5 text-slate-500" /></div>
                  <span className="text-[11px] text-slate-700" style={{ fontWeight: 600 }}>{note.author}</span>
                  <span className="text-[10px] text-slate-400">{formatDate(note.date)}</span>
                </div>
                <p className={`text-[12px] text-slate-500 leading-relaxed ${isSmall ? "line-clamp-2" : ""}`}>{note.text}</p>
              </div>
            ))}
          </div>
        );

      default:
        return <p className="text-[12px] text-slate-400">Widget content</p>;
    }
    })();

    // Wrap every widget in a fixed-height flex column so all cards match at same size
    return (
      <div className="flex flex-col" style={{ height: h }}>
        {widgetBody}
      </div>
    );
  };

  const getWidgetIcon = (key: string): React.ElementType => {
    const map: Record<string, React.ElementType> = {
      interaction_activity: BarChart3,
      communication_trend: TrendingUp,
      recent_communications: MessageSquare,
      order_summary: Package,
      purchase_orders: ShoppingCart,
      sales_orders: Receipt,
      activity_timeline: Activity,
      notes: StickyNote,
    };
    return map[key] || Info;
  };

  const getWidgetTitle = (key: string): string => {
    return CONTACT_WIDGET_DEFS.find(w => w.key === key)?.label || key;
  };

  /* Build layout — flex wrap: each widget width depends on its own size */
  const getWidgetWidth = (sz: "sm" | "md" | "lg", defaultSpan: "full" | "half"): string => {
    if (sz === "sm") return "calc(50% - 6px)";
    if (sz === "lg") return "100%";
    // medium — use the widget's default span
    return defaultSpan === "full" ? "100%" : "calc(50% - 6px)";
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12px] text-slate-500">
          <span className="text-sm text-slate-700" style={{ fontWeight: 500 }}>Overview</span>
          <button className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] text-slate-500 hover:bg-muted hover:text-slate-700 transition-colors cursor-pointer" style={{ fontWeight: 500 }}>
            <Calendar className="w-3 h-3" /> Last 30 days <ChevronDown className="w-2.5 h-2.5" />
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-400">Updated {new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
          <button className="inline-flex items-center gap-1 text-[11px] text-primary hover:text-[#0862D4] transition-colors cursor-pointer" style={{ fontWeight: 500 }} onClick={() => toast.success("Refreshed")}>
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
        <button className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-white hover:bg-slate-50 text-slate-700 text-[12px] shadow-sm transition-all cursor-pointer" style={{ fontWeight: 500 }} onClick={() => setCustomizeOpen(true)}>
          <Sliders className="w-3.5 h-3.5 text-slate-400" /> Customize Widgets
        </button>
      </div>

      {/* KPI strip */}
      <DndProvider backend={HTML5Backend}>
        <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}>
          {kpiOrder.filter(k => !hiddenKpis.has(k)).map((key, idx) => {
            const kpi = CONTACT_KPIS.find(k => k.key === key);
            if (!kpi) return null;
            const v = kpi.key === "linked_partners" ? String(contact.linkedPartners.length) : kpi.value;
            return <DraggableContactKpi key={kpi.key} index={idx} kpiKey={kpi.key} label={kpi.label} value={v} icon={kpi.icon} change={kpi.change} moveCard={moveKpi} onRemove={() => toggleKpi(kpi.key)} />;
          })}
        </div>
      </DndProvider>

      {/* Two-column layout: Widgets (left) + Sidebar (right) */}
      <div className="flex gap-5 items-start">
        {/* ── LEFT: Widgets ── */}
        <div className="flex-1 min-w-0">
          <DndProvider backend={HTML5Backend}>
            <div className="flex flex-wrap gap-3 items-stretch">
              {activeWidgets.map((wKey, wIdx) => {
                const sz = widgetSizes[wKey] || "md";
                const defaultSpan = CONTACT_WIDGET_DEFAULT_SPANS[wKey] || "half";
                const width = getWidgetWidth(sz, defaultSpan);
                return (
                  <div key={wKey} style={{ width }} className="transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                    <DraggableContactWidget widgetKey={wKey} index={wIdx} moveWidget={moveWidget}>
                      {(dragging, over) => (
                        <ContactContentCard
                          title={getWidgetTitle(wKey)}
                          icon={getWidgetIcon(wKey)}
                          currentSize={sz}
                          onSizeChange={(s) => onWidgetSizeChange(wKey, s)}
                          isDragging={dragging}
                          isOver={over}
                        >
                          {renderWidgetContent(wKey, sz)}
                        </ContactContentCard>
                      )}
                    </DraggableContactWidget>
                  </div>
                );
              })}
            </div>
          </DndProvider>
        </div>

        {/* ── RIGHT: Sidebar — all data lives here ── */}
        <div className="w-[280px] xl:w-[300px] shrink-0 hidden lg:block space-y-4">
          {/* Contact Information — consolidated with status & dates */}
          <ContactSidebarCard title="Contact Information" icon={User}>
            <div className="space-y-3">
              <ContactSidebarRow icon={Building2} label="Company" value={contact.company} />
              <ContactSidebarRow icon={Users} label="Department" value={contact.department} />
              <ContactSidebarRow icon={Briefcase} label="Role" value={contact.role || `${contact.department} Rep`} />
              <ContactSidebarRow icon={Phone} label="Phone" value={contact.phone} />
              {contact.secondaryPhone && (
                <ContactSidebarRow icon={Phone} label="Secondary" value={contact.secondaryPhone} />
              )}
              <ContactSidebarRow icon={Mail} label="Email" value={contact.email} isLink />
              <div className="pt-2.5 mt-2.5 border-t border-muted space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400" style={{ fontWeight: 500 }}>Status</span>
                  <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-md border" style={{ fontWeight: 500, backgroundColor: sStyle.bg, color: sStyle.text, borderColor: sStyle.border }}>
                    {contact.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400" style={{ fontWeight: 500 }}>Last Active</span>
                  <span className="text-[12px] text-slate-700" style={{ fontWeight: 500 }}>Mar 01, 2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400" style={{ fontWeight: 500 }}>Created On</span>
                  <span className="text-[12px] text-slate-700" style={{ fontWeight: 500 }}>{contact.createdOn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400" style={{ fontWeight: 500 }}>Created By</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] shrink-0" style={{ backgroundColor: "hsl(var(--primary))", fontWeight: 600 }}>
                      {contact.createdByInitials}
                    </div>
                    <span className="text-[12px] text-slate-700" style={{ fontWeight: 500 }}>{contact.createdByName}</span>
                  </div>
                </div>
              </div>
            </div>
          </ContactSidebarCard>

          {/* Quick Stats */}
          <ContactSidebarCard title="Quick Stats" icon={BarChart3}>
            <div className="grid grid-cols-2 gap-2.5">
              <ContactStatBox label="Total Orders" value="24" icon={Package} />
              <ContactStatBox label="Email Sent" value="156" icon={Mail} color="hsl(var(--primary))" />
              <ContactStatBox label="Satisfaction" value="4.8/5" icon={Star} color="#F59E0B" />
              <ContactStatBox label="Avg Response" value="4.2 hrs" icon={Clock} color="hsl(var(--success))" />
            </div>
          </ContactSidebarCard>

          {/* Linked Partners */}
          <ContactSidebarCard title="Linked Partners" icon={Link2} count={contact.linkedPartners.length}>
            <div className="space-y-2">
              {contact.linkedPartners.slice(0, 5).map((partner, idx) => {
                const pTint = getAvatarTint(partner);
                const pI = partner.split(" ").filter(Boolean).map((w) => w[0]).slice(0,2).join("").toUpperCase();
                const pId = partnerNameToId[partner];
                return (
                  <div key={idx} className={"flex items-center gap-2.5 " + (pId ? "cursor-pointer" : "")} onClick={() => { if (pId) window.open("/vendors/" + pId, "_blank"); }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] shrink-0" style={{ backgroundColor: pTint.bg, color: pTint.fg, fontWeight: 700 }}>
                      {pI}
                    </div>
                    <span className="text-[12px] text-slate-700 truncate" style={{ fontWeight: 500 }}>{partner}</span>
                    {idx === 0 && (
                      <span className="text-[10px] text-primary px-1.5 py-0.5 rounded-md bg-accent ml-auto shrink-0" style={{ fontWeight: 600 }}>PRIMARY</span>
                    )}
                  </div>
                );
              })}
              {contact.linkedPartners.length > 5 && (
                <p className="text-xs text-primary hover:text-[#0862D0] transition-colors cursor-pointer mt-1" style={{ fontWeight: 500 }}>
                  +{contact.linkedPartners.length - 5} more
                </p>
              )}
            </div>
          </ContactSidebarCard>
        </div>
      </div>
    </div>
  );
}

/* ─── Activity Tab ─── */
function ActivityTab() {
  const iconMap: Record<string, React.ElementType> = { create: CircleCheck, link: Link2, edit: Pencil, email: Mail };
  const colorMap: Record<string, { bg: string; fg: string }> = { create: { bg: "#ECFDF5", fg: "hsl(var(--success))" }, link: { bg: "#EFF6FF", fg: "#2563EB" }, edit: { bg: "#FFFBEB", fg: "hsl(var(--warning))" }, email: { bg: "hsl(var(--accent))", fg: "hsl(var(--primary))" } };
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-muted flex items-center justify-between">
        <h3 className="text-[13px] text-foreground" style={{ fontWeight: 600 }}>Activity History</h3>
        <span className="text-[11px] shrink-0" style={{ fontWeight: 600, color: "#085FCC" }}>{ACTIVITY_LOG.length} events</span>
      </div>
      <div className="px-5 py-2">
        {ACTIVITY_LOG.map((item, idx) => {
          const Icon = iconMap[item.icon] || Activity;
          const color = colorMap[item.icon] || colorMap.edit;
          return (
            <div key={item.id} className="flex items-start gap-3 relative" style={{ paddingBottom: idx === ACTIVITY_LOG.length - 1 ? 8 : 0 }}>
              {/* Timeline line */}
              {idx < ACTIVITY_LOG.length - 1 && <div className="absolute left-[15px] top-[32px] bottom-0 w-px bg-border" />}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-2.5 z-10" style={{ backgroundColor: color.bg }}>
                <Icon className="w-3.5 h-3.5" style={{ color: color.fg }} />
              </div>
              <div className="flex-1 min-w-0 py-2.5 border-b border-muted last:border-b-0" style={{ borderBottom: idx === ACTIVITY_LOG.length - 1 ? "none" : undefined }}>
                <p className="text-[12px] text-slate-700" style={{ fontWeight: 500 }}>{item.action}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-400" style={{ fontWeight: 500 }}>{item.user}</span>
                  <span className="text-[11px] text-slate-300">·</span>
                  <span className="text-[11px] text-slate-400">{formatDateTime(item.date)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Notes Tab ─── */
function NotesTab() {
  const [newNote, setNewNote] = useState("");
  return (
    <div className="space-y-4">
      {/* Add note input */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-muted">
          <h3 className="text-[13px] text-foreground" style={{ fontWeight: 600 }}>Add a Note</h3>
        </div>
        <div className="p-4">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note..."
            className="w-full h-[80px] px-3 py-2.5 text-[13px] text-slate-700 bg-slate-50 border border-border rounded-lg outline-none resize-none placeholder:text-slate-400 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-colors"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => { if (newNote.trim()) { toast.success("Note added"); setNewNote(""); } }}
              className="h-8 px-4 rounded-lg bg-primary hover:bg-[#0862D0] text-white text-[12px] cursor-pointer transition-colors"
              style={{ fontWeight: 600 }}
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
      {/* Existing notes */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-muted flex items-center justify-between">
          <h3 className="text-[13px] text-foreground" style={{ fontWeight: 600 }}>Notes</h3>
          <span className="text-[11px] shrink-0" style={{ fontWeight: 600, color: "#085FCC" }}>{NOTES_DATA.length} notes</span>
        </div>
        <div className="divide-y divide-muted">
          {NOTES_DATA.map((note) => {
            const noteInitials = note.author.split(" ").map(w => w[0]).join("").toUpperCase();
            return (
              <div key={note.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] text-white shrink-0" style={{ backgroundColor: "hsl(var(--primary))", fontWeight: 700 }}>{noteInitials}</div>
                  <span className="text-[12px] text-slate-700" style={{ fontWeight: 600 }}>{note.author}</span>
                  <span className="text-[11px] text-slate-400">{formatDate(note.date)}</span>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed pl-[34px]">{note.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

