import React from "react";
import { Check, ChevronRight } from "lucide-react";
import type { VendorSubType, ConfigSection } from "./partnerConstants";

/** ── Configuration Sub-page: Unified Sidebar Nav ── */
export function ConfigUnifiedNav({
  subTypes,
  sections,
  selectedSubTypes,
  activeSubTypeTab,
  activeSection,
  onToggleSubType,
  onSetActiveSubType,
  onActiveSectionChange,
}: {
  subTypes: VendorSubType[];
  sections: ConfigSection[];
  selectedSubTypes: Set<string>;
  activeSubTypeTab: string;
  activeSection: string;
  onToggleSubType: (id: string) => void;
  onSetActiveSubType: (id: string) => void;
  onActiveSectionChange: (id: string) => void;
}) {
  return (
    <>
      {/* Mobile: horizontal scrollable nav */}
      <div className="sm:hidden shrink-0 border-b border-[#EEF2F6] bg-white overflow-x-auto scrollbar-hide">
        <nav className="flex flex-col">
          <div className="flex px-3 py-2 gap-1.5 min-w-max">
            {subTypes.map((subType) => {
              const isEnabled = selectedSubTypes.has(subType.id);
              const isActive = activeSubTypeTab === subType.id;
              return (
                <button
                  key={subType.id}
                  onClick={() => {
                    if (!isEnabled) onToggleSubType(subType.id);
                    onSetActiveSubType(subType.id);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all whitespace-nowrap shrink-0 ${
                    isActive && isEnabled
                      ? "bg-[#EDF4FF] text-[#0A77FF]"
                      : isActive
                      ? "bg-[#F8FAFC] text-[#475569]"
                      : isEnabled
                      ? "text-[#475569] hover:bg-[#F8FAFC]"
                      : "text-[#94A3B8] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    isActive && isEnabled ? "bg-white text-[#0A77FF] shadow-sm" : isEnabled ? "bg-[#F1F5F9] text-[#64748B]" : "bg-[#F1F5F9] text-[#CBD5E1]"
                  }`}>
                    {React.cloneElement(subType.icon as React.ReactElement, { className: "w-3.5 h-3.5" })}
                  </div>
                  <span className="text-xs" style={{ fontWeight: isActive ? 600 : 500 }}>{subType.label}</span>
                  {isEnabled && !isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0A77FF] shrink-0" />}
                </button>
              );
            })}
          </div>
          {/* Mobile config section pills */}
          {selectedSubTypes.has(activeSubTypeTab) && (
            <div className="flex px-3 pb-2 gap-1 min-w-max overflow-x-auto scrollbar-hide border-t border-[#F1F5F9] pt-1.5">
              {sections.map((section) => {
                const isActive = section.id === activeSection;
                return (
                  <button
                    key={section.id}
                    onClick={() => onActiveSectionChange(section.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] transition-all whitespace-nowrap ${
                      isActive ? "bg-[#0A77FF] text-white" : "text-[#64748B] hover:bg-[#F1F5F9]"
                    }`}
                    style={{ fontWeight: isActive ? 600 : 500 }}
                  >
                    {section.title}
                  </button>
                );
              })}
            </div>
          )}
        </nav>
      </div>

      {/* Desktop: unified vertical accordion sidebar */}
      <div className="hidden sm:flex sm:flex-col w-[252px] lg:w-[268px] shrink-0 border-r border-[#EEF2F6] bg-white overflow-y-auto">
        <div className="px-3.5 pt-3.5 pb-1.5">
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-wider" style={{ fontWeight: 600 }}>Sub-types</p>
        </div>
        <nav className="flex flex-col px-1.5 pb-3 flex-1">
          {subTypes.map((subType) => {
            const isEnabled = selectedSubTypes.has(subType.id);
            const isExpanded = activeSubTypeTab === subType.id;
            const isSeller = subType.id === "seller_items";

            return (
              <div key={subType.id}>
                {/* Sub-type header row */}
                <div
                  className={`group flex items-center gap-2 px-2 py-[7px] rounded-md cursor-pointer transition-colors duration-150 ${
                    isExpanded ? "bg-transparent" : "hover:bg-[#F1F5F9]/60"
                  }`}
                  onClick={() => {
                    onSetActiveSubType(subType.id);
                    if (!isExpanded && isEnabled && isSeller) {
                      onActiveSectionChange(sections[0]?.id || activeSection);
                    }
                  }}
                >
                  {/* Expand/collapse chevron */}
                  <ChevronRight className={`w-3 h-3 shrink-0 transition-transform duration-150 ${
                    isExpanded ? "rotate-90 text-[#64748B]" : "text-[#CBD5E1] group-hover:text-[#94A3B8]"
                  }`} />

                  {/* Icon */}
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors duration-150 ${
                    isExpanded
                      ? "bg-[#0A77FF] text-white"
                      : isEnabled
                      ? "bg-[#DBEAFE] text-[#0A77FF]"
                      : "bg-[#F1F5F9] text-[#94A3B8]"
                  }`}>
                    {React.cloneElement(subType.icon as React.ReactElement, { className: "w-3.5 h-3.5" })}
                  </div>

                  {/* Label */}
                  <span className={`flex-1 min-w-0 text-[13px] truncate transition-colors duration-150 ${
                    isExpanded
                      ? "text-[#0F172A]"
                      : isEnabled
                      ? "text-[#1E293B]"
                      : "text-[#64748B] group-hover:text-[#334155]"
                  }`} style={{ fontWeight: isExpanded ? 600 : isEnabled ? 500 : 400 }}>
                    {subType.label}
                  </span>

                  {/* Toggle checkbox */}
                  <span
                    role="checkbox"
                    aria-checked={isEnabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSubType(subType.id);
                    }}
                    className={`relative w-4 h-4 rounded border-[1.5px] flex items-center justify-center shrink-0 transition-colors duration-150 cursor-pointer ${
                      isEnabled
                        ? "bg-[#0A77FF] border-[#0A77FF]"
                        : "border-[#CBD5E1] bg-white hover:border-[#94A3B8]"
                    }`}
                  >
                    {isEnabled && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </span>
                </div>

                {/* Nested config sections — only for seller type */}
                <div
                  className="overflow-hidden transition-all duration-200 ease-out"
                  style={{
                    maxHeight: isExpanded && isSeller ? `${sections.length * 34 + 8}px` : "0px",
                    opacity: isExpanded && isSeller ? 1 : 0,
                  }}
                >
                  <div className="ml-[18px] pl-[14px] border-l-[1.5px] border-[#E2E8F0] py-0.5">
                    {sections.map((section) => {
                      const isSectionActive = isExpanded && isEnabled && section.id === activeSection;
                      const isDisabledSection = !isEnabled;
                      return (
                        <button
                          key={section.id}
                          onClick={() => {
                            if (isDisabledSection) return;
                            onActiveSectionChange(section.id);
                          }}
                          className={`group/item w-full flex items-center gap-2 px-2 py-[6px] rounded-md text-left transition-colors duration-150 ${
                            isSectionActive
                              ? "bg-[#EDF4FF]"
                              : isDisabledSection
                              ? "opacity-30 cursor-not-allowed"
                              : "hover:bg-[#F1F5F9]/60"
                          }`}
                        >
                          <span className={`transition-colors duration-150 ${
                            isSectionActive
                              ? "text-[#0A77FF]"
                              : isDisabledSection
                              ? "text-[#CBD5E1]"
                              : "text-[#94A3B8] group-hover/item:text-[#64748B]"
                          }`}>
                            {React.cloneElement(section.icon as React.ReactElement, { className: "w-3.5 h-3.5" })}
                          </span>
                          <span className={`text-[12.5px] truncate transition-colors duration-150 ${
                            isSectionActive
                              ? "text-[#0A77FF]"
                              : isDisabledSection
                              ? "text-[#94A3B8]"
                              : "text-[#475569] group-hover/item:text-[#1E293B]"
                          }`} style={{ fontWeight: isSectionActive ? 600 : 400 }}>
                            {section.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
