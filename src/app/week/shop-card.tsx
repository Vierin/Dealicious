"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function ShopCard({
  planId,
  productIds,
}: {
  planId: string;
  productIds: string[];
}) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(`dealicious-checks:${planId}`);
    if (!raw) {
      setDone(0);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      const ids = new Set(productIds);
      setDone(parsed.filter((item) => typeof item === "string" && ids.has(item)).length);
    } catch {
      setDone(0);
    }
  }, [planId, productIds]);

  return (
    <Link
      href="/shop"
      className="flex h-full items-center justify-between gap-4 rounded-3xl border border-line bg-paper px-5 py-5"
    >
      <span>
        <span className="block font-serif text-2xl">Список</span>
        <span className="mt-1 block text-sm text-muted">Открыть</span>
      </span>
      <span className="font-serif text-3xl">
        {done}/{productIds.length}
      </span>
    </Link>
  );
}
