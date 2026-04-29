export default function GoldDivider({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 my-6 ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/40" />
      <div className="w-1.5 h-1.5 bg-gold rotate-45 flex-shrink-0" />
      <div className="w-6 h-px bg-gold/60" />
      <div className="w-1.5 h-1.5 bg-gold rotate-45 flex-shrink-0" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  )
}
