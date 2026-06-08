# ZY-BPM-Codegen

Flowportal BPM 系统代码生成器。通过自然语言生成与原有 C# 生成器（ZYDevToolsApp）完全一致的代码文件。

## 功能

| 子命令 | 说明 |
|--------|------|
| `init-project` | 项目初始化 + 配置管理 |
| `create-table` | SQL Server 建表 SQL 生成 |
| `create-form` | ASP.NET WebForm 表单 .aspx 生成 |
| `create-page` | ExtJS 列表页（JS + Handler）生成 |
| `create-dynamic-page` | 动态页面生成（v47/v67/QMW 三版本） |

## 安装

```bash
claude plugin add https://github.com/ShawnShao98/zy-bpm-codegen
```

或手动安装：

```bash
git clone https://github.com/ShawnShao98/zy-bpm-codegen.git
```

将 `skills/zy-bpm-codegen` 复制到 `~/.claude/skills/zy-bpm-codegen`。

## 使用示例

1. **初始化项目**：`/zy-bpm-codegen` → 引导配置 `.bpm-codegen-config.json`
2. **建表**：`创建员工表，字段：姓名（文本）、工号（文本）、入职日期（日期）`
3. **表单**：`根据员工表生成表单，2 列布局`
4. **列表页**：`生成员工管理列表页，包含新增/编辑/删除按钮`
5. **动态页面**：`生成 v67 版本的员工管理页面`

## 技术栈

- ASP.NET Framework 4.5 + ExtJS 6（v67）
- SQL Server DDL（含 sp_addextendedproperty 注释）
- C# ASHX Handler（CTE + ROW_NUMBER 分页）
- Flowportal BPM SDK 约定

## License

MIT
