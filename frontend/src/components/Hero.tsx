import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
      <h2 className="text-5xl font-extrabold md:text-6xl">
        Professional AI Audio
        <br />
        & Video Enhancer
      </h2>

      <p className="mt-6 max-w-2xl text-lg text-slate-400">
        Remove background noise, enhance voice quality, and prepare
        professional audio for YouTube, podcasts, and online courses.
      </p>

      <div className="mt-10 flex gap-4">
        <Button size="lg">Upload Audio</Button>
        <Button variant="outline" size="lg">
          Learn More
        </Button>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
        <span>✅ Local Processing</span>
        <span>🔒 Privacy First</span>
        <span>⚡ AI Powered</span>
      </div>
    </section>
  );
}