import AudioPlayer from "../audio/AudioPlayer";
import VideoPlayer from "../video/VideoPlayer";
import EnhancementPanel from "../enhancement/EnhancementPanel";

interface FileInfoProps {
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
}

export default function FileInfo({
  file,
  name,
  size,
  type,
  previewUrl,
}: FileInfoProps) {
  const isVideo = type.startsWith("video");

  return (
    <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">

      <div className="flex items-center gap-3">

        <div className="text-4xl">

          {isVideo ? "🎥" : "🎵"}

        </div>

        <div>

          <h3 className="font-semibold text-lg">

            {name}

          </h3>

          <p className="text-sm text-green-400">

            ✓ Ready for Enhancement

          </p>

        </div>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div>

          <p className="text-slate-400 text-sm">

            Size

          </p>

          <p>

            {(size / 1024 / 1024).toFixed(2)} MB

          </p>

        </div>

        <div>

          <p className="text-slate-400 text-sm">

            Type

          </p>

          <p>

            {isVideo ? (
              <VideoPlayer src={previewUrl} />
            ) : (
             // <AudioPlayer src={previewUrl} />
              <>
              <AudioPlayer src={previewUrl} />
              <EnhancementPanel file={file} />
              </>
              
            )}
          

          </p>

        </div>

      </div>

    </div>
  );
}