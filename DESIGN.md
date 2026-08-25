---
name: 李向东 AI 短剧视觉作品集
description: 以完整成片为主体、由冷月夜走向黑白光门的电影放映式个人作品集
colors:
  deep-ocean: "#02090e"
  submerged-surface: "#0a1821"
  moon-ink: "#edf2f2"
  moonlight: "#c6d6e3"
  phoenix-light: "#c28d4d"
  route-light: "#a5b6c0"
  vampire-light: "#8e454b"
  intern-light: "#9eacb5"
  threshold-black: "#050606"
  threshold-white: "#edf2f2"
typography:
  display:
    fontFamily: "Instrument Serif, Noto Serif SC, serif"
    fontSize: "clamp(3.625rem, 6.2vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Noto Serif SC, serif"
    fontSize: "clamp(2.75rem, 4.4vw, 4.75rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Geist, Noto Sans SC, sans-serif"
    fontSize: "13px"
    fontWeight: 350
    lineHeight: 1.9
  label:
    fontFamily: "Geist, Noto Sans SC, sans-serif"
    fontSize: "8px–12px"
    fontWeight: 500
rounded:
  xs: "18px"
  sm: "22px"
  md: "16px"
  lg: "28px"
  xl: "32px"
  xxl: "36px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "24px"
  lg: "48px"
components:
  action-pill:
    backgroundColor: "{colors.submerged-surface}"
    textColor: "{colors.moon-ink}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "52px"
  episode-selected:
    backgroundColor: "{colors.moonlight}"
    textColor: "{colors.deep-ocean}"
    rounded: "{rounded.pill}"
    height: "44px"
  media-frame:
    backgroundColor: "{colors.submerged-surface}"
    rounded: "{rounded.xl}"
---

# Design System: 李向东 AI 短剧视觉作品集

## Overview

**Creative North Star: "From Frame to Threshold"**

页面像一场从冷月夜走向遥远门洞的连续放映，而不是装载作品的组件库。深海底色保持安静，真实成片负责光、色与情绪；界面只提供观看路径、项目事实和集数控制。Hero 夜空向正文延伸为稀疏、低亮度、轻微指针视差的星场，收尾进入固定的黑白光门画面。星点是远景空间，不是噪点纹理或科技 HUD。

**Key Characteristics:**

- Hero 之后由轻量个人履历完成身份确认，再让完整成片接管页面主视觉。
- 一部旗舰作品满幅展开，其他项目使用不同构图，不复制章节模板。
- 圆角只属于真实影像、导航、小尺寸人物照片和小型控制，不把整段内容装进大卡片。
- 动效表达放映焦点、页面接力与冷暖过渡，内容在静止状态下仍然完整。

## Colors

深海蓝黑统一前四个项目，月光冷白负责界面状态；每个项目只允许自身成片的色温扩散到对应章节。最后一屏压入接近黑白的门洞画面，作为旅程终点而不是新的主题色系统。

### Primary

- **Moonlight:** 用于选中集数、键盘焦点与少量高光，是界面唯一稳定强调色。

### Secondary

- **Project Light Fields:** 凤凰金、现实冷灰、哥特暗红与职场冷蓝只在对应项目的影像和背景光场中出现，不进入通用按钮系统。

### Closing Light

- **Threshold White:** 只来自最后一屏固定视频中的门洞与人物轮廓，不额外绘制金色光晕，也不轮换内容。

### Neutral

- **Deep Ocean:** 页面主背景与影像之间的过渡底色。
- **Submerged Surface:** 播放器与导航的低透明底面。
- **Moon Ink:** 主要文字，避免纯白带来的硬边。

**The Borrowed Light Rule.** 项目章节的颜色必须来自该项目真实成片，不额外发明霓虹或科技渐变。

## Typography

**Display Font:** Instrument Serif，中文回退 Noto Serif SC。

**Body Font:** Geist，中文回退 Noto Sans SC。

**Character:** 展示字像片头字幕，轻盈、窄而有节奏；正文保持低调、紧凑和可核对。衬线字负责剧名与主张，无衬线字负责职责、集数和控制。

### Hierarchy

- **Display:** 400 字重，最大 6rem，用于 Hero、剧名和收尾主张。
- **Headline:** 400 字重，用于项目地图等中文章节标题。
- **Body:** 350 字重，13px，约 1.9 行高，用于职责与说明。
- **Label:** 500 字重，9–11px，用于集数、类型和控制状态。

**The Title Belongs to the Film Rule.** 剧名可以大，但不与播放器争夺中心；标题与影像必须构成同一个画面。

## Layout

桌面版版心最大约 1700px。Hero 和项目光场满幅，核心内容在版心内形成非对称放映构图。项目标题与固定导航之间保留明确安全区，完整竖屏播放器占据每章最大视觉面积，项目事实退到次级列。四章可交替排列，但不使用包住整组视频的大底板。

