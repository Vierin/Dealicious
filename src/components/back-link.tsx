import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const row = "inline-flex items-center gap-2 text-sm text-ink";
const circle = "flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper";

function Mark() {
  return (
    <span className={circle}>
      <ChevronLeft size={18} strokeWidth={1.75} />
    </span>
  );
}

export function BackLink({
  href,
  label,
  overlay = false,
}: {
  href: string;
  label?: string;
  overlay?: boolean;
}) {
  if (overlay) {
    return (
      <Link
        href={href}
        aria-label="Назад"
        className="absolute top-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink"
      >
        <ChevronLeft size={22} strokeWidth={1.75} />
      </Link>
    );
  }
  return (
    <Link href={href} className={row}>
      <Mark />
      {label}
    </Link>
  );
}

export function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={row}>
      <Mark />
      {label}
    </button>
  );
}
