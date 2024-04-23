"use client";
import cn from "classnames";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { Home, Calculator, PanelLeft, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { ModeToggle } from "../mode-toggle";
import UserMenu from "../user-menu";

export const menuItems = [
  {
    label: "Home",
    value: "/",
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: "Dashboard",
    value: "/dashboard",
    icon: <Calculator className="h-5 w-5" />,
  },
];

export default function AsideMenu() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              {menuItems?.map((item) => (
                <Link
                  key={`sheet-menu-${item.value}`}
                  href={item.value}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="relative ml-auto flex-1 md:grow-0"></div>
        <div
          className={cn("hidden", {
            flex: pathname !== "/",
          })}
        >
          <ModeToggle />
          <UserMenu />
        </div>
      </header>

      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {menuItems?.map((item) => (
            <Tooltip key={item.value}>
              <TooltipTrigger asChild>
                <Link
                  href={item.value}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    {
                      "bg-primary text-primary-foreground":
                        pathname === item.value,
                    },
                  )}
                >
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <UserMenu />
          <ModeToggle />
        </nav>
      </aside>
    </TooltipProvider>
  );
}
