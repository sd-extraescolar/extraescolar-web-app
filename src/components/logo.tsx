export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img 
        src="/extraescolar-icon.png" 
        alt="Extraescolar Logo" 
        className="w-8 h-8 object-contain"
      />
      <span className="text-xl font-bold text-education-green">
        Extraescolar
      </span>
    </div>
  )
}
