import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Search,
  X,
  Check,
  ChevronDown,
  Plus,
  Maximize2,
  Minimize2,
  AlertTriangle,
  MapPin,
  Info,
  Camera,
  Users,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import {
  CONTACT_DICTIONARY,
  type ContactPerson,
} from "./partnerConstants";
import { SelectPocDictionaryModal, CreatePocModal } from "./PocModals";
import { PocPillsRow } from "./PocPillComponents";

interface CreatePartnerLocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationCreated?: (data: Record<string, unknown>) => void;
  vendorName?: string;
}

const COUNTRY_CODES = [
  { code: "+1", flag: "\u{1F1FA}\u{1F1F8}", country: "United States" },
  { code: "+1", flag: "\u{1F1E8}\u{1F1E6}", country: "Canada" },
  { code: "+44", flag: "\u{1F1EC}\u{1F1E7}", country: "United Kingdom" },
  { code: "+49", flag: "\u{1F1E9}\u{1F1EA}", country: "Germany" },
  { code: "+33", flag: "\u{1F1EB}\u{1F1F7}", country: "France" },
  { code: "+81", flag: "\u{1F1EF}\u{1F1F5}", country: "Japan" },
  { code: "+86", flag: "\u{1F1E8}\u{1F1F3}", country: "China" },
  { code: "+91", flag: "\u{1F1EE}\u{1F1F3}", country: "India" },
  { code: "+61", flag: "\u{1F1E6}\u{1F1FA}", country: "Australia" },
  { code: "+55", flag: "\u{1F1E7}\u{1F1F7}", country: "Brazil" },
  { code: "+971", flag: "\u{1F1E6}\u{1F1EA}", country: "UAE" },
  { code: "+65", flag: "\u{1F1F8}\u{1F1EC}", country: "Singapore" },
  { code: "+82", flag: "\u{1F1F0}\u{1F1F7}", country: "South Korea" },
  { code: "+52", flag: "\u{1F1F2}\u{1F1FD}", country: "Mexico" },
  { code: "+31", flag: "\u{1F1F3}\u{1F1F1}", country: "Netherlands" },
  { code: "+46", flag: "\u{1F1F8}\u{1F1EA}", country: "Sweden" },
  { code: "+41", flag: "\u{1F1E8}\u{1F1ED}", country: "Switzerland" },
  { code: "+34", flag: "\u{1F1EA}\u{1F1F8}", country: "Spain" },
  { code: "+39", flag: "\u{1F1EE}\u{1F1F9}", country: "Italy" },
  { code: "+48", flag: "\u{1F1F5}\u{1F1F1}", country: "Poland" },
];

const MOCK_ADDRESS_SUGGESTIONS = [
  { main: "350 Fifth Avenue", secondary: "New York, NY 10118, USA" },
  { main: "1600 Amphitheatre Parkway", secondary: "Mountain View, CA 94043, USA" },
  { main: "1 Apple Park Way", secondary: "Cupertino, CA 95014, USA" },
  { main: "One Microsoft Way", secondary: "Redmond, WA 98052, USA" },
  { main: "410 Terry Ave North", secondary: "Seattle, WA 98109, USA" },
  { main: "1 Hacker Way", secondary: "Menlo Park, CA 94025, USA" },
  { main: "Unter den Linden 77", secondary: "10117 Berlin, Germany" },
  { main: "1-7-1 Konan, Minato-ku", secondary: "Tokyo 108-0075, Japan" },
  { main: "221B Baker Street", secondary: "London, NW1 6XE, United Kingdom" },
  { main: "1 Infinite Loop", secondary: "Cupertino, CA 95014, USA" },
  { main: "30 Hudson Yards", secondary: "New York, NY 10001, USA" },
  { main: "233 S Wacker Dr", secondary: "Chicago, IL 60606, USA" },
  { main: "4 Privet Drive", secondary: "Little Whinging, Surrey, UK" },
  { main: "1313 Disneyland Dr", secondary: "Anaheim, CA 92802, USA" },
  { main: "11 Wall Street", secondary: "New York, NY 10005, USA" },
  { main: "1 World Trade Center", secondary: "New York, NY 10007, USA" },
  { main: "500 Terry A Francois Blvd", secondary: "San Francisco, CA 94158, USA" },
  { main: "2300 Traverwood Dr", secondary: "Ann Arbor, MI 48105, USA" },
  { main: "8 Rue du Faubourg", secondary: "75008 Paris, France" },
  { main: "Marienplatz 1", secondary: "80331 Munich, Germany" },
  { main: "1 Harbourside Crescent", secondary: "Sydney, NSW 2000, Australia" },
  { main: "Via Roma 28", secondary: "00184 Rome, Italy" },
  { main: "Rua Augusta 274", secondary: "S\u00e3o Paulo, SP 01305-000, Brazil" },
  { main: "100 Universal City Plaza", secondary: "Universal City, CA 91608, USA" },
];

