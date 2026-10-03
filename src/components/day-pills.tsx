import { SHOP_DAYS } from "@/lib/options";

export function DayPills({ selected, onPick }: { selected: number[]; onPick: (day: number) => void }) {
  return (
    <div className="flex gap-1.5">
      {SHOP_DAYS.map((day) => {
        const on = selected.includes(day.value);
        return (
          <button
            key={day.value}
            type="button"
            aria-pressed={on}
            aria-label={day.label}
            onClick={() => onPick(day.value)}
            className={`h-11 min-w-0 flex-1 rounded-full border text-sm ${on ? "border-olive bg-olive text-paper" : "border-line bg-paper text-ink"}`}
          >
            {day.short}
          </button>
        );
      })}
    </div>
  );
}
