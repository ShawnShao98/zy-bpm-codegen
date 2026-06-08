---
name: zy-bpm-codegen
description: BPM 代码生成器 — 通过自然语言生成 SQL 建表脚本、ExtJS 表单页面、列表页（JS + Handler）等。支持 init-project、create-table、create-form、create-page、create-dynamic-page 五个子命令。
---

# ZY-BPM-Codegen

BPM 系统代码生成器。根据用户描述的业务需求，生成与原有 C# 生成器（ZYDevToolsApp）完全一致的代码文件。

## 路由规则

根据用户描述中的关键意图分发到对应子 skill：

| 意图关键词 | 子 skill |
|-----------|----------|
| 初始化 / init / 配置 / 设置 / config | `init-project` |
| 建表 / create table / 表结构 / 表 / 字段 | `create-table` |
| 表单 / form / 页面设计 / aspx | `create-form` |
| 列表 / 页面 / grid / 列表页 / 管理页 | `create-page` |
| 动态页面 / dynamic page | `create-dynamic-page` |

用户也可通过子命令直接指定，如 `/zy-bpm-codegen create-table`、`/zy-bpm-codegen create-form` 等。

## 前置检查

执行任何生成操作前，检查项目根目录是否存在 `.bpm-codegen-config.json`：
- 不存在 → 提示用户先执行 `init-project`
- 存在 → 读取配置并应用于生成

## 通用约定

### 命名规范
- PageClassName：大驼峰，如 `EmployeeManagement`
- JS 模块路径：`YZModules.{prefix}.Modules.{PageClassName}`
- Handler 类名：`{PageClassName}_Handler`
- Store/Grid 命名：`store_{TableName}`、`grid_{TableName}`
- 数据源命名：`DSName.TableName`（如 `BPMDB.Employee_T`）

### 编码规范
- .aspx 文件：GBK (936)
- .js / .ashx 文件：GBK (936)（QMW 版本 .js 为 UTF-8 with BOM）
- C# 代码使用 XML 中文注释
- SQL 参数化查询

### BPM 框架约定
- 列表页继承 `Ext.panel.Panel`，layout `border`
- 表单使用 `YZSoft.bpm.src.ux.FormManager` 打开
- 权限通过 `config?.perm?.AllRecord` 传递
- 按钮使用 YZSoft glyph 图标体系

## 子 Skill 列表

- `init-project` — 项目初始化 + 配置管理
- `create-table` — 建表 SQL 生成
- `create-form` — 表单 .aspx 生成
- `create-page` — 列表页 (ExtJS + Handler) 生成
- `create-dynamic-page` — 动态页面生成 (v47/v67/QMW)
