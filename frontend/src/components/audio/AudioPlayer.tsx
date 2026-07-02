import { useState } from "react";
import WaveSurfer from "wavesurfer.js";

import Waveform from "./Waveform";
import PlaybackControls from "./PlaybackControls";
import TimeDisplay from "./TimeDisplay";
import VolumeControl from "./VolumeControl";

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(100);

  const togglePlay = () => {
    if (!waveSurfer) return;

    waveSurfer.playPause();
  };

  const handleReady = (ws: WaveSurfer) => {
    setWaveSurfer(ws);

    setDuration(ws.getDuration());

    ws.on("play", () => setIsPlaying(true));

    ws.on("pause", () => setIsPlaying(false));

    ws.on("timeupdate", (time) => {
      setCurrentTime(time);
    });
  };

  const changeVolume = (value: number) => {
    setVolume(value);

    waveSurfer?.setVolume(value / 100);
  };

  return (
    <div className="mt-6">

      <Waveform
        audioUrl={src}
        onReady={handleReady}
      />

      <PlaybackControls
        isPlaying={isPlaying}
        onToggle={togglePlay}
      />

      <TimeDisplay
        current={currentTime}
        duration={duration}
      />

      <VolumeControl
        value={volume}
        onChange={changeVolume}
      />

    </div>
  );
}