export function RangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  readout,
  minLabel,
  maxLabel,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  readout: string;
  minLabel: string;
  maxLabel: string;
}) {
  return (
    <div>
      <div className="font-serif text-4xl leading-none">{readout}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="deal-range mt-6 w-full cursor-pointer"
      />
      <div className="mt-3 flex justify-between text-sm text-muted">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}
