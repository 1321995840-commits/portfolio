import { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Mail,
  Play,
} from "lucide-react"
import Galaxy from "./components/Galaxy"
import BlurText from "./components/BlurText"
import AnimatedContent from "./components/AnimatedContent"

type Episode = {
  key: string
  id: string
  collection?: string
  video: string
  poster: string
}
type Project = {
  slug: string
  title: string
  chinese?: string
  genre: string
  responsibility: string
  episodeText: string
  fileCount: number
  url?: string
  episodes: Episode[]
}

const heroVideo = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
const closingVideo = `${import.meta.env.BASE_URL}assets/video/contact-door.mp4`

const episode = (asset: string, id: string, collection?: string): Episode => ({
  key: asset,
  id,
  collection,
  video: `${import.meta.env.BASE_URL}assets/episodes/${asset}.mp4`,
  poster: `${import.meta.env.BASE_URL}assets/episodes/${asset}.jpg`,
})

const projects: Project[] = [
  {
    slug: "route",
    title: "Route Threeway to Climax",
    chinese: "通往高潮的三重路径",
    genre: "现实情感 / 连续剧情",
    responsibility: "连续段落与核心高潮节点。负责剧本拆解、AI 分镜、动态生成，以及人物站位和动作承接的连续性修正。",
    episodeText: "制作 EP.12–18、EP.28–29",
    fileCount: 13,
    url: "https://www.goodshort.com/drama/route-threeway-to-climax-31001621683",
    episodes: [
      episode("route-r1-ep016", "016", "PART 1"),
      episode("route-r2-ep015", "015", "PART 2"),
      episode("route-r2-ep016", "016", "PART 2"),
      episode("route-r2-ep018", "018", "PART 2"),
    ],
  },
  {
    slug: "vampire",
    title: "Sexting the Vampire Who Owns Me",
    genre: "哥特幻想 / 吸血鬼",
    responsibility: "负责 EP.02–06 的 AI 画面制作，将角色、场景与动作资产组织为可持续衔接的连续剧情段。",
    episodeText: "制作 EP.02–06",
    fileCount: 5,
    episodes: [episode("vampire-ep03", "003"), episode("vampire-ep05", "005"), episode("vampire-ep06", "006")],
  },
  {
    slug: "intern",
    title: "The Intern Accused Me of Stealing, So I Took Everything 2",
    chinese: "实习生污蔑我贪污，于是我拿走了一切 2",
    genre: "现代职场 / 复仇剧情",
    responsibility: "负责核心剧情段与商业交付节点，包括角色、场景资产调用，动态生成和多轮反馈修改。",
    episodeText: "制作 EP.02–10",
    fileCount: 9,
    url: "https://www.goodshort.com/drama/the-intern-accused-me-of-stealing-so-i-took-everything-2-31001630791",
    episodes: [episode("intern-ep02", "02"), episode("intern-ep06", "06"), episode("intern-ep10", "10")],
  },
  {
    slug: "phoenix",
    title: "The Phoenix’s Second Choice",
    chinese: "涅槃凤凰，另择良人",
    genre: "神话史诗 / 奇幻爱情",
    responsibility: "负责连续剧情与关键付费节点，重点处理多人站位、正反打视线与跨镜动作连续性。",
    episodeText: "制作 EP.11–22",
    fileCount: 12,
    url: "https://www.goodshort.com/drama/the-phoenix-s-second-choice-31001645252",
    episodes: [
      episode("phoenix-ep17", "017"),
      episode("phoenix-ep20", "020"),
      episode("phoenix-ep21", "021"),
      episode("phoenix-ep22", "022"),
    ],
  },
]

const capabilities = [
  ["剧本拆解", "确认人物关系、情绪转折与每一场的镜头任务。"],
  ["资产与分镜", "建立角色、场景、服化与空间关系，再进入动态生产。"],
  ["动态生成", "控制动作、表演和镜头节奏，让单镜头服务连续剧情。"],
  ["连续性与交付", "检查站位、视线和动作承接，处理反馈并交付版本。"],
] as const

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(query.matches)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])
  return reduced
}

function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (reduced) video.pause()
    else void video.play().catch(() => undefined)
  }, [reduced])

  return (
    <video ref={ref} className="hero-video" autoPlay={!reduced} loop muted playsInline preload="metadata" aria-hidden="true">
      <source src={heroVideo} type="video/mp4" />
    </video>
  )
}

