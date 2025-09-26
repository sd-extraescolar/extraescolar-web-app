"use client"

export function FloatingElements() {
  return (
    <>
      {/* Organic floating elements - left side - more towards corners */}
      <div className="fixed left-4 top-16 w-16 h-16 bg-accent/20 rounded-full animate-float-organic blur-sm"></div>
      <div className="fixed left-8 top-32 w-12 h-12 bg-secondary/30 rounded-full animate-float-organic delay-1000 blur-sm"></div>
      <div className="fixed left-2 top-48 w-20 h-20 bg-accent/15 rounded-full animate-float-organic delay-2000 blur-sm"></div>
      <div className="fixed left-6 top-64 w-8 h-8 bg-secondary/25 rounded-full animate-float-organic delay-3000 blur-sm"></div>
      <div className="fixed left-4 bottom-32 w-14 h-14 bg-accent/20 rounded-full animate-float-organic delay-4000 blur-sm"></div>
      <div className="fixed left-8 bottom-16 w-10 h-10 bg-secondary/30 rounded-full animate-float-organic delay-5000 blur-sm"></div>

      {/* Geometric floating elements - right side - more towards corners */}
      <div className="fixed right-4 top-24 w-10 h-10 bg-primary/20 rotate-45 animate-float-geometric blur-sm"></div>
      <div className="fixed right-8 top-8 w-6 h-6 bg-chart-2/30 rotate-12 animate-float-geometric delay-500 blur-sm"></div>
      <div className="fixed right-2 top-40 w-14 h-14 bg-primary/15 rotate-45 animate-float-geometric delay-1500 blur-sm"></div>
      <div className="fixed right-6 top-56 w-8 h-8 bg-chart-2/25 rotate-12 animate-float-geometric delay-2500 blur-sm"></div>
      <div className="fixed right-4 top-72 w-12 h-12 bg-primary/20 rotate-45 animate-float-geometric delay-3500 blur-sm"></div>
      <div className="fixed right-8 bottom-24 w-10 h-10 bg-chart-2/25 rotate-12 animate-float-geometric delay-4500 blur-sm"></div>
      <div className="fixed right-2 bottom-8 w-16 h-16 bg-primary/15 rotate-45 animate-float-geometric delay-5500 blur-sm"></div>

      {/* Additional scattered elements - corners */}
      <div className="fixed right-12 top-12 w-4 h-4 bg-chart-3/40 rounded-full animate-pulse-glow"></div>
      <div className="fixed right-16 top-28 w-6 h-6 bg-chart-4/30 rounded-full animate-pulse-glow delay-1000"></div>
      <div className="fixed right-6 top-80 w-3 h-3 bg-chart-5/50 rounded-full animate-pulse-glow delay-2000"></div>
      <div className="fixed left-12 top-8 w-5 h-5 bg-chart-3/35 rounded-full animate-pulse-glow delay-1500"></div>
      <div className="fixed left-16 bottom-12 w-4 h-4 bg-chart-4/40 rounded-full animate-pulse-glow delay-2500"></div>
    </>
  )
}
