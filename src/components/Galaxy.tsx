import { HTMLAttributes, useEffect, useRef } from "react"
import { Color, Mesh, Program, Renderer, Triangle } from "ogl"

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform bool uTransparent;
varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }
float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}
float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 k = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + k.xyz) * 6.0 - k.www);
  return c.z * mix(k.xxx, clamp(p - k.xxx, 0.0, 1.0), c.y);
}

float starShape(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / max(d, 0.001);
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  return m * smoothstep(1.0, 0.2, d);
}

vec3 starLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + offset;
      float seed = hash21(si);
      float size = fract(seed * 345.32);
      float gloss = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flare = smoothstep(0.94, 1.0, size) * gloss;
      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blue = smoothstep(STAR_COLOR_CUTOFF, 1.0, hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float green = min(red, blue) * seed;
      vec3 base = vec3(red, green, blue);
      float hue = atan(base.g - base.r, base.b - base.r) / 6.28318 + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));
      vec2 drift = vec2(
        tris(seed * 34.0 + uTime * uSpeed / 10.0),
        tris(seed * 38.0 + uTime * uSpeed / 30.0)
      ) - 0.5;
      float star = starShape(gv - offset - drift, flare);
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      star *= mix(1.0, twinkle, uTwinkleIntensity);
      col += star * size * base;
    }
  }
  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
  vec2 mouseNorm = uMouse - vec2(0.5);

  if (uMouseRepulsion) {
    vec2 mousePos = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float distanceToMouse = length(uv - mousePos);
    uv += normalize(uv - mousePos) * (uRepulsionStrength / (distanceToMouse + 0.1)) * 0.05 * uMouseActiveFactor;
  } else {
    uv += mouseNorm * 0.1 * uMouseActiveFactor;
  }

  float angle = uTime * uRotationSpeed;
  uv = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += starLayer(uv * scale + i * 453.32) * fade;
  }

  float alpha = uTransparent ? min(smoothstep(0.0, 0.32, length(col)), 1.0) : 1.0;
  gl_FragColor = vec4(col, alpha);
}`

type GalaxyProps = HTMLAttributes<HTMLDivElement> & {
  focal?: [number, number]
  rotation?: [number, number]
  starSpeed?: number
  density?: number
  hueShift?: number
  disableAnimation?: boolean
  speed?: number
  mouseInteraction?: boolean
  glowIntensity?: number
  saturation?: number
  mouseRepulsion?: boolean
  twinkleIntensity?: number
  rotationSpeed?: number
  repulsionStrength?: number
  transparent?: boolean
}

const DEFAULT_FOCAL: [number, number] = [0.5, 0.5]
const DEFAULT_ROTATION: [number, number] = [1, 0]

// Adapted from React Bits Galaxy (MIT). The loop pauses when hidden and renders
// only one composed frame when reduced motion is requested.
export default function Galaxy({
  focal = DEFAULT_FOCAL,
  rotation = DEFAULT_ROTATION,
  starSpeed = 0.2,
  density = 0.58,
  hueShift = 205,
  disableAnimation = false,
  speed = 0.18,
  mouseInteraction = false,
  glowIntensity = 0.22,
  saturation = 0.06,
  mouseRepulsion = false,
  twinkleIntensity = 0.14,
  rotationSpeed = 0.008,
  repulsionStrength = 1,
  className = "",
  transparent = true,
  ...rest
}: GalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const shouldAnimate = !disableAnimation && !prefersReducedMotion

    const renderer = new Renderer({
      alpha: transparent,
      dpr: Math.min(window.devicePixelRatio, window.innerWidth < 820 ? 1 : 1.25),
      premultipliedAlpha: false,
    })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, transparent ? 0 : 1)
    if (transparent) {
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    }

    const targetMouse = { x: 0.5, y: 0.5 }
    const smoothMouse = { x: 0.5, y: 0.5 }
    let targetActive = 0
    let smoothActive = 0
    let frame = 0

    const geometry = new Triangle(gl)
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: shouldAnimate ? 0 : 8 },
        uResolution: { value: new Color(1, 1, 1) },
        uFocal: { value: new Float32Array(focal) },
        uRotation: { value: new Float32Array(rotation) },
        uStarSpeed: { value: starSpeed },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uMouseRepulsion: { value: mouseRepulsion },
        uTwinkleIntensity: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uRepulsionStrength: { value: repulsionStrength },
        uMouseActiveFactor: { value: 0 },
        uTransparent: { value: transparent },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })

    const resize = () => {
      const width = Math.max(container.offsetWidth, 1)
      const height = Math.max(container.offsetHeight, 1)
      renderer.setSize(width, height)
      program.uniforms.uResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()
    container.appendChild(gl.canvas)

    const render = (time = 0) => {
      if (shouldAnimate) {
        program.uniforms.uTime.value = time * 0.001
        program.uniforms.uStarSpeed.value = (time * 0.001 * starSpeed) / 10
      }
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.04
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.04
      smoothActive += (targetActive - smoothActive) * 0.04
      program.uniforms.uMouse.value[0] = smoothMouse.x
      program.uniforms.uMouse.value[1] = smoothMouse.y
      program.uniforms.uMouseActiveFactor.value = smoothActive
      renderer.render({ scene: mesh })
      if (shouldAnimate && !document.hidden) frame = requestAnimationFrame(render)
    }

    const handlePointer = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      targetMouse.x = (event.clientX - rect.left) / rect.width
      targetMouse.y = 1 - (event.clientY - rect.top) / rect.height
      targetActive = 1
    }
    const handleLeave = () => { targetActive = 0 }
    const handleVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden && shouldAnimate) frame = requestAnimationFrame(render)
    }

    if (mouseInteraction) {
      window.addEventListener("pointermove", handlePointer, { passive: true })
      window.addEventListener("blur", handleLeave)
    }
    document.addEventListener("visibilitychange", handleVisibility)
    render()

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("pointermove", handlePointer)
      window.removeEventListener("blur", handleLeave)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      gl.canvas.remove()
    }
  }, [density, disableAnimation, focal, glowIntensity, hueShift, mouseInteraction, mouseRepulsion, repulsionStrength, rotation, rotationSpeed, saturation, speed, starSpeed, transparent, twinkleIntensity])

  return <div ref={containerRef} className={`galaxy-container ${className}`.trim()} {...rest} />
}
