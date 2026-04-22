"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteChangePointerEventsFix() {
  const pathname = usePathname();

  useEffect(() => {
    // Force cleanup pointer-events: none on body 
    // This handles the edge case where a user clicks a link while a Radix/Shadcn dialog is open
    // Next.js SPA navigation does not trigger Radix's unmount cleanup
    document.body.style.pointerEvents = "auto";
    document.body.removeAttribute("data-scroll-locked");
  }, [pathname]);

  return null;
}
