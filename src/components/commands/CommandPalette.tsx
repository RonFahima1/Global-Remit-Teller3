"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function CommandPalette() {
  return (
    <div className="relative">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full h-10 pl-9 bg-muted/50 border-none focus-visible:ring-1"
        />
      </div>
    </div>
  );
} 