function DreamAtmosphere() {
  const reduced = useReducedMotion()

  return (
    <div className="dream-atmosphere" aria-hidden="true">
      <Galaxy
        className="galaxy-field"
        mouseRepulsion={false}
        mouseInteraction
        density={0.52}
        glowIntensity={0.22}
        saturation={0.06}
        hueShift={205}
        twinkleIntensity={0.14}
        repulsionStrength={1}
        starSpeed={0.2}
        speed={0.18}
        rotationSpeed={0.008}
        disableAnimation={reduced}
      />
      <div className="dream-halo" />
      <div className="galaxy-veil" />
    </div>
  )
}

function ClosingVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (reduced) video.pause()
    else void video.play().catch(() => undefined)
  }, [reduced])

  return (
    <video ref={ref} className="closing-video" autoPlay={!reduced} loop muted playsInline preload="metadata" aria-hidden="true">
      <source src={closingVideo} type="video/mp4" />
    </video>
  )
}

function ProfilePass() {
  return (
    <section id="about" className="profile-section page-width" aria-labelledby="profile-title">
      <div className="profile-stage">
        <AnimatedContent as="header" className="profile-heading" distance={54} reverse duration={0.72} delay={0.04} initialOpacity={0.22} scale={0.97}>
          <h2 id="profile-title">About</h2>
          <p>关于我 · AI 短剧视觉制作</p>
        </AnimatedContent>
        <AnimatedContent className="profile-intro" distance={68} duration={0.76} delay={0.08} initialOpacity={0.16} scale={0.97}>
          <figure><img src={`${import.meta.env.BASE_URL}assets/portrait.jpg`} alt="李向东个人照片" /></figure>
          <div>
            <h3>李向东</h3>
            <p>专注 AI 真人短剧视觉生产。把剧本拆解、角色与场景资产、动态镜头和连续性修正，组织成可以稳定交付的完整剧情段。</p>
            <span>深圳 · AI 短剧视觉制作 / AI 生成师</span>
          </div>
        </AnimatedContent>
        <AnimatedContent className="profile-timeline" aria-label="个人经历" distance={58} duration={0.72} delay={0.14} initialOpacity={0.18} scale={0.98}>
          <div><time>2026.06–08</time><span>巨绘元境</span><small>AI 短剧视觉制作</small></div>
          <div><time>2025.10–2026.04</time><span>王氏家居</span><small>AI 产品设计实习生</small></div>
          <div><time>2022.09–2026.06</time><span>深圳技术大学</span><small>艺术与科技</small></div>
        </AnimatedContent>
        <AnimatedContent as="dl" className="profile-proof" direction="vertical" distance={34} duration={0.68} delay={0.18} initialOpacity={0.16} scale={0.985}>
          <div><dt>商业项目</dt><dd>10</dd></div>
          <div><dt>累计制作</dt><dd>200+ <small>集</small></dd></div>
          <div><dt>常见批次</dt><dd>4–5 <small>天</small></dd></div>
        </AnimatedContent>
      </div>
    </section>
  )
}

function Hero() {
  const shellRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const shell = shellRef.current
    if (!shell || reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    let frame = 0
    const move = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = shell.getBoundingClientRect()
        const x = (event.clientX - rect.left) / rect.width - 0.5
        const y = (event.clientY - rect.top) / rect.height - 0.5
        shell.style.setProperty("--hero-media-x", `${x * 12}px`)
        shell.style.setProperty("--hero-media-y", `${y * 9}px`)
        shell.style.setProperty("--hero-copy-x", `${x * -5}px`)
        shell.style.setProperty("--hero-copy-y", `${y * -4}px`)
      })
    }
    const reset = () => {
      shell.style.setProperty("--hero-media-x", "0px")
      shell.style.setProperty("--hero-media-y", "0px")
      shell.style.setProperty("--hero-copy-x", "0px")
      shell.style.setProperty("--hero-copy-y", "0px")
    }
    shell.addEventListener("pointermove", move)
    shell.addEventListener("pointerleave", reset)
    return () => {
      cancelAnimationFrame(frame)
      shell.removeEventListener("pointermove", move)
      shell.removeEventListener("pointerleave", reset)
    }
  }, [reduced])

  return (
    <header ref={shellRef} id="top" className="hero-shell">
      <BackgroundVideo />
      <div className="hero-grade" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-dissolve" aria-hidden="true" />
      <div className="hero-content">
        <div className="hero-copy-plane">
          <p className="hero-role">LI XIANGDONG · AI SHORT DRAMA VISUAL PRODUCTION</p>
          <h1>
            <BlurText text="Every frame" delay={90} animateBy="words" direction="top" className="hero-title-line" />
            <BlurText text="carries the next." delay={90} startDelay={120} animateBy="words" direction="top" className="hero-title-line" />
          </h1>
          <AnimatedContent as="p" className="hero-chinese" direction="vertical" distance={24} duration={0.62} delay={0.24} initialOpacity={0.12} scale={0.99}>让每一镜，接住下一镜。</AnimatedContent>
        </div>
      </div>
      <div className="hero-meta"><span>SHENZHEN · CHINA</span><span>AI SHORT DRAMA / 2026</span></div>
    </header>
  )
}

