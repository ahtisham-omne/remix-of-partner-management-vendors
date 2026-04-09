import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
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
} from "lucide-react";
import { toast } from "sonner";
import { CONTACT_DICTIONARY, type ContactPerson } from "../components/vendors/partnerConstants";
import { getAvatarTint } from "../utils/avatarTints";
import { useVendors } from "../context/VendorContext";
import { CreatePocModal } from "../components/vendors/PocModals";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "../components/ui/alert-dialog";
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
  return { ...c, status, linkedPartners };
}

/* ─── Dummy data ─── */
const ACTIVITY_LOG = [
  { id: 1, action: "Contact created", user: "System", date: "2025-11-02T09:15:00Z", icon: "create" },
  { id: 2, action: "Linked to Acme Corp", user: "Sarah Johnson", date: "2025-11-05T14:22:00Z", icon: "link" },
  { id: 3, action: "Phone number updated", user: "Admin", date: "2025-12-10T10:05:00Z", icon: "edit" },
  { id: 4, action: "Linked to TechVault", user: "Sarah Johnson", date: "2026-01-08T16:33:00Z", icon: "link" },
  { id: 5, action: "Email address updated", user: "Admin", date: "2026-02-14T11:45:00Z", icon: "edit" },
  { id: 6, action: "Department changed to current", user: "Michael Lee", date: "2026-03-01T08:20:00Z", icon: "edit" },
];

const NOTES_DATA = [
  { id: 1, author: "Sarah Johnson", date: "2026-03-15T09:00:00Z", text: "Confirmed preferred communication channel is email. Direct phone line available for urgent matters only." },
  { id: 2, author: "Michael Lee", date: "2026-02-20T14:30:00Z", text: "Attended annual vendor review meeting. Contact expressed interest in expanding partnership to include logistics services." },
  { id: 3, author: "Admin", date: "2026-01-10T11:15:00Z", text: "Verified contact details during quarterly data cleanup. All information current and accurate." },
];

