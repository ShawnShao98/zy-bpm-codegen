# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

ZY-BPM-Codegen 是一个 Claude Code 插件（Skill），用于为 Flowportal BPM 系统（ASP.NET Framework 4.5 + ExtJS 6）生成代码。通过自然语言描述，生成与原有 C# 生成器（ZYDevToolsApp）完全一致的代码文件。

**这不是一个可运行的应用程序**，而是一个代码生成器插件——没有 build/test/run 流程。工作方式是用户通过 `/bpm-*` 子命令触发代码生成。

## 目录结构

```
.claude/skills/          # 5 个子命令的 SKILL.md（核心逻辑）
references/              # 参考模板
├── extjs-page-sample.js # 完整 ExtJS v67 页面示例
├── handler-sample.ashx  # 完整 C# Handler 示例
├── sql-template.txt     # SQL 建表模板
└── form/                # C# 表单生成器参考样本
.claude-plugin/          # 插件元数据（plugin.json）
plugin.json              # 根目录插件描述文件
README.md                # 用户使用文档
```

## 核心工作流

用户执行命令的典型流程：

1. **`/bpm-init-project`** → 生成 `.bpm-codegen-config.json`（保存在项目根目录）
2. **`/bpm-create-table`** → 生成 SQL Server 建表 SQL
3. **`/bpm-create-form`** → 生成 ASP.NET WebForm `.aspx` 表单
4. **`/bpm-create-page`** → 生成 ExtJS 列表页 `.js` + C# Handler `.ashx`
5. **`/bpm-create-dynamic-page`** → 同 create-page，支持 v47/v67/QMW 三版本

## 关键架构约束

### 配置必须先初始化

所有生成命令（create-form/create-page/create-dynamic-page）**必须先检查当前工作目录下是否存在 `.bpm-codegen-config.json`**：
- 不存在 → 必须先引导用户执行 `/bpm-init-project`
- 存在 → 必须使用配置文件中的值，**禁止使用硬编码默认值**

### 所有配置项必须确认

配置文件中的任何值，**未经用户明确确认不得使用**。不得假设、不得跳过、不得使用"合理默认值"。

### 文件编码

- `.aspx` / `.js` / `.ashx` 文件必须使用 **UTF-8 with BOM**
- Write 工具写入后，**必须立即用 PowerShell 添加 BOM**（一步到位，不需用户确认）

### 命名规范

| 元素 | 格式 |
|------|------|
| PageClassName | 大驼峰，如 `EmployeeManagement` |
| JS 模块路径 | `YZModules.{prefix}.Modules.{PageClassName}` |
| Handler 类名 | `{PageClassName}_Handler` |
| 控件 ID | `{DSName}_{TableName}_{ColumnName}`（**必须含 DSName 前缀**） |
| XDataBind | `{DSName}:{TableName}.{ColumnName}` |
| 数据源 | `DSName.TableName`（如 `BPMDB.Employee_T`） |

## 技术栈

- **前端**：ExtJS 6（v67）、ExtJS 4.7（v47 兼容版）
- **后端**：ASP.NET Framework 4.5 WebForm + ASHX Handler
- **数据库**：SQL Server（DDL + `sp_addextendedproperty` 注释）
- **分页**：CTE + `ROW_NUMBER()` 分页模式
- **BPM SDK**：Flowportal BPM SDK 约定（`YZSoft.*` 命名空间）

## 参考模板位置

生成代码时，以 `references/` 目录中的文件为基准：
- ExtJS 页面 → `references/extjs-page-sample.js`
- C# Handler → `references/handler-sample.ashx`
- SQL 建表 → `references/sql-template.txt`
- ASP.NET 表单 → `.claude/skills/bpm-create-form/SKILL.md` 中的 XML 模板

## 子命令速查

| 命令 | SKILL 文件 | 输出 |
|------|-----------|------|
| `/bpm-init-project` | `.claude/skills/bpm-init-project/SKILL.md` | `.bpm-codegen-config.json` |
| `/bpm-create-table` | `.claude/skills/bpm-create-table/SKILL.md` | SQL 脚本 |
| `/bpm-create-form` | `.claude/skills/bpm-create-form/SKILL.md` | `.aspx` 文件 |
| `/bpm-create-page` | `.claude/skills/bpm-create-page/SKILL.md` | `.js` + `.ashx` |
| `/bpm-create-dynamic-page` | `.claude/skills/bpm-create-dynamic-page/SKILL.md` | `.js` + `.ashx` |