function relativeOffset(index: number, active: number, length: number) {
  let offset = index - active
  if (offset > length / 2) offset -= length
  if (offset < -length / 2) offset += length
  return offset
}

function EpisodeTransport({ project, showHint = false }: { project: Project; showHint?: boolean }) {
  const [active, setActive] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const pointer = useRef<{ id: number; x: number; y: number; dragging: boolean } | null>(null)
  const dragCleanup = useRef<(() => void) | null>(null)
  const suppressVideoClick = useRef(false)

  useEffect(() => () => dragCleanup.current?.(), [])

  const select = (index: number) => {
    videoRef.current?.pause()
    setActive(index)
  }

  const change = (delta: number) => {
    select((active + delta + project.episodes.length) % project.episodes.length)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      change(1)
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      change(-1)
    }
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement
    if (target.closest("a")) return
    const video = target.closest("video") as HTMLVideoElement | null
    if (video) {
      const rect = video.getBoundingClientRect()
      if (event.clientY > rect.bottom - 68) return
    }
    dragCleanup.current?.()
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, dragging: false }

    const cleanup = () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onEnd)
      window.removeEventListener("pointercancel", onCancel)
      dragCleanup.current = null
    }
    const onMove = (moveEvent: globalThis.PointerEvent) => {
      const start = pointer.current
      if (!start || start.id !== moveEvent.pointerId) return
      const dx = moveEvent.clientX - start.x
      const dy = moveEvent.clientY - start.y
      if (!start.dragging && Math.abs(dx) > 9 && Math.abs(dx) > Math.abs(dy)) start.dragging = true
      if (start.dragging) moveEvent.preventDefault()
    }
    const onEnd = (endEvent: globalThis.PointerEvent) => {
      const start = pointer.current
      if (!start || start.id !== endEvent.pointerId) return
      const distance = endEvent.clientX - start.x
      pointer.current = null
      cleanup()
      if (start.dragging && Math.abs(distance) > 42) {
        endEvent.preventDefault()
        suppressVideoClick.current = true
        change(distance < 0 ? 1 : -1)
        window.setTimeout(() => { suppressVideoClick.current = false }, 0)
      }
    }
    const onCancel = () => {
      pointer.current = null
      cleanup()
    }

    dragCleanup.current = cleanup
    window.addEventListener("pointermove", onMove, { passive: false })
    window.addEventListener("pointerup", onEnd)
    window.addEventListener("pointercancel", onCancel)
  }

  const onVideoSurfaceClick = () => {
    if (suppressVideoClick.current) {
      suppressVideoClick.current = false
      return
    }
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play().catch(() => undefined)
    else video.pause()
  }

  const onStagePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current
    if (!stage || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const rect = stage.getBoundingClientRect()
    stage.style.setProperty("--focus-x", `${((event.clientX - rect.left) / rect.width) * 100}%`)
    stage.style.setProperty("--focus-y", `${((event.clientY - rect.top) / rect.height) * 100}%`)
  }

  return (
    <div className="transport">
      <div
        ref={stageRef}
        className="transport-stage"
        tabIndex={0}
        role="group"
        aria-label={`${project.title} 集数放映轨，左右方向键切换`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onStagePointerMove}
        onPointerLeave={() => {
          stageRef.current?.style.setProperty("--focus-x", "50%")
          stageRef.current?.style.setProperty("--focus-y", "50%")
        }}
      >
        <div className="transport-orbit" aria-hidden="true" />
        {project.episodes.map((item, index) => {
          const offset = relativeOffset(index, active, project.episodes.length)
          const magnitude = Math.abs(offset)
          const style = {
            "--reel-x": `${offset * 76}%`,
            "--reel-y": `${magnitude * 7}%`,
            "--reel-depth": `${-magnitude * 150}px`,
            "--reel-rotate": `${offset * -24}deg`,
            "--reel-scale": offset === 0 ? 1 : 0.84,
            "--reel-opacity": magnitude > 1 ? 0 : offset === 0 ? 1 : 0.56,
            "--reel-z": offset === 0 ? 4 : 2,
            "--reel-pointer": magnitude > 1 ? "none" : "auto",
          } as CSSProperties
          const isActive = offset === 0
          return (
            <article className={`reel-frame ${isActive ? "is-active" : ""}`} style={style} key={item.key} aria-hidden={!isActive}>
              <div className="reel-timecode"><span>{item.collection ? `${item.collection} · ` : ""}EP.{item.id}</span><span>FULL CUT</span></div>
              {isActive ? (
                <>
                  <video
                    key={item.video}
                    ref={videoRef}
                    src={item.video}
                    poster={item.poster}
                    controls
                    controlsList="nodownload"
                    playsInline
                    preload="metadata"
                    aria-label={`${project.title} 第 ${item.id} 集完整成片`}
                  />
                  <div
                    className="video-drag-surface"
                    onClick={onVideoSurfaceClick}
                    aria-hidden="true"
                  />
                </>
              ) : (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => {
                    if (suppressVideoClick.current) {
                      suppressVideoClick.current = false
                      return
                    }
                    select(index)
                  }}
                  aria-label={`切换至第 ${item.id} 集`}
                >
                  <img src={item.poster} alt="" draggable={false} />
                  <span className="poster-play"><Play size={17} fill="currentColor" /></span>
                </button>
              )}
            </article>
          )
        })}
      </div>
      <AnimatedContent className="transport-copy" direction="vertical" distance={32} duration={0.66} delay={0.12} initialOpacity={0.16} scale={0.985}>
        <div className="transport-controls">
          <button type="button" onClick={() => change(-1)} aria-label="上一集"><ArrowLeft size={18} /></button>
          <div>
            <span>正在放映</span>
            <strong>{project.episodes[active].collection ? `${project.episodes[active].collection} · ` : ""}EP.{project.episodes[active].id} / {String(project.episodes.length).padStart(2, "0")}</strong>
          </div>
          <button type="button" onClick={() => change(1)} aria-label="下一集"><ArrowRight size={18} /></button>
        </div>
        <div className="episode-dots" aria-label="选择集数">
          {project.episodes.map((item, index) => (
            <button
              type="button"
              className={active === index ? "is-active" : ""}
              key={item.key}
              onClick={() => select(index)}
              aria-label={`切换至第 ${item.id} 集`}
              aria-current={active === index ? "true" : undefined}
            >{item.collection ? `${item.collection.replace("PART ", "P")}.` : ""}EP.{item.id}</button>
          ))}
        </div>
        {showHint && <p className="transport-hint">在画面上左右拖动，或使用方向键切换。播放器保留完整时长与声音。</p>}
      </AnimatedContent>
    </div>
  )
}

