import React, { useState, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import {
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  MapPin,
  X,
  Building2,
  Truck,
} from "lucide-react";
import {
  type PartnerLocationItem,
  type PaymentMethodType,
  type PaymentMethodEntry,
  FUNDED_BY_ITEMS,
  CURRENCY_OPTIONS,
} from "./partnerConstants";

// ── Reusable pill-style option button ──
export function PillOption({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm transition-all ${
        isSelected
          ? "border-[#0A77FF] bg-[#EDF4FF] text-[#0A77FF]"
          : "border-[#E2E8F0] bg-white text-[#334155] hover:border-[#CBD5E1]"
      }`}
      style={{ fontWeight: isSelected ? 600 : 500 }}
    >
      {label}
    </button>
  );
}

// ── Reusable: radio option card ──
export function RadioOption({ label, description, isSelected, onClick }: { label: string; description?: string; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all ${
        isSelected
          ? "border-[#0A77FF] bg-[#EDF4FF]/30"
          : "border-[#E2E8F0] hover:border-[#CBD5E1]"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
          isSelected ? "border-[#0A77FF]" : "border-[#CBD5E1]"
        }`}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-[#0A77FF]" />}
        </div>
        <div>
          <p className="text-xs text-[#0F172A]" style={{ fontWeight: 600 }}>{label}</p>
          {description && <p className="text-[11px] text-[#94A3B8] mt-0.5">{description}</p>}
        </div>
      </div>
    </button>
  );
}

// ── Reusable: icon card option (like Purchased / Manufactured) ──
export function IconCardOption({ label, icon, isSelected, onClick }: { label: string; icon: React.ReactNode; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border-2 transition-all min-w-[100px] ${
        isSelected
          ? "border-[#0A77FF] bg-[#EDF4FF]/40 text-[#0A77FF]"
          : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]"
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        isSelected ? "bg-[#D6E8FF]" : "bg-[#F1F5F9]"
      }`}>
        {icon}
      </div>
      <span className="text-sm" style={{ fontWeight: 600 }}>{label}</span>
    </button>
  );
}

// ── Searchable partner/location dropdown ──
export function SearchablePartnerDropdown({
  label,
  tooltip,
  placeholder,
  items,
  selectedId,
  onSelect,
  showDefaultBadge,
  disabled,
  hideLabel,
}: {
  label: string;
  tooltip: string;
  placeholder: string;
  items: PartnerLocationItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  showDefaultBadge?: boolean;
  disabled?: boolean;
  hideLabel?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "partners" | "locations">("all");

  const selectedItem = items.find((i) => i.id === selectedId) || null;

  const filtered = useMemo(() => {
    let list = items;
    if (filterTab === "partners") list = list.filter((i) => i.type === "partner");
    if (filterTab === "locations") list = list.filter((i) => i.type === "location");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q));
    }
    return list;
  }, [items, filterTab, search]);

  return (
    <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
      {!hideLabel && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs text-[#0F172A]" style={{ fontWeight: 600 }}>{label}</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="inline-flex" tabIndex={-1}>
                <Info className="w-3.5 h-3.5 text-[#94A3B8] cursor-help" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6} className="bg-[#1E293B] text-white text-[12px] leading-[1.5] rounded-lg max-w-[260px] px-3 py-2.5 shadow-lg z-[300]">
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      <Popover open={disabled ? false : open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <button
            disabled={disabled}
            className={`w-full h-10 px-3 rounded-lg border flex items-center justify-between text-sm transition-colors ${
              disabled
                ? "bg-[#F8FAFC] border-[#E2E8F0] cursor-not-allowed"
                : open
                  ? "bg-white border-[#0A77FF] ring-2 ring-[#0A77FF]/10"
                  : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1]"
            }`}
          >
            {selectedItem ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] shrink-0"
                  style={{ backgroundColor: selectedItem.logoColor, fontWeight: 700 }}
                >
                  {selectedItem.logoText}
                </div>
                <span className="text-[#0F172A] truncate" style={{ fontWeight: 500 }}>{selectedItem.name}</span>
                {selectedItem.location && (
                  <span className="text-[11px] text-[#64748B] truncate hidden sm:inline">{selectedItem.location}</span>
                )}
                {showDefaultBadge && selectedItem.isDefault && (
                  <span className="text-[10px] text-[#0A77FF] bg-[#EDF4FF] border border-[#0A77FF]/20 px-1.5 py-0.5 rounded shrink-0" style={{ fontWeight: 600 }}>Default</span>
                )}
              </div>
            ) : (
              <span className="text-[#94A3B8]">{placeholder}</span>
            )}
            {open ? (
              <ChevronUp className="w-4 h-4 text-[#94A3B8] shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl border border-[#E2E8F0] shadow-lg z-[200]"
          align="start"
          sideOffset={4}
        >
          {/* Filter tabs */}
          <div className="px-3 pt-3 pb-2 flex items-center gap-1.5">
            {(["all", "partners", "locations"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  filterTab === tab
                    ? "border border-[#0A77FF] text-[#0A77FF] bg-white"
                    : "border border-[#E2E8F0] text-[#334155] bg-white hover:bg-[#F8FAFC]"
                }`}
                style={{ fontWeight: filterTab === tab ? 600 : 500 }}
              >
                {tab === "all" ? "All" : tab === "partners" ? "Partners" : "Partner Locations"}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search delivery location..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0A77FF] focus:ring-2 focus:ring-[#0A77FF]/10"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-[240px] overflow-y-auto border-t border-[#F1F5F9]">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#94A3B8]">No results found</div>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F8FAFC] ${
                    selectedId === item.id ? "bg-[#EDF4FF]/50" : ""
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] shrink-0"
                    style={{ backgroundColor: item.logoColor, fontWeight: 700 }}
                  >
                    {item.logoText}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm text-[#0F172A] truncate" style={{ fontWeight: 500 }}>{item.name}</span>
                    {item.location && (
                      <span className="flex items-center gap-1 text-[11px] text-[#64748B] truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {item.location}
                      </span>
                    )}
                  </div>
                  {selectedId === item.id && <Check className="w-4 h-4 text-[#0A77FF] ml-auto shrink-0" />}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ── Currency dropdown ──
export function CurrencyDropdown({
  selectedId,
  onSelect,
  hideLabel,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  hideLabel?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = CURRENCY_OPTIONS.find((c) => c.id === selectedId);

  const filtered = useMemo(() => {
    if (!search.trim()) return CURRENCY_OPTIONS;
    const q = search.toLowerCase();
    return CURRENCY_OPTIONS.filter((c) => c.label.toLowerCase().includes(q));
  }, [search]);

  return (
    <div>
      {!hideLabel && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs text-[#0F172A]" style={{ fontWeight: 600 }}>Currency</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="inline-flex" tabIndex={-1}>
                <Info className="w-3.5 h-3.5 text-[#94A3B8] cursor-help" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6} className="bg-[#1E293B] text-white text-[12px] leading-[1.5] rounded-lg max-w-[260px] px-3 py-2.5 shadow-lg z-[300]">
              The currency used for all transactions with this partner. Ensure it matches your billing and funding requirements.
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={`w-full h-10 px-3 rounded-lg border bg-white flex items-center justify-between text-sm transition-colors ${
              open ? "border-[#0A77FF] ring-2 ring-[#0A77FF]/10" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
            }`}
          >
            {selected ? (
              <span className="text-[#0F172A] truncate" style={{ fontWeight: 500 }}>{selected.label}</span>
            ) : (
              <span className="text-[#94A3B8]">Select a currency</span>
            )}
            {open ? (
              <ChevronUp className="w-4 h-4 text-[#94A3B8] shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl border border-[#E2E8F0] shadow-lg z-[200]"
          align="start"
          sideOffset={4}
        >
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0A77FF] focus:ring-2 focus:ring-[#0A77FF]/10"
              />
            </div>
          </div>
          <div className="max-h-[220px] overflow-y-auto border-t border-[#F1F5F9]">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#94A3B8]">No results found</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelect(c.id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#F8FAFC] ${
                    selectedId === c.id ? "bg-[#EDF4FF]/50" : ""
                  }`}
                >
                  <span className="w-7 text-center text-sm text-[#64748B]" style={{ fontWeight: 600 }}>{c.symbol}</span>
                  <span className="text-sm text-[#0F172A] truncate" style={{ fontWeight: 500 }}>{c.label}</span>
                  {selectedId === c.id && <Check className="w-4 h-4 text-[#0A77FF] ml-auto shrink-0" />}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ── Funded By dropdown (simple list, no tabs/search) ──
export function FundedByDropdown({
  selectedId,
  onSelect,
  disabled,
  hideLabel,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
  hideLabel?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const selectedItem = FUNDED_BY_ITEMS.find((i) => i.id === selectedId) || null;

  return (
    <div className={disabled ? "opacity-50 pointer-events-none" : ""}>
      {!hideLabel && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-xs text-[#0F172A]" style={{ fontWeight: 600 }}>Funded By</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" className="inline-flex" tabIndex={-1}>
                <Info className="w-3.5 h-3.5 text-[#94A3B8] cursor-help" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" sideOffset={6} className="bg-[#1E293B] text-white text-[12px] leading-[1.5] rounded-lg max-w-[260px] px-3 py-2.5 shadow-lg z-[300]">
              The organization or entity covering the costs of this transaction. This is usually the buyer or their funding partner.
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      <Popover open={disabled ? false : open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <button
            disabled={disabled}
            className={`w-full h-10 px-3 rounded-lg border flex items-center justify-center text-sm transition-colors ${
              disabled
                ? "bg-[#F8FAFC] border-[#E2E8F0] cursor-not-allowed"
                : open
                  ? "bg-white border-[#0A77FF] ring-2 ring-[#0A77FF]/10"
                  : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1]"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              {selectedItem ? (
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] shrink-0"
                    style={{ backgroundColor: selectedItem.logoColor, fontWeight: 700 }}
                  >
                    {selectedItem.logoText}
                  </div>
                  <span className="text-[#0F172A] truncate" style={{ fontWeight: 500 }}>{selectedItem.name}</span>
                  {selectedItem.isDefault && (
                    <span className="text-[10px] text-[#0A77FF] bg-[#EDF4FF] border border-[#0A77FF]/20 px-1.5 py-0.5 rounded shrink-0" style={{ fontWeight: 600 }}>Default</span>
                  )}
                </div>
              ) : (
                <span className="text-[#94A3B8]">Select funding source</span>
              )}
              {open ? (
                <ChevronUp className="w-4 h-4 text-[#94A3B8] shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
              )}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl border border-[#E2E8F0] shadow-lg z-[200]"
          align="start"
          sideOffset={4}
        >
          <div className="max-h-[280px] overflow-y-auto py-1">
            {FUNDED_BY_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#F8FAFC] ${
                  selectedId === item.id ? "bg-[#EDF4FF]/50" : ""
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] shrink-0"
                  style={{ backgroundColor: item.logoColor, fontWeight: 700 }}
                >
                  {item.logoText}
                </div>
                <span className="text-sm text-[#0F172A] truncate" style={{ fontWeight: 500 }}>{item.name}</span>
                {item.isDefault && (
                  <span className="text-[10px] text-[#0A77FF] bg-[#EDF4FF] border border-[#0A77FF]/20 px-1.5 py-0.5 rounded shrink-0 ml-auto" style={{ fontWeight: 600 }}>Default</span>
                )}
                {selectedId === item.id && !item.isDefault && <Check className="w-4 h-4 text-[#0A77FF] ml-auto shrink-0" />}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function createEmptyPaymentEntry(type: PaymentMethodType): PaymentMethodEntry {
  return {
    id: `pm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    expanded: true,
    isSaved: false,
    isPrimary: false,
    nickname: "",
    bankName: "",
    accountTitle: "",
    accountNumber: "",
    routingNumber: "",
    swiftCode: "",
    accountType: "checking",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    walletProvider: "",
    walletId: "",
    payeeName: "",
    mailingAddress: "",
    recipientName: "",
    collectionPoint: "",
    methodName: "",
    description: "",
    documentLink: "",
    phone: "",
    countryCode: "+1",
    specialInstructions: "",
    applyDiscount: false,
    discountPercent: "",
    additionalCharges: "",
  };
}