import { ShieldCheck } from 'lucide-react';

export function TopBar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-paper/95 px-4 py-3.5 backdrop-blur md:px-8 md:py-5">
      <div className="flex items-center gap-2 md:hidden">
        <ShieldCheck className="h-5 w-5 text-gold-deep" strokeWidth={1.75} />
      </div>
      <h1 className="font-display text-xl text-ink md:text-2xl">{title}</h1>
      <div />
    </header>
  );
}