function ProjectChapter({
  project,
  index,
  setRef,
}: {
  project: Project
  index: number
  setRef: (node: HTMLElement | null) => void
}) {
  const layout = index === 1 || index === 3 ? "stage" : "split"
  return (
    <article
      id={`project-${project.slug}`}
      className={`project-chapter project-chapter-${layout}`}
      ref={setRef}
      data-project-index={index}
    >
      <img className="chapter-backdrop" src={project.episodes[1].poster} alt="" aria-hidden="true" />
      <AnimatedContent as="header" className="chapter-title" direction="vertical" distance={64} duration={0.76} delay={0.03} initialOpacity={0.12} scale={0.975}>
        <div className="chapter-index"><span>PROJECT</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
        <h3>{project.title}</h3>
        {project.chinese && <p>{project.chinese}</p>}
      </AnimatedContent>
      <div className="chapter-body">
        <EpisodeTransport project={project} showHint={index === 0} />
        <AnimatedContent as="aside" className="chapter-credits" distance={62} reverse={index % 2 === 1} duration={0.74} delay={0.1} initialOpacity={0.16} scale={0.98}>
          <div className="credit-line"><span>类型</span><strong>{project.genre}</strong></div>
          <div className="credit-line"><span>制作范围</span><strong>{project.episodeText}</strong></div>
          <p>{project.responsibility}</p>
          <div className="credit-actions">
            {project.url ? (
              <a href={project.url} target="_blank" rel="noreferrer">查看项目页 <ArrowUpRight size={15} /></a>
            ) : (
              <span>暂无已确认公开项目页</span>
            )}
            <small>{String(project.fileCount).padStart(2, "0")} 个上传文件</small>
          </div>
        </AnimatedContent>
      </div>
    </article>
  )
}

