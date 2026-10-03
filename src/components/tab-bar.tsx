"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Calendar, ShoppingBag, User, Utensils } from "lucide-react";

const tabs = [
  { href: "/week", key: "week", icon: Calendar },
  { href: "/meals", key: "meals", icon: Utensils },
  { href: "/shop", key: "shop", icon: ShoppingBag },
  { href: "/profile", key: "profile", icon: User },
] as const;

export function TabBar() {
  const path = usePathname();
  const t = useTranslations("nav");
  if (path === "/" || path.startsWith("/login") || path.startsWith("/signup") || path.startsWith("/onboarding")) return null;

  return (
    <>
      <div className="h-20 md:hidden" aria-hidden />
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <ul className="mx-auto grid h-16 max-w-lg grid-cols-4">
          {tabs.map((tab) => {
            const on = isOn(path, tab.href);
            const Icon = tab.icon;
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={on ? "page" : undefined}
                  className={`flex h-full flex-col items-center justify-center gap-1 text-[11px] ${on ? "text-olive" : "text-muted"}`}
                >
                  <Icon size={22} strokeWidth={1.75} />
                  {t(tab.key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

function isOn(path: string, href: string): boolean {
  if (href === "/week") return path === "/week" || path.startsWith("/subscribe");
  if (href === "/meals") return path.startsWith("/meals") || path.startsWith("/recipe");
  return path === href || path.startsWith(`${href}/`);
}
