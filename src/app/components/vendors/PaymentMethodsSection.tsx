import React, { useState } from "react";
import {
  Plus, X, CreditCard, ChevronLeft, Check, Pencil, Trash2, Star,
  ArrowUpDown, ExternalLink, ChevronDown,
} from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import {
  type PaymentMethodType,
  type PaymentTypeCategory,
  type PaymentMethodEntry,
  PAYMENT_TYPE_CARDS,
} from "./partnerConstants";
import { createEmptyPaymentEntry } from "./config-helpers";

const inputCls = "mt-1.5 rounded-lg border-[#E2E8F0] h-10 bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20";

const catColor: Record<string, string> = {
  Bank: "#0A77FF",
  Traditional: "#7C3AED",
  Card: "#D97706",
  Digital: "#059669",
  "Trade Finance": "#DC2626",
};
const catBg: Record<string, string> = {
  Bank: "#EDF4FF",
  Traditional: "#F0EBFF",
  Card: "#FEF3C7",
  Digital: "#ECFDF5",
  "Trade Finance": "#FEF2F2",
};

const categories: PaymentTypeCategory[] = ["Bank", "Traditional", "Card", "Digital", "Trade Finance"];

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
  if (e.bankName) return e.bankName;
  if (e.cardholderName) return e.cardholderName;
  if (e.walletProvider) return e.walletProvider;
  if (e.payeeName) return e.payeeName;
  if (e.recipientName) return e.recipientName;
  if (e.issuerName) return e.issuerName;
  if (e.escrowProvider) return e.escrowProvider;
  if (e.virtualCardProvider) return e.virtualCardProvider;
  if (e.issuingBank) return e.issuingBank;
  return typeLabel(e.type);
}

function getEntrySubtext(e: PaymentMethodEntry): string {
  if (e.accountNumber) return `••••${e.accountNumber.slice(-4)}`;
  if (e.cardNumber) return `••••${e.cardNumber.slice(-4)}`;
  if (e.walletId) return e.walletId;
  if (e.mailingAddress) return e.mailingAddress;
  if (e.collectionPoint) return e.collectionPoint;
  if (e.cryptoWalletAddress) return `${e.cryptoWalletAddress.slice(0, 8)}...`;
  if (e.ibanNumber) return `••••${e.ibanNumber.slice(-4)}`;
  if (e.lcNumber) return e.lcNumber;
  if (e.escrowAccountId) return e.escrowAccountId;
  if (e.purchaseCardNumber) return `••••${e.purchaseCardNumber.slice(-4)}`;
  return typeCategory(e.type);
}