function App() {
  const year = useMemo(() => new Date().getFullYear(), [])
  const [activeProject, setActiveProject] = useState(0)
  const projectRefs = useRef<(HTMLElement | null)[]>([])
  const reduced = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveProject(Number((visible.target as HTMLElement).dataset.projectIndex))
    }, { threshold: [0.28, 0.46, 0.64], rootMargin: "-14% 0px -14% 0px" })

    projectRefs.current.forEach((node) => node && observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const goToProject = (index: number) => {
    projectRefs.current[index]?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
  }

  return (
    <div className="site-shell" data-active-project={projects[activeProject].slug}>
      <a className="skip-link" href="#work">跳至作品</a>
      <DreamAtmosphere />

      <nav className="site-nav" aria-label="主导航">
        <a className="wordmark" href="#top" aria-label="返回首页">
          <span>LXD</span><small>VISUAL PRODUCTION</small>
        </a>
        <div className="nav-links">
          <a href="#work">作品</a>
          <a href="#about">关于我</a>
          <a href="#method">制作能力</a>
          <a href="mailto:1321995840@qq.com">联系</a>
        </div>
        <a className="nav-contact" href="mailto:1321995840@qq.com">联系合作 <ArrowUpRight size={14} /></a>
      </nav>

      <Hero />

      <main id="main">
        <ProfilePass />

        <section id="work" className="screening-room" aria-label="精选项目">
          <aside className="reel-index" aria-label="项目快速切换">
            <span>REEL</span>
            <div>
              {projects.map((project, index) => (
                <button
                  type="button"
                  className={activeProject === index ? "is-active" : ""}
                  key={project.slug}
                  onClick={() => goToProject(index)}
                  aria-label={`前往项目 ${project.title}`}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          </aside>
          <div className="project-stack">
            {projects.map((project, index) => (
              <ProjectChapter
                project={project}
                index={index}
                key={project.slug}
                setRef={(node) => { projectRefs.current[index] = node }}
              />
            ))}
          </div>
        </section>

        <section id="method" className="method-contact">
          <ClosingVideo />
          <div className="method-grade" aria-hidden="true" />
          <div className="page-width method-layout">
            <AnimatedContent className="method-statement" distance={64} reverse duration={0.76} delay={0.04} initialOpacity={0.14} scale={0.975}>
              <h2>Next frame,<br />start here.</h2>
              <strong>下一镜，从这里开始。</strong>
              <p>制作能力不是软件列表，而是把连续剧情稳定推到交付。</p>
            </AnimatedContent>
            <AnimatedContent as="ol" className="method-list" aria-label="AI 短剧视觉制作流程" distance={76} duration={0.78} delay={0.12} initialOpacity={0.16} scale={0.97}>
              {capabilities.map(([title, copy], index) => (
                <li key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </li>
              ))}
            </AnimatedContent>
            <AnimatedContent className="contact-block" direction="vertical" distance={38} duration={0.7} delay={0.16} initialOpacity={0.12} scale={0.985}>
              <p>AI 短剧视觉制作 / 项目合作</p>
              <a href="mailto:1321995840@qq.com">
                <span>1321995840@qq.com</span>
                <ArrowUpRight size={34} />
              </a>
            </AnimatedContent>
            <AnimatedContent as="footer" direction="vertical" distance={24} duration={0.62} delay={0.22} initialOpacity={0.16} scale={0.99}>
              <span><Mail size={13} /> 公开邮箱</span>
              <span>电话 136 **** 5186</span>
              <span>深圳 · 中国</span>
              <span>© {year} 李向东</span>
            </AnimatedContent>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
