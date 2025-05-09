'use client';

import React from "react";
import { ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Send, 
  ArrowLeftRight,
  Wallet,
  Calculator,
  History,
  Building2,
  Menu, 
  Search, 
  Bell, 
  Sun,
  Moon,
  LogOut,
  Settings,
  ChevronRight,
  Banknote,
  BarChart2,
  ShieldCheck,
  Cog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { useTranslation } from "@/hooks/useTranslation";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { CommandPalette } from "@/components/commands/CommandPalette";
import { useLanguage } from "@/components/providers/LanguageProvider";
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import PlasmicLoaderComponent from '@/components/plasmic/PlasmicLoader';

interface NavItem {
  title: string;
  href: string;
  icon: any;
}

const mainNav: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Send Money", href: "/send-money", icon: Send },
  { title: "Currency Exchange", href: "/exchange", icon: ArrowLeftRight },
  { title: "Client Balance", href: "/client-balance", icon: Wallet },
  { title: "Cash Register", href: "/cash-register", icon: Calculator },
  { title: "Transactions", href: "/transactions", icon: History },
  { title: "Payout", href: "/payout", icon: Building2 },
  { title: "Reports", href: "/reports", icon: BarChart2 },
  { title: "KYC / Compliance", href: "/kyc", icon: ShieldCheck },
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Administration", href: "/admin", icon: Cog },
  // Add more pages here as needed
];

// Simple error boundary
function ErrorBoundary({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="text-destructive text-lg font-medium">Something went wrong.</div>
        <Button onClick={() => window.location.reload()}>Reload Page</Button>
      </div>
    );
  }
  // @ts-ignore
  return React.Children.only(children);
}

const SIDEBAR_COLLAPSE_KEY = "sidebar_collapsed";
const SIDEBAR_EXPANDED = 300;
const SIDEBAR_COLLAPSED = 80;

const AppLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const { t } = useTranslation();
  const { direction } = useLanguage();
  const whiteScreenTimeoutRef = useRef<NodeJS.Timeout>();
  const lastPathnameRef = useRef(pathname);
  const errorCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const contentRef = useRef<HTMLElement>(null);
  const [previousChildren, setPreviousChildren] = useState<ReactNode>(children);
  const emptyPageTimeoutRef = useRef<NodeJS.Timeout>();
  const [showFallback, setShowFallback] = useState(false);
  const [reloadAttempts, setReloadAttempts] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "true";
    }
    return false;
  });

  const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Clear any existing timeouts
    if (whiteScreenTimeoutRef.current) {
      clearTimeout(whiteScreenTimeoutRef.current);
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Reset error state on pathname change
    setError(null);
    setIsLoading(true);

    // Keep previous children during transition
    setPreviousChildren(children);

    // Set a new timeout to check for white screen
    whiteScreenTimeoutRef.current = setTimeout(() => {
      const mainContent = contentRef.current;
      if (mainContent && (mainContent.children.length === 0 || mainContent.clientHeight === 0)) {
        errorCountRef.current++;
        
        if (errorCountRef.current >= 3) {
          // After 3 failures, show error and try to recover
          setError("Unable to load content. Please try again.");
          retryTimeoutRef.current = setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          // Try a soft navigation first
          router.refresh();
        }
      } else {
        // Content loaded successfully
        errorCountRef.current = 0;
        setIsLoading(false);
      }
    }, 1000);

    // Update the last pathname
    lastPathnameRef.current = pathname;

    // Cleanup timeouts on unmount or pathname change
    return () => {
      if (whiteScreenTimeoutRef.current) {
        clearTimeout(whiteScreenTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      setIsLoading(false);
    };
  }, [pathname, router, children]);

  // Enhanced empty page check with fallback UI and debounce
  useEffect(() => {
    if (pathname !== lastPathnameRef.current) {
      setShowFallback(false);
      if (emptyPageTimeoutRef.current) clearTimeout(emptyPageTimeoutRef.current);
      emptyPageTimeoutRef.current = setTimeout(() => {
        const mainContent = contentRef.current;
        const hasContent = mainContent && (
          mainContent.children.length > 0 ||
          (mainContent.textContent?.trim().length ?? 0) > 0 ||
          mainContent.querySelector('img, svg, canvas, video') !== null
        );
        if (!hasContent) {
          if (reloadAttempts < 2) {
            setReloadAttempts(r => r + 1);
            router.refresh();
          } else {
            setShowFallback(true);
          }
        } else {
          setReloadAttempts(0);
        }
      }, 2000);
      lastPathnameRef.current = pathname;
    }
    return () => {
      if (emptyPageTimeoutRef.current) clearTimeout(emptyPageTimeoutRef.current);
    };
  }, [pathname, router, reloadAttempts]);

  // Keyboard shortcut for collapse/expand
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSidebarCollapsed((prev) => {
          localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(!prev));
          return !prev;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className={cn(
      "min-h-screen bg-gray-50 dark:bg-gray-900",
      direction === "rtl" && "rtl"
    )}>
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side={direction === "rtl" ? "right" : "left"} className="w-[280px] p-0 rounded-r-2xl transition-transform duration-300 ease-ios">
          <div className="h-full ios-blur rounded-r-2xl">
            <div className="flex h-[70px] items-center px-6 border-b">
              <Logo size={32} isIcon={true} showText={true} className="hover:scale-105" />
            </div>
            <div className="py-6">
              <nav className="space-y-2 px-4">
                {mainNav.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <div key={item.href} className="relative flex items-center">
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-indicator"
                          className="absolute left-0 h-6 w-1 bg-blue-500 rounded-r"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <Link
                        href={item.href}
                        className={cn(
                          "ios-nav-link group flex items-center gap-3 px-4 relative transition-all duration-200 ease-ios",
                          isActive && "scale-110"
                        )}
                        onClick={e => {
                          e.preventDefault();
                          setIsSidebarOpen(false);
                          window.location.href = item.href;
                        }}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-[15px] font-medium">{item.title}</span>
                        <ChevronRight className={cn(
                          "ml-auto h-5 w-5 opacity-0 transition-all duration-200 ease-ios group-hover:opacity-100",
                          direction === "rtl" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
                        )} />
                      </Link>
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <TooltipProvider delayDuration={0}>
        <aside
          className={cn(
            "ios-sidebar fixed inset-y-0 left-0 z-50 transition-all duration-300 flex flex-col",
            "bg-white/70 dark:bg-[#18181b]/80 backdrop-blur-2xl border-r border-white/30 dark:border-white/10 shadow-2xl rounded-r-3xl",
            sidebarCollapsed ? `w-[${SIDEBAR_COLLAPSED}px]` : `w-[${SIDEBAR_EXPANDED}px]`,
            direction === "rtl" && "left-auto right-0",
            "lg:block hidden"
          )}
          style={{ width: sidebarWidth }}
        >
        <div className={cn(
          "flex items-center border-b border-border/30 transition-all duration-300",
          sidebarCollapsed ? "h-[70px] px-3 justify-center" : "h-[80px] px-8 justify-start"
        )}>
          <div 
            className={cn("flex items-center gap-2 cursor-pointer", sidebarCollapsed && "justify-center w-full") }
          >
            <Logo 
              size={sidebarCollapsed ? 32 : 40} 
              isIcon={sidebarCollapsed} 
              showText={!sidebarCollapsed} 
              className="hover:scale-105" 
              onClick={() => {
                setSidebarCollapsed(!sidebarCollapsed);
                localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(!sidebarCollapsed));
              }}
            />
          </div>
        </div>
        <div className={cn("flex-1 overflow-y-auto transition-all duration-300", sidebarCollapsed ? "py-4" : "py-8") }>
          <nav className={cn("flex flex-col gap-2", sidebarCollapsed ? "px-2" : "px-4") }>
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              const navLink = (
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center transition-all duration-200 ease-ios relative font-semibold",
                    sidebarCollapsed
                      ? "justify-center rounded-2xl p-0 w-[56px] h-[56px] mx-auto hover:bg-blue-50/80 dark:hover:bg-blue-900/30"
                      : "gap-5 px-5 py-3 rounded-2xl text-gray-800 dark:text-gray-100 hover:bg-blue-50/80 dark:hover:bg-blue-900/30",
                    isActive && !sidebarCollapsed && "bg-blue-100/70 dark:bg-blue-900/40 scale-105 shadow-md",
                    isActive && sidebarCollapsed && "bg-blue-100/70 dark:bg-blue-900/40 scale-105 shadow-md"
                  )}
                  style={{ minHeight: 48 }}
                  onClick={e => {
                    e.preventDefault();
                    window.location.href = item.href;
                  }}
                  tabIndex={0}
                  aria-label={item.title}
                >
                  <item.icon className="h-7 w-7 drop-shadow mx-auto" />
                  {!sidebarCollapsed && <span className="font-medium tracking-tight ml-3">{item.title}</span>}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className={cn(
                        "absolute left-0 top-2 bottom-2 w-2 bg-blue-500 rounded-r-xl shadow-lg",
                        sidebarCollapsed ? "left-0 top-2 bottom-2 w-2" : "left-0 top-2 bottom-2 w-2"
                      )}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
              return sidebarCollapsed ? (
                <Tooltip key={item.href} delayDuration={0}>
                  <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                  <TooltipContent side="right" className="ml-2">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div key={item.href} className="relative flex items-center">{navLink}</div>
              );
            })}
          </nav>
        </div>
        <div className="flex-1 overflow-y-auto transition-all duration-300">
          <div className="p-4">
            {/* Empty div to maintain layout */}
          </div>
        </div>
      </aside>
      </TooltipProvider>

      {/* Main Content */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          direction === "rtl"
            ? `lg:pr-[${sidebarWidth}px] lg:pl-0 pr-0 pl-0`
            : `lg:pl-[${sidebarWidth}px] lg:pr-0 pl-0 pr-0`
        )}
        style={{
          transition: 'padding 0.3s cubic-bezier(0.4,0,0.2,1), margin 0.3s cubic-bezier(0.4,0,0.2,1)',
          ...(window.innerWidth >= 1024
            ? (direction === "rtl"
                ? { paddingRight: sidebarWidth, paddingLeft: 0 }
                : { paddingLeft: sidebarWidth, paddingRight: 0 })
            : { paddingLeft: 0, paddingRight: 0 })
        }}
      >
        {/* Header */}
        <header
          className={cn(
            "sticky top-0 z-50 bg-background border-b border-border transition-all duration-300",
            direction === "rtl"
              ? `lg:pr-[${sidebarWidth}px] lg:pl-0 pr-0 pl-0`
              : `lg:pl-[${sidebarWidth}px] lg:pr-0 pl-0 pr-0`
          )}
          style={{
            transition: 'padding 0.3s cubic-bezier(0.4,0,0.2,1), margin 0.3s cubic-bezier(0.4,0,0.2,1)',
            ...(window.innerWidth >= 1024
              ? (direction === "rtl"
                  ? { paddingRight: sidebarWidth, paddingLeft: 0 }
                  : { paddingLeft: sidebarWidth, paddingRight: 0 })
              : { paddingLeft: 0, paddingRight: 0 })
          }}
        >
          <div className="flex h-[70px] items-center justify-between gap-6 px-4 lg:px-6 w-full">
            <div className="flex items-center gap-4 flex-1">
              <div className="lg:hidden">
                <Logo 
                  size={32} 
                  isIcon={true} 
                  showText={false} 
                  className="hover:scale-105" 
                  onClick={() => setIsSidebarOpen(true)}
                />
              </div>
              <div className="flex-1 w-full max-w-[800px]">
                <CommandPalette />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <NotificationCenter />
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl h-[40px] w-[40px] transition-all duration-300 ease-ios active:scale-95"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-[40px] w-[40px] rounded-xl"
                  >
                    <Avatar className="h-[40px] w-[40px] rounded-xl">
                      <AvatarImage src="/images/avatar.svg" alt="Avatar" className="rounded-xl" />
                      <AvatarFallback className="bg-primary/10 text-primary rounded-xl text-[15px]">GR</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={direction === "rtl" ? "start" : "end"} className="w-[240px] rounded-xl">
                  <DropdownMenuItem className="rounded-lg h-[40px] text-[15px] transition-colors duration-200 ease-ios hover:bg-primary/5 dark:hover:bg-primary/10 focus:bg-primary/10 dark:focus:bg-primary/20">
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings className={cn(
                        "h-5 w-5 transition-transform duration-200 ease-ios group-hover:scale-110",
                        direction === "rtl" ? "ml-3" : "mr-3"
                      )} />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 dark:text-red-400 rounded-lg h-[40px] text-[15px] transition-colors duration-200 ease-ios hover:bg-red-50 dark:hover:bg-red-950/20 focus:bg-red-100 dark:focus:bg-red-950/30">
                    <button 
                      onClick={logout}
                      className="flex items-center w-full"
                    >
                      <LogOut className={cn(
                        "h-5 w-5 transition-transform duration-200 ease-ios group-hover:scale-110",
                        direction === "rtl" ? "ml-3" : "mr-3"
                      )} />
                      <span>Log out</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            ref={contentRef}
            key={pathname}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-[calc(100vh-70px)] py-4 lg:py-6 relative"
          >
            {isLoading && <LoadingOverlay />}
            {showFallback && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50 gap-4">
                <div className="text-destructive text-lg font-medium">Content failed to load.</div>
                <Button onClick={() => { setReloadAttempts(0); setShowFallback(false); router.refresh(); }}>Retry</Button>
              </div>
            )}
            {error && (
              <motion.div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="text-destructive text-lg font-medium">{error}</div>
                  <Button 
                    variant="default" 
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Reload Page
                  </Button>
                </div>
              </motion.div>
            )}
            <div className="w-full px-4 lg:px-6 relative z-10">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div>
                  {pathname === "/dashboard" ? (
                    <div>
                      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white mb-1">Welcome back, Demo User</h1>
                      <p className="text-[15px] text-gray-500 dark:text-gray-400">Here's your teller dashboard overview.</p>
                    </div>
                  ) : (
                    <h1 className="text-2xl font-semibold tracking-tight">{mainNav.find(item => item.href === pathname)?.title || ''}</h1>
                  )}
                </div>
              </div>
              <div className="w-full">
                <ErrorBoundary>{children}</ErrorBoundary>
              </div>
            </div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppLayout;

// Add Plasmic loader to the root of your app
export function PlasmicRootProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <PlasmicLoaderComponent />
      {children}
    </>
  );
}
