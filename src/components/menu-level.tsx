import { MENU_LEVELS } from "@/lib/profile";

export function MenuLevelCards({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      {MENU_LEVELS.map((level) => {
        const on = value === level.value;
        return (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={`rounded-2xl border px-4 py-3 text-left ${on ? "border-olive bg-paper" : "border-line bg-paper/60"}`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-serif text-xl">{level.label}</span>
              <span className="text-sm text-muted">{level.minutes}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{level.hint}</p>
          </button>
        );
      })}
    </div>
  );
}
