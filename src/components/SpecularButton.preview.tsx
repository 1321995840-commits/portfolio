import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "../index.css"
import SpecularButton from "./SpecularButton"

const states = [
  ["default", <SpecularButton>进入放映</SpecularButton>],
  ["hover", <SpecularButton className="is-hover">进入放映</SpecularButton>],
  ["focus", <SpecularButton className="is-focus">进入放映</SpecularButton>],
  ["active", <SpecularButton className="is-active">进入放映</SpecularButton>],
  ["disabled", <SpecularButton disabled>进入放映</SpecularButton>],
  ["loading", <SpecularButton state="loading">进入放映</SpecularButton>],
  ["error", <SpecularButton state="error">重新尝试</SpecularButton>],
  ["success", <SpecularButton state="success">已完成</SpecularButton>],
] as const

function Preview() {
  return (
    <main style={{ width: "min(760px, calc(100vw - 40px))", margin: "0 auto", padding: "72px 0" }}>
      <h1 style={{ marginBottom: 12, fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 400 }}>Specular Button</h1>
      <p style={{ marginBottom: 48, color: "var(--muted)" }}>八种交互状态。这个页面仅用于组件检查。</p>
      <div style={{ display: "grid", gap: 16 }}>
        {states.map(([name, component]) => (
          <section key={name} style={{ display: "grid", gridTemplateColumns: "110px 1fr", alignItems: "center", minHeight: 78, borderTop: "1px solid var(--line)" }}>
            <span style={{ color: "var(--dim)", fontSize: 11, textTransform: "uppercase" }}>{name}</span>
            <div>{component}</div>
          </section>
        ))}
      </div>
    </main>
  )
}

createRoot(document.getElementById("preview-root")!).render(<StrictMode><Preview /></StrictMode>)
