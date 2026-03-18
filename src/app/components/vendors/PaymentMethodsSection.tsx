import React, { useState, useMemo } from "react";
import {
  Plus, X, CreditCard, Check, Pencil, Trash2, Star,
  ExternalLink, ChevronDown, Search, CheckCircle2,
} from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import {
  type PaymentMethodType,
  type PaymentTypeCategory,
  type PaymentMethodEntry,
  PAYMENT_TYPE_CARDS,
} from "./partnerConstants";
import { createEmptyPaymentEntry } from "./config-helpers";

const inputCls = "mt-1.5 rounded-lg border-[#E2E8F0] h-10 bg-white text-sm text-[#0F172A] placeholder:text-[#CBD5E1] focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20";

const catColor: Record<string, string> = {
  Bank: "#0A77FF",
  Traditional: "#7C3AED",
  "Card & Digital": "#D97706",
  Other: "#059669",
};
const catBg: Record<string, string> = {
  Bank: "#EDF4FF",
  Traditional: "#F0EBFF",
  "Card & Digital": "#FEF3C7",
  Other: "#ECFDF5",
};

const GROUP_ORDER: { label: string; types: PaymentMethodType[] }[] = [
  { label: "Bank Transfers", types: ["ach", "wire"] },
  { label: "Traditional", types: ["check", "cash"] },
  { label: "Card & Digital", types: ["card", "digital_wallet"] },
  { label: "Other", types: ["echeck", "instant_pay", "other_method"] },
];

const INSTANT_PAY_BRANDS = [
  { id: "zelle", label: "Zelle" },
  { id: "cashapp", label: "Cash App" },
  { id: "venmo", label: "Venmo for Business" },
  { id: "other", label: "Other" },
];

function typeLabel(type: PaymentMethodType) {
  return PAYMENT_TYPE_CARDS.find((t) => t.id === type)?.label || type;
}
function typeIcon(type: PaymentMethodType) {
  return PAYMENT_TYPE_CARDS.find((t) => t.id === type)?.icon || CreditCard;
}
function typeCategory(type: PaymentMethodType): string {
  return PAYMENT_TYPE_CARDS.find((t) => t.id === type)?.category || "Other";
}

function getEntrySummary(e: PaymentMethodEntry): string {
  if (e.nickname) return e.nickname;
  if (e.accountHolderName) return e.accountHolderName;
  if (e.beneficiaryName) return e.beneficiaryName;
  if (e.payeeName) return e.payeeName;
  if (e.cardholderName) return e.cardholderName;
  if (e.walletProvider) return e.walletProvider;
  if (e.instantPayAccountName) return e.instantPayAccountName;
  if (e.contactPersonName) return e.contactPersonName;
  return typeLabel(e.type);
}

function getEntryIdentifier(e: PaymentMethodEntry): string {
  if (e.type === "ach" || e.type === "echeck") {
    if (e.routingNumber) return `Routing: ${e.routingNumber}`;
    if (e.accountNumber) return `••••${e.accountNumber.slice(-4)}`;
  }
  if (e.type === "wire") {
    if (e.swiftCode) return `SWIFT: ${e.swiftCode}`;
    if (e.accountNumber) return `••••${e.accountNumber.slice(-4)}`;
  }
  if (e.type === "card") {
    if (e.cardNumber) return `••••${e.cardNumber.slice(-4)}`;
  }
  if (e.type === "digital_wallet") return e.walletId || "Digital Wallet";
  if (e.type === "check") return e.mailingAddress || "Check";
  if (e.type === "cash") return "Cash";
  if (e.type === "instant_pay") {
    const brand = INSTANT_PAY_BRANDS.find((b) => b.id === e.instantPayBrand);
    return brand ? brand.label : "Instant Pay";
  }
  if (e.type === "other_method") return e.methodDescription?.slice(0, 30) || "Other";
  return typeLabel(e.type);
}