820px 以下所有项目改为单列，播放器宽度控制在约 76–82vw；320、375、414、768px 都必须无横向页面滚动。导航始终单行，所有集数控制保持至少 44px。

## Elevation & Depth

深度来自真实影像的放大光场、饱和度差、柔和位移与低亮度星场，不依靠套层卡片。星场密度和辉光必须低于内容，移动端进一步降载；播放器使用向下偏移的冷色软阴影，与背景拉开距离。结尾直接使用单一黑白门洞影像，以大面积暗部承接联系信息，不叠加粒子爆发。

**The Image Makes the Depth Rule.** 删除项目影像后，章节应明显失去空间感；若仅靠阴影仍能成立，说明界面又开始压过作品。

## Shapes

圆角按 16、18、22、28、32、36px 逐级使用；小型集数选择与导航动作使用胶囊形。竖屏播放器保持 9:16 原生比例，不绘制手机边框或浏览器外壳。章节本身不加外框，项目信息使用平直分隔线而不是小卡片。

## Components

### Buttons

- **Shape:** 44–52px 高的圆形或胶囊控制。
- **Default:** 冷白文字、低透明深海底面和半透明细边。
- **Hover / Focus:** 只提高底面亮度或产生 1–2px 位移；键盘焦点使用清晰月光描边。

### Chips

- **Style:** 集数选择为 44px 高的小胶囊，未选中状态透明。
- **State:** 选中时月光底、深海文字；不使用项目色区分状态。

### Cards / Containers

- **Corner Style:** 人物照片 18–22px，视觉目录 24px，播放器 32px。
- **Background:** 导航可以使用深海透明表面；个人介绍与项目章节禁止再套同尺寸大容器。
- **Shadow Strategy:** 仅播放器和视觉目录需要环境阴影。

### Navigation

导航只覆盖 Hero 顶部，桌面显示字标、三项导航与联系动作；手机保留 LXD 字标和“联系合作”。导航以低透明深海胶囊压在首屏影像上，随 Hero 一起离开视口，不悬浮覆盖后续作品。

### Complete Episode Player

每个项目只挂载当前集的完整 720×1280 成片，保留原生声音、进度与全屏控制。左右拖动画面上部、方向键、上一集/下一集按钮和集数胶囊都能切换；画面交接使用一次裁切与清晰度恢复，不做 3D 卡片轨道。

### Editorial Profile

个人介绍以标题、小尺寸真实照片、简介、经历和三个真实数据组成三栏编辑式版面。照片只负责身份确认，信息依靠间距与细分隔线分组，不使用工牌容器或模拟物理装置。

### Typographic Focus

Hero 英文标题只在首次进入时按词从轻度模糊过渡到清晰，总时长控制在约 0.8 秒。正文文字以内容组进入：About 标题、人物介绍、经历、数据、项目标题、项目说明、播放控制、能力列表、联系与页脚分别触发一次。标题位移控制在 54–68px，数据与控制缩短到 24–40px，缩放不低于 0.97，以快速自然减速收尾，不使用可见回弹。减少动态模式直接显示清晰终态。

正文从 About 到最后一个项目共享同一 Galaxy 深海背景。章节色温只来自局部海报模糊光，不允许使用覆盖整幅视口宽度的矩形渐变或伪元素作为章节底板；章节之间依靠留白、标题节奏和局部光晕过渡。所有章节局部影像必须在暴露边缘使用遮罩渐隐，直接露出共享 Galaxy，衔接逻辑与 Hero 尾部一致。

项目浏览的操作教学只在第一个项目出现一次；后续项目依靠相同控件建立识别，不重复说明。非当前集数与常驻项目索引保持低权重，只有当前状态以及悬停、键盘聚焦时提升对比度。

尾页是 Hero 的视觉回声而不是独立主题：门与人物保持居中的纵深构图，联系邮箱是页面最后且最强的交互动作。尾页影像通过纵向遮罩融入 Galaxy，不使用整屏视频矩形边界。

## Do's and Don'ts

### Do:

- **Do** 让真实成片占据每个项目的最大视觉面积。
- **Do** 从项目画面提取章节色温，保持界面控制统一为月光色。
- **Do** 让四个项目使用不同的标题、播放器和说明关系。
- **Do** 为减少动态偏好提供已经构图完成的静止状态。
- **Do** 用稀疏星场连接 Hero 与作品章节，再让星光在黑白门洞收尾前退出。

### Don't:

- **Don't** 恢复三张封面环绕、放映轨道、HUD、交互式粒子网络或统一项目大卡片。
- **Don't** 生成虚拟头像、假播放量、假客户或未确认项目链接。
- **Don't** 给竖屏视频绘制手机外壳，也不要用装饰性黑框包住播放器。
- **Don't** 让项目色进入通用按钮，造成全站强调色漂移。
- **Don't** 把星场提高到能与标题、人物信息或完整成片争夺注意力的密度和亮度。
