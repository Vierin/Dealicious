"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronLeft } from "lucide-react";

const circle = "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ink";

export function BackLink({
  href,
  overlay = false,
}: {
  href: string;
  label?: string;
  overlay?: boolean;
}) {
  const t = useTranslations("nav");
  if (overlay) {
    return (
      <Link
        href={href}
        aria-label={t("back")}
        className="absolute top-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink"
      >
        <ChevronLeft size={22} strokeWidth={1.75} />
      </Link>
    );
  }
  return (
    <Link href={href} aria-label={t("back")} className={circle}>
      <ChevronLeft size={22} strokeWidth={1.75} />
    </Link>
  );
}

export function BackButton({ onClick }: { label?: string; onClick: () => void }) {
  const t = useTranslations("nav");
  return (
    <button type="button" onClick={onClick} aria-label={t("back")} className={circle}>
      <ChevronLeft size={22} strokeWidth={1.75} />
    </button>
  );
}
