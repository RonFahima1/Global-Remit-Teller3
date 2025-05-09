"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationCenter() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-xl h-[40px] w-[40px] transition-colors duration-200 ease-ios active:scale-95"
    >
      <Bell className="h-5 w-5" />
      <span className="sr-only">Notifications</span>
    </Button>
  );
} 