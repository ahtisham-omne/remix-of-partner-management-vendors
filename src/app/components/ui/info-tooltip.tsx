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
    <TooltipPrimitive.Provider delayDuration={400} skipDelayDuration={200}>
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
              "z-[300] max-w-[240px] rounded-lg bg-[#1E293B] px-3 py-2 text-[12px] leading-[1.5] text-white shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
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
