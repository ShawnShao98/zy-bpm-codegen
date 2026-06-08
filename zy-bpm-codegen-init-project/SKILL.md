---
name: bpm-init-project
description: BPM 项目初始化 — 引导配置 .bpm-codegen-config.json（模块前缀、输出路径、表单模板等）
---

# bpm-init-project — 项目初始化 + 配置管理

## 功能

引导用户配置项目参数，保存到 `.bpm-codegen-config.json`。

## 配置文件结构

```json
{
  "modulesPrefix": "Demo",
  "outputBasePath": "",
  "jsOutputPath": "YZModules/{prefix}/Modules/{PageClassName}.js",
  "handlerOutputPath": "YZModules/{prefix}/StoreDataService/{PageClassName}_Handler.ashx",
  "formOutputPath": "YZSoft/forms/XForm/{FormName}.aspx",
  "defaultDSName": "BPMDB",
  "i18n": true,
  "form": {
    "tplFilePath": "",
    "tplInsertSign": "",
    "tplClassNames": {
      "title": "xttl",
      "primaryTableLabel": "xfld",
      "repeatTableLabel": "xtbd"
    },
    "formWidth": 800,
    "tableCols": 6,
    "formSavePath": "YZSoft/forms/XForm",
    "showSignTrace": false,
    "primaryTableLabelWidth": 150
  },
  "createDirectories": ["Dialogs", "Excel", "Modules", "RFC", "StoreDataService"]
}
```

## 配置项说明

| 配置项 | 必填 | 默认值 | 说明 |
|--------|------|--------|------|
| `modulesPrefix` | 是 | — | 模块前缀（如 Demo、HR、OA） |
| `outputBasePath` | 否 | 当前工作目录 | BPM WEB 根路径 |
| `jsOutputPath` | 否 | 见上 | JS 输出路径模板 |
| `handlerOutputPath` | 否 | 见上 | Handler 输出路径模板 |
| `formOutputPath` | 否 | 见上 | 表单默认输出路径 |
| `defaultDSName` | 否 | BPMDB | 默认数据源名 |
| `i18n` | 否 | true | 是否使用国际化 |
| `form.tplFilePath` | 是 | — | 表单模板文件全路径 |
| `form.tplInsertSign` | 是 | — | 模板替换标识 |
| `form.tplClassNames.title` | 否 | xttl | 标题栏 CSS 类名 |
| `form.tplClassNames.primaryTableLabel` | 否 | xfld | 主表 Label CSS 类名 |
| `form.tplClassNames.repeatTableLabel` | 否 | xtbd | 明细表 Label CSS 类名 |
| `form.formWidth` | 否 | 800 | 表单默认宽度 |
| `form.tableCols` | 否 | 6 | 主表默认列数 |
| `form.formSavePath` | 否 | YZSoft/forms/XForm | 表单输出相对路径 |
| `form.showSignTrace` | 否 | false | 默认启用签核跟踪 |
| `form.primaryTableLabelWidth` | 否 | 150 | 主表 Label 宽度 |

## 交互流程

1. **首次初始化**：逐项引导用户填写（`modulesPrefix` 必填）
2. **查看配置**：显示当前 `.bpm-codegen-config.json` 内容
3. **更新配置**：用户指定要修改的配置项和值
4. **重置配置**：删除配置文件，提示重新初始化

## 路径解析

- `{prefix}` → `modulesPrefix` 值
- `{PageClassName}` → 生成时的页面类名
- `{FormName}` → 生成时的表单名称
- `outputBasePath` 为空时使用当前工作目录

## 子目录创建

`createDirectories` 列表中的目录在列表页生成时自动创建：
- `Dialogs`、`Excel`、`Modules`、`RFC`、`StoreDataService`

## 输出

生成 `.bpm-codegen-config.json` 到项目根目录。
