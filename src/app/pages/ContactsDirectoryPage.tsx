import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ColumnSelector, ColumnSelectorTrigger, type ColumnConfig } from "../components/vendors/ColumnSelector";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "../components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Archive,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Users,
  LayoutGrid,
  List,
  AlignJustify,
  Check,
  ChevronDown,
  X,
  Mail,
  Phone,
  Building2,
  CircleCheck,
  CircleSlash,
  PhoneCall,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "../components/ui/checkbox";
import { CONTACT_DICTIONARY, type ContactPerson } from "../components/vendors/partnerConstants";
import { CreatePocModal } from "../components/vendors/PocModals";
import { getAvatarTint } from "../utils/avatarTints";

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

function ContactAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const [imgFailed, setImgFailed] = useState(false);
  const photo = getPersonPhoto(name);
  const tint = getAvatarTint(name);
  const initials = name.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const sizeClass = size === "lg" ? "w-9 h-9" : size === "sm" ? "w-7 h-7" : "w-8 h-8";
  const textSize = size === "lg" ? "text-[11px]" : size === "sm" ? "text-[9px]" : "text-[10px]";
  const showImg = photo && !imgFailed;
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center shrink-0 overflow-hidden border border-[#E8ECF1]`} style={{ backgroundColor: showImg ? "transparent" : tint.bg }}>
      {showImg ? (
        <img src={photo} alt="" className="w-full h-full object-cover" onError={() => setImgFailed(true)} />
      ) : (
        <span className={`${textSize}`} style={{ fontWeight: 700, color: tint.fg }}>{initials}</span>
      )}
    </div>
  );
}

/* ─── Types ─── */
type QuickFilter = "all" | "sales" | "supply_chain" | "finance" | "active" | "inactive";
type DensityOption = "condensed" | "comfort" | "card";
type CardSize = "large" | "medium" | "small";
type SortDirection = "asc" | "desc";

interface SortConfig {
  key: string;
  direction: SortDirection;
}

/* ─── Enriched contact type ─── */
interface EnrichedContact extends ContactPerson {
  status: "active" | "inactive";
  linkedPartners: string[];
}

/* ─── Density config ─── */
const DENSITY_CONFIG: {
  key: DensityOption;
  label: string;
  description: string;
  icon: "align-justify" | "list" | "layout-grid";
}[] = [
  { key: "condensed", label: "Condensed", description: "Compact view", icon: "align-justify" },
  { key: "comfort", label: "Comfort", description: "Spacious view", icon: "list" },
  { key: "card", label: "Card View", description: "Grid layout", icon: "layout-grid" },
];

/* ─── Quick filter config ─── */
const QUICK_FILTER_OPTIONS: { key: QuickFilter; label: string; showCount: boolean }[] = [
  { key: "all", label: "Show All", showCount: false },
  { key: "sales", label: "Sales", showCount: true },
  { key: "supply_chain", label: "Supply Chain", showCount: true },
  { key: "finance", label: "Finance", showCount: true },
  { key: "active", label: "Active", showCount: true },
  { key: "inactive", label: "Inactive", showCount: true },
];

/* ─── Column definitions ─── */
const COLUMN_DEFS: (ColumnConfig & { minWidth: string; sortable?: boolean })[] = [
  { key: "contact_name", label: "Contact", minWidth: "240px", sortable: true },
  { key: "department", label: "Department", minWidth: "160px", sortable: true },
  { key: "company", label: "Company", minWidth: "180px", sortable: true },
  { key: "email", label: "Email", minWidth: "220px" },
  { key: "phone", label: "Phone", minWidth: "160px" },
  { key: "secondary_phone", label: "Secondary Phone", minWidth: "160px" },
  { key: "linked_partners", label: "Linked Partners", minWidth: "160px" },
  { key: "status", label: "Status", minWidth: "100px", sortable: true },
];

const DEFAULT_COLUMN_ORDER = COLUMN_DEFS.map((c) => c.key);
const DEFAULT_COLUMN_VISIBILITY: Record<string, boolean> = Object.fromEntries(
  COLUMN_DEFS.map((c) => [c.key, true])
);
const LOCKED_COLUMNS = ["contact_name"];

const DEFAULT_COLUMN_WIDTHS: Record<string, number> = Object.fromEntries(
  COLUMN_DEFS.map((c) => [c.key, parseInt(c.minWidth, 10)])
);
const CHECKBOX_COL_WIDTH = 40;

/* ─── Partner name pool for linked partners ─── */
const PARTNER_NAMES = [
  "Acme Corp", "TechVault", "NexGen Solutions", "Apex Industries", "Summit Group",
  "Vertex Labs", "Pioneer Systems", "Atlas Logistics", "Beacon Analytics", "Cascade Networks",
  "Delta Manufacturing", "Echo Enterprises", "Falcon Dynamics", "Granite Holdings", "Horizon Partners",
  "Ionic Solutions", "Jade Innovations", "Keystone Global", "Lumen Corp", "Metro Supply",
];

