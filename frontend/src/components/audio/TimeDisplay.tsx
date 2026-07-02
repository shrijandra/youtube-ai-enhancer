interface TimeDisplayProps {
  current: number;
  duration: number;
}

function format(seconds: number) {
  if (!seconds) return "00:00";

  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);

  return `${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

export default function TimeDisplay({
  current,
  duration,
}: TimeDisplayProps) {
  return (
    <div className="mt-2 flex justify-between text-sm text-slate-400">
      <span>{format(current)}</span>

      <span>{format(duration)}</span>
    </div>
  );
}