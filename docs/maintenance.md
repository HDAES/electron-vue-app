# 项目维护说明

## 当前结构

- `electron/`：Electron 主进程、preload、IPC 注册逻辑。
- `src/`：Vue 3 渲染进程代码。
- `src/composables/`：可复用业务状态和组合式逻辑。
- `src/components/ui/`：shadcn-vue 组件。
- `src/styles/`：Tailwind CSS 与主题变量。
- `build/`：electron-builder 使用的应用图标。

## 开发脚本

```bash
npm run dev
```

同时启动 Vite 与 Electron。Vite 固定监听 `127.0.0.1:5173`，Electron 通过 `VITE_DEV_SERVER_URL` 加载渲染进程。

```bash
npm run typecheck
```

执行 Vue / TypeScript 类型检查。

```bash
npm run build:renderer
```

只构建渲染进程产物，输出到 `dist/`。

```bash
npm run build
```

先执行类型检查，再构建渲染进程，最后通过 electron-builder 打包当前平台应用。

## 代码整理约定

1. 渲染进程状态逻辑优先放到 `src/composables/`。
2. `App.vue` 保持为页面组装层，避免堆积运行时逻辑。
3. IPC channel 名称集中维护，避免主进程与 preload 之间出现字符串漂移。
4. preload 只暴露最小 API 面，渲染进程不得直接访问 Node.js 能力。
5. 继续保持 Electron 22.3.27，除非明确放弃 Windows 7 兼容。