/* ─── Deterministic enrichment of contacts ─── */
function enrichContacts(contacts: ContactPerson[]): EnrichedContact[] {
  return contacts.map((c, i) => {
    // Deterministic hash from id
    let hash = 0;
    for (let j = 0; j < c.id.length; j++) hash = c.id.charCodeAt(j) + ((hash << 5) - hash);
    const absHash = Math.abs(hash);

    // 80% active, 20% inactive
    const status: "active" | "inactive" = absHash % 5 === 0 ? "inactive" : "active";

    // 1-5 linked partners, deterministic
    const partnerCount = 1 + (absHash % 5);
    const linkedPartners: string[] = [];
    for (let p = 0; p < partnerCount; p++) {
      linkedPartners.push(PARTNER_NAMES[(absHash + p * 7) % PARTNER_NAMES.length]);
    }

    return { ...c, status, linkedPartners };
  });
}

/* ─── Department pill styles ─── */
const DEPT_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  Sales: { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  "Supply Chain Management": { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  Finance: { bg: "#F5F3FF", text: "#5B21B6", border: "#DDD6FE" },
};

/* ─── Status pill styles ─── */
const STATUS_STYLES = {
  active: { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" },
  inactive: { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
};

/* ─── Helper: get initials from name ─── */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/* ─── Helper: column def lookup ─── */
function colDef(key: string) {
  return COLUMN_DEFS.find((c) => c.key === key) || COLUMN_DEFS[0];
}

export function ContactsDirectoryPage() {
  const navigate = useNavigate();

  /* ─── Data ─── */
  const allContacts = useMemo(() => enrichContacts(CONTACT_DICTIONARY), []);

  /* ─── State ─── */
  const [searchQuery, setSearchQuery] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [density, setDensity] = useState<DensityOption>("comfort");
  const [cardSize, setCardSize] = useState<CardSize>("medium");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [columnOrder, setColumnOrder] = useState<string[]>(DEFAULT_COLUMN_ORDER);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(DEFAULT_COLUMN_VISIBILITY);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(DEFAULT_COLUMN_WIDTHS);
  const [columnDrawerOpen, setColumnDrawerOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  /* ─── Create Contact Modal State ─── */
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPocName, setNewPocName] = useState("");
  const [newPocDepartment, setNewPocDepartment] = useState("Sales");
  const [newPocRole, setNewPocRole] = useState("");
  const [newPocLandline, setNewPocLandline] = useState("");
  const [newPocLandlineCode, setNewPocLandlineCode] = useState("+1");
  const [newPocExt, setNewPocExt] = useState("");
  const [newPocMobile, setNewPocMobile] = useState("");
  const [newPocMobileCode, setNewPocMobileCode] = useState("+1");
  const [newPocEmail, setNewPocEmail] = useState("");
  const [saveAndCreateAnother, setSaveAndCreateAnother] = useState(false);

  const resetCreateForm = () => {
    setNewPocName(""); setNewPocDepartment("Sales"); setNewPocRole("");
    setNewPocLandline(""); setNewPocLandlineCode("+1"); setNewPocExt("");
    setNewPocMobile(""); setNewPocMobileCode("+1"); setNewPocEmail("");
  };

  const handleSaveContact = () => {
    if (!newPocName.trim()) { toast.error("Please enter a contact name"); return; }
    toast.success(`Contact "${newPocName}" created successfully`);
    if (saveAndCreateAnother) {
      resetCreateForm();
    } else {
      setCreateModalOpen(false);
      resetCreateForm();
    }
  };

  /* ─── Visible columns ─── */
  const visibleColumns = useMemo(
    () => columnOrder.filter((key) => columnVisibility[key]),
    [columnOrder, columnVisibility]
  );

  /* ─── Filtering ─── */
  const filteredContacts = useMemo(() => {
    let result = allContacts;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.department.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q)
      );
    }

    // Quick filter
    switch (quickFilter) {
      case "sales":
        result = result.filter((c) => c.department === "Sales");
        break;
      case "supply_chain":
        result = result.filter((c) => c.department === "Supply Chain Management");
        break;
      case "finance":
        result = result.filter((c) => c.department === "Finance");
        break;
      case "active":
        result = result.filter((c) => c.status === "active");
        break;
      case "inactive":
        result = result.filter((c) => c.status === "inactive");
        break;
    }

    // Sort
    if (sortConfig) {
      const { key, direction } = sortConfig;
      const dir = direction === "asc" ? 1 : -1;
      result = [...result].sort((a, b) => {
        let aVal = "";
        let bVal = "";
        switch (key) {
          case "contact_name": aVal = a.name; bVal = b.name; break;
          case "department": aVal = a.department; bVal = b.department; break;
          case "company": aVal = a.company; bVal = b.company; break;
          case "status": aVal = a.status; bVal = b.status; break;
          default: return 0;
        }
        return aVal.localeCompare(bVal) * dir;
      });
    }

    return result;
  }, [allContacts, searchQuery, quickFilter, sortConfig]);

  /* ─── Filter counts ─── */
  const filterCounts = useMemo(() => {
    const base = searchQuery.trim()
      ? allContacts.filter((c) => {
          const q = searchQuery.toLowerCase();
          return (
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.department.toLowerCase().includes(q) ||
            c.company.toLowerCase().includes(q)
          );
        })
      : allContacts;

    return {
      all: base.length,
      sales: base.filter((c) => c.department === "Sales").length,
      supply_chain: base.filter((c) => c.department === "Supply Chain Management").length,
      finance: base.filter((c) => c.department === "Finance").length,
      active: base.filter((c) => c.status === "active").length,
      inactive: base.filter((c) => c.status === "inactive").length,
    };
  }, [allContacts, searchQuery]);

  /* ─── Pagination ─── */
  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / recordsPerPage));
  const paginatedContacts = useMemo(() => {
    const start = (currentPage - 1) * recordsPerPage;
    return filteredContacts.slice(start, start + recordsPerPage);
  }, [filteredContacts, currentPage, recordsPerPage]);

  /* ─── Page numbers ─── */
  const getPageNumbers = useCallback((): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  /* ─── Selection ─── */
  const handleSelectRow = useCallback((id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const allPageSelected = paginatedContacts.length > 0 && paginatedContacts.every((c) => selectedRows.has(c.id));
  const somePageSelected = paginatedContacts.some((c) => selectedRows.has(c.id));

  const handleSelectAll = useCallback(() => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        paginatedContacts.forEach((c) => next.delete(c.id));
      } else {
        paginatedContacts.forEach((c) => next.add(c.id));
      }
      return next;
    });
  }, [allPageSelected, paginatedContacts]);

  /* ─── Sort ─── */
  const handleSort = useCallback((key: string) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) return { key, direction: "asc" };
      if (prev.direction === "asc") return { key, direction: "desc" };
      return null;
    });
    setCurrentPage(1);
  }, []);

  /* ─── Render helpers ─── */
  const isRelaxed = density === "comfort";

  const renderCell = (contact: EnrichedContact, colKey: string) => {
    const tint = getAvatarTint(contact.name);
    const initials = getInitials(contact.name);

    switch (colKey) {
      case "contact_name":
        return (
          <TableCell key={colKey}>
            <div className={`flex items-center ${isRelaxed ? "gap-3" : "gap-2.5"}`}>
              <HoverCard>
                <HoverCardTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <div className="cursor-pointer">
                    <ContactAvatar name={contact.name} size={isRelaxed ? "lg" : "md"} />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent side="bottom" align="start" className="w-[280px] p-0 rounded-xl border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-br from-[#1E293B] to-[#334155] px-4 py-3 relative overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/[0.04]" />
                    <div className="flex items-center gap-3 relative">
                      <div className="w-11 h-11 rounded-xl overflow-hidden border-2 border-white/20 shrink-0" style={{ backgroundColor: getPersonPhoto(contact.name) ? "transparent" : tint.bg }}>
                        {getPersonPhoto(contact.name) ? <img src={getPersonPhoto(contact.name)} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[13px] text-white" style={{ fontWeight: 700 }}>{initials}</div>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] text-white truncate" style={{ fontWeight: 600 }}>{contact.name}</p>
                        <p className="text-[11px] text-[#94A3B8] truncate">{contact.department}</p>
                      </div>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="bg-white px-4 py-3 space-y-2">
                    <div className="flex items-center gap-2.5 text-[12px] text-[#334155]"><Mail className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" /><span className="truncate">{contact.email}</span></div>
                    <div className="flex items-center gap-2.5 text-[12px] text-[#334155]"><Phone className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" /><span>{contact.phone}{contact.phoneExt ? ` ext. ${contact.phoneExt}` : ""}</span></div>
                    <div className="flex items-center gap-2.5 text-[12px] text-[#334155]"><Building2 className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" /><span>{contact.company}</span></div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <div className="min-w-0">
                <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} truncate block max-w-[170px]`} style={{ fontWeight: 500 }}>{contact.name}</span>
                {isRelaxed && contact.email && (
                  <span className="text-xs text-muted-foreground/60 truncate block max-w-[170px]">{contact.email}</span>
                )}
              </div>
            </div>
          </TableCell>
        );

      case "department": {
        const dStyle = DEPT_STYLES[contact.department] || DEPT_STYLES.Sales;
        const shortDept = contact.department === "Supply Chain Management" ? "Supply Chain" : contact.department;
        return (
          <TableCell key={colKey}>
            <span
              className={`inline-flex items-center ${isRelaxed ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-xs"} rounded-full border`}
              style={{ fontWeight: 500, backgroundColor: dStyle.bg, color: dStyle.text, borderColor: dStyle.border }}
            >
              {shortDept}
            </span>
          </TableCell>
        );
      }

      case "company":
        return (
          <TableCell key={colKey}>
            <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} truncate block max-w-[160px]`}>{contact.company}</span>
          </TableCell>
        );

      case "email":
        return (
          <TableCell key={colKey}>
            <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} text-muted-foreground truncate block max-w-[200px]`}>{contact.email}</span>
          </TableCell>
        );

      case "phone":
        return (
          <TableCell key={colKey}>
            <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} tabular-nums`}>
              {contact.phone}
              {contact.phoneExt && <span className="text-muted-foreground ml-1">ext. {contact.phoneExt}</span>}
            </span>
          </TableCell>
        );

      case "secondary_phone":
        return (
          <TableCell key={colKey}>
            {contact.secondaryPhone ? (
              <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} tabular-nums`}>
                {contact.secondaryPhone}
                {contact.secondaryPhoneExt && <span className="text-muted-foreground ml-1">ext. {contact.secondaryPhoneExt}</span>}
              </span>
            ) : (
              <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} text-muted-foreground`}>{"\u2013"}</span>
            )}
          </TableCell>
        );

      case "linked_partners": {
        const partners = contact.linkedPartners;
        const first = partners[0];
        const extra = partners.length - 1;
        return (
          <TableCell key={colKey}>
            <div className="flex items-center gap-1.5">
              <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} truncate max-w-[90px]`}>{first}</span>
              {extra > 0 && (
                <span className="text-[11px] shrink-0 cursor-default leading-none" style={{ fontWeight: 600, color: "#085FCC" }}>+{extra} more</span>
              )}
            </div>
          </TableCell>
        );
      }

      case "status": {
        const sStyle = STATUS_STYLES[contact.status];
        return (
          <TableCell key={colKey}>
            <span
              className={`inline-flex items-center ${isRelaxed ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-xs"} rounded-full border`}
              style={{ fontWeight: 500, backgroundColor: sStyle.bg, color: sStyle.text, borderColor: sStyle.border }}
            >
              {contact.status === "active" ? "Active" : "Inactive"}
            </span>
          </TableCell>
        );
      }

      default:
        return <TableCell key={colKey}>{"\u2013"}</TableCell>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 lg:px-8 h-12 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <button
            onClick={() => navigate("/partners")}
            className="hover:text-foreground transition-colors cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            Partners Management
          </button>
          <span className="text-muted-foreground">/</span>
          <span style={{ fontWeight: 500 }} className="text-foreground">Contacts Directory</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <Input
              placeholder="Search contacts..."
              className="pl-9 w-[260px] h-8 bg-white border-border/60 text-[13px] placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#EDF4FF" }}>
              <span className="text-[11px]" style={{ fontWeight: 600, color: "#0A77FF" }}>AA</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-[13px]" style={{ fontWeight: 500 }}>Ahtisham Ahmad</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Product Designer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="px-6 lg:px-8 py-6 flex-1 min-h-0 flex flex-col">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 -mx-6 lg:-mx-8 -mt-6 px-6 lg:px-8 pt-3.5 pb-3.5 bg-white border-b border-border shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#EDF4FF" }}>
                <Users className="w-4 h-4" style={{ color: "#0A77FF" }} />
              </div>
              <div>
                <h1 className="font-bold text-[20px]">Contacts Directory</h1>
                <p className="text-xs text-muted-foreground">
                  Manage and organize all partner contacts — from procurement leads and sales reps to logistics coordinators — in one centralized directory.
                </p>
              </div>
            </div>
            <Button
              onClick={() => { resetCreateForm(); setCreateModalOpen(true); }}
              className="bg-primary text-primary-foreground shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create New Contact
            </Button>
          </div>

          {/* Data Table Container */}
          <div className="border border-border rounded-xl bg-card overflow-clip flex flex-1 min-h-0">
            <div className="flex-1 min-w-0 overflow-clip flex flex-col">
              {/* Row 1: Search + Filters | Count + Density + Column Selector */}
              <div className="flex items-center justify-between gap-3 px-4 pt-3.5 pb-2 shrink-0">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
                    <Input
                      placeholder="Search by name, email, department..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
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
                  {/* Filters button */}
                  <button
                    type="button"
                    onClick={() => toast.info("Advanced filters — coming soon")}
                    className="inline-flex items-center justify-center h-9 gap-1.5 px-3 rounded-lg border bg-white shadow-sm hover:bg-muted/50 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 shrink-0 text-foreground border-border/80"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm" style={{ fontWeight: 500 }}>Filters</span>
                  </button>
                </div>

                {/* Count + Density + Column Selector */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-sm tabular-nums mr-1 hidden sm:inline" style={{ fontWeight: 500 }}>
                    {filteredContacts.length !== allContacts.length ? (
                      <>
                        <span className="text-foreground">{filteredContacts.length}</span>
                        <span className="text-muted-foreground/60"> of </span>
                        <span className="text-muted-foreground">{allContacts.length}</span>
                        <span className="text-muted-foreground/70"> contacts</span>
                      </>
                    ) : (
                      <>
                        <span className="text-foreground">{allContacts.length}</span>
                        <span className="text-muted-foreground/70"> contacts</span>
                      </>
                    )}
                  </span>

                  <div className="w-px h-5 bg-border/60 mx-1 hidden sm:block" />

                  {/* Density Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center h-9 gap-2 px-3 rounded-lg border border-border bg-white text-foreground shadow-sm hover:bg-muted/40 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      >
                        {density === "condensed" && <AlignJustify className="w-[18px] h-[18px] text-muted-foreground/80" />}
                        {density === "comfort" && <List className="w-[18px] h-[18px] text-muted-foreground/80" />}
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
                          {opt.icon === "list" && <List className="w-5 h-5 text-muted-foreground shrink-0" />}
                          {opt.icon === "layout-grid" && <LayoutGrid className="w-5 h-5 text-muted-foreground shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm" style={{ fontWeight: 500 }}>{opt.label}</div>
                            <div className="text-xs text-muted-foreground">{opt.description}</div>
                          </div>
                          {density === opt.key && <Check className="w-4 h-4 shrink-0" style={{ color: "#0A77FF" }} />}
                        </DropdownMenuItem>
                      ))}
                      {/* Card size options — only when card view is active */}
                      {density === "card" && (
                        <>
                          <div className="mx-2 my-1.5 border-t border-[#F1F5F9]" />
                          <div className="px-3 py-1.5">
                            <p className="text-[10px] text-[#94A3B8] uppercase tracking-wide mb-2" style={{ fontWeight: 600 }}>Card Size</p>
                            <div className="flex items-center gap-1.5">
                              {(["large", "medium", "small"] as const).map((size) => (
                                <button
                                  key={size}
                                  onClick={() => setCardSize(size)}
                                  className={`flex-1 py-1.5 rounded-md text-[11px] text-center transition-all cursor-pointer ${
                                    cardSize === size
                                      ? "bg-[#0A77FF] text-white shadow-sm"
                                      : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
                                  }`}
                                  style={{ fontWeight: cardSize === size ? 600 : 500 }}
                                >
                                  {size === "large" ? "Large" : size === "medium" ? "Medium" : "Small"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <ColumnSelectorTrigger
                    visibleCount={visibleColumns.length}
                    active={columnDrawerOpen}
                    onClick={() => setColumnDrawerOpen(!columnDrawerOpen)}
                  />
                </div>
              </div>

              {/* Row 2: Quick Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto px-4 pb-3 shrink-0">
                {QUICK_FILTER_OPTIONS.map((filter) => {
                  const isActive = quickFilter === filter.key;
                  const count = filterCounts[filter.key];
                  return (
                    <button
                      key={filter.key}
                      onClick={() => {
                        setQuickFilter(filter.key);
                        setCurrentPage(1);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? "border-primary bg-[#EDF4FF] hover:bg-[#D6E8FF] active:bg-[#ADD1FF]"
                          : "border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:border-muted-foreground/30 active:bg-muted"
                      }`}
                      style={{
                        fontWeight: isActive ? 500 : 400,
                        color: isActive ? "#0A77FF" : undefined,
                      }}
                    >
                      {filter.label}
                      {filter.showCount && (
                        <span
                          className={`text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center ${
                            isActive ? "bg-primary/10" : "bg-muted"
                          }`}
                          style={{
                            fontWeight: 600,
                            color: isActive ? "#0A77FF" : "#475569",
                          }}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-border shrink-0" />

              {density === "card" ? (
                /* ─── Card View ─── */
                <div className="p-4 min-h-0 overflow-y-auto flex-1">
                  {paginatedContacts.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
                      <Users className="w-8 h-8" />
                      <p className="text-sm">No contacts found</p>
                      {(searchQuery || quickFilter !== "all") && (
                        <Button variant="link" size="sm" onClick={() => { setSearchQuery(""); setQuickFilter("all"); setCurrentPage(1); }}>
                          Clear all filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className={`grid gap-4 ${
                      cardSize === "large" ? "grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2" :
                      cardSize === "small" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" :
                      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    }`}>
                      {paginatedContacts.map((contact) => {
                        const dStyle = DEPT_STYLES[contact.department] || DEPT_STYLES.Sales;
                        const sStyle = STATUS_STYLES[contact.status];
                        const shortDept = contact.department === "Supply Chain Management" ? "Supply Chain" : contact.department;

                        return (
                          <div
                            key={contact.id}
                            className="rounded-xl border border-[#E8ECF1] bg-white relative group hover:border-[#BFDBFE] hover:shadow-[0_4px_16px_-4px_rgba(10,119,255,0.10)] transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
                          >
                            {/* 3-dot menu */}
                            <div className="absolute top-3 right-3 z-10">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <button className="h-7 w-7 rounded-md flex items-center justify-center text-[#94A3B8] opacity-0 group-hover:opacity-100 hover:text-[#334155] hover:bg-[#F1F5F9] transition-all cursor-pointer">
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                  <DropdownMenuItem onClick={() => toast.info("View Details — coming soon")}>
                                    <Eye className="w-4 h-4 mr-2" /> View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => toast.info("Edit — coming soon")}>
                                    <Pencil className="w-4 h-4 mr-2" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-[#DC2626] focus:text-[#DC2626] focus:bg-[#FEF2F2]" onClick={() => toast.info("Archive — coming soon")}>
                                    <Archive className="w-4 h-4 mr-2 text-[#DC2626]" /> Archive
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className={`${cardSize === "large" ? "p-4" : cardSize === "small" ? "p-3" : "p-3.5"}`}>
                              {/* Avatar + Name + Company */}
                              <div className="flex items-start gap-3">
                                <ContactAvatar name={contact.name} size="lg" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}>{contact.name}</p>
                                  <p className="text-[11px] text-[#94A3B8] truncate">{contact.company}</p>
                                </div>
                              </div>

                              {/* Contact details — matches creation form card */}
                              <div className="mt-2.5 space-y-1.5">
                                <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                                  <Phone className="w-3 h-3 text-[#94A3B8] shrink-0" />
                                  <span className="truncate tabular-nums">{contact.phone}</span>
                                  <span className="ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] shrink-0 border" style={{ fontWeight: 500, backgroundColor: dStyle.bg, color: dStyle.text, borderColor: dStyle.border }}>
                                    {shortDept}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                                  <PhoneCall className="w-3 h-3 text-[#94A3B8] shrink-0" />
                                  <span className="truncate tabular-nums">{contact.secondaryPhone || "—"}</span>
                                  {contact.secondaryPhoneExt && <span className="text-[#94A3B8]">Ext. {contact.secondaryPhoneExt}</span>}
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                                  <Mail className="w-3 h-3 text-[#94A3B8] shrink-0" />
                                  <span className="truncate">{contact.email}</span>
                                </div>
                              </div>

                              {/* Status pill at bottom */}
                              <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] border" style={{ fontWeight: 600, backgroundColor: sStyle.bg, color: sStyle.text, borderColor: sStyle.border }}>
                                  {contact.status === "active" ? "Active" : "Inactive"}
                                </span>
                                <span className="text-[10px] text-[#94A3B8]" style={{ fontWeight: 500 }}>
                                  {contact.linkedPartners.length} partner{contact.linkedPartners.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                /* ─── Table View ─── */
                <div className="min-h-0 overflow-auto flex-1">
                  <Table style={{ tableLayout: "fixed", width: `${CHECKBOX_COL_WIDTH + visibleColumns.reduce((sum, key) => sum + (columnWidths[key] ?? parseInt(colDef(key).minWidth, 10)), 0) + 60}px` }}>
                    <TableHeader className="sticky top-0 z-20 bg-card">
                      <TableRow className={`bg-muted/30 hover:bg-muted/30 ${
                        density === "condensed" ? "[&>th]:h-8" : density === "comfort" ? "[&>th]:h-9" : ""
                      }`}>
                        {/* Checkbox column — sticky leftmost */}
                        <TableHead className="sticky left-0 z-20 bg-[#f8fafc] w-[40px] min-w-[40px] max-w-[40px] !pl-2 !pr-0">
                          <Checkbox
                            checked={allPageSelected ? true : somePageSelected ? "indeterminate" : false}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all rows"
                          />
                        </TableHead>
                        {/* Dynamic columns */}
                        {visibleColumns.map((key) => {
                          const def = colDef(key);
                          const width = columnWidths[key] ?? parseInt(def.minWidth, 10);
                          const currentColSort: "asc" | "desc" | null = sortConfig?.key === key ? sortConfig.direction : null;
                          const isFirstCol = key === "contact_name";

                          return (
                            <TableHead
                              key={key}
                              className={`whitespace-nowrap relative group/colheader ${isFirstCol ? "sticky left-[40px] bg-[#f8fafc] z-20" : ""}`}
                              style={{
                                width: `${width}px`,
                                minWidth: `${width}px`,
                                maxWidth: `${width}px`,
                                overflow: "hidden",
                                ...(isFirstCol ? { boxShadow: "inset -1px 0 0 0 rgba(0,0,0,0.08), 3px 0 6px -2px rgba(0,0,0,0.06)" } : {}),
                              }}
                            >
                              <div className="flex items-center">
                                {def.sortable ? (
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
                                    onClick={() => handleSort(key)}
                                  >
                                    <span className="text-[13px]" style={currentColSort ? { color: "#0A77FF" } : undefined}>{def.label}</span>
                                    {currentColSort === "asc" && <ArrowUp className="w-3 h-3 shrink-0" style={{ color: "#0A77FF" }} />}
                                    {currentColSort === "desc" && <ArrowDown className="w-3 h-3 shrink-0" style={{ color: "#0A77FF" }} />}
                                    {!currentColSort && (
                                      <ArrowUpDown className="w-3 h-3 shrink-0 text-muted-foreground opacity-0 group-hover/colheader:opacity-100 transition-opacity" />
                                    )}
                                  </button>
                                ) : (
                                  <span className="text-[13px]">{def.label}</span>
                                )}
                              </div>
                            </TableHead>
                          );
                        })}
                        {/* Actions column — sticky right */}
                        <TableHead className="whitespace-nowrap w-[60px] sticky right-0 bg-[#f8fafc] z-20 !pl-2 !pr-2" style={{ boxShadow: "inset 1px 0 0 0 rgba(0,0,0,0.08)" }}>
                          <span className="text-[13px]">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedContacts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={visibleColumns.length + 2} className="h-32 text-center">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <Users className="w-8 h-8" />
                              <p className="text-sm">No contacts found</p>
                              {(searchQuery || quickFilter !== "all") && (
                                <Button variant="link" size="sm" onClick={() => { setSearchQuery(""); setQuickFilter("all"); setCurrentPage(1); }}>
                                  Clear all filters
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedContacts.map((contact) => {
                          return (
                            <TableRow
                              key={contact.id}
                              className={`cursor-pointer group hover:bg-[#F0F7FF] ${
                                density === "condensed"
                                  ? "[&>td]:py-1 [&>td]:pl-4 [&>td]:pr-2"
                                  : density === "comfort"
                                  ? "[&>td]:py-2 [&>td]:pl-4 [&>td]:pr-2"
                                  : ""
                              }`}
                            >
                              {/* Checkbox cell — sticky leftmost */}
                              <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-[#F0F7FF] w-[40px] min-w-[40px] max-w-[40px] !pl-2 !pr-0">
                                <Checkbox
                                  checked={selectedRows.has(contact.id)}
                                  onCheckedChange={() => handleSelectRow(contact.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  aria-label={`Select ${contact.name}`}
                                />
                              </TableCell>
                              {visibleColumns.map((key) => {
                                const cell = renderCell(contact, key);
                                const w = columnWidths[key] ?? parseInt(colDef(key).minWidth, 10);
                                const cellWidthStyle: React.CSSProperties = {
                                  width: `${w}px`, minWidth: `${w}px`, maxWidth: `${w}px`, overflow: "hidden", textOverflow: "ellipsis",
                                };
                                const isFirstCol = key === "contact_name";
                                if (isFirstCol) {
                                  return (
                                    <TableCell
                                      key={key}
                                      className="sticky left-[40px] z-10 bg-card group-hover:bg-[#F0F7FF]"
                                      style={{
                                        ...cellWidthStyle,
                                        boxShadow: "inset -1px 0 0 0 rgba(0,0,0,0.08), 3px 0 6px -2px rgba(0,0,0,0.06)",
                                      }}
                                    >
                                      {/* Re-render inside sticky wrapper */}
                                      {(() => {
                                        const tint = getAvatarTint(contact.name);
                                        const initials = getInitials(contact.name);
                                        return (
                                          <div className={`flex items-center ${isRelaxed ? "gap-3" : "gap-2.5"}`}>
                                            <div
                                              className={`${isRelaxed ? "w-9 h-9" : "w-8 h-8"} rounded-full flex items-center justify-center shrink-0`}
                                              style={{ backgroundColor: tint.bg }}
                                            >
                                              <span className="text-[11px]" style={{ fontWeight: 600, color: tint.fg }}>{initials}</span>
                                            </div>
                                            <div className="min-w-0">
                                              <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} truncate block max-w-[170px]`} style={{ fontWeight: 500 }}>{contact.name}</span>
                                              {isRelaxed && contact.email && (
                                                <span className="text-xs text-muted-foreground/60 truncate block max-w-[170px]">{contact.email}</span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </TableCell>
                                  );
                                }
                                // For non-first-col, clone cell with width styles
                                // We already render a <TableCell> from renderCell, so we just wrap style
                                return (
                                  <TableCell key={key} style={cellWidthStyle}>
                                    {(() => {
                                      // Re-render cell content inline
                                      switch (key) {
                                        case "department": {
                                          const dStyle = DEPT_STYLES[contact.department] || DEPT_STYLES.Sales;
                                          const shortDept = contact.department === "Supply Chain Management" ? "Supply Chain" : contact.department;
                                          return (
                                            <span
                                              className={`inline-flex items-center ${isRelaxed ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-xs"} rounded-full border`}
                                              style={{ fontWeight: 500, backgroundColor: dStyle.bg, color: dStyle.text, borderColor: dStyle.border }}
                                            >
                                              {shortDept}
                                            </span>
                                          );
                                        }
                                        case "company":
                                          return <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} truncate block max-w-[160px]`}>{contact.company}</span>;
                                        case "email":
                                          return <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} text-muted-foreground truncate block max-w-[200px]`}>{contact.email}</span>;
                                        case "phone":
                                          return (
                                            <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} tabular-nums`}>
                                              {contact.phone}
                                              {contact.phoneExt && <span className="text-muted-foreground ml-1">ext. {contact.phoneExt}</span>}
                                            </span>
                                          );
                                        case "secondary_phone":
                                          return contact.secondaryPhone ? (
                                            <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} tabular-nums`}>
                                              {contact.secondaryPhone}
                                              {contact.secondaryPhoneExt && <span className="text-muted-foreground ml-1">ext. {contact.secondaryPhoneExt}</span>}
                                            </span>
                                          ) : (
                                            <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} text-muted-foreground`}>{"\u2013"}</span>
                                          );
                                        case "linked_partners": {
                                          const partners = contact.linkedPartners;
                                          const first = partners[0];
                                          const extra = partners.length - 1;
                                          return (
                                            <div className="flex items-center gap-1.5">
                                              <span className={`${isRelaxed ? "text-[13.5px]" : "text-sm"} truncate max-w-[90px]`}>{first}</span>
                                              {extra > 0 && (
                                                <span className="text-[11px] shrink-0 cursor-default leading-none" style={{ fontWeight: 600, color: "#085FCC" }}>+{extra} more</span>
                                              )}
                                            </div>
                                          );
                                        }
                                        case "status": {
                                          const sStyle = STATUS_STYLES[contact.status];
                                          return (
                                            <span
                                              className={`inline-flex items-center ${isRelaxed ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-xs"} rounded-full border`}
                                              style={{ fontWeight: 500, backgroundColor: sStyle.bg, color: sStyle.text, borderColor: sStyle.border }}
                                            >
                                              {contact.status === "active" ? "Active" : "Inactive"}
                                            </span>
                                          );
                                        }
                                        default:
                                          return <span>{"\u2013"}</span>;
                                      }
                                    })()}
                                  </TableCell>
                                );
                              })}
                              {/* Actions — sticky right */}
                              <TableCell className="sticky right-0 bg-card group-hover:bg-[#F0F7FF] z-10 !pl-2 !pr-2" style={{ boxShadow: "inset 1px 0 0 0 rgba(0,0,0,0.08)" }}>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors cursor-pointer"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-[220px]" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenuItem onClick={() => toast.info("View Details — coming soon")}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => toast.info("Edit — coming soon")}>
                                      <Pencil className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {contact.status === "active" ? (
                                      <DropdownMenuItem onClick={() => toast.info("Deactivate — coming soon")}>
                                        <CircleSlash className="w-4 h-4 mr-2" />
                                        Deactivate
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem onClick={() => toast.info("Activate — coming soon")}>
                                        <CircleCheck className="w-4 h-4 mr-2" />
                                        Activate
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem variant="destructive" onClick={() => toast.info("Archive — coming soon")}>
                                      <Archive className="w-4 h-4 mr-2 text-[#DC2626]" />
                                      Archive
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {filteredContacts.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-center px-4 py-3 border-t border-border gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Records per page</span>
                    <Select
                      value={String(recordsPerPage)}
                      onValueChange={(val) => {
                        setRecordsPerPage(Number(val));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-[70px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-sm text-muted-foreground"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      Prev
                    </Button>

                    {getPageNumbers().map((page, idx) =>
                      page === "..." ? (
                        <span key={`dots-${idx}`} className="px-1 text-sm text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "ghost"}
                          size="sm"
                          className={`h-8 w-8 p-0 text-sm ${
                            currentPage === page
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground"
                          }`}
                          onClick={() => setCurrentPage(page as number)}
                        >
                          {page}
                        </Button>
                      )
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1 text-sm text-muted-foreground"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {/* Column Selector Side Drawer */}
            <ColumnSelector
              columns={COLUMN_DEFS}
              columnOrder={columnOrder}
              columnVisibility={columnVisibility}
              onColumnOrderChange={setColumnOrder}
              onColumnVisibilityChange={setColumnVisibility}
              lockedColumns={LOCKED_COLUMNS}
              open={columnDrawerOpen}
              onOpenChange={setColumnDrawerOpen}
            />
          </div>
        </div>
      </div>

      {/* Create Contact Modal — same as partner creation form */}
      <CreatePocModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        contextName="Contacts Directory"
        newPocName={newPocName}
        onNewPocNameChange={setNewPocName}
        newPocDepartment={newPocDepartment}
        onNewPocDepartmentChange={setNewPocDepartment}
        newPocRole={newPocRole}
        onNewPocRoleChange={setNewPocRole}
        newPocLandline={newPocLandline}
        onNewPocLandlineChange={setNewPocLandline}
        newPocLandlineCode={newPocLandlineCode}
        onNewPocLandlineCodeChange={setNewPocLandlineCode}
        newPocExt={newPocExt}
        onNewPocExtChange={setNewPocExt}
        newPocMobile={newPocMobile}
        onNewPocMobileChange={setNewPocMobile}
        newPocMobileCode={newPocMobileCode}
        onNewPocMobileCodeChange={setNewPocMobileCode}
        newPocEmail={newPocEmail}
        onNewPocEmailChange={setNewPocEmail}
        saveAndCreateAnother={saveAndCreateAnother}
        onSaveAndCreateAnotherChange={setSaveAndCreateAnother}
        onSave={handleSaveContact}
      />
    </div>
  );
}
