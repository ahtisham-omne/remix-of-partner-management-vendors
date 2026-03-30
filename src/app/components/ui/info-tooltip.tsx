import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import { cn } from "./utils";

interface InfoTooltipProps {
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  className?: string;
  iconClassName?: string;
}

/**
 * A standardised dark info tooltip with a 400ms hover delay.
 * Use this wherever an ⓘ icon needs to explain a field.
 */
export function InfoTooltip({
  children,
  side = "top",
  sideOffset = 6,
  className,
  iconClassName,
}: InfoTooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200} skipDelayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          <button type="button" className="inline-flex" tabIndex={-1} onClick={(e) => e.stopPropagation()}>
            <Info
              className={cn(
                "w-3 h-3 text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors",
                iconClassName,
              )}
            />
          </button>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={sideOffset}
            className={cn(
              "z-[300] max-w-[240px] rounded-xl bg-white text-[#334155] border border-[#E2E8F0] px-3 py-2 text-[12px] leading-[1.5] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.03)] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className,
            )}
          >
            {children}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
