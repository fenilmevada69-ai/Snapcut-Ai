import { Scissors } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-display font-bold text-xl tracking-tight ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary glow-sm border border-white/10">
        <Scissors className="w-5 h-5 text-white" />
      </div>
      <span className="text-foreground tracking-tighter">
        SnapCut<span className="text-primary ml-0.5">AI</span>
      </span>
    </div>
  );
}
