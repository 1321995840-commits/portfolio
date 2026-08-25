import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"

type ScrollRevealProps = {
  children: string
  baseOpacity?: number
  enableBlur?: boolean
  baseRotation?: number
  blurStrength?: number
  className?: string
}

export default function ScrollReveal({
  children,
  baseOpacity = 0.38,
  enableBlur = true,
  baseRotation = 0,
  blurStrength = 3,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [armed, setArmed] = useState(false)
  const [visible, setVisible] = useState(false)
  const segments = useMemo(() => {
    const segmenter = new Intl.Segmenter("zh-CN", { granularity: "word" })
    return Array.from(segmenter.segment(children), ({ segment }) => segment)
  }, [children])

  useEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }
    setArmed(true)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setVisible(true)
      observer.disconnect()
    }, { threshold: 0.28, rootMargin: "0px 0px -10% 0px" })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  let revealIndex = -1
  return (
    <p
      ref={ref}
      className={`scroll-reveal ${armed ? "is-armed" : ""} ${visible ? "is-visible" : ""} ${className}`.trim()}
      aria-label={children}
      style={{
        "--reveal-base-opacity": baseOpacity,
        "--reveal-blur": enableBlur ? `${blurStrength}px` : "0px",
        "--reveal-rotation": `${baseRotation}deg`,
      } as CSSProperties}
    >
      {segments.map((segment, index) => {
        if (!segment.trim()) return <span aria-hidden="true" key={`${segment}-${index}`}>{segment}</span>
        revealIndex += 1
        return <span aria-hidden="true" className="scroll-reveal-word" key={`${segment}-${index}`} style={{ "--reveal-index": revealIndex } as CSSProperties}>{segment}</span>
      })}
    </p>
  )
}
