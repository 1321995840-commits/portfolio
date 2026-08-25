import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"

type BlurTextProps = {
  text: string
  delay?: number
  startDelay?: number
  animateBy?: "words" | "characters"
  direction?: "top" | "bottom"
  className?: string
  onAnimationComplete?: () => void
}

export default function BlurText({
  text,
  delay = 90,
  startDelay = 0,
  animateBy = "words",
  direction = "top",
  className = "",
  onAnimationComplete,
}: BlurTextProps) {
  const [started, setStarted] = useState(false)
  const completed = useRef(false)
  const parts = useMemo(() => animateBy === "characters" ? Array.from(text) : text.split(/(\s+)/), [animateBy, text])
  const animatedCount = parts.filter((part) => part.trim().length > 0).length

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const frame = requestAnimationFrame(() => setStarted(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  let animatedIndex = -1
  return (
    <span
      className={`blur-text ${started ? "is-animated" : ""} ${className}`.trim()}
      aria-label={text}
      style={{
        "--blur-delay": `${delay}ms`,
        "--blur-start": `${startDelay}ms`,
        "--blur-y": direction === "top" ? "-20px" : "20px",
      } as CSSProperties}
    >
      {parts.map((part, index) => {
        if (!part.trim()) return <span aria-hidden="true" key={`${part}-${index}`}>{part}</span>
        animatedIndex += 1
        const currentIndex = animatedIndex
        return (
          <span
            aria-hidden="true"
            className="blur-text-word"
            key={`${part}-${index}`}
            style={{ "--word-index": currentIndex } as CSSProperties}
            onAnimationEnd={currentIndex === animatedCount - 1 ? () => {
              if (completed.current) return
              completed.current = true
              onAnimationComplete?.()
            } : undefined}
          >{part}</span>
        )
      })}
    </span>
  )
}