// ── Form Fields Renderer ──
function PaymentFormFields({
  e,
  updateEntry,
}: {
  e: PaymentMethodEntry;
  updateEntry: (id: string, updates: Partial<PaymentMethodEntry>) => void;
}) {
  return (
    <>
      {/* Nickname */}
      <div>
        <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Nickname</Label>
        <Input value={e.nickname} onChange={(ev) => updateEntry(e.id, { nickname: ev.target.value })} placeholder="e.g. Primary ACH, Backup Wire" className={inputCls} />
      </div>

      {/* ACH / Wire */}
      {(e.type === "wire" || e.type === "ach") && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Bank Name *</Label>
            <Input value={e.bankName} onChange={(ev) => updateEntry(e.id, { bankName: ev.target.value })} placeholder="e.g. Chase Bank" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Account Title *</Label>
            <Input value={e.accountTitle} onChange={(ev) => updateEntry(e.id, { accountTitle: ev.target.value })} placeholder="Enter account holder name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>{e.type === "wire" ? "Account Number/IBAN *" : "Account Number *"}</Label>
            <Input value={e.accountNumber} onChange={(ev) => updateEntry(e.id, { accountNumber: ev.target.value })} placeholder={e.type === "wire" ? "Enter account number/IBAN" : "Enter account number"} className={inputCls} />
          </div>
          {e.type === "ach" && (
            <div>
              <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Routing Number *</Label>
              <Input value={e.routingNumber} onChange={(ev) => updateEntry(e.id, { routingNumber: ev.target.value })} placeholder="e.g. 021000021" className={inputCls} />
            </div>
          )}
          {e.type === "wire" && (
            <div>
              <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Swift Code *</Label>
              <Input value={e.swiftCode} onChange={(ev) => updateEntry(e.id, { swiftCode: ev.target.value })} placeholder="Enter swift code" className={inputCls} />
            </div>
          )}
        </>
      )}

      {/* SEPA */}
      {e.type === "sepa" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Bank Name *</Label>
            <Input value={e.bankName} onChange={(ev) => updateEntry(e.id, { bankName: ev.target.value })} placeholder="e.g. Deutsche Bank" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Account Holder *</Label>
            <Input value={e.accountTitle} onChange={(ev) => updateEntry(e.id, { accountTitle: ev.target.value })} placeholder="Enter account holder name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>IBAN *</Label>
            <Input value={e.ibanNumber} onChange={(ev) => updateEntry(e.id, { ibanNumber: ev.target.value })} placeholder="e.g. DE89370400440532013000" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>BIC/SWIFT Code *</Label>
            <Input value={e.bicCode} onChange={(ev) => updateEntry(e.id, { bicCode: ev.target.value })} placeholder="e.g. DEUTDEDBFRA" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>SEPA Mandate Reference</Label>
            <Input value={e.sepaMandate} onChange={(ev) => updateEntry(e.id, { sepaMandate: ev.target.value })} placeholder="Enter mandate reference" className={inputCls} />
          </div>
        </>
      )}

      {/* Direct Debit */}
      {e.type === "direct_debit" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Bank Name *</Label>
            <Input value={e.bankName} onChange={(ev) => updateEntry(e.id, { bankName: ev.target.value })} placeholder="e.g. HSBC" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Account Holder *</Label>
            <Input value={e.accountTitle} onChange={(ev) => updateEntry(e.id, { accountTitle: ev.target.value })} placeholder="Enter account holder name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Account Number / IBAN *</Label>
            <Input value={e.accountNumber} onChange={(ev) => updateEntry(e.id, { accountNumber: ev.target.value })} placeholder="Enter account number or IBAN" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Frequency</Label>
            <Input value={e.frequency} onChange={(ev) => updateEntry(e.id, { frequency: ev.target.value })} placeholder="e.g. Monthly, Weekly, Bi-weekly" className={inputCls} />
          </div>
        </>
      )}

      {/* Check */}
      {e.type === "check" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Payee Name *</Label>
            <Input value={e.payeeName} onChange={(ev) => updateEntry(e.id, { payeeName: ev.target.value })} placeholder="Enter payee name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Mailing Address *</Label>
            <Input value={e.mailingAddress} onChange={(ev) => updateEntry(e.id, { mailingAddress: ev.target.value })} placeholder="Enter mailing address" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Bank Name</Label>
            <Input value={e.bankName} onChange={(ev) => updateEntry(e.id, { bankName: ev.target.value })} placeholder="e.g. Chase Bank" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Account Number</Label>
            <Input value={e.accountNumber} onChange={(ev) => updateEntry(e.id, { accountNumber: ev.target.value })} placeholder="Enter account number" className={inputCls} />
          </div>
        </>
      )}

      {/* Money Order */}
      {e.type === "money_order" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Issuer Name *</Label>
            <Input value={e.issuerName} onChange={(ev) => updateEntry(e.id, { issuerName: ev.target.value })} placeholder="e.g. USPS, Western Union" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Payee Name *</Label>
            <Input value={e.payeeName} onChange={(ev) => updateEntry(e.id, { payeeName: ev.target.value })} placeholder="Enter payee name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Money Order Number</Label>
            <Input value={e.moneyOrderNumber} onChange={(ev) => updateEntry(e.id, { moneyOrderNumber: ev.target.value })} placeholder="Enter serial/tracking number" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Mailing Address</Label>
            <Input value={e.mailingAddress} onChange={(ev) => updateEntry(e.id, { mailingAddress: ev.target.value })} placeholder="Enter mailing address" className={inputCls} />
          </div>
        </>
      )}

      {/* Cash */}
      {e.type === "cash" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Recipient Name *</Label>
            <Input value={e.recipientName} onChange={(ev) => updateEntry(e.id, { recipientName: ev.target.value })} placeholder="Enter recipient name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Collection Point *</Label>
            <Input value={e.collectionPoint} onChange={(ev) => updateEntry(e.id, { collectionPoint: ev.target.value })} placeholder="Enter collection point or location" className={inputCls} />
          </div>
        </>
      )}

      {/* Credit/Debit Card */}
      {e.type === "card" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Cardholder Name *</Label>
            <Input value={e.cardholderName} onChange={(ev) => updateEntry(e.id, { cardholderName: ev.target.value })} placeholder="Enter cardholder name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Card Number *</Label>
            <Input value={e.cardNumber} onChange={(ev) => updateEntry(e.id, { cardNumber: ev.target.value })} placeholder="Enter card number" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Expiry Date *</Label>
              <Input value={e.expiryDate} onChange={(ev) => updateEntry(e.id, { expiryDate: ev.target.value })} placeholder="MM/YY" className={inputCls} />
            </div>
            <div>
              <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>CVV *</Label>
              <Input value={e.cvv} onChange={(ev) => updateEntry(e.id, { cvv: ev.target.value })} placeholder="Enter CVV" className={inputCls} />
            </div>
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Billing Address</Label>
            <Input value={e.billingAddress} onChange={(ev) => updateEntry(e.id, { billingAddress: ev.target.value })} placeholder="Enter billing address" className={inputCls} />
          </div>
        </>
      )}

      {/* Purchase Card */}
      {e.type === "purchase_card" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Cardholder Name *</Label>
            <Input value={e.cardholderName} onChange={(ev) => updateEntry(e.id, { cardholderName: ev.target.value })} placeholder="Enter cardholder name" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>P-Card Number *</Label>
            <Input value={e.purchaseCardNumber} onChange={(ev) => updateEntry(e.id, { purchaseCardNumber: ev.target.value })} placeholder="Enter purchase card number" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Spending Limit</Label>
            <Input value={e.spendingLimit} onChange={(ev) => updateEntry(e.id, { spendingLimit: ev.target.value })} placeholder="e.g. $10,000" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Approval Workflow</Label>
            <Input value={e.approvalWorkflow} onChange={(ev) => updateEntry(e.id, { approvalWorkflow: ev.target.value })} placeholder="e.g. Manager approval required" className={inputCls} />
          </div>
        </>
      )}

      {/* Virtual Card */}
      {e.type === "virtual_card" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Provider *</Label>
            <Input value={e.virtualCardProvider} onChange={(ev) => updateEntry(e.id, { virtualCardProvider: ev.target.value })} placeholder="e.g. Divvy, Ramp, Brex" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Card Number *</Label>
            <Input value={e.cardNumber} onChange={(ev) => updateEntry(e.id, { cardNumber: ev.target.value })} placeholder="Enter virtual card number" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Expiry Date *</Label>
              <Input value={e.expiryDate} onChange={(ev) => updateEntry(e.id, { expiryDate: ev.target.value })} placeholder="MM/YY" className={inputCls} />
            </div>
            <div>
              <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Spending Limit</Label>
              <Input value={e.virtualCardLimit} onChange={(ev) => updateEntry(e.id, { virtualCardLimit: ev.target.value })} placeholder="e.g. $5,000" className={inputCls} />
            </div>
          </div>
        </>
      )}

      {/* Digital Wallet */}
      {e.type === "digital_wallet" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Wallet Provider *</Label>
            <Input value={e.walletProvider} onChange={(ev) => updateEntry(e.id, { walletProvider: ev.target.value })} placeholder="e.g. PayPal, Venmo, Stripe" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Wallet ID/Email *</Label>
            <Input value={e.walletId} onChange={(ev) => updateEntry(e.id, { walletId: ev.target.value })} placeholder="Enter wallet ID or email" className={inputCls} />
          </div>
        </>
      )}

      {/* Cryptocurrency */}
      {e.type === "crypto" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Currency *</Label>
            <Input value={e.cryptoCurrency} onChange={(ev) => updateEntry(e.id, { cryptoCurrency: ev.target.value })} placeholder="e.g. Bitcoin, Ethereum, USDC" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Wallet Address *</Label>
            <Input value={e.cryptoWalletAddress} onChange={(ev) => updateEntry(e.id, { cryptoWalletAddress: ev.target.value })} placeholder="Enter wallet address" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Network</Label>
            <Input value={e.cryptoNetwork} onChange={(ev) => updateEntry(e.id, { cryptoNetwork: ev.target.value })} placeholder="e.g. Ethereum Mainnet, Bitcoin" className={inputCls} />
          </div>
        </>
      )}

      {/* Letter of Credit */}
      {e.type === "letter_of_credit" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>L/C Number *</Label>
            <Input value={e.lcNumber} onChange={(ev) => updateEntry(e.id, { lcNumber: ev.target.value })} placeholder="Enter L/C reference number" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Issuing Bank *</Label>
            <Input value={e.issuingBank} onChange={(ev) => updateEntry(e.id, { issuingBank: ev.target.value })} placeholder="e.g. Citibank, HSBC" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Beneficiary Bank</Label>
            <Input value={e.beneficiaryBank} onChange={(ev) => updateEntry(e.id, { beneficiaryBank: ev.target.value })} placeholder="Enter beneficiary bank" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>L/C Amount</Label>
              <Input value={e.lcAmount} onChange={(ev) => updateEntry(e.id, { lcAmount: ev.target.value })} placeholder="e.g. $100,000" className={inputCls} />
            </div>
            <div>
              <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Expiry Date</Label>
              <Input type="date" value={e.lcExpiryDate} onChange={(ev) => updateEntry(e.id, { lcExpiryDate: ev.target.value })} className={`${inputCls} text-[#0F172A]`} />
            </div>
          </div>
        </>
      )}

      {/* Escrow */}
      {e.type === "escrow" && (
        <>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Escrow Provider *</Label>
            <Input value={e.escrowProvider} onChange={(ev) => updateEntry(e.id, { escrowProvider: ev.target.value })} placeholder="e.g. Escrow.com, PayPal Escrow" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Escrow Account ID</Label>
            <Input value={e.escrowAccountId} onChange={(ev) => updateEntry(e.id, { escrowAccountId: ev.target.value })} placeholder="Enter escrow account ID" className={inputCls} />
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Release Conditions</Label>
            <Input value={e.releaseConditions} onChange={(ev) => updateEntry(e.id, { releaseConditions: ev.target.value })} placeholder="e.g. Delivery confirmed, Inspection passed" className={inputCls} />
          </div>
        </>
      )}

      {/* Phone */}
      {(e.type === "ach" || e.type === "wire" || e.type === "digital_wallet" || e.type === "cash") && (
        <div>
          <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Phone Number</Label>
          <div className="flex gap-0 mt-1.5">
            <div className="flex items-center gap-1.5 px-3 h-10 border border-r-0 border-[#E2E8F0] rounded-l-lg bg-white text-sm text-[#0F172A] shrink-0">
              <span className="text-base">🇺🇸</span>
              <span style={{ fontWeight: 500 }}>{e.countryCode}</span>
              <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </div>
            <Input value={e.phone} onChange={(ev) => updateEntry(e.id, { phone: ev.target.value })} placeholder="xxx xxx xxxx" className="rounded-l-none rounded-r-lg border-[#E2E8F0] h-10 bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20" />
          </div>
        </div>
      )}

      {/* Special Instructions */}
      <div>
        <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Special Instructions</Label>
        <Input value={e.specialInstructions} onChange={(ev) => updateEntry(e.id, { specialInstructions: ev.target.value })} placeholder="Enter any special instructions or notes..." className={inputCls} />
      </div>

      {/* Discount */}
      <div className="pt-1 border-t border-[#E2E8F0]">
        <label className="flex items-center gap-2.5 cursor-pointer select-none pt-3">
          <div
            onClick={() => updateEntry(e.id, { applyDiscount: !e.applyDiscount })}
            className={`w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
              e.applyDiscount ? "bg-[#0A77FF]" : "border-2 border-[#CBD5E1] bg-white"
            }`}
          >
            {e.applyDiscount && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className="text-xs text-[#0F172A]" style={{ fontWeight: 500 }}>Apply Discount Terms or Additional Charges</span>
        </label>
      </div>
      {e.applyDiscount && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Discount (%)</Label>
            <div className="relative mt-1.5">
              <Input value={e.discountPercent} onChange={(ev) => updateEntry(e.id, { discountPercent: ev.target.value })} placeholder="e.g. 5" className="rounded-lg border-[#E2E8F0] h-10 pr-10 bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]">%</span>
            </div>
          </div>
          <div>
            <Label className="text-xs text-[#64748B]" style={{ fontWeight: 500 }}>Add. Charges (%)</Label>
            <div className="relative mt-1.5">
              <Input value={e.additionalCharges} onChange={(ev) => updateEntry(e.id, { additionalCharges: ev.target.value })} placeholder="e.g. 2" className="rounded-lg border-[#E2E8F0] h-10 pr-10 bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:border-[#0A77FF] focus:ring-1 focus:ring-[#0A77FF]/20" />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]">%</span>
            </div>
          </div>
        </div>
      )}
    </>
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
}: {
  configType: "vendor" | "customer";
  paymentEntries: PaymentMethodEntry[];
  setPaymentEntries: React.Dispatch<React.SetStateAction<PaymentMethodEntry[]>>;
  savedPaymentEntries: PaymentMethodEntry[];
  updatePaymentEntry: (id: string, updates: Partial<PaymentMethodEntry>) => void;
  savePaymentEntry: (id: string) => void;
  removePaymentEntry: (id: string) => void;
}) {
  const [pmModalOpen, setPmModalOpen] = useState(false);
  const [pmModalStep, setPmModalStep] = useState<"select" | "form">("select");
  const [pmModalTypeFilter, setPmModalTypeFilter] = useState<PaymentTypeCategory | "All">("All");
  const [pmEditingEntryId, setPmEditingEntryId] = useState<string | null>(null);
  const [pmListFilter, setPmListFilter] = useState<PaymentMethodType | "all">("all");
  const [pmListSort, setPmListSort] = useState<"newest" | "oldest" | "type" | "name">("newest");

  const filteredTypeCards = pmModalTypeFilter === "All" ? PAYMENT_TYPE_CARDS : PAYMENT_TYPE_CARDS.filter((t) => t.category === pmModalTypeFilter);
  const modalEntry = paymentEntries.find((e) => e.id === pmEditingEntryId) || null;
  const savedTypes = Array.from(new Set(savedPaymentEntries.map((e) => e.type)));

  const filteredSaved = savedPaymentEntries
    .filter((e) => pmListFilter === "all" || e.type === pmListFilter)
    .sort((a, b) => {
      if (pmListSort === "type") return typeLabel(a.type).localeCompare(typeLabel(b.type));
      if (pmListSort === "name") return getEntrySummary(a).localeCompare(getEntrySummary(b));
      if (pmListSort === "oldest") return a.id.localeCompare(b.id);
      return b.id.localeCompare(a.id);
    });

  function openAddModal() {
    setPmModalStep("select");
    setPmEditingEntryId(null);
    setPmModalTypeFilter("All");
    setPmModalOpen(true);
  }

  function selectTypeAndProceed(type: PaymentMethodType) {
    const newEntry = createEmptyPaymentEntry(type);
    setPaymentEntries((prev) => [...prev, newEntry]);
    setPmEditingEntryId(newEntry.id);
    setPmModalStep("form");
  }

  function openEditModal(id: string) {
    setPmEditingEntryId(id);
    setPmModalStep("form");
    setPmModalOpen(true);
  }

  function handleModalSave() {
    if (pmEditingEntryId) savePaymentEntry(pmEditingEntryId);
    setPmModalOpen(false);
    setPmEditingEntryId(null);
  }

  function handleModalCancel() {
    if (pmEditingEntryId) {
      const entry = paymentEntries.find((e) => e.id === pmEditingEntryId);
      if (entry && !entry.isSaved) {
        setPaymentEntries((prev) => prev.filter((e) => e.id !== pmEditingEntryId));
      }
    }
    setPmModalOpen(false);
    setPmEditingEntryId(null);
  }

  function handleSetPrimary(id: string) {
    setPaymentEntries((prev) => prev.map((e) => ({ ...e, isPrimary: e.id === id })));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h4 className="text-sm text-[#0F172A]" style={{ fontWeight: 700 }}>Payment Methods</h4>
        <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
          Configure payment methods for this {configType}. Add multiple methods across bank transfers, cards, digital wallets, trade finance and more.{" "}
          <span className="text-[#0A77FF] inline-flex items-center gap-0.5 cursor-pointer hover:underline" style={{ fontWeight: 500 }}>
            Learn More <ExternalLink className="w-3 h-3" />
          </span>
        </p>
      </div>

      {/* Toolbar */}
      {savedPaymentEntries.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 flex-1 flex-wrap">
            <button
              onClick={() => setPmListFilter("all")}
              className={`px-2.5 py-1 rounded-full text-[11px] transition-all border cursor-pointer ${
                pmListFilter === "all" ? "bg-[#0A77FF] text-white border-[#0A77FF]" : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]"
              }`}
              style={{ fontWeight: 600 }}
            >
              All ({savedPaymentEntries.length})
            </button>
            {savedTypes.map((st) => {
              const count = savedPaymentEntries.filter((e) => e.type === st).length;
              const cat = typeCategory(st);
              const isActive = pmListFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => setPmListFilter(st)}
                  className={`px-2.5 py-1 rounded-full text-[11px] transition-all border cursor-pointer ${
                    isActive ? "text-white border-transparent" : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]"
                  }`}
                  style={{ fontWeight: 600, ...(isActive ? { backgroundColor: catColor[cat] || "#64748B" } : {}) }}
                >
                  {typeLabel(st)} ({count})
                </button>
              );
            })}
          </div>
          <Select value={pmListSort} onValueChange={(v: "newest" | "oldest" | "type" | "name") => setPmListSort(v)}>
            <SelectTrigger className="h-7 w-auto min-w-[100px] text-[11px] rounded-lg border-[#E2E8F0] bg-white px-2 gap-1 [&>svg]:w-3 [&>svg]:h-3">
              <ArrowUpDown className="w-3 h-3 text-[#94A3B8] shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[250] rounded-lg text-[11px]">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="type">By Type</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={openAddModal}
            className="h-7 px-2.5 rounded-lg bg-[#0A77FF] text-white text-[11px] hover:bg-[#0862D0] transition-colors inline-flex items-center gap-1 cursor-pointer"
            style={{ fontWeight: 600 }}
          >
            <Plus className="w-3 h-3" /> Add Method
          </button>
        </div>
      )}

      {/* Saved List */}
      {savedPaymentEntries.length > 0 ? (
        <div className="space-y-2">
          {filteredSaved.map((pe) => {
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
                    <span className="text-[11px] text-[#94A3B8] truncate">{getEntrySubtext(pe)}</span>
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={() => openEditModal(pe.id)} className="p-1.5 rounded-md hover:bg-[#EDF4FF] transition-colors cursor-pointer">
                        <Pencil className="w-3.5 h-3.5 text-[#94A3B8] hover:text-[#0A77FF]" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="z-[300]"><p className="text-xs">Edit</p></TooltipContent>
                  </Tooltip>
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
      ) : (
        <div className="rounded-xl border-2 border-dashed border-[#E2E8F0] bg-[#FAFBFC] py-10 px-4 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-xl bg-[#EDF4FF] border border-[#DBEAFE] flex items-center justify-center mb-3">
            <CreditCard className="w-6 h-6 text-[#0A77FF]" />
          </div>
          <p className="text-sm text-[#0F172A]" style={{ fontWeight: 600 }}>No payment methods added yet</p>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-[280px]">
            Add payment methods to define how this {configType} sends or receives payments. You can configure multiple methods.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 px-4 py-2.5 rounded-lg bg-[#0A77FF] text-white text-xs hover:bg-[#0862D0] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            style={{ fontWeight: 600 }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Payment Method
          </button>
        </div>
      )}

      {/* Modal */}
      {pmModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={handleModalCancel} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-[#E2E8F0]/60 w-[calc(100%-2rem)] max-w-[580px] max-h-[85vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8ECF1] shrink-0">
              <div className="flex items-center gap-2.5">
                {pmModalStep === "form" && !modalEntry?.isSaved && (
                  <button
                    onClick={() => {
                      if (pmEditingEntryId) {
                        const entry = paymentEntries.find((e) => e.id === pmEditingEntryId);
                        if (entry && !entry.isSaved) setPaymentEntries((prev) => prev.filter((e) => e.id !== pmEditingEntryId));
                      }
                      setPmModalStep("select");
                      setPmEditingEntryId(null);
                    }}
                    className="p-1 rounded-md hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#64748B]" />
                  </button>
                )}
                <div>
                  <h3 className="text-sm text-[#0F172A]" style={{ fontWeight: 700 }}>
                    {pmModalStep === "select" ? "Add Payment Method" : modalEntry?.isSaved ? `Edit ${typeLabel(modalEntry.type)}` : `New ${modalEntry ? typeLabel(modalEntry.type) : "Payment Method"}`}
                  </h3>
                  {pmModalStep === "select" && <p className="text-[11px] text-[#94A3B8] mt-0.5">Choose a payment method type to get started</p>}
                </div>
              </div>
              <button onClick={handleModalCancel} className="p-1.5 rounded-md hover:bg-[#F1F5F9] transition-colors cursor-pointer">
                <X className="w-4 h-4 text-[#64748B]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {pmModalStep === "select" ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setPmModalTypeFilter("All")}
                      className={`px-2.5 py-1 rounded-full text-[11px] border transition-all cursor-pointer ${
                        pmModalTypeFilter === "All" ? "bg-[#0F172A] text-white border-[#0F172A]" : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      All Types
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setPmModalTypeFilter(cat)}
                        className={`px-2.5 py-1 rounded-full text-[11px] border transition-all cursor-pointer ${
                          pmModalTypeFilter === cat ? "text-white border-transparent" : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]"
                        }`}
                        style={{ fontWeight: 600, ...(pmModalTypeFilter === cat ? { backgroundColor: catColor[cat] || "#64748B" } : {}) }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {filteredTypeCards.map((t) => {
                      const Icon = t.icon;
                      const color = catColor[t.category] || "#64748B";
                      const bg = catBg[t.category] || "#F1F5F9";
                      return (
                        <button
                          key={t.id}
                          onClick={() => selectTypeAndProceed(t.id)}
                          className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E8ECF1] bg-white text-left hover:border-[#BFDBFE] hover:shadow-[0_2px_8px_-2px_rgba(10,119,255,0.08)] transition-all group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: bg }}>
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] text-[#0F172A] group-hover:text-[#0A77FF] transition-colors" style={{ fontWeight: 600 }}>{t.label}</p>
                            <p className="text-[10px] text-[#94A3B8] mt-0.5 leading-relaxed">{t.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : modalEntry ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#F1F5F9]">
                    {(() => {
                      const Icon = typeIcon(modalEntry.type);
                      const cat = typeCategory(modalEntry.type);
                      return (
                        <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: catBg[cat] || "#F1F5F9" }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: catColor[cat] || "#64748B" }} />
                        </div>
                      );
                    })()}
                    <span className="text-xs text-[#64748B]" style={{ fontWeight: 600 }}>{typeLabel(modalEntry.type)}</span>
                  </div>
                  <PaymentFormFields e={modalEntry} updateEntry={updatePaymentEntry} />
                </div>
              ) : null}
            </div>

            {/* Footer */}
            {pmModalStep === "form" && (
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[#E8ECF1] shrink-0">
                <button onClick={handleModalCancel} className="px-3.5 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer" style={{ fontWeight: 500 }}>
                  Cancel
                </button>
                <button onClick={handleModalSave} className="px-4 py-2 rounded-lg bg-[#0A77FF] text-white text-xs hover:bg-[#0960D0] transition-colors cursor-pointer" style={{ fontWeight: 600 }}>
                  {modalEntry?.isSaved ? "Update Method" : "Save Method"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
