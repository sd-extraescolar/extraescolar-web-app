"use client"

export function FloatingElements() {
  return (
    <>
      {/* Organic floating elements - left side */}
      <div className="fixed left-10 top-20 w-16 h-16 bg-accent/20 rounded-full animate-float-organic blur-sm"></div>
      <div className="fixed left-32 top-40 w-12 h-12 bg-secondary/30 rounded-full animate-float-organic delay-1000 blur-sm"></div>
      <div className="fixed left-20 top-60 w-20 h-20 bg-accent/15 rounded-full animate-float-organic delay-2000 blur-sm"></div>
      <div className="fixed left-40 top-80 w-8 h-8 bg-secondary/25 rounded-full animate-float-organic delay-3000 blur-sm"></div>

      {/* Geometric floating elements - right side */}
      <div className="fixed right-16 top-32 w-10 h-10 bg-primary/20 rotate-45 animate-float-geometric blur-sm"></div>
      <div className="fixed right-32 top-16 w-6 h-6 bg-chart-2/30 rotate-12 animate-float-geometric delay-500 blur-sm"></div>
      <div className="fixed right-20 top-52 w-14 h-14 bg-primary/15 rotate-45 animate-float-geometric delay-1500 blur-sm"></div>
      <div className="fixed right-40 top-72 w-8 h-8 bg-chart-2/25 rotate-12 animate-float-geometric delay-2500 blur-sm"></div>
      <div className="fixed right-12 top-96 w-12 h-12 bg-primary/20 rotate-45 animate-float-geometric delay-3500 blur-sm"></div>

      {/* Additional scattered elements */}
      <div className="fixed right-60 top-24 w-4 h-4 bg-chart-3/40 rounded-full animate-pulse-glow"></div>
      <div className="fixed right-80 top-44 w-6 h-6 bg-chart-4/30 rounded-full animate-pulse-glow delay-1000"></div>
      <div className="fixed right-72 top-64 w-3 h-3 bg-chart-5/50 rounded-full animate-pulse-glow delay-2000"></div>
    </>
  )
}
