import { useEffect, useState } from 'react'

function getTimeLeft(targetDate) {
  const total = new Date(targetDate) - new Date()
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / 1000 / 60) % 60),
    seconds: Math.floor((total / 1000) % 60),
  }
}

export default function CountdownTimer({ targetDate }) {
  const [time, setTime] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft(targetDate)), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const units = [
    { label: 'Hari', value: time.days },
    { label: 'Jam', value: time.hours },
    { label: 'Menit', value: time.minutes },
    { label: 'Detik', value: time.seconds },
  ]

  return (
    <div className="flex gap-6 md:gap-10 justify-center">
      {units.map(({ label, value }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="font-display text-5xl md:text-6xl font-light text-gold tabular-nums leading-none">
            {String(value).padStart(2, '0')}
          </div>
          <div className="font-body text-xs tracking-[0.2em] uppercase text-muted mt-2">
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
