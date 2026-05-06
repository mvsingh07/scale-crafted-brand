export const Footer = () => (
  <footer className="border-t border-border/60 py-10">
    <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
      <div className="flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded bg-gradient-brand text-[11px] font-bold text-primary-foreground">M</span>
        <span className="font-mono">© {new Date().getFullYear()} Manvir Singh — Engineering at scale.</span>
      </div>
      <div className="font-mono text-xs">Designed & built with intent.</div>
    </div>
  </footer>
);