// ── Inline Form Fields per Type ──
function PaymentFormFields({
  e,
  updateEntry,
  payToEntityName,
  payToEntityAddress,
}: {
  e: PaymentMethodEntry;
  updateEntry: (id: string, updates: Partial<PaymentMethodEntry>) => void;
  payToEntityName: string;
  payToEntityAddress: string;
}) {
  // Pre-populate on first render if fields are empty
  React.useEffect(() => {
    const updates: Partial<PaymentMethodEntry> = {};
    if (e.type === "ach" && !e.accountHolderName && payToEntityName) updates.accountHolderName = payToEntityName;
    if (e.type === "ach" && !e.mailingAddress && payToEntityAddress) updates.mailingAddress = payToEntityAddress;
    if (e.type === "wire" && !e.beneficiaryName && payToEntityName) updates.beneficiaryName = payToEntityName;
    if (e.type === "wire" && !e.beneficiaryAddress && payToEntityAddress) updates.beneficiaryAddress = payToEntityAddress;
    if (e.type === "check" && !e.payeeName && payToEntityName) updates.payeeName = payToEntityName;
    if (e.type === "check" && !e.mailingAddress && payToEntityAddress) updates.mailingAddress = payToEntityAddress;
    if (e.type === "card" && !e.cardholderName && payToEntityName) updates.cardholderName = payToEntityName;
    if (e.type === "card" && !e.billingAddress && payToEntityAddress) updates.billingAddress = payToEntityAddress;
    if (e.type === "echeck" && !e.payeeName && payToEntityName) updates.payeeName = payToEntityName;
    if (e.type === "echeck" && !e.mailingAddress && payToEntityAddress) updates.mailingAddress = payToEntityAddress;
    if (e.type === "instant_pay" && !e.instantPayAccountName && payToEntityName) updates.instantPayAccountName = payToEntityName;
    if (Object.keys(updates).length > 0) updateEntry(e.id, updates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (e.type === "cash") {
    return (
      <div className="flex items-center gap-3 py-4 px-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
        <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
        <span className="text-sm text-[#15803D]" style={{ fontWeight: 600 }}>Cash added as a payment method</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ACH Direct Deposit */}
      {e.type === "ach" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Account Holder Name</Label>
            <Input value={e.accountHolderName} onChange={(ev) => updateEntry(e.id, { accountHolderName: ev.target.value })} placeholder="Enter account holder name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Routing Number</Label>
            <Input value={e.routingNumber} onChange={(ev) => updateEntry(e.id, { routingNumber: ev.target.value })} placeholder="e.g. 021000021" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Account Number</Label>
            <Input value={e.accountNumber} onChange={(ev) => updateEntry(e.id, { accountNumber: ev.target.value })} placeholder="Enter account number" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Address</Label>
            <Input value={e.mailingAddress} onChange={(ev) => updateEntry(e.id, { mailingAddress: ev.target.value })} placeholder="Enter address" className={inputCls} />
          </div>
        </>
      )}

      {/* Wire Transfer */}
      {e.type === "wire" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Beneficiary Name</Label>
            <Input value={e.beneficiaryName} onChange={(ev) => updateEntry(e.id, { beneficiaryName: ev.target.value })} placeholder="Enter beneficiary name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Routing Number</Label>
            <Input value={e.routingNumber} onChange={(ev) => updateEntry(e.id, { routingNumber: ev.target.value })} placeholder="e.g. 021000021" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Account Number</Label>
            <Input value={e.accountNumber} onChange={(ev) => updateEntry(e.id, { accountNumber: ev.target.value })} placeholder="Enter account number" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>SWIFT Code</Label>
            <Input value={e.swiftCode} onChange={(ev) => updateEntry(e.id, { swiftCode: ev.target.value })} placeholder="Enter SWIFT code" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Address</Label>
            <Input value={e.beneficiaryAddress} onChange={(ev) => updateEntry(e.id, { beneficiaryAddress: ev.target.value })} placeholder="Enter address" className={inputCls} />
          </div>
        </>
      )}

      {/* Check */}
      {e.type === "check" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Payee Name</Label>
            <Input value={e.payeeName} onChange={(ev) => updateEntry(e.id, { payeeName: ev.target.value })} placeholder="Enter payee name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Mailing Address</Label>
            <Input value={e.mailingAddress} onChange={(ev) => updateEntry(e.id, { mailingAddress: ev.target.value })} placeholder="Enter mailing address (optional)" className={inputCls} />
          </div>
        </>
      )}

      {/* Credit / Debit Card */}
      {e.type === "card" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Cardholder Name</Label>
            <Input value={e.cardholderName} onChange={(ev) => updateEntry(e.id, { cardholderName: ev.target.value })} placeholder="Enter cardholder name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Card Number</Label>
            <Input value={e.cardNumber} onChange={(ev) => updateEntry(e.id, { cardNumber: ev.target.value })} placeholder="Enter card number" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Expiry Date</Label>
              <Input value={e.expiryDate} onChange={(ev) => updateEntry(e.id, { expiryDate: ev.target.value })} placeholder="MM/YY" className={inputCls} />
            </div>
            <div>
              <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>CVV</Label>
              <Input value={e.cvv} onChange={(ev) => updateEntry(e.id, { cvv: ev.target.value })} placeholder="Enter CVV" className={inputCls} />
            </div>
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Billing Address</Label>
            <Input value={e.billingAddress} onChange={(ev) => updateEntry(e.id, { billingAddress: ev.target.value })} placeholder="Enter billing address" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Special Instructions</Label>
            <Input value={e.specialInstructions} onChange={(ev) => updateEntry(e.id, { specialInstructions: ev.target.value })} placeholder="Enter any special instructions or notes..." className={inputCls} />
          </div>
        </>
      )}

      {/* Digital Wallet */}
      {e.type === "digital_wallet" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Wallet Provider</Label>
            <Input value={e.walletProvider} onChange={(ev) => updateEntry(e.id, { walletProvider: ev.target.value })} placeholder="e.g. PayPal, Apple Pay, Google Pay" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Wallet ID / Email</Label>
            <Input value={e.walletId} onChange={(ev) => updateEntry(e.id, { walletId: ev.target.value })} placeholder="Enter wallet ID or email" className={inputCls} />
          </div>
        </>
      )}

      {/* E-Check */}
      {e.type === "echeck" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Payee Name</Label>
            <Input value={e.payeeName} onChange={(ev) => updateEntry(e.id, { payeeName: ev.target.value })} placeholder="Enter payee name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Address</Label>
            <Input value={e.mailingAddress} onChange={(ev) => updateEntry(e.id, { mailingAddress: ev.target.value })} placeholder="Enter address" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Bank Routing Number</Label>
            <Input value={e.routingNumber} onChange={(ev) => updateEntry(e.id, { routingNumber: ev.target.value })} placeholder="e.g. 021000021" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Account Number</Label>
            <Input value={e.accountNumber} onChange={(ev) => updateEntry(e.id, { accountNumber: ev.target.value })} placeholder="Enter account number" className={inputCls} />
          </div>
        </>
      )}

      {/* Instant Pay */}
      {e.type === "instant_pay" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Brand</Label>
            <Select value={e.instantPayBrand} onValueChange={(v) => updateEntry(e.id, { instantPayBrand: v })}>
              <SelectTrigger className={`${inputCls} mt-1.5`}>
                <SelectValue placeholder="Select a brand" />
              </SelectTrigger>
              <SelectContent className="z-[300] rounded-lg">
                {INSTANT_PAY_BRANDS.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Phone Number or Handle</Label>
            <Input value={e.instantPayHandle} onChange={(ev) => updateEntry(e.id, { instantPayHandle: ev.target.value })} placeholder="Enter phone number or handle" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Account Name</Label>
            <Input value={e.instantPayAccountName} onChange={(ev) => updateEntry(e.id, { instantPayAccountName: ev.target.value })} placeholder="Enter account name" className={inputCls} />
          </div>
        </>
      )}

      {/* Other */}
      {e.type === "other_method" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Method Description</Label>
            <Input value={e.methodDescription} onChange={(ev) => updateEntry(e.id, { methodDescription: ev.target.value })} placeholder="Describe the payment method" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Contact Person Name</Label>
            <Input value={e.contactPersonName} onChange={(ev) => updateEntry(e.id, { contactPersonName: ev.target.value })} placeholder="Enter contact person name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Contact Notes</Label>
            <Input value={e.contactNotes} onChange={(ev) => updateEntry(e.id, { contactNotes: ev.target.value })} placeholder="Enter any contact notes" className={inputCls} />
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Exported Component ──
export function PaymentMethodsSection({
  configType,
  paymentEntries,
  setPaymentEntries,
  savedPaymentEntries,
  updatePaymentEntry,
  savePaymentEntry,
  removePaymentEntry,
  payToEntityName = "",
  payToEntityAddress = "",
}: {
  configType: "vendor" | "customer";
  paymentEntries: PaymentMethodEntry[];
  setPaymentEntries: React.Dispatch<React.SetStateAction<PaymentMethodEntry[]>>;
  savedPaymentEntries: PaymentMethodEntry[];
  updatePaymentEntry: (id: string, updates: Partial<PaymentMethodEntry>) => void;
  savePaymentEntry: (id: string) => void;
  removePaymentEntry: (id: string) => void;
  payToEntityName?: string;
  payToEntityAddress?: string;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState("");
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const activeEntry = paymentEntries.find((e) => e.id === activeEntryId) || null;
  const editingEntry = paymentEntries.find((e) => e.id === editingEntryId) || null;

  const filteredTypeCards = useMemo(() => {
    if (!dropdownSearch.trim()) return PAYMENT_TYPE_CARDS;
    const q = dropdownSearch.toLowerCase();
    return PAYMENT_TYPE_CARDS.filter((t) => t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
  }, [dropdownSearch]);

  // Group saved methods by the GROUP_ORDER
  const groupedSaved = useMemo(() => {
    return GROUP_ORDER.map((group) => {
      const methods = savedPaymentEntries.filter((e) => group.types.includes(e.type));
      return { ...group, methods };
    }).filter((g) => g.methods.length > 0);
  }, [savedPaymentEntries]);

  function selectType(type: PaymentMethodType) {
    // For cash, auto-save immediately
    if (type === "cash") {
      const newEntry = createEmptyPaymentEntry(type);
      newEntry.isSaved = true;
      if (savedPaymentEntries.length === 0) newEntry.isPrimary = true;
      setPaymentEntries((prev) => [...prev, newEntry]);
      setDropdownOpen(false);
      setDropdownSearch("");
      return;
    }
    const newEntry = createEmptyPaymentEntry(type);
    setPaymentEntries((prev) => [...prev, newEntry]);
    setActiveEntryId(newEntry.id);
    setDropdownOpen(false);
    setDropdownSearch("");
  }

  function handleSaveMethod() {
    if (activeEntryId) {
      // Auto-set as primary if first method
      if (savedPaymentEntries.length === 0) {
        updatePaymentEntry(activeEntryId, { isPrimary: true });
      }
      savePaymentEntry(activeEntryId);
      setActiveEntryId(null);
    }
  }

  function handleCancelAdd() {
    if (activeEntryId) {
      const entry = paymentEntries.find((e) => e.id === activeEntryId);
      if (entry && !entry.isSaved) {
        setPaymentEntries((prev) => prev.filter((e) => e.id !== activeEntryId));
      }
      setActiveEntryId(null);
    }
  }

  function handleEditSave() {
    if (editingEntryId) {
      savePaymentEntry(editingEntryId);
      setEditingEntryId(null);
    }
  }

  function handleEditCancel() {
    setEditingEntryId(null);
  }

  function handleSetPrimary(id: string) {
    setPaymentEntries((prev) => prev.map((e) => ({ ...e, isPrimary: e.id === id })));
  }

  function startEdit(id: string) {
    setEditingEntryId(id);
    setActiveEntryId(null);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="text-sm text-[#0F172A]" style={{ fontWeight: 700 }}>Payment Methods</h4>
        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
          Configure payment methods for this {configType}. This section is optional — you can add methods later.{" "}
          <span className="text-[#0A77FF] inline-flex items-center gap-0.5 cursor-pointer hover:underline" style={{ fontWeight: 500 }}>
            Learn More <ExternalLink className="w-3 h-3" />
          </span>
        </p>
      </div>

      {/* Searchable Dropdown */}
      {!activeEntryId && !editingEntryId && (
        <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <PopoverTrigger asChild>
            <button
              className={`w-full h-10 px-3 rounded-lg border flex items-center justify-between text-sm transition-colors ${
                dropdownOpen
                  ? "bg-white border-[#0A77FF] ring-2 ring-[#0A77FF]/10"
                  : "bg-white border-[#E2E8F0] hover:border-[#CBD5E1]"
              }`}
            >
              <span className="text-[#94A3B8] flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add a payment method...
              </span>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl border border-[#E2E8F0] shadow-lg z-[200]"
            align="start"
            sideOffset={4}
          >
            {/* Search */}
            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  value={dropdownSearch}
                  onChange={(e) => setDropdownSearch(e.target.value)}
                  placeholder="Search payment methods..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#CBD5E1] focus:outline-none focus:border-[#0A77FF] focus:ring-2 focus:ring-[#0A77FF]/10"
                />
              </div>
            </div>
            {/* Grouped List */}
            <div className="max-h-[320px] overflow-y-auto border-t border-[#F1F5F9]">
              {filteredTypeCards.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#94A3B8]">No methods found</div>
              ) : (
                GROUP_ORDER.map((group) => {
                  const items = filteredTypeCards.filter((t) => group.types.includes(t.id));
                  if (items.length === 0) return null;
                  return (
                    <div key={group.label}>
                      <div className="px-4 py-1.5 text-[10px] text-[#94A3B8] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                        {group.label}
                      </div>
                      {items.map((t) => {
                        const Icon = t.icon;
                        const cat = t.category;
                        return (
                          <button
                            key={t.id}
                            onClick={() => selectType(t.id)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-[#F8FAFC]"
                          >
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: catBg[cat] || "#F1F5F9" }}>
                              <Icon className="w-3.5 h-3.5" style={{ color: catColor[cat] || "#64748B" }} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] text-[#0F172A]" style={{ fontWeight: 600 }}>{t.label}</p>
                              <p className="text-[11px] text-[#94A3B8] truncate">{t.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Inline Add Form */}
      {activeEntry && (
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = typeIcon(activeEntry.type);
                const cat = typeCategory(activeEntry.type);
                return (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: catBg[cat] || "#F1F5F9" }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: catColor[cat] || "#64748B" }} />
                  </div>
                );
              })()}
              <span className="text-sm text-[#0F172A]" style={{ fontWeight: 700 }}>{typeLabel(activeEntry.type)}</span>
            </div>
            <button onClick={handleCancelAdd} className="p-1.5 rounded-md hover:bg-[#F1F5F9] transition-colors">
              <X className="w-4 h-4 text-[#64748B]" />
            </button>
          </div>

          <PaymentFormFields
            e={activeEntry}
            updateEntry={updatePaymentEntry}
            payToEntityName={payToEntityName}
            payToEntityAddress={payToEntityAddress}
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
            <button onClick={handleCancelAdd} className="px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#64748B] hover:bg-[#F1F5F9] transition-colors" style={{ fontWeight: 500 }}>
              Cancel
            </button>
            <button onClick={handleSaveMethod} className="px-4 py-2 rounded-lg bg-[#0A77FF] text-white text-xs hover:bg-[#0960D0] transition-colors" style={{ fontWeight: 600 }}>
              Save Method
            </button>
          </div>
        </div>
      )}

      {/* Inline Edit Form */}
      {editingEntry && (
        <div className="rounded-xl border border-[#0A77FF]/30 bg-white p-4 space-y-4 animate-in fade-in-0 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(() => {
                const Icon = typeIcon(editingEntry.type);
                const cat = typeCategory(editingEntry.type);
                return (
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: catBg[cat] || "#F1F5F9" }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: catColor[cat] || "#64748B" }} />
                  </div>
                );
              })()}
              <span className="text-sm text-[#0F172A]" style={{ fontWeight: 700 }}>Edit {typeLabel(editingEntry.type)}</span>
            </div>
            <button onClick={handleEditCancel} className="p-1.5 rounded-md hover:bg-[#F1F5F9] transition-colors">
              <X className="w-4 h-4 text-[#64748B]" />
            </button>
          </div>

          <PaymentFormFields
            e={editingEntry}
            updateEntry={updatePaymentEntry}
            payToEntityName={payToEntityName}
            payToEntityAddress={payToEntityAddress}
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
            <button onClick={handleEditCancel} className="px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#64748B] hover:bg-[#F1F5F9] transition-colors" style={{ fontWeight: 500 }}>
              Cancel
            </button>
            <button onClick={handleEditSave} className="px-4 py-2 rounded-lg bg-[#0A77FF] text-white text-xs hover:bg-[#0960D0] transition-colors" style={{ fontWeight: 600 }}>
              Update Method
            </button>
          </div>
        </div>
      )}

      {/* Saved Methods List — Grouped */}
      {savedPaymentEntries.length > 0 ? (
        <div className="space-y-4">
          {groupedSaved.map((group) => (
            <div key={group.label}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] text-[#64748B] uppercase tracking-wider" style={{ fontWeight: 700 }}>{group.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#94A3B8]" style={{ fontWeight: 600 }}>{group.methods.length}</span>
              </div>
              <div className="space-y-1.5">
                {group.methods.map((pe) => {
                  const PeIcon = typeIcon(pe.type);
                  const cat = typeCategory(pe.type);
                  return (
                    <div
                      key={pe.id}
                      className="group flex items-center gap-3 px-3.5 py-3 rounded-xl border border-[#E8ECF1] bg-white hover:border-[#BFDBFE] hover:shadow-[0_2px_8px_-2px_rgba(10,119,255,0.08)] transition-all"
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: catBg[cat] || "#F1F5F9" }}>
                        <PeIcon className="w-4 h-4" style={{ color: catColor[cat] || "#64748B" }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-[#0F172A] truncate" style={{ fontWeight: 600 }}>{getEntrySummary(pe)}</span>
                          {pe.isPrimary && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#EDF4FF] text-[#0A77FF] border border-[#0A77FF]/15 shrink-0" style={{ fontWeight: 700 }}>PRIMARY</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full shrink-0" style={{ fontWeight: 600, color: catColor[cat] || "#64748B", backgroundColor: catBg[cat] || "#F1F5F9" }}>
                            {typeLabel(pe.type)}
                          </span>
                          <span className="text-[11px] text-[#94A3B8] truncate">{getEntryIdentifier(pe)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!pe.isPrimary && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => handleSetPrimary(pe.id)} className="p-1.5 rounded-md hover:bg-[#EDF4FF] transition-colors cursor-pointer">
                                <Star className="w-3.5 h-3.5 text-[#94A3B8] hover:text-[#0A77FF]" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="z-[300]"><p className="text-xs">Set as primary</p></TooltipContent>
                          </Tooltip>
                        )}
                        {pe.type !== "cash" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button onClick={() => startEdit(pe.id)} className="p-1.5 rounded-md hover:bg-[#EDF4FF] transition-colors cursor-pointer">
                                <Pencil className="w-3.5 h-3.5 text-[#94A3B8] hover:text-[#0A77FF]" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="z-[300]"><p className="text-xs">Edit</p></TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => removePaymentEntry(pe.id)} className="p-1.5 rounded-md hover:bg-[#FEF2F2] transition-colors cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5 text-[#94A3B8] hover:text-[#EF4444]" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="z-[300]"><p className="text-xs">Delete</p></TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : !activeEntry && !editingEntry ? (
        <div className="rounded-xl border-2 border-dashed border-[#E2E8F0] bg-[#FAFBFC] py-8 px-4 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-[#EDF4FF] border border-[#DBEAFE] flex items-center justify-center mb-3">
            <CreditCard className="w-6 h-6 text-[#0A77FF]" />
          </div>
          <p className="text-sm text-[#0F172A]" style={{ fontWeight: 600 }}>No payment methods added yet</p>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-[280px]">
            Select a payment method from the dropdown above to get started. This section is optional.
          </p>
        </div>
      ) : null}
    </div>
  );
}
