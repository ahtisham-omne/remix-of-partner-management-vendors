import { Search, Filter, Plus, Mail, Phone, Building2 } from "lucide-react";

export function ContactsDirectoryPage() {
  const contacts = [
    { id: 1, name: "Sarah Chen", email: "sarah.chen@acmecorp.com", phone: "+1 (555) 234-5678", role: "Procurement Manager", organization: "Acme Corporation", initials: "SC", color: "#0A77FF" },
    { id: 2, name: "James Wilson", email: "j.wilson@globalind.com", phone: "+1 (555) 345-6789", role: "Sales Director", organization: "Global Industries", initials: "JW", color: "#16A34A" },
    { id: 3, name: "Maria Garcia", email: "m.garcia@techsupply.com", phone: "+1 (555) 456-7890", role: "Account Executive", organization: "TechSupply Co", initials: "MG", color: "#EA580C" },
    { id: 4, name: "David Kim", email: "d.kim@premiumlog.com", phone: "+1 (555) 567-8901", role: "Logistics Coordinator", organization: "Premium Logistics", initials: "DK", color: "#7C3AED" },
    { id: 5, name: "Emily Brown", email: "e.brown@steelworks.com", phone: "+1 (555) 678-9012", role: "Operations Manager", organization: "SteelWorks Ltd", initials: "EB", color: "#DC2626" },
    { id: 6, name: "Robert Taylor", email: "r.taylor@nexgen.com", phone: "+1 (555) 789-0123", role: "VP of Partnerships", organization: "NexGen Materials", initials: "RT", color: "#0891B2" },
    { id: 7, name: "Lisa Anderson", email: "l.anderson@quickship.com", phone: "+1 (555) 890-1234", role: "Supply Chain Lead", organization: "QuickShip Inc", initials: "LA", color: "#CA8A04" },
    { id: 8, name: "Michael Patel", email: "m.patel@innovate.com", phone: "+1 (555) 901-2345", role: "Business Development", organization: "Innovate Systems", initials: "MP", color: "#BE185D" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      <div className="px-5 py-3.5 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground" style={{ fontSize: "20px", fontWeight: 600 }}>
              Contacts Directory
            </h1>
            <p className="text-muted-foreground mt-1" style={{ fontSize: "13px" }}>
              Global point of contacts across all partner organizations.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-[13px] transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0A77FF", fontWeight: 500 }}
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-card text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#0A77FF]/20 focus:border-[#0A77FF]"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-[13px] text-muted-foreground hover:bg-muted transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${contact.color}18`, color: contact.color }}
                >
                  <span className="text-[12px]" style={{ fontWeight: 600 }}>
                    {contact.initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-foreground truncate" style={{ fontSize: "14px", fontWeight: 500 }}>
                    {contact.name}
                  </h3>
                  <p className="text-muted-foreground truncate" style={{ fontSize: "12px" }}>
                    {contact.role}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: "12px" }}>
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{contact.organization}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: "12px" }}>
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{contact.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: "12px" }}>
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}