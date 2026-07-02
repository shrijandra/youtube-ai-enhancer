import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

export default function UploadCard() {
  const [file, setFile] = useState<UploadedFile | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const selected = acceptedFiles[0];

    setFile({
      name: selected.name,
      size: selected.size,
      type: selected.type,
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "audio/*": [],
      "video/*": [],
    },
  });

  return (
    <Card className="mx-auto mt-12 max-w-3xl border-dashed border-2 border-slate-700 bg-slate-900">
      <CardContent className="p-10 text-center">

        <div
          {...getRootProps()}
          className="cursor-pointer rounded-lg p-10 transition hover:bg-slate-800"
        >
          <input {...getInputProps()} />

          <div className="text-6xl">📁</div>

          <h2 className="mt-4 text-2xl font-semibold">
            Drag & Drop Audio or Video
          </h2>

          <p className="mt-3 text-slate-400">
            MP3 • WAV • FLAC • MP4 • MOV • MKV
          </p>

          <Button className="mt-8">
            Browse Files
          </Button>
        </div>

        {file && (
          <div className="mt-8 rounded-lg bg-slate-800 p-6 text-left">

            <h3 className="mb-4 text-xl font-bold">
              Selected File
            </h3>

            <p>
              <strong>Name:</strong> {file.name}
            </p>

            <p>
              <strong>Type:</strong> {file.type}
            </p>

            <p>
              <strong>Size:</strong>{" "}
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>

          </div>
        )}

      </CardContent>
    </Card>
  );
}