import Waveform from "./Waveform";

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <div className="mt-6">
      <Waveform audioUrl={src} />

      <audio
        controls
        className="mt-4 w-full"
      >
        <source src={src} />
      </audio>
    </div>
  );
}