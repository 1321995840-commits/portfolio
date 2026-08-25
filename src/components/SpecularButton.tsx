/* finesse · component: button · register=brand
 * states: default · hover · focus-visible · active · disabled · loading · error · success
 * tokens: inherited (src/index.css) */
import {
  CSSProperties,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  Ref,
  useEffect,
  useRef,
} from "react"
import { Color, Mesh, Program, Renderer, Triangle } from "ogl"
import "./SpecularButton.css"

type ButtonSize = "sm" | "md" | "lg"
type ButtonState = "default" | "loading" | "error" | "success"

export type SpecularButtonProps = {
  children?: ReactNode
  size?: ButtonSize
  radius?: number
  tint?: string
  tintOpacity?: number
  blur?: number
  textColor?: string
  lineColor?: string
  baseColor?: string
  intensity?: number
  shineSize?: number
  shineFade?: number
  thickness?: number
  speed?: number
  followMouse?: boolean
  proximity?: number
  autoAnimate?: boolean
  disabled?: boolean
  state?: ButtonState
  href?: string
  target?: string
  rel?: string
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  className?: string
  type?: "button" | "submit" | "reset"
}

type ShaderProps = {
  radius: number
  lineColor: string
  baseColor: string
  intensity: number
  shineSize: number
  shineFade: number
  thickness: number
  speed: number
  followMouse: boolean
  proximity: number
  autoAnimate: boolean
}

const PAD = 20
const VERTEX = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`

const FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;
out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}
void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = sdRoundedRect(p, uHalfSize, uRadius);
  vec2 light = vec2(cos(uAngle), sin(uAngle));
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;
  vec2 normal = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(normal, light)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edge = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float highlight = line * rim * edge * uIntensity;
  vec3 color = uBaseColor * base + uLineColor * highlight;
  fragColor = vec4(color, clamp(base + highlight, 0.0, 1.0));
}`

const resolveToken = (value: string) => {
  const match = value.match(/^var\((--[^)]+)\)$/)
  if (!match) return value
  return getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim() || value
}

