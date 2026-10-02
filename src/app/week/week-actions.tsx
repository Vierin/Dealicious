export function WeekActions({ trialOpen }: { trialOpen: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      {trialOpen ? null : (
        <a href="/subscribe" className="text-olive">
          Подписка
        </a>
      )}
      <a href="/meals" className="hidden text-muted md:inline">
        Блюда
      </a>
      <a href="/profile" className="hidden text-muted md:inline">
        Профиль
      </a>
    </div>
  );
}
