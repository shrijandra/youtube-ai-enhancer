interface VideoPlayerProps {
  src: string;
}

export default function VideoPlayer({ src }: VideoPlayerProps) {
  return (
    <div className="mt-6">
      <video
        controls
        className="w-full rounded-xl"
      >
        <source src={src} />
      </video>
    </div>
  );
}