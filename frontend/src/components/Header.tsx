import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎙️</span>
          <h1 className="text-xl font-bold">AI Creator Studio</h1>
        </div>

        <nav className="flex items-center gap-3">
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">Docs</Button>
          <Button variant="outline">GitHub</Button>
        </nav>
      </div>
    </header>
  );
}