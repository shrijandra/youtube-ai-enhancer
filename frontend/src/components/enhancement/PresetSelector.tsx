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

      <label className="block mb-2 font-medium">

        AI Preset

      </label>

      <select
        value={preset}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-md border border-slate-700 bg-slate-900 text-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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