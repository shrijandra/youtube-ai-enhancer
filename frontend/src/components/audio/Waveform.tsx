import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformProps {
  audioUrl: string;
  onReady?: (waveSurfer: WaveSurfer) => void;
}

export default function Waveform({
  audioUrl,
  onReady,
}: WaveformProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,

      height: 120,

      waveColor: "#64748b",

      progressColor: "#3b82f6",

      cursorColor: "#ffffff",

      barWidth: 3,

      barGap: 2,

      barRadius: 4,
    });

    ws.load(audioUrl);

    ws.on("ready", () => {
      onReady?.(ws);
    });

    return () => {
      ws.destroy();
    };
  }, [audioUrl]);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
      <div ref={containerRef} />
    </div>
  );
}