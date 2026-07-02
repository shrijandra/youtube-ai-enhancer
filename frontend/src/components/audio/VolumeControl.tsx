import { Volume2 } from "lucide-react";

interface VolumeControlProps {
  value: number;
  onChange: (value: number) => void;
}

export default function VolumeControl({
  value,
  onChange,
}: VolumeControlProps) {
  return (
    <div className="mt-6 flex items-center gap-4">
      <Volume2 className="h-5 w-5 text-slate-300" />

      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500"
      />

      <span className="w-12 text-right text-sm text-slate-300">
        {value}%
      </span>
    </div>
  );
}