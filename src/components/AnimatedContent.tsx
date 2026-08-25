import {
  CSSProperties,
  ElementType,
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"

type AnimatedContentProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  children: ReactNode
  as?: ElementType
  distance?: number
  direction?: "horizontal" | "vertical"
  reverse?: boolean
  duration?: number
  ease?: "bounce.out" | "power3.out" | string
  initialOpacity?: number
  animateOpacity?: boolean
  scale?: number
  threshold?: number
  delay?: number
}

const easingMap: Record<string, string> = {
  "bounce.out": "cubic-bezier(0.16, 1, 0.3, 1)",
  "power3.out": "cubic-bezier(0.16, 1, 0.3, 1)",
}

export default function AnimatedContent({
  children,
  as: Tag = "div",
  className = "",
  distance = 110,
  direction = "horizontal",
  reverse = false,
  duration = 0.7,
  ease = "bounce.out",
  initialOpacity = 0.1,
  animateOpacity = true,
  scale = 0.8,
  threshold = 0.2,
  delay = 0.3,
  style,
  ...rest
}: AnimatedContentProps) {
  const nodeRef = useRef<HTMLElement | null>(null)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = nodeRef.current
    if (!node) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced || !("IntersectionObserver" in window)) {
      setVisible(true)
      setReady(true)
      return
    }

    setReady(true)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setVisible(true)
      observer.disconnect()
    }, { threshold })

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  const signedDistance = distance * (reverse ? -1 : 1)
  const variables = {
    "--animated-x": direction === "horizontal" ? `${signedDistance}px` : "0px",
    "--animated-y": direction === "vertical" ? `${signedDistance}px` : "0px",
    "--animated-duration": `${duration}s`,
    "--animated-delay": `${delay}s`,
    "--animated-ease": easingMap[ease] ?? ease,
    "--animated-opacity": animateOpacity ? initialOpacity : 1,
    "--animated-scale": scale,
    ...style,
  } as CSSProperties

  return (
    <Tag
      ref={nodeRef}
      className={`animated-content${ready ? " is-ready" : ""}${visible ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
      style={variables}
      {...rest}
    >
      {children}
    </Tag>
  )
}
