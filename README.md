# Electron + Vue 3 桌面应用

基于 **Electron 22.3.27** + **Vue 3** + **Vite** + **shadcn-vue** 的跨平台桌面应用模板，兼容 **Windows 7 SP1** 及以上系统。

## 技术栈

| 依赖 | 版本 | 说明 |
|------|------|------|
| Electron | 22.3.27 | 最后一个支持 Win7/8/8.1 的版本 |
| Vue | 3.x | 前端框架 |
| Vite | 5.x | 构建工具 |
| shadcn-vue | 2.x | UI 组件库（[文档](https://www.shadcn-vue.com/docs)） |
| Tailwind CSS | 4.x | 样式框架 |
| electron-builder | 24.x | 打包工具 |

## 项目结构

```
electron-vue-app/
├── electron/                    # 主进程（CommonJS，.cjs 后缀）
│   ├── ipc/
│   │   └── index.cjs            # IPC 事件注册
│   ├── main.cjs                 # 应用入口、窗口管理
│   └── preload.cjs              # 预加载脚本，暴露安全 API
│
├── src/                         # 渲染进程（Vue 3 + TypeScript）
│   ├── assets/                  # 静态资源（图片、字体等，经 Vite 处理）
│   ├── components/
│   │   └── ui/                  # shadcn-vue 组件（CLI 自动生成）
│   ├── composables/             # 组合式函数
│   ├── lib/
│   │   └── utils.ts             # shadcn 工具函数（cn 等）
│   ├── styles/
│   │   └── main.css             # Tailwind + 主题变量
│   ├── types/
│   │   ├── electron.d.ts        # Electron API 类型声明
│   │   └── vue.d.ts             # Vue 模块类型声明
│   ├── App.vue                  # 根组件
│   └── main.ts                  # 渲染进程入口
│
├── public/                      # 公共静态文件（不经 Vite 处理，原样复制）
├── build/                       # 打包资源（应用图标）
├── dist/                        # Vite 构建产物（渲染进程）
├── release/                     # electron-builder 打包产物
│
├── components.json              # shadcn-vue 配置
├── index.html                   # HTML 入口
├── vite.config.ts               # Vite 配置
├── tsconfig.json                # TS 根配置
├── tsconfig.app.json            # 渲染进程 TS 配置
├── tsconfig.node.json           # Vite 配置 TS 配置
└── package.json
```

### 进程职责

| 目录 | 运行时 | 模块格式 | 职责 |
|------|--------|----------|------|
| `electron/` | Node.js（Electron 主进程） | CommonJS (`.cjs`) | 窗口、系统 API、IPC |
| `src/` | Chromium（渲染进程） | ESM（Vite 打包） | UI 界面、用户交互 |

> 根目录 `package.json` 设置 `"type": "module"` 供 Vite 使用，主进程通过 `.cjs` 后缀保持 CommonJS，避免模块格式冲突。

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式（Vite 热更新 + Electron 窗口）
npm run dev

# 仅启动 Vite 开发服务器
npm run dev:vite

# 仅启动 Electron（需 Vite 已在运行）
npm run dev:electron
```

## 打包

```bash
# 当前平台
npm run build

# Windows（zip 绿色包，Mac 上可直接打包）
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

打包产物输出到 `release/` 目录。Windows 会同时生成 **NSIS 安装包**（`.exe`）和 **zip 绿色包**。

## GitHub Actions 自动打包（Windows + macOS）

项目已配置 `.github/workflows/build-release.yml`，推送 tag 或手动触发时，会**并行**构建：

| 平台 | 运行环境 | 产物 |
|------|----------|------|
| Windows | `windows-latest` | NSIS 安装包 + zip |
| macOS | `macos-latest` | dmg + zip |

### 首次使用

```bash
# 1. 初始化 git 并推送到 GitHub
git init
git add .
git commit -m "init"
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

### 方式一：手动触发（调试推荐）

1. 打开 GitHub 仓库 → **Actions**
2. 选择 **Build Release** → **Run workflow**
3. 等待构建完成（首次约 5～15 分钟）
4. 进入本次 run → 底部 **Artifacts**，每个安装包独立下载：

| Artifact | 说明 |
|----------|------|
| `windows-setup` | Windows NSIS 安装包（`.exe`） |
| `windows-zip` | Windows 绿色压缩包（`.zip`） |
| `mac-dmg` | macOS 磁盘镜像（`.dmg`） |
| `mac-zip` | macOS 压缩包（`.zip`） |

推送 tag 后，**Releases** 页面也会列出以上 4 个文件，可单独下载。

### 方式二：打 tag 自动发布 Release

```bash
git tag v1.0.0
git push origin v1.0.0
```

推送 tag 后会自动构建 Win + Mac，并将所有产物合并上传到 **GitHub Releases**。

### 代码签名（可选）

在仓库 **Settings → Secrets and variables → Actions** 中添加：

| Secret | 说明 |
|--------|------|
| `WIN_CSC_LINK` | Windows 证书（base64 或 URL） |
| `WIN_CSC_KEY_PASSWORD` | Windows 证书密码 |
| `MAC_CSC_LINK` | macOS 证书（.p12 base64 或 URL） |
| `MAC_CSC_KEY_PASSWORD` | macOS 证书密码 |

未配置时正常打包；macOS 用户首次打开可能提示「来自未知开发者」。

### 切换打包目标

当前 Windows 目标为 `["nsis", "zip"]`。若只需绿色包，可改为：

```json
"win": {
  "target": "zip",
  "icon": "build/icon.ico"
}
```

然后重新 push 或手动触发 workflow 即可。

## shadcn-vue

项目已集成 [shadcn-vue](https://github.com/unovue/shadcn-vue)，通过 CLI 按需添加组件：

```bash
# 添加单个组件
npx shadcn-vue@latest add dialog

# 添加多个组件
npx shadcn-vue@latest add input select table
```

在 Vue 文件中使用：

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button>点击</Button>
</template>
```

已预装组件：`button`、`card`、`badge`

## 主进程通信

渲染进程通过 `preload.cjs` 暴露的 `window.electronAPI` 与主进程通信：

```
渲染进程 (Vue)  →  window.electronAPI.ping()
                        ↓
                  preload.cjs (contextBridge)
                        ↓
                  ipcRenderer.invoke('ping')
                        ↓
                  electron/ipc/index.cjs
                        ↓
                  ipcMain.handle('ping', ...)
```

新增 IPC 接口：

1. 在 `electron/ipc/index.cjs` 注册 `ipcMain.handle(...)`
2. 在 `electron/preload.cjs` 通过 `contextBridge` 暴露方法
3. 在 `src/types/electron.d.ts` 补充类型声明

## Windows 7 兼容

1. **Electron 22.3.27** — Electron 23+ 基于 Chromium 110，不再支持 Win7/8/8.1
2. **构建目标 chrome108** — 与 Electron 22 内核一致（`vite.config.ts`）
3. **主进程 `sandbox: false`** — 降低旧系统闪退风险
4. **主题色 HSL 格式** — 默认 `oklch` 在 Chromium 108 不支持，已改为 `hsl`
5. **系统要求** — Win7 SP1 + [KB2999226](https://support.microsoft.com/kb/2999226) + [KB2533623](https://support.microsoft.com/kb/2533623)

> Electron 22 已于 2023 年停止官方安全更新。若目标用户已升级到 Win10+，建议评估升级到更新的 Electron 版本。

## 应用图标

`build/` 目录已包含打包所需图标：

| 文件 | 平台 | 说明 |
|------|------|------|
| `icon.ico` | Windows | NSIS 安装包 / exe |
| `icon.icns` | macOS | dmg / app |
| `icon.png` | Linux | AppImage / deb（1024×1024） |
| `icon-source.svg` | — | 可编辑源文件 |

重新生成图标：

```bash
npm run generate:icons
```

自定义图标时，修改 `build/icon-source.svg` 后执行上述命令，或直接替换 `build/` 下对应文件。

## TypeScript 配置

项目使用三份 TS 配置，解决 `vite.config.ts` 中 `import.meta.url` 的类型报错：

| 文件 | 作用域 |
|------|--------|
| `tsconfig.json` | 根配置，引用下面两份 |
| `tsconfig.app.json` | `src/` 渲染进程代码 |
| `tsconfig.node.json` | `vite.config.ts`，含 Node 类型 |

若编辑器仍有红色波浪线，执行 **TypeScript: Restart TS Server**。
