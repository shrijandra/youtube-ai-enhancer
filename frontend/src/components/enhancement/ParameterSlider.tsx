interface ParameterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export default function ParameterSlider({
  label,
  value,
  onChange,
}: ParameterSliderProps) {
  return (
    <div className="space-y-2">

      <div className="flex justify-between">

        <span className="font-medium">

          {label}

        </span>

        <span className="text-blue-400">

          {value}%

        </span>

      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="w-full accent-blue-500"
      />

    </div>
  );
}