const ATTACHMENTS_DATA = [
  { id: 1, name: "NDA_Agreement_2026.pdf", size: "1.2 MB", date: "2026-03-10T09:00:00Z", type: "pdf" },
  { id: 2, name: "Contact_Onboarding_Form.docx", size: "340 KB", date: "2026-01-15T14:20:00Z", type: "doc" },
  { id: 3, name: "ID_Verification.png", size: "2.8 MB", date: "2025-12-05T10:45:00Z", type: "img" },
  { id: 4, name: "Meeting_Notes_Q1.pdf", size: "520 KB", date: "2026-03-28T16:00:00Z", type: "pdf" },
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
export function ContactDetailPage() {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();
  const { vendors } = useVendors();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [imgFailed, setImgFailed] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
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
        <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
          <User className="w-8 h-8 text-[#94A3B8]" />
        </div>
        <p className="text-[#64748B] text-sm">Contact not found.</p>
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
  const shortDept = contact.department === "Supply Chain Management" ? "Supply Chain" : contact.department;
  const sStyle = contact.status === "active" ? { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0" } : { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFC]">
      {/* Sentinel for scroll detection */}
      <div ref={sentinelRef} className="h-0 w-full" />

      {/* Sticky Header Card */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] shadow-sm transition-all duration-200">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 xl:px-8">
          {/* Breadcrumb row */}
          <div className="flex items-center gap-1.5 text-[12px] text-[#64748B] py-2 border-b border-[#F1F5F9]">
            <span className="hover:text-[#334155] cursor-pointer" onClick={() => navigate("/partners")}>Partners Management</span>
            <span>/</span>
            <span className="hover:text-[#334155] cursor-pointer" onClick={() => navigate("/partners/contacts")}>Contacts Directory</span>
            <span>/</span>
            <span className="text-[#0F172A]" style={{ fontWeight: 500 }}>{contact.name}</span>
          </div>

          {/* Main header row */}
          <div className={`flex items-center gap-3 transition-all duration-200 ${isCompact ? "py-2" : "py-4"}`}>
            {/* Back button */}
            <button onClick={() => navigate("/partners/contacts")} className={`${isCompact ? "w-8 h-8" : "w-10 h-10"} rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] flex items-center justify-center transition-all cursor-pointer shadow-sm shrink-0`}>
              <ChevronLeft className={`${isCompact ? "w-4 h-4" : "w-5 h-5"} text-[#64748B]`} />
            </button>

            {/* Avatar */}
            <div className={`${isCompact ? "w-8 h-8" : "w-11 h-11"} rounded-xl flex items-center justify-center shrink-0 transition-all duration-200`} style={{ backgroundColor: tint.bg }}>
              {photo && !imgFailed ? (
                <img src={photo} alt="" className="w-full h-full object-cover rounded-xl" onError={() => setImgFailed(true)} />
              ) : (
                <span className={`${isCompact ? "text-[10px]" : "text-[13px]"}`} style={{ fontWeight: 700, color: tint.fg }}>{initials}</span>
              )}
            </div>

            {/* Name + pills */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className={`${isCompact ? "text-[14px]" : "text-[18px]"} text-[#0F172A] truncate transition-all duration-200`} style={{ fontWeight: isCompact ? 600 : 700 }}>{contact.name}</h1>
                {deptStyle && <span className={`inline-flex items-center ${isCompact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]"} rounded-full border`} style={{ fontWeight: 600, backgroundColor: deptStyle.bg, color: deptStyle.text, borderColor: deptStyle.border }}>{shortDept}</span>}
                <span className={`inline-flex items-center ${isCompact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]"} rounded-full border`} style={{ fontWeight: 500, backgroundColor: sStyle.bg, color: sStyle.text, borderColor: sStyle.border }}>{contact.status === "active" ? "Active" : "Inactive"}</span>
              </div>
              {!isCompact && (
                <div className="flex items-center gap-3 mt-1 text-[12px] text-[#64748B]">
                  {contact.role && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{contact.role}</span>}
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{(contact.companies || [contact.company])[0]}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] text-[#334155] inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm" style={{ fontWeight: 500 }}>
                    Actions <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied"); }}>
                    <Link2 className="w-4 h-4 mr-2" /> Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-[#92400E] focus:text-[#92400E] focus:bg-[#FFFBEB]" onClick={() => setShowDeactivateModal(true)}>
                    <CircleSlash className="w-4 h-4 mr-2 text-[#92400E]" /> {contact.status === "active" ? "Deactivate" : "Activate"}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[#DC2626] focus:text-[#DC2626] focus:bg-[#FEF2F2]" onClick={() => setShowArchiveModal(true)}>
                    <Archive className="w-4 h-4 mr-2 text-[#DC2626]" /> Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button onClick={handleOpenEdit} className="h-9 px-4 rounded-lg bg-[#0A77FF] hover:bg-[#0862D0] text-white text-[13px] inline-flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer" style={{ fontWeight: 600 }}>
                <Pencil className="w-3.5 h-3.5" /> Edit Contact
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-0 -mb-px overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 text-[13px] inline-flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${isActive ? "border-[#0A77FF] text-[#0A77FF]" : "border-transparent text-[#64748B] hover:text-[#334155] hover:border-[#CBD5E1]"}`} style={{ fontWeight: isActive ? 600 : 500 }}>
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 xl:px-8 py-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-2 gap-5">
              {/* Contact Information Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                <h3 className="text-[13px] text-[#0F172A] mb-4" style={{ fontWeight: 600 }}>Contact Information</h3>
                <div className="space-y-3.5">
                  {/* Primary Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-[#64748B]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#94A3B8] mb-0.5" style={{ fontWeight: 500 }}>Primary Phone</p>
                      <p className="text-[13px] text-[#334155]" style={{ fontWeight: 500 }}>
                        {contact.phone}
                        {contact.phoneExt && <span className="text-[#94A3B8] ml-1.5">ext. {contact.phoneExt}</span>}
                      </p>
                    </div>
                  </div>
                  {/* Secondary Phone */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-[#64748B]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#94A3B8] mb-0.5" style={{ fontWeight: 500 }}>Secondary Phone</p>
                      <p className="text-[13px] text-[#334155]" style={{ fontWeight: 500 }}>
                        {contact.secondaryPhone}
                        {contact.secondaryPhoneExt && <span className="text-[#94A3B8] ml-1.5">ext. {contact.secondaryPhoneExt}</span>}
                      </p>
                    </div>
                  </div>
                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-[#64748B]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#94A3B8] mb-0.5" style={{ fontWeight: 500 }}>Email</p>
                      <a href={`mailto:${contact.email}`} className="text-[13px] text-[#0A77FF] hover:underline" style={{ fontWeight: 500 }}>
                        {contact.email}
                      </a>
                    </div>
                  </div>
                  {/* Department */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-[#64748B]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#94A3B8] mb-0.5" style={{ fontWeight: 500 }}>Department</p>
                      <p className="text-[13px] text-[#334155]" style={{ fontWeight: 500 }}>{contact.department}</p>
                    </div>
                  </div>
                  {/* Role / Title */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-[#64748B]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#94A3B8] mb-0.5" style={{ fontWeight: 500 }}>Role / Title</p>
                      <p className="text-[13px] text-[#334155]" style={{ fontWeight: 500 }}>{contact.role || `${contact.department} Representative`}</p>
                    </div>
                  </div>
                  {/* Company */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-[#64748B]" />
                    </div>
                    <div>
                      <p className="text-[11px] text-[#94A3B8] mb-0.5" style={{ fontWeight: 500 }}>Company</p>
                      <p className="text-[13px] text-[#334155]" style={{ fontWeight: 500 }}>{contact.company}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Partner Information Card */}
              <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] text-[#0F172A]" style={{ fontWeight: 600 }}>Partner Information</h3>
                  <span className="text-[11px] text-[#94A3B8] bg-[#F1F5F9] rounded-full px-2.5 py-0.5" style={{ fontWeight: 600 }}>
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
                        className={`flex items-center gap-3 p-2.5 rounded-lg border border-[#F1F5F9] hover:border-[#BFDBFE] hover:bg-[#F0F7FF] transition-all ${partnerId ? "cursor-pointer" : ""}`}
                        onClick={() => { if (partnerId) window.open(`/vendors/${partnerId}`, "_blank"); }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: pTint.bg }}
                        >
                          <span className="text-[10px]" style={{ fontWeight: 700, color: pTint.fg }}>{pInitials}</span>
                        </div>
                        <span className={`text-[13px] text-[#334155] ${partnerId ? "hover:text-[#0A77FF] hover:underline" : ""}`} style={{ fontWeight: 500 }}>{partner}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "linked_partners" && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#F1F5F9] flex items-center justify-between">
                <h3 className="text-[13px] text-[#0F172A]" style={{ fontWeight: 600 }}>Linked Partners</h3>
                <span className="text-[11px] text-[#94A3B8] bg-[#F1F5F9] rounded-full px-2.5 py-0.5" style={{ fontWeight: 600 }}>
                  {contact.linkedPartners.length} partner{contact.linkedPartners.length !== 1 ? "s" : ""}
                </span>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F1F5F9]">
                    <th className="text-left text-[11px] text-[#94A3B8] px-5 py-2.5" style={{ fontWeight: 600 }}>Partner Name</th>
                    <th className="text-left text-[11px] text-[#94A3B8] px-5 py-2.5" style={{ fontWeight: 600 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contact.linkedPartners.map((partner, idx) => {
                    const pTint = getAvatarTint(partner);
                    const pInitials = partner.split(" ").filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
                    const partnerId = partnerNameToId[partner];
                    return (
                      <tr
                        key={idx}
                        className={`border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F8FAFC] transition-colors ${partnerId ? "cursor-pointer" : ""}`}
                        onClick={() => { if (partnerId) navigate(`/vendors/${partnerId}`); }}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: pTint.bg }}>
                              <span className="text-[10px]" style={{ fontWeight: 700, color: pTint.fg }}>{pInitials}</span>
                            </div>
                            <span className={`text-[13px] text-[#334155] ${partnerId ? "hover:text-[#0A77FF]" : ""}`} style={{ fontWeight: 500 }}>{partner}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] border" style={{ fontWeight: 500, backgroundColor: "#ECFDF5", color: "#065F46", borderColor: "#A7F3D0" }}>Active</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "communications" && (
            <div className="flex flex-col items-center gap-3 py-16 text-[#94A3B8]">
              <MessageSquare className="w-10 h-10" />
              <p className="text-sm" style={{ fontWeight: 500 }}>Communications</p>
              <p className="text-xs text-center max-w-[300px]">Track and manage communications with this contact. This feature is coming soon.</p>
            </div>
          )}

          {activeTab === "purchase_orders" && (
            <div className="flex flex-col items-center gap-3 py-16 text-[#94A3B8]">
              <ShoppingCart className="w-10 h-10" />
              <p className="text-sm" style={{ fontWeight: 500 }}>Purchase Orders</p>
              <p className="text-xs text-center max-w-[300px]">View purchase orders associated with this contact. This feature is coming soon.</p>
            </div>
          )}

          {activeTab === "sales_orders" && (
            <div className="flex flex-col items-center gap-3 py-16 text-[#94A3B8]">
              <Receipt className="w-10 h-10" />
              <p className="text-sm" style={{ fontWeight: 500 }}>Sales Orders</p>
              <p className="text-xs text-center max-w-[300px]">View sales orders associated with this contact. This feature is coming soon.</p>
            </div>
          )}

          {activeTab === "quotes" && (
            <div className="flex flex-col items-center gap-3 py-16 text-[#94A3B8]">
              <ClipboardList className="w-10 h-10" />
              <p className="text-sm" style={{ fontWeight: 500 }}>Quotes</p>
              <p className="text-xs text-center max-w-[300px]">View quotes associated with this contact. This feature is coming soon.</p>
            </div>
          )}

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

      {/* Archive Confirmation Modal */}
      <AlertDialog open={showArchiveModal} onOpenChange={setShowArchiveModal}>
        <AlertDialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF2F2] flex items-center justify-center mb-4">
              <Archive className="w-6 h-6 text-[#DC2626]" />
            </div>
            <AlertDialogTitle className="text-[16px] text-[#0F172A]" style={{ fontWeight: 700 }}>
              Archive Contact
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] mt-2 max-w-[300px] mx-auto" style={{ color: "#475569", lineHeight: "1.65" }}>
              Are you sure you want to archive <strong>{contact.name}</strong>? This contact will be removed from active listings but records will be preserved.
            </AlertDialogDescription>
          </div>
          <div className="px-6 pb-6 flex flex-col gap-2">
            <button onClick={() => { toast.success("Contact archived"); setShowArchiveModal(false); navigate("/partners/contacts"); }} className="w-full h-11 text-[14px] rounded-xl border-0 cursor-pointer transition-colors hover:opacity-90" style={{ fontWeight: 600, backgroundColor: "#DC2626", color: "#fff" }}>
              Archive Contact
            </button>
            <AlertDialogCancel className="w-full h-11 text-[14px] rounded-xl border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC] cursor-pointer" style={{ fontWeight: 500 }}>
              Cancel
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate Confirmation Modal */}
      <AlertDialog open={showDeactivateModal} onOpenChange={setShowDeactivateModal}>
        <AlertDialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25)]">
          <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FFFBEB] flex items-center justify-center mb-4">
              <CircleSlash className="w-6 h-6 text-[#F97316]" />
            </div>
            <AlertDialogTitle className="text-[16px] text-[#0F172A]" style={{ fontWeight: 700 }}>
              Deactivate Contact
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] mt-2 max-w-[300px] mx-auto" style={{ color: "#475569", lineHeight: "1.65" }}>
              Are you sure you want to deactivate <strong>{contact.name}</strong>? This contact will be marked as inactive and excluded from new assignments.
            </AlertDialogDescription>
          </div>
          <div className="px-6 pb-6 flex flex-col gap-2">
            <button onClick={() => { toast.success("Contact deactivated"); setShowDeactivateModal(false); }} className="w-full h-11 text-[14px] rounded-xl border-0 cursor-pointer transition-colors hover:opacity-90" style={{ fontWeight: 600, backgroundColor: "#F97316", color: "#FFFFFF" }}>
              Deactivate Contact
            </button>
            <AlertDialogCancel className="w-full h-11 text-[14px] rounded-xl border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFC] cursor-pointer" style={{ fontWeight: 500 }}>
              Cancel
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ─── Activity Tab ─── */
function ActivityTab() {
  return (
    <div className="space-y-0">
      {ACTIVITY_LOG.map((item, idx) => (
        <div key={item.id} className="flex items-start gap-3 py-3 border-b border-[#F1F5F9] last:border-b-0">
          <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0 mt-0.5">
            <Activity className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-[#334155]" style={{ fontWeight: 500 }}>{item.action}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-[#94A3B8]" style={{ fontWeight: 500 }}>{item.user}</span>
              <span className="text-[11px] text-[#CBD5E1]">|</span>
              <span className="text-[11px] text-[#94A3B8]">{formatDateTime(item.date)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Notes Tab ─── */
function NotesTab() {
  return (
    <div className="space-y-3">
      {NOTES_DATA.map((note) => (
        <div key={note.id} className="p-4 rounded-lg border border-[#F1F5F9] hover:border-[#E2E8F0] transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center">
              <User className="w-3 h-3 text-[#64748B]" />
            </div>
            <span className="text-[12px] text-[#334155]" style={{ fontWeight: 600 }}>{note.author}</span>
            <span className="text-[11px] text-[#94A3B8]">{formatDate(note.date)}</span>
          </div>
          <p className="text-[13px] text-[#64748B] leading-relaxed">{note.text}</p>
        </div>
      ))}
    </div>
  );
}

/* ─── Attachments Tab ─── */
function AttachmentsTab() {
  const fileIcons: Record<string, typeof FileText> = {
    pdf: FileText,
    doc: FileText,
    img: FileText,
  };
  return (
    <div className="space-y-0">
      {ATTACHMENTS_DATA.map((file) => {
        const Icon = fileIcons[file.type] || FileText;
        return (
          <div key={file.id} className="flex items-center gap-3 py-3 border-b border-[#F1F5F9] last:border-b-0">
            <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 text-[#64748B]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#334155] truncate" style={{ fontWeight: 500 }}>{file.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-[#94A3B8]">{file.size}</span>
                <span className="text-[11px] text-[#CBD5E1]">|</span>
                <span className="text-[11px] text-[#94A3B8]">{formatDate(file.date)}</span>
              </div>
            </div>
            <button
              onClick={() => toast.info("Download coming soon")}
              className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] flex items-center justify-center cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B]" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