export default function SpecularButton({
  children = "继续",
  size = "lg",
  radius = 18,
  tint = "var(--ink)",
  tintOpacity = 0,
  blur = 0,
  textColor = "var(--ink)",
  lineColor = "var(--accent-bright)",
  baseColor = "var(--dim)",
  intensity = 0.88,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  state = "default",
  href,
  target,
  rel,
  onClick,
  className = "",
  type = "button",
}: SpecularButtonProps) {
  const elementRef = useRef<HTMLElement>(null)
  const effectRef = useRef<HTMLSpanElement>(null)
  const propsRef = useRef<ShaderProps>({} as ShaderProps)
  const inactive = disabled || state === "loading"

  propsRef.current = { radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate }

  useEffect(() => {
    const element = elementRef.current
    const effect = effectRef.current
    if (!element || !effect) return

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches
    const shouldAnimate = !reduced && finePointer && (followMouse || autoAnimate)
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    const geometry = new Triangle(gl)
    if (geometry.attributes.uv) delete geometry.attributes.uv
    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uCenter: { value: [0, 0] },
        uHalfSize: { value: [1, 1] },
        uRadius: { value: 0 },
        uAngle: { value: 2.4 },
        uPx: { value: dpr },
        uLineColor: { value: [1, 1, 1] },
        uBaseColor: { value: [0.32, 0.32, 0.32] },
        uIntensity: { value: 0.42 },
        uShineSize: { value: 0.17 },
        uShineFade: { value: 0.7 },
        uThickness: { value: 1 },
        uBaseWidth: { value: dpr },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })
    effect.appendChild(gl.canvas)

    const size = { width: 1, height: 1 }
    const targetMouse = { angle: 2.4, proximity: 0 }
    let angle = 2.4
    let idleAngle = 2.4
    let brightness = shouldAnimate ? 0 : 0.42
    let last = performance.now()
    let frame = 0

    const line = new Color(resolveToken(lineColor))
    const base = new Color(resolveToken(baseColor))
    const syncUniforms = (activeIntensity: number) => {
      const props = propsRef.current
      program.uniforms.uRadius.value = Math.min(props.radius, Math.min(size.width, size.height) / 2) * dpr
      program.uniforms.uLineColor.value = [line.r, line.g, line.b]
      program.uniforms.uBaseColor.value = [base.r, base.g, base.b]
      program.uniforms.uIntensity.value = props.intensity * activeIntensity
      program.uniforms.uShineSize.value = props.shineSize * Math.PI / 180
      program.uniforms.uShineFade.value = props.shineFade * Math.PI / 180
      program.uniforms.uThickness.value = props.thickness * dpr
      program.uniforms.uAngle.value = angle
    }
    const renderOnce = () => {
      syncUniforms(brightness)
      renderer.render({ scene: mesh })
    }
    const resize = () => {
      const rect = element.getBoundingClientRect()
      size.width = rect.width
      size.height = rect.height
      renderer.setSize(rect.width + PAD * 2, rect.height + PAD * 2)
      program.uniforms.uCenter.value = [(PAD + rect.width / 2) * dpr, (PAD + rect.height / 2) * dpr]
      program.uniforms.uHalfSize.value = [(rect.width / 2) * dpr, (rect.height / 2) * dpr]
      renderOnce()
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(element)
    resize()

    const handlePointerMove = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right)
      const dy = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom)
      const distance = Math.hypot(dx, dy)
      targetMouse.angle = distance === 0
        ? Math.atan2(2 / rect.height, -2 / rect.width) + ((event.clientX - centerX) / rect.width) * 0.4
        : Math.atan2(centerY - event.clientY, event.clientX - centerX)
      const proximityValue = Math.max(0, 1 - distance / Math.max(propsRef.current.proximity, 1))
      targetMouse.proximity = proximityValue * proximityValue * (3 - 2 * proximityValue)
    }

    const update = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.05)
      last = now
      const props = propsRef.current
      idleAngle += props.speed * delta
      const targetAngle = props.followMouse && targetMouse.proximity > 0 ? targetMouse.angle : idleAngle
      const difference = ((targetAngle - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      angle += difference * (1 - Math.exp(-delta * 7))
      const brightnessTarget = props.autoAnimate ? 1 : targetMouse.proximity
      brightness += (brightnessTarget - brightness) * (1 - Math.exp(-delta * 8))
      renderOnce()
      if (!document.hidden) frame = requestAnimationFrame(update)
    }
    const handleVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden && shouldAnimate) frame = requestAnimationFrame(update)
    }

    if (shouldAnimate) {
      window.addEventListener("pointermove", handlePointerMove)
      document.addEventListener("visibilitychange", handleVisibility)
      frame = requestAnimationFrame(update)
    }

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("visibilitychange", handleVisibility)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      gl.canvas.remove()
    }
  }, [autoAnimate, baseColor, followMouse, lineColor])

  const classes = `specular-button specular-button--${size} is-${state}${className ? ` ${className}` : ""}`
  const style = {
    "--sb-radius": `${radius}px`,
    "--sb-tint": tint,
    "--sb-tint-opacity": tintOpacity,
    "--sb-blur": `${blur}px`,
    "--sb-text-color": textColor,
  } as CSSProperties
  const label = <><span className="specular-button__label">{children}</span>{state === "loading" && <span className="specular-button__state">处理中</span>}</>

  const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (inactive) {
      event.preventDefault()
      return
    }
    onClick?.(event)
  }

  if (href) {
    return (
      <a
        ref={elementRef as Ref<HTMLAnchorElement>}
        href={inactive ? undefined : href}
        target={target}
        rel={rel}
        aria-disabled={inactive || undefined}
        aria-busy={state === "loading" || undefined}
        data-state={state}
        className={classes}
        style={style}
        onClick={handleClick}
      >
        <span ref={effectRef} className="specular-button__fx" aria-hidden="true" />
        {label}
      </a>
    )
  }

  return (
    <button
      ref={elementRef as Ref<HTMLButtonElement>}
      type={type}
      disabled={inactive}
      aria-busy={state === "loading" || undefined}
      data-state={state}
      className={classes}
      style={style}
      onClick={handleClick}
    >
      <span ref={effectRef} className="specular-button__fx" aria-hidden="true" />
      {label}
    </button>
  )
}
