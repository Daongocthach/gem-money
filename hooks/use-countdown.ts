import { useEffect, useMemo, useRef, useState } from 'react'

export function useCountdownSeconds(
  initialSeconds: number,
  autoStart: boolean = true
) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [secondsLeft, setSecondsLeft] = useState(
    autoStart ? initialSeconds : 0
  )
  const [isRunning, setIsRunning] = useState(autoStart)

  const start = (seconds = initialSeconds) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setSecondsLeft(seconds)
    setIsRunning(true)
  }

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRunning(false)
    setSecondsLeft(0)
  }

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRunning, secondsLeft])

  const formatted = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
    const s = secondsLeft % 60
    return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`
  }, [secondsLeft])

  return {
    secondsLeft,
    formatted,
    isExpired: secondsLeft === 0,
    isRunning,
    start,
    stop,
  }
}
