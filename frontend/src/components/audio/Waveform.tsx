import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

interface WaveformProps {
  audioUrl: string;
}

export default function Waveform({ audioUrl }: WaveformProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,

      height: 120,

      waveColor: "#64748b",

      progressColor: "#3b82f6",

      cursorColor: "#ffffff",

      barWidth: 3,

      barGap: 2,

      barRadius: 4,
    });

    wavesurfer.load(audioUrl);

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl]);

  return (
    <div className="mt-6 rounded-xl border border-slate-700 bg-slate-950 p-4">
      <div ref={containerRef} />
    </div>
  );
}