const AVATAR_COLORS = [
  "#0A77FF", "#7C3AED", "#059669", "#DC2626", "#D97706",
  "#0891B2", "#4F46E5", "#BE185D", "#65A30D", "#EA580C",
];

const POC_PER_PAGE = 20;

export function CreatePartnerLocationModal({
  open,
  onOpenChange,
  onLocationCreated,
  vendorName,
}: CreatePartnerLocationModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  // Location Info
  const [locationName, setLocationName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [description, setDescription] = useState("");

  // Address (single-line Google Maps style)
  const [address, setAddress] = useState("");
  const [addressFocused, setAddressFocused] = useState(false);
  const [addressSelected, setAddressSelected] = useState(false);
  const addressRef = useRef<HTMLDivElement>(null);

  // Profile image
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const [profileDragOver, setProfileDragOver] = useState(false);

  // Phone country picker
  const [countryPickerOpen, setCountryPickerOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // Point of Contact (vendor config pattern)
  const [showSelectPocModal, setShowSelectPocModal] = useState(false);
  const [showCreatePocModal, setShowCreatePocModal] = useState(false);
  const [contactDictionary, setContactDictionary] = useState<ContactPerson[]>([...CONTACT_DICTIONARY]);
  const [pocSearch, setPocSearch] = useState("");
  const [pocCategoryFilter, setPocCategoryFilter] = useState<"all" | "Sales" | "Supply Chain Management" | "Finance">("all");
  const [pocPage, setPocPage] = useState(1);
  const [pocTempSelected, setPocTempSelected] = useState<Set<string>>(new Set());
  const [selectedPocIds, setSelectedPocIds] = useState<Set<string>>(new Set());

  // Create new POC form
  const [newPocName, setNewPocName] = useState("");
  const [newPocDepartment, setNewPocDepartment] = useState<"Sales" | "Supply Chain Management" | "Finance">("Sales");
  const [newPocRole, setNewPocRole] = useState("");
  const [newPocLandline, setNewPocLandline] = useState("");
  const [newPocLandlineCode, setNewPocLandlineCode] = useState("+1");
  const [newPocExt, setNewPocExt] = useState("");
  const [newPocMobile, setNewPocMobile] = useState("");
  const [newPocMobileCode, setNewPocMobileCode] = useState("+1");
  const [newPocEmail, setNewPocEmail] = useState("");
  const [saveAndCreateAnother, setSaveAndCreateAnother] = useState(false);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusConfig = {
    Active: { color: "#10B981", bg: "#ECFDF5", label: "Active" },
    Inactive: { color: "#EF4444", bg: "#FEF2F2", label: "Inactive" },
  } as const;

  const filteredPhoneCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRY_CODES;
    const q = countrySearch.toLowerCase();
    return COUNTRY_CODES.filter(
      (c) => c.country.toLowerCase().includes(q) || c.code.includes(q)
    );
  }, [countrySearch]);

  const selectedPhoneCountry = useMemo(() => {
    return COUNTRY_CODES.find((c) => c.code === phoneCountryCode) || COUNTRY_CODES[0];
  }, [phoneCountryCode]);

  // Address suggestions (Google Maps style mock)
  const addressSuggestions = useMemo(() => {
    if (!address.trim() || address.length < 2 || addressSelected) return [];
    const q = address.toLowerCase();
    return MOCK_ADDRESS_SUGGESTIONS.filter(
      (s) => s.main.toLowerCase().includes(q) || s.secondary.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [address, addressSelected]);

  // Close address dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (addressRef.current && !addressRef.current.contains(e.target as Node)) {
        setAddressFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (e) => setProfileImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  // POC logic
  const pocDepartmentCounts = useMemo(() => {
    const counts: Record<string, number> = { Sales: 0, "Supply Chain Management": 0, Finance: 0 };
    contactDictionary.forEach((c) => { counts[c.department] = (counts[c.department] || 0) + 1; });
    return counts;
  }, [contactDictionary]);

  const filteredPocContacts = useMemo(() => {
    let list = contactDictionary;
    if (pocCategoryFilter !== "all") {
      list = list.filter((c) => c.department === pocCategoryFilter);
    }
    if (pocSearch.trim()) {
      const q = pocSearch.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
      );
    }
    return list;
  }, [pocCategoryFilter, pocSearch, contactDictionary]);

  const pocTotalPages = Math.max(1, Math.ceil(filteredPocContacts.length / POC_PER_PAGE));
  const pocPagedContacts = filteredPocContacts.slice((pocPage - 1) * POC_PER_PAGE, pocPage * POC_PER_PAGE);

  const selectedPocContacts = useMemo(() => {
    return contactDictionary.filter((c) => selectedPocIds.has(c.id));
  }, [selectedPocIds, contactDictionary]);

  function handleOpenSelectPoc() {
    setPocTempSelected(new Set(selectedPocIds));
    setPocSearch("");
    setPocCategoryFilter("all");
    setPocPage(1);
    setShowSelectPocModal(true);
  }

  function handleConfirmPocSelection() {
    setSelectedPocIds(new Set(pocTempSelected));
    setShowSelectPocModal(false);
    toast.success(`${pocTempSelected.size} point of contact${pocTempSelected.size !== 1 ? "s" : ""} selected`);
  }

  function handleTogglePocTemp(id: string) {
    setPocTempSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleRemovePoc(id: string) {
    setSelectedPocIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function resetNewPocForm() {
    setNewPocName("");
    setNewPocDepartment("");
    setNewPocRole("");
    setNewPocLandline("");
    setNewPocLandlineCode("+1");
    setNewPocExt("");
    setNewPocMobile("");
    setNewPocMobileCode("+1");
    setNewPocEmail("");
  }

  function handleOpenCreatePoc() {
    resetNewPocForm();
    setSaveAndCreateAnother(false);
    setShowCreatePocModal(true);
  }

  function handleSaveNewPoc() {
    if (!newPocName.trim()) {
      toast.error("Name is required");
      return;
    }
    const newId = `C-NEW-${Date.now()}`;
    const avatarColor = AVATAR_COLORS[contactDictionary.length % AVATAR_COLORS.length];
    const newContact: ContactPerson = {
      id: newId,
      name: newPocName.trim(),
      company: vendorName || "New Partner",
      department: newPocDepartment,
      phone: newPocLandline ? `${newPocLandlineCode} ${newPocLandline}` : "",
      phoneExt: newPocExt,
      secondaryPhone: newPocMobile ? `${newPocMobileCode} ${newPocMobile}` : "",
      secondaryPhoneExt: "",
      email: newPocEmail,
      avatarColor,
    };
    setContactDictionary((prev) => [newContact, ...prev]);
    setPocTempSelected((prev) => {
      const next = new Set(prev);
      next.add(newId);
      return next;
    });
    toast.success(`"${newContact.name}" added to Contact Directory`);
    if (saveAndCreateAnother) {
      resetNewPocForm();
    } else {
      setShowCreatePocModal(false);
    }
  }

  const handleDiscard = useCallback(() => {
    setIsFullScreen(false);
    setShowCancelConfirmation(false);
    setLocationName("");
    setPhone("");
    setPhoneCountryCode("+1");
    setEmail("");
    setStatus("Active");
    setDescription("");
    setAddress("");
    setAddressFocused(false);
    setAddressSelected(false);
    setProfileImage(null);
    setSelectedPocIds(new Set());
    setContactSearch("");
    setCountrySearch("");
    setCountryPickerOpen(false);
    setErrors({});
    onOpenChange(false);
  }, [onOpenChange]);

  // Alias for backward compat
  const [contactSearch, setContactSearch] = useState("");

  const hasAnyProgress = useMemo(() => {
    return (
      locationName.trim().length > 0 ||
      phone.trim().length > 0 ||
      email.trim().length > 0 ||
      address.length > 0 ||
      description.length > 0 ||
      selectedPocIds.size > 0
    );
  }, [locationName, phone, email, address, description, selectedPocIds]);

  const handleCancelAttempt = useCallback(() => {
    if (!hasAnyProgress) {
      handleDiscard();
      return;
    }
    setShowCancelConfirmation(true);
  }, [hasAnyProgress, handleDiscard]);

  const handleConfirmCancel = useCallback(() => {
    setShowCancelConfirmation(false);
    handleDiscard();
  }, [handleDiscard]);

  const handleOpenChange = useCallback(
    (val: boolean) => {
      if (!val) {
        if (!hasAnyProgress) {
          handleDiscard();
        } else {
          setShowCancelConfirmation(true);
        }
      } else {
        onOpenChange(val);
      }
    },
    [onOpenChange, hasAnyProgress, handleDiscard]
  );

  const handleSave = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!locationName.trim()) newErrors.locationName = "Location name is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = {
      locationName: locationName.trim(),
      phone: phone ? `${phoneCountryCode} ${phone}` : "",
      email,
      address,
      status,
      description,
      contacts: Array.from(selectedPocIds),
      profileImage: profileImage || "",
    };

    if (onLocationCreated) {
      onLocationCreated(data);
    }

    toast.success("Partner location created successfully");
    handleDiscard();
  }, [locationName, phone, phoneCountryCode, email, address, status, description, selectedPocIds, profileImage, onLocationCreated, handleDiscard]);

  const modalBaseClass =
    "!fixed !inset-0 !translate-x-0 !translate-y-0 !m-auto !w-full !h-full transition-[max-width,max-height,border-radius] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]";

  const modalSizeClass = isFullScreen
    ? `${modalBaseClass} !max-w-[calc(100%-1rem)] sm:!max-w-[calc(100%-1.5rem)] lg:!max-w-[calc(100%-2rem)] !max-h-[calc(100%-1rem)] sm:!max-h-[calc(100%-1.5rem)] lg:!max-h-[calc(100%-2rem)] !rounded-2xl`
    : `${modalBaseClass} !max-w-[100%] sm:!max-w-[960px] lg:!max-w-[1040px] !max-h-[100dvh] sm:!max-h-[88vh] rounded-none sm:!rounded-2xl`;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className={`flex flex-col p-0 gap-0 border-0 sm:border ${modalSizeClass}`}
          hideCloseButton
          style={{
            boxShadow:
              "0 24px 48px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          <DialogTitle className="sr-only">Create New Partner Location</DialogTitle>
          <DialogDescription className="sr-only">
            Configure the details for the new partner location.
          </DialogDescription>

          {/* Header */}
          <div className="px-3 sm:px-4 lg:px-5 pt-3 sm:pt-4 pb-2.5 sm:pb-3 shrink-0 bg-white rounded-t-none sm:rounded-t-2xl border-b border-[#EEF2F6]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2
                  className="text-[15px] sm:text-[17px] text-[#0F172A]"
                  style={{ fontWeight: 700 }}
                >
                  Create New Partner Location
                </h2>
                <p
                  className="text-[11px] sm:text-xs text-[#64748B] mt-0.5"
                  style={{ fontWeight: 400 }}
                >
                  {vendorName
                    ? `Add a new location for ${vendorName}.`
                    : "Configure the details and address for the new location."}
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#475569] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all cursor-pointer"
                  style={{ fontWeight: 500 }}
                >
                  {isFullScreen ? (
                    <Minimize2 className="w-3.5 h-3.5" />
                  ) : (
                    <Maximize2 className="w-3.5 h-3.5" />
                  )}
                  {isFullScreen ? "Exit full" : "Full view"}
                </button>
                <button
                  onClick={handleCancelAttempt}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-all cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 min-h-0 overflow-y-auto bg-[#FAFBFC] scrollbar-hide">
            <div className="px-4 py-4 transition-all duration-300 ease-out space-y-3 sm:space-y-4">

              {/* ── Location Details Card ── */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[#EEF2F6] flex items-center gap-2 bg-[#FAFBFC]">
                  <div className="w-6 h-6 rounded-md bg-[#0A77FF]/8 flex items-center justify-center shrink-0">
                    <Info className="w-3.5 h-3.5 text-[#0A77FF]" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-[13px] text-[#0F172A]" style={{ fontWeight: 600 }}>Location Details</span>
                    <span className="text-[9px] sm:text-[10px] text-[#94A3B8] tracking-wider uppercase hidden min-[480px]:inline" style={{ fontWeight: 500 }}>Required</span>
                  </div>
                </div>
                <div className="px-2.5 sm:px-3 pt-2 sm:pt-2.5 pb-1.5 sm:pb-2">

                  {/* Mobile: Compact profile photo row */}
                  <div className="flex sm:hidden items-center gap-3 mb-3">
                    <input
                      ref={profileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProfileFile(file);
                        e.target.value = "";
                      }}
                    />
                    <div
                      onClick={() => profileInputRef.current?.click()}
                      className={`relative w-14 h-14 rounded-xl cursor-pointer shrink-0 transition-all ${
                        profileImage
                          ? "ring-2 ring-[#E2E8F0]"
                          : "border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC]"
                      }`}
                    >
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full rounded-xl object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-5 h-5 text-[#94A3B8]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#0F172A]" style={{ fontWeight: 500 }}>
                        {profileImage ? "Location photo" : "Add a photo"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <button
                          type="button"
                          onClick={() => profileInputRef.current?.click()}
                          className="text-[11px] text-[#0A77FF]"
                          style={{ fontWeight: 500 }}
                        >
                          {profileImage ? "Change" : "Upload"}
                        </button>
                        {profileImage && (
                          <>
                            <span className="text-[#E2E8F0] text-[11px]">&middot;</span>
                            <button
                              type="button"
                              onClick={() => setProfileImage(null)}
                              className="text-[11px] text-[#EF4444]"
                              style={{ fontWeight: 500 }}
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Photo on left, all fields in 2-col grid on right */}
                  <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 sm:gap-4">
                    {/* Left — Profile Picture Upload — desktop only */}
                    <div className="hidden sm:flex flex-col items-center w-[120px]">
                      <input
                        ref={profileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleProfileFile(file);
                          e.target.value = "";
                        }}
                      />
                      <div
                        onClick={() => profileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setProfileDragOver(true); }}
                        onDragLeave={() => setProfileDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setProfileDragOver(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleProfileFile(file);
                        }}
                        className={`relative w-full aspect-square rounded-xl cursor-pointer group transition-all ${
                          profileImage
                            ? "ring-2 ring-[#E2E8F0] hover:ring-[#0A77FF]/30"
                            : profileDragOver
                            ? "border-2 border-dashed border-[#0A77FF] bg-[#EDF4FF]"
                            : "border-2 border-dashed border-[#CBD5E1] hover:border-[#0A77FF]/50 bg-[#F8FAFC] hover:bg-[#EDF4FF]/50"
                        }`}
                      >
                        {profileImage ? (
                          <>
                            <img
                              src={profileImage}
                              alt="Location"
                              className="w-full h-full rounded-xl object-cover"
                            />
                            <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                              <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                            <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] group-hover:bg-[#EDF4FF] flex items-center justify-center transition-colors">
                              <Camera className="w-5 h-5 text-[#94A3B8] group-hover:text-[#0A77FF] transition-colors" />
                            </div>
                            <span className="text-[11px] text-[#94A3B8] group-hover:text-[#0A77FF] transition-colors" style={{ fontWeight: 500 }}>Upload photo</span>
                            <span className="text-[9px] text-[#CBD5E1]">Max 5 MB</span>
                          </div>
                        )}
                      </div>
                      {profileImage && (
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => profileInputRef.current?.click()}
                            className="text-[11px] text-[#0A77FF] hover:text-[#0862D0] transition-colors cursor-pointer"
                            style={{ fontWeight: 500 }}
                          >
                            Change
                          </button>
                          <span className="text-[#E2E8F0] text-[11px]">&middot;</span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setProfileImage(null); }}
                            className="text-[11px] text-[#EF4444] hover:text-[#DC2626] transition-colors cursor-pointer"
                            style={{ fontWeight: 500 }}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Right — all fields in a 2-column grid */}
                    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-2.5 sm:gap-y-3">
                      {/* Row 1 Left: Location Name */}
                      <div>
                        <Label htmlFor="loc-name" className="text-xs sm:text-[13px] text-[#0F172A]" style={{ fontWeight: 500 }}>
                          Location Name<span className="text-[#EF4444]">*</span>
                        </Label>
                        <Input
                          id="loc-name"
                          placeholder="e.g. Toyota TTC"
                          value={locationName}
                          onChange={(e) => {
                            setLocationName(e.target.value);
                            if (errors.locationName) setErrors((p) => ({ ...p, locationName: "" }));
                          }}
                          className="mt-1 rounded-lg border-[#E2E8F0] bg-white !h-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20"
                        />
                        {errors.locationName && (
                          <p className="text-[#EF4444] text-xs mt-1">{errors.locationName}</p>
                        )}
                      </div>

                      {/* Row 1 Right: Status */}
                      <div>
                        <Label className="text-xs sm:text-[13px] text-[#0F172A]" style={{ fontWeight: 500 }}>Status</Label>
                        <Select value={status} onValueChange={(val: string) => setStatus(val as "Active" | "Inactive")}>
                          <SelectTrigger className="mt-1 !h-10 rounded-lg border-[#E2E8F0] bg-white text-sm hover:border-[#CBD5E1] transition-colors focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20 [&>svg]:text-[#94A3B8]">
                            <SelectValue>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusConfig[status].color }} />
                                <span className="text-[#0F172A]">{statusConfig[status].label}</span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="z-[250] rounded-lg">
                            <SelectItem value="Active">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                                Active
                              </div>
                            </SelectItem>
                            <SelectItem value="Inactive">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                                Inactive
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Row 2 Left: Phone Number */}
                      <div>
                        <Label htmlFor="loc-phone" className="text-xs sm:text-[13px] text-[#0F172A]" style={{ fontWeight: 500 }}>
                          Phone Number
                        </Label>
                        <div className="flex items-center gap-0 mt-1">
                          <Popover open={countryPickerOpen} onOpenChange={setCountryPickerOpen}>
                            <PopoverTrigger asChild>
                              <button
                                type="button"
                                className="flex items-center gap-1.5 pl-2.5 pr-1.5 !h-10 rounded-l-lg border border-r-0 border-[#E2E8F0] bg-white text-sm shrink-0 cursor-pointer hover:border-[#CBD5E1] transition-colors focus:outline-none focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20"
                              >
                                <span className="text-base leading-none">{selectedPhoneCountry.flag}</span>
                                <span className="text-xs text-[#334155]" style={{ fontWeight: 600 }}>
                                  {phoneCountryCode}
                                </span>
                                <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-64 p-0 z-[200] rounded-xl shadow-lg border border-[#E2E8F0]"
                              align="start"
                              sideOffset={4}
                            >
                              <div className="p-2 border-b border-[#F1F5F9]">
                                <div className="relative">
                                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                                  <input
                                    type="text"
                                    placeholder="Search country..."
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20"
                                  />
                                </div>
                              </div>
                              <div className="max-h-[200px] overflow-y-auto p-1">
                                {filteredPhoneCountries.map((c, i) => (
                                  <button
                                    key={`${c.code}-${c.country}-${i}`}
                                    type="button"
                                    onClick={() => {
                                      setPhoneCountryCode(c.code);
                                      setCountryPickerOpen(false);
                                      setCountrySearch("");
                                    }}
                                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${
                                      phoneCountryCode === c.code && selectedPhoneCountry.country === c.country
                                        ? "bg-[#EDF4FF] text-[#0A77FF]"
                                        : "hover:bg-[#F8FAFC] text-[#334155]"
                                    }`}
                                  >
                                    <span className="text-base">{c.flag}</span>
                                    <span className="text-sm flex-1 truncate" style={{ fontWeight: 500 }}>
                                      {c.country}
                                    </span>
                                    <span className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>
                                      {c.code}
                                    </span>
                                    {phoneCountryCode === c.code && selectedPhoneCountry.country === c.country && (
                                      <Check className="w-3.5 h-3.5 text-[#0A77FF] shrink-0" />
                                    )}
                                  </button>
                                ))}
                                {filteredPhoneCountries.length === 0 && (
                                  <p className="text-xs text-[#94A3B8] text-center py-4">No countries found</p>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                          <Input
                            id="loc-phone"
                            placeholder="(555) 123-4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="rounded-l-none rounded-r-lg border-[#E2E8F0] bg-white !h-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20"
                          />
                        </div>
                      </div>

                      {/* Row 2 Right: Email */}
                      <div>
                        <Label htmlFor="loc-email" className="text-xs sm:text-[13px] text-[#0F172A]" style={{ fontWeight: 500 }}>
                          Email
                        </Label>
                        <Input
                          id="loc-email"
                          type="email"
                          placeholder="support@toyota.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 rounded-lg border-[#E2E8F0] bg-white !h-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20"
                        />
                      </div>

                      {/* Row 3 Left: Address (Google Maps style single-line) */}
                      <div ref={addressRef} className="relative">
                        <Label htmlFor="loc-address" className="text-xs sm:text-[13px] text-[#0F172A]" style={{ fontWeight: 500 }}>
                          Address
                        </Label>
                        <div className="relative mt-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8] pointer-events-none z-[1]" />
                          <Input
                            id="loc-address"
                            placeholder="Search for an address..."
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);
                              setAddressSelected(false);
                            }}
                            onFocus={() => {
                              setAddressFocused(true);
                              if (addressSelected) setAddressSelected(false);
                            }}
                            className={`pl-9 pr-8 rounded-lg border-[#E2E8F0] bg-white !h-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20 ${
                              addressFocused && addressSuggestions.length > 0 ? "rounded-b-none border-b-transparent" : ""
                            }`}
                          />
                          {address.length > 0 && (
                            <button
                              type="button"
                              onClick={() => { setAddress(""); setAddressFocused(true); setAddressSelected(false); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors z-[1]"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Google Places-style suggestions dropdown */}
                        {addressFocused && addressSuggestions.length > 0 && (
                          <div className="absolute left-0 right-0 top-[calc(100%)] z-50 rounded-b-lg border border-t-0 border-[#0A77FF] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden ring-1 ring-[#0A77FF]/20">
                            {addressSuggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setAddress(`${suggestion.main}, ${suggestion.secondary}`);
                                  setAddressFocused(false);
                                  setAddressSelected(true);
                                }}
                                className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer border-b border-[#F1F5F9] last:border-b-0 group/addr"
                              >
                                <div className="w-8 h-8 rounded-full bg-[#F1F5F9] group-hover/addr:bg-[#EDF4FF] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                                  <MapPin className="w-3.5 h-3.5 text-[#64748B] group-hover/addr:text-[#0A77FF] transition-colors" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 500 }}>{suggestion.main}</div>
                                  <div className="text-[11px] text-[#94A3B8] truncate mt-0.5">{suggestion.secondary}</div>
                                </div>
                              </button>
                            ))}
                            <div className="px-3 py-2 flex justify-end border-t border-[#E2E8F0] bg-[#FAFBFC]">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-[#9CA3AF]">Powered by</span>
                                <svg width="52" height="16" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
                                  <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
                                  <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
                                  <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                                  <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
                                  <path d="M35.29 41.19V32H67.6c.32 1.68.48 3.67.48 5.83 0 7.23-1.97 16.17-8.32 22.51C53.65 66.67 46.01 70 35.29 70 15.82 70 0 54.73 0 35.26S15.82.52 35.29.52c10.8 0 18.52 4.25 24.27 9.74l-6.82 6.82c-4.1-3.86-9.66-6.82-17.45-6.82C22.47 10.27 10.11 23.02 10.11 35.27c0 12.25 12.36 25 25.18 25 9.19 0 14.4-3.69 17.72-7.02 2.7-2.7 4.46-6.56 5.15-11.84H35.29z" fill="#4285F4"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Row 3 Right: Description */}
                      <div className="relative">
                        <Label className="text-xs sm:text-[13px] text-[#0F172A]" style={{ fontWeight: 500 }}>Description</Label>
                        <textarea
                          placeholder="Brief summary of this location."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="mt-1 w-full h-[64px] sm:h-[72px] rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 pb-5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20 focus:outline-none resize-none transition-colors"
                        />
                        <p className="absolute bottom-1.5 right-2.5 text-[11px] text-[#94A3B8] pointer-events-none">{description.length}/500</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Point of Contact Section ── */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#0A77FF]/8 flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5 text-[#0A77FF]" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-[13px] text-[#0F172A] block" style={{ fontWeight: 600 }}>Point of Contact</span>
                    <span className="text-[10px] sm:text-[11px] text-[#94A3B8] block mt-px">Assign contacts for orders and inquiries at this location</span>
                  </div>
                </div>
                {selectedPocContacts.length > 0 ? (
                  <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden relative">
                    <PocPillsRow contacts={selectedPocContacts} onManage={handleOpenSelectPoc} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Select from Contact Directory */}
                    <button
                      onClick={handleOpenSelectPoc}
                      className="group relative rounded-xl overflow-hidden border border-[#E2E8F0] bg-white text-left transition-all duration-200 hover:border-[#BFDBFE] hover:shadow-[0_4px_16px_-4px_rgba(10,119,255,0.12)] cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#EDF4FF]/0 to-[#EDF4FF]/0 group-hover:from-[#EDF4FF]/60 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
                      <div className="relative flex items-center gap-3 pl-3.5 pr-3 py-3">
                        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#EDF4FF] to-[#DBEAFE] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                          <Users className="w-[18px] h-[18px] text-[#0A77FF]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-[#0F172A]" style={{ fontWeight: 600 }}>Select from Contact Directory</p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">Browse and pick from saved contacts</p>
                        </div>
                      </div>
                    </button>
                    {/* Create new contact */}
                    <button
                      onClick={handleOpenCreatePoc}
                      className="group relative rounded-xl overflow-hidden border border-[#E2E8F0] bg-white text-left transition-all duration-200 hover:border-[#D5D3EC] hover:shadow-[0_4px_16px_-4px_rgba(124,58,237,0.10)] cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F3FF]/0 to-[#F5F3FF]/0 group-hover:from-[#F5F3FF]/60 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
                      <div className="relative flex items-center gap-3 pl-3.5 pr-3 py-3">
                        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                          <UserPlus className="w-[18px] h-[18px] text-[#7C3AED]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-[#0F172A]" style={{ fontWeight: 600 }}>Create new contact</p>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5 truncate">Add a new point of contact directly</p>
                        </div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-[#EEF2F6] bg-white px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 flex items-center justify-end gap-2 sm:gap-2.5 sm:rounded-b-2xl">
            <Button
              variant="outline"
              onClick={handleCancelAttempt}
              className="border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] rounded-lg px-3 sm:px-5 text-xs sm:text-[13px] h-8 sm:h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="gap-1.5 rounded-lg px-3 sm:px-5 text-xs sm:text-[13px] h-8 sm:h-9 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create Location</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Select Point of Contact Modal ── */}
      <SelectPocDictionaryModal
        open={showSelectPocModal}
        onOpenChange={setShowSelectPocModal}
        contactDictionary={contactDictionary}
        pocSearch={pocSearch}
        onPocSearchChange={(v) => { setPocSearch(v); setPocPage(1); }}
        pocCategoryFilter={pocCategoryFilter}
        onPocCategoryFilterChange={(v) => { setPocCategoryFilter(v); setPocPage(1); }}
        pocDepartmentCounts={pocDepartmentCounts}
        pocPagedContacts={pocPagedContacts}
        pocPage={pocPage}
        pocTotalPages={pocTotalPages}
        onPocPageChange={setPocPage}
        pocTempSelected={pocTempSelected}
        onTogglePocTemp={handleTogglePocTemp}
        onConfirm={handleConfirmPocSelection}
        onOpenCreatePoc={handleOpenCreatePoc}
        contextLabel="this location"
      />

      {/* ── Create New Point of Contact Modal ── */}
      <CreatePocModal
        open={showCreatePocModal}
        onOpenChange={setShowCreatePocModal}
        contextName={vendorName}
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
        onSave={handleSaveNewPoc}
      />

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirmation} onOpenChange={setShowCancelConfirmation}>
        <AlertDialogContent
          className="sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-2xl border-0 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.25)]"
          style={{ zIndex: 220 }}
          onInteractOutside={() => setShowCancelConfirmation(false)}
        >
          <div
            className="relative flex flex-col items-center pt-10 pb-6"
            style={{
              background:
                "linear-gradient(180deg, #FEF2F2 0%, rgba(254,242,242,0.3) 70%, transparent 100%)",
            }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[180px] h-[80px] rounded-full blur-[50px] opacity-25"
              style={{ backgroundColor: "#EF4444" }}
            />
            <div
              className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "#FEE2E2" }}
            >
              <AlertTriangle className="w-8 h-8" style={{ color: "#DC2626" }} />
            </div>
            <span
              className="mt-4 px-3 py-1 rounded-full text-[11px]"
              style={{
                fontWeight: 600,
                backgroundColor: "#FEF2F2",
                color: "#991B1B",
                textTransform: "uppercase" as const,
                letterSpacing: "0.05em",
              }}
            >
              Discard
            </span>
          </div>
          <div className="flex flex-col items-center text-center px-8 pb-8">
            <AlertDialogHeader className="p-0 gap-0 text-center">
              <AlertDialogTitle
                className="text-[18px] tracking-[-0.02em]"
                style={{ fontWeight: 600, color: "#0F172A" }}
              >
                Discard location creation?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription
              className="text-[13px] mt-2 max-w-[300px] mx-auto"
              style={{ color: "#475569", lineHeight: "1.65" }}
            >
              All the information you've entered will be lost. This action cannot be undone.
            </AlertDialogDescription>
            <div className="w-full mt-7 flex flex-col gap-2.5">
              <button
                onClick={handleConfirmCancel}
                className="w-full h-11 text-[14px] rounded-xl border-0 cursor-pointer transition-colors hover:opacity-90"
                style={{ fontWeight: 600, backgroundColor: "#DC2626", color: "#fff" }}
              >
                Discard changes
              </button>
              <button
                onClick={() => setShowCancelConfirmation(false)}
                className="w-full h-11 text-[14px] rounded-xl border-0 cursor-pointer transition-colors"
                style={{ fontWeight: 500, backgroundColor: "#F1F5F9", color: "#334155" }}
              >
                Continue editing
              </button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}