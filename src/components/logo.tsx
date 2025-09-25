export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
        <div className="w-4 h-4 bg-accent-foreground rounded-sm"></div>
      </div>
      <span className="text-xl font-bold text-foreground">
        SEMILLERO
        <span className="text-muted-foreground font-normal ml-1">DIGITAL</span>
      </span>
    </div>
  )
}
