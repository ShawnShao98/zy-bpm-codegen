---
name: bpm-create-dynamic-page
description: BPM 动态页面生成 — 支持 v47/v67/QMW 三版本，生成 ExtJS 前端 + C# Handler
---

# bpm-create-dynamic-page — 动态页面生成 (v47/v67/QMW)

## 前置检查

**⚠️ 配置必须先初始化**：执行生成前，检查项目根目录是否存在 `.bpm-codegen-config.json`：
- 不存在 → **必须**先引导用户执行 `/bpm-init-project` 完成初始化，**不能跳过**
- 存在 → 读取配置并应用于生成，**必须使用配置中的值**，不能使用硬编码默认值

**⚠️ 强制执行：所有配置项必须逐项向用户确认，未经用户明确确认的配置项一律不得使用，不得假设、不得跳过、不得使用所谓的"合理默认值"。**

## 说明

生成规则与 `bpm-create-page` 完全相同，区别在于代码生成版本。

## 版本选择

| 版本 | 说明 | 编码 | 默认 |
|------|------|------|------|
| **v67** | ExtJS 6 标准版 | JS: UTF-8 with BOM, Handler: UTF-8 with BOM | ✅ |
| **v47** | ExtJS 4.7 兼容版 | JS: UTF-8 with BOM, Handler: UTF-8 with BOM | — |
| **QMW** | 双语版 | JS: UTF-8 with BOM, Handler: UTF-8 with BOM | — |

## v67（默认）

- 模块路径：`YZModules.{prefix}.Modules.{PageClassName}`
- 引用 `YZSoft.bpm.src.ux.FormManager`
- 完整支持所有渲染函数和按钮类型
- 布局宽度支持 px/%

## v47（兼容版）

与 v67 的差异：
- 模块命名空间不同：`YZModules.{prefix}` 而非 `.Modules.{PageClassName}`
- 部分 Store/Proxy API 差异
- `Ext.define` 语法差异
- 布局宽度单位差异（v47 无单位，v67 支持 px/%）
- 部分渲染函数可能不完全一致

## QMW（双语版）

- 针对特殊客户需求的双语表单支持
- 仅在用户明确要求双语版本时使用
- JS 文件编码为 UTF-8 with BOM

## 交互流程

1. 确认版本（默认 v67）
2. 其余同 `bpm-create-page` 的交互流程
3. 生成 JS + Handler

### 进度汇报（生成期间）

生成过程中（步骤 3），每完成一个阶段向用户汇报进度：

- `✅ 已确认版本：{v67|v47|QMW}`
- `✅ 已确认页面配置`
- `🔄 正在生成 ExtJS 页面 (.js)`
- `🔄 正在生成 C# Handler (.ashx)`
- `📄 生成完毕`

## 输出

- `.js` 文件 + `.ashx` Handler 文件
- 编码：UTF-8 with BOM
- **直接写入**（不要用 Write 工具 + 后处理两步）：

  ```bash
  cd "{目标目录路径}"
  powershell -Command "[System.IO.File]::WriteAllLines('{FileName}.js', $jsContent, [System.Text.UTF8Encoding]::new($true)); [System.IO.File]::WriteAllLines('{FileName}.ashx', $handlerContent, [System.Text.UTF8Encoding]::new($true))"
  ```
