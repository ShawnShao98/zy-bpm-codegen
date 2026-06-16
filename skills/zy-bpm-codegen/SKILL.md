---
name: zy-bpm-codegen
description: BPM 代码生成器 — 通过自然语言生成 SQL 建表脚本、ExtJS 表单页面、列表页（JS + Handler）等。包含 5 个子命令：init-project、create-table、create-form、create-page、create-dynamic-page。
---

# ZY-BPM-Codegen

BPM 系统代码生成器。根据用户描述的业务需求，生成与原有 C# 生成器（ZYDevToolsApp）完全一致的代码文件。

## 子命令

安装本插件后，以下命令自动可用：

| 命令 | 说明 |
|------|------|
| `/bpm-init-project` | 项目初始化 + 配置管理 |
| `/bpm-create-table` | 建表 SQL 生成 |
| `/bpm-create-form` | 表单 .aspx 生成 |
| `/bpm-create-page` | 列表页 (ExtJS + Handler) 生成 |
| `/bpm-create-dynamic-page` | 动态页面生成 (v47/v67/QMW) |

## 前置检查

**⚠️ 配置必须先初始化**：执行任何生成操作（create-form、create-page、create-dynamic-page）前，**当前项目目录**（用户执行命令的工作目录）下**必须存在** `.bpm-codegen-config.json` 配置文件：
- 不存在 → **必须**先引导用户执行 `/bpm-init-project` 完成初始化，配置文件保存在当前项目目录下，**不能跳过**
- 存在 → 读取配置并应用于生成，**必须使用配置中的值**，不能假设或使用硬编码默认值

**⚠️ 强制执行：任何配置项未经用户明确确认，一律不得使用。不得假设、不得跳过确认、不得使用"合理默认值"。**

**配置文件作用域**：`.bpm-codegen-config.json` 保存在**项目根目录**，随项目一起移动。不同项目可以有各自的配置文件。

## 通用约定

### 命名规范
- PageClassName：大驼峰，如 `EmployeeManagement`
- JS 模块路径：`YZModules.{prefix}.Modules.{PageClassName}`
- Handler 类名：`{PageClassName}_Handler`
- Store/Grid 命名：`store_{TableName}`、`grid_{TableName}`
- 数据源命名：`DSName.TableName`（如 `BPMDB.Employee_T`）

### 编码规范
- .aspx 文件：UTF-8 with BOM（Write 后紧跟 PowerShell 加 BOM，一步到位不确认）
- .js / .ashx 文件：UTF-8 with BOM（Write 后紧跟 PowerShell 加 BOM，一步到位不确认）
- **BOM 添加**（Write 工具无 BOM，生成后立刻用 PowerShell 补 BOM，不需要用户确认）：
  ```bash
  cd "{目标目录}"
  powershell -Command "Get-ChildItem -Filter '{FileName}.*' | ForEach-Object { \$f=\$_.FullName; \$c=[System.IO.File]::ReadAllBytes(\$f); if(\$c[0]-ne 0xEF -or \$c[1]-ne 0xBB -or \$c[2]-ne 0xBF){\$b=[byte[]]@(0xEF,0xBB,0xBF)+$c;[System.IO.File]::WriteAllBytes(\$f,\$b)}}"
  ```
- C# 代码使用 XML 中文注释
- SQL 参数化查询

### BPM 框架约定
- 列表页继承 `Ext.panel.Panel`，layout `border`
- 表单使用 `YZSoft.bpm.src.ux.FormManager` 打开
- 权限通过 `config?.perm?.AllRecord` 传递
- 按钮使用 YZSoft glyph 图标体系

## 参考模板

生成代码时参考 `references/` 目录中的模板：
- `references/extjs-page-sample.js` — 完整 ExtJS v67 页面示例
- `references/handler-sample.ashx` — 完整 C# Handler 示例
- `references/sql-template.txt` — SQL 建表模板
