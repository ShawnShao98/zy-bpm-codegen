# create-dynamic-page — 动态页面生成 (v47/v67/QMW)

## 说明

生成规则与 `create-page` 完全相同，区别在于代码生成版本。

## 版本选择

| 版本 | 说明 | 编码 | 默认 |
|------|------|------|------|
| **v67** | ExtJS 6 标准版 | JS: GBK, Handler: GBK | ✅ |
| **v47** | ExtJS 4.7 兼容版 | JS: GBK, Handler: GBK | — |
| **QMW** | 青牧文双语版 | JS: UTF-8 with BOM, Handler: GBK | — |

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
- JS 文件编码为 UTF-8 with BOM（与 v67/v47 的 GBK 不同）

## 交互流程

1. 确认版本（默认 v67）
2. 其余同 `create-page` 的交互流程
3. 生成 JS + Handler

## 输出

- `.js` 文件 + `.ashx` Handler 文件
- 编码根据版本不同而不同
