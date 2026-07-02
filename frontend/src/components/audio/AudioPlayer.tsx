interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <div className="mt-6">
      <audio controls className="w-full rounded-lg">
        <source src={src} />
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}