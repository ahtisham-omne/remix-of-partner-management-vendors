

## Payment Methods Section — Complete Redesign

This is a significant rewrite of `PaymentMethodsSection.tsx` (~780 lines) and updates to `partnerConstants.tsx` for new types/fields.

### 1. Update `partnerConstants.tsx` — Types and Constants

**Add new payment method types** to `PaymentMethodType`:
- Add `"echeck"`, `"instant_pay"`, `"other_method"` to the union type
- Remove types not in the spec: `"sepa"`, `"direct_debit"`, `"money_order"`, `"purchase_card"`, `"virtual_card"`, `"crypto"`, `"letter_of_credit"`, `"escrow"` (keep them in the type for backward compat but remove from `PAYMENT_TYPE_CARDS`)

**Replace `PAYMENT_TYPE_CARDS`** with 9 methods grouped into 4 categories:
- **Bank Transfers**: ACH Direct Deposit, Wire Transfer
- **Traditional**: Check, Cash
- **Card & Digital**: Credit/Debit Card, Digital Wallet
- **Other**: E-Check, Instant Pay, Other

**Update `PaymentMethodEntry` interface**:
- Add `accountHolderName` (replaces `accountTitle` usage)
- Add `beneficiaryName`, `beneficiaryAddress`
- Add `instantPayBrand` (Zelle / Cash App / Venmo for Business / Other)
- Add `instantPayHandle`, `instantPayAccountName`
- Add `methodDescription`, `contactPersonName`, `contactNotes` (for "Other")

**Remove all `*` required markers** — the entire section is optional.

### 2. Rewrite `PaymentMethodsSection.tsx` — New UX Pattern

**Replace flat card grid + modal with inline searchable dropdown flow:**

1. **Searchable Dropdown** at the top (using Popover + search input):
   - Groups items by category with group headers in the dropdown
   - On selection, expand an inline form below the dropdown (not a modal)
   - After filling and clicking "Save Method", the method is added to the saved list
   - Dropdown resets for adding another method

2. **Inline Form** (replaces modal):
   - Renders below the dropdown when a type is selected
   - Each type shows only its specific fields per the spec
   - **Cash**: No form fields — just a confirmation message "Cash added as a payment method"
   - **ACH**: Account Holder Name (pre-populated), routing number, account number, address (pre-populated)
   - **Wire**: Beneficiary Name (pre-populated), routing number, account number, address (pre-populated), SWIFT code
   - **Check**: Payee name (pre-populated), mailing address (pre-populated, optional) — no bank name or account number
   - **Credit/Debit Card**: Cardholder name, card number, expiry, CVV, billing address, special instructions
   - **Digital Wallet**: Wallet ID, name
   - **E-Check**: Payee name (pre-populated), address (pre-populated), bank routing number, account number
   - **Instant Pay**: Brand sub-dropdown (Zelle, Cash App, Venmo for Business, Other), phone/handle, account name (pre-populated)
   - **Other**: Method description, contact person name, contact notes
   - All placeholder text uses `placeholder:text-[#CBD5E1]` (lighter than current `#94A3B8`)
   - Pre-population: Accept `payToEntityName` and `payToEntityAddress` props from parent, use as default values for payee/account holder fields

3. **Saved Methods List** (always visible, not collapsed):
   - Grouped visually in fixed order: ACH + Wire → Check + Cash → Card + Digital Wallet → E-Check + Instant Pay + Other
   - Each method shows: type label, payee/holder name, primary identifier (last 4 digits, routing number, etc.)
   - Count badge per group as secondary element
   - Edit (opens inline form pre-filled), delete, set-as-primary actions on hover
   - First saved method auto-set as primary

4. **Remove all required constraints** — no asterisks, no validation blocking save

### 3. Update `config-helpers.tsx` — `createEmptyPaymentEntry`

Update the factory function to include new fields (`accountHolderName`, `instantPayBrand`, `methodDescription`, etc.) with empty defaults.

### 4. Update `CreatePartnerModal.tsx` — Pass Pay-To Entity Data

Pass `payToEntityName` and `payToEntityAddress` as props to `PaymentMethodsSection` from the partner data already collected in previous steps (company name + billing address).

### Files Changed
- `src/app/components/vendors/partnerConstants.tsx` — new types, updated PAYMENT_TYPE_CARDS, updated PaymentMethodEntry
- `src/app/components/vendors/PaymentMethodsSection.tsx` — complete rewrite (~600-700 lines)
- `src/app/components/vendors/config-helpers.tsx` — update createEmptyPaymentEntry
- `src/app/components/vendors/CreatePartnerModal.tsx` — pass pay-to entity props

