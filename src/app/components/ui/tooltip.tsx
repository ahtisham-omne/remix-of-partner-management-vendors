"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "./utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  children,
  asChild,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  // Filter out Figma inspector props (starting with _fg) to avoid React DOM warnings
  const filteredProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !key.startsWith("_fg"))
  );

  // When asChild is used, Radix's Slot merges props onto the child via cloneElement.
  // FGCmp wrappers in the Figma environment also inject _fg props onto the child,
  // so we must strip them from the child's props too.
  if (asChild && React.isValidElement(children)) {
    const childProps = (children as React.ReactElement<Record<string, unknown>>).props;
    const filteredChildProps = Object.fromEntries(
      Object.entries(childProps).filter(([key]) => !key.startsWith("_fg"))
    );
    const cleanChild = React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      filteredChildProps
    );
    return (
      <TooltipPrimitive.Trigger data-slot="tooltip-trigger" asChild {...filteredProps}>
        {cleanChild}
      </TooltipPrimitive.Trigger>
    );
  }

  return (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" asChild={asChild} {...filteredProps}>
      {children}
    </TooltipPrimitive.Trigger>
  );
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-white text-[#334155] border border-[#E2E8F0] shadow-sm animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[300] w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className,
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-white fill-white border border-[#E2E8F0] z-[300] size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };