import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaybackControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export default function PlaybackControls({
  isPlaying,
  onToggle,
}: PlaybackControlsProps) {
  return (
    <div className="flex justify-center py-4">
      <Button
        size="icon"
        onClick={onToggle}
        className="h-14 w-14 rounded-full"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}