interface Props {
  preset: string;
  onChange: (preset: string) => void;
}

export default function PresetSelector({
  preset,
  onChange,
}: Props) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-300">

        AI Preset

      </label>

      <select
        value={preset}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-white"
      >
        <option>Balanced</option>

        <option>Podcast</option>

        <option>Studio</option>

        <option>Strong Noise Removal</option>

        <option>Voice Focus</option>

      </select>

    </div>
  );
}