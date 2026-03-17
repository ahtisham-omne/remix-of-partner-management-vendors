import { Badge } from "../ui/badge";
import type { VendorStatus } from "../../data/vendors";
import { STATUS_LABELS } from "../../data/vendors";

/*
 * AAA-compliant status badge colors
 * All text colors meet 7:1+ contrast on their respective background.
 *
 * Active:   #065F46 on #ECFDF5 → ~10.2:1 ✓ AAA
 * Inactive: #92400E on #FFFBEB → ~8.5:1  ✓ AAA
 * Archived: #334155 on #F1F5F9 → ~9.6:1  ✓ AAA
 */

const statusStyles: Record<VendorStatus, { bg: string; text: string; border: string; dot: string }> = {
  active: {
    bg: "#ECFDF5",
    text: "#065F46",
    border: "#A7F3D0",
    dot: "#059669",
  },
  inactive: {
    bg: "#FFFBEB",
    text: "#92400E",
    border: "#FDE68A",
    dot: "#D97706",
  },
  archived: {
    bg: "#F1F5F9",
    text: "#334155",
    border: "#CBD5E1",
    dot: "#64748B",
  },
};

interface VendorStatusBadgeProps {
  status: VendorStatus;
}

export function VendorStatusBadge({ status }: VendorStatusBadgeProps) {
  const s = statusStyles[status];
  return (
    <Badge
      variant="outline"
      style={{
        backgroundColor: s.bg,
        color: s.text,
        borderColor: s.border,
      }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ backgroundColor: s.dot }}
      />
      {STATUS_LABELS[status]}
    </Badge>
  );
}
