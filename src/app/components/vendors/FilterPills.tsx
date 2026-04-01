import React from "react";

export interface FilterPillOption {
  key: string;
  label: string;
  count?: number;
  showCount?: boolean;
}

interface FilterPillsProps {
  options: FilterPillOption[];
  activeKey: string;
  onSelect: (key: string) => void;
}

/**
 * Reusable filter pill bar matching the partner listing table style.
 * Uses semantic design tokens — no hard-coded fill colors on active state.
 */
export function FilterPills({ options, activeKey, onSelect }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {options.map((opt) => {
        const isActive = activeKey === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onSelect(opt.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isActive
                ? "border-[#0A77FF]/25 bg-[#EDF4FF] hover:bg-[#D6E8FF] active:bg-[#ADD1FF]"
                : "border-[#E2E8F0] bg-transparent text-[#334155] hover:bg-[#F1F5F9] hover:border-[#CBD5E1] active:bg-[#E2E8F0]"
            }`}
            style={{
              fontWeight: isActive ? 600 : 500,
              color: isActive ? "#0A77FF" : undefined,
            }}
          >
            {opt.label}
            {opt.showCount && opt.count !== undefined && (
              <span
                className={`text-[10px] rounded-full px-1.5 py-px min-w-[18px] text-center ${
                  isActive ? "bg-[#0A77FF]/12" : "bg-[#E2E8F0]"
                }`}
                style={{
                  fontWeight: 600,
                  color: isActive ? "#0A77FF" : "#475569",
                }}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
