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

export function BackLink({ href, label }: { href: string; label: string }) {
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
