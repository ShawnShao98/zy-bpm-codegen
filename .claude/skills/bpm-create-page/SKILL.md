---
name: bpm-create-page
description: BPM 列表页生成 — 生成 ExtJS 前端页面 (.js) + C# 后端 Handler (.ashx)，含按钮/搜索/列配置/操作列
---

# bpm-create-page — 列表页 (ExtJS + Handler) 生成

## 输入

表结构 + 页面配置（按钮、搜索、列、操作）。每个配置点需与用户确认，全部确认后生成。

## 前置检查

**⚠️ 配置必须先初始化**：执行生成前，检查项目根目录是否存在 `.bpm-codegen-config.json`：
- 不存在 → **必须**先引导用户执行 `/bpm-init-project` 完成初始化，**不能跳过**
- 存在 → 读取配置并应用于生成，**必须使用配置中的值**，不能使用硬编码默认值

**⚠️ 强制执行：所有配置项必须逐项向用户确认，未经用户明确确认的配置项一律不得使用，不得假设、不得跳过、不得使用所谓的"合理默认值"。**

**必须读取的配置项**（全部来自 `.bpm-codegen-config.json`）：
- `modulesPrefix` — 模块前缀（用于 JS 模块路径）
- `i18n` — 是否使用国际化（默认 true）
- `defaultDSName` — 默认数据源名称
- `jsOutputPath` — JS 输出路径模板
- `handlerOutputPath` — Handler 输出路径模板
- `createDirectories` — 需要自动创建的目录列表

- 确认用户提供了 `PageClassName` 和页面名称

## 页面数据结构

对应 DynamicPage 前端 PageModel，三个核心字段以 JSON 存储：
- `PageLayout` — 页面布局
- `PageToolbar` — 工具栏
- `PageTables` — 数据表数组

## PageLayout 配置

| type | 说明 | 额外 LayoutCfg 字段 |
|------|------|---------------------|
| `border` | 区域布局 | `region`（center/north/south/west/east）、`width`（west/east）、`height`（north/south） |
| `hbox` | 水平布局 | `width`、`height` |
| `vbox` | 垂直布局 | `width`、`height` |
| `fit` | 填充布局（默认） | 无 |

## PageTables[] 配置

每个数据表：

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `DSName` | 配置的 defaultDSName | 数据源名称 |
| `TableName` | — | 表名/视图名 |
| `Repeat` | 表名以 `_T` 结尾 | 是否明细表 |
| `Title` | — | 表格标题 |
| `RelationTableName` | — | 关联表名（明细表需要） |
| `MultiSelect` | false | 多选 |
| `RowDblClickType` | — | `openTaskForRead` / `openFormApplication` |
| `HistoryFormTaskID` | TaskID | 历史表单字段 |
| `FormServicePath` | — | 表单服务路径 |
| `FormServiceKey` | — | 表单服务 Key |
| `LayoutCfg` | 见 PageLayout | 布局配置 |
| `ActionColumn` | `{}` | 操作列配置 |
| `Columns` | [] | 列配置 |

## Columns[] 配置

| 字段 | 默认值 | 说明 |
|------|--------|------|
| `ColumnName` | — | 数据库列名 |
| `DisplayName` | Comment 或 ColumnName | 展示名称 |
| `DataType` | — | 数据类型 |
| `Order` | true | 允许排序 |
| `DefaultOrder` | "" | 默认排序（TaskID 默认 DESC） |
| `Width` | 150 | 列宽 |
| `Fixed` | false | 锁定列 |
| `Hidden` | 列名含 ID/Code/Account | 隐藏 |
| `Align` | center | 对齐 |
| `QuickSearch` | false | 快速搜索 |
| `AdvancedSearch` | false | 高级搜索 |
| `SearchCfg` | `{}` | 搜索配置 |
| `Format` | date类型→date, State→state | 格式化 |
| `FormatCfg` | `{}` | 格式化配置 |
| `RelationTableColumn` | — | 关联表字段 |

## Format 类型与渲染函数映射

| Format | 渲染函数 | FormatCfg 要求 |
|--------|---------|----------------|
| `date` | `renderAsDate(value)` | 无 |
| `decimal` | `renderAsDecimal(value, digit)` | `DecimalDigit`（默认 2） |
| `currency` | `renderAsCurrency(value, symbol, digit)` | `CurrencySymbol`（默认 ¥）、`CurrencyDigit`（默认 2） |
| `bpm_attachment` | `renderAsBPMAttachment(value, nameField)` | `AttachmentNameField` |
| `bpm_image_attachment` | `renderAsBPMImageAttachment(value, nameField)` | `AttachmentNameField` |
| `state` | `renderStateAsChinese(value)` | 无 |
| `state_flag` | `renderStatusFlag(value)` | 无 |
| `yes_no` | `renderYesNo(value)` | 无 |
| `tag` | `renderAsTagWithElementUI(value)` | 无 |
| `link` | `renderAsLink(value)` + click handler | `ClickAction` + 对应参数 |
| `custom` | 使用 `FormatCfg.JS` 自定义 | `JS` 函数体 |

## link 的 ClickAction

| 值 | 说明 | FormatCfg 额外字段 |
|----|------|-------------------|
| `openTaskForRead` | 历史表单 | `HistoryFormTaskID` |
| `openTaskForProcess` | 点击处理流程 | `HistoryFormTaskID` |
| `openFormApplication` | 表单服务 | `FormServicePath`、`FormServiceKey` |
| `openWebsite` | 打开网址 | `Url` |

## SearchCfg 配置

| ComponentType | ExtJS 组件 | 说明 |
|--------------|------------|------|
| `Account` | `YZSoft.src.form.field.User` | 账号选择 |
| `OU` | `YZSoft.src.form.field.OUCode` | 部门选择 |
| `ProcessState` | `Ext.form.ComboBox`（Running/Approved/Rejected/Aborted/Deleted） | 流程状态下拉 |
| `DropDown` | `Ext.form.ComboBox`（是/否） | 自定义下拉 |

## ActionColumn 配置

| ActionType | 配置项 |
|------------|--------|
| `FormServiceEdit` | `FormServicePath`、`FormServiceKey` |
| `State` | `UpdateStateKey`、`StateField`、`EnableValue`、`DisableValue` |
| `All` | 以上全部 |

## PageToolbar.Buttons[] 配置

### 按钮图标（18 种预定义）

```
yz-glyph yz-glyph-e61d (新增)
yz-glyph yz-glyph-edit (编辑)
yz-glyph yz-glyph-delete (删除)
yz-glyph yz-glyph-e601 (下载)
yz-glyph yz-glyph-e606 (禁用)
yz-glyph yz-glyph-e611 (锁定)
yz-glyph yz-glyph-e62b (关闭)
yz-glyph yz-glyph-e913 (分享)
yz-glyph yz-glyph-e916 (链接)
yz-glyph yz-glyph-e926 (点赞)
yz-glyph yz-glyph-e91f (上传)
yz-glyph yz-glyph-e956 (搜索)
yz-glyph yz-glyph-e959 (导航)
yz-glyph yz-glyph-e96b (设置)
yz-glyph yz-glyph-e967 (通知)
yz-glyph yz-glyph-ead9 (过滤)
yz-glyph yz-glyph-ead1 (收藏)
yz-glyph yz-glyph-eb2a (Excel)
yz-glyph yz-glyph-eb16 (退出)
```

### handlerType 配置

**① openProcess**：需要 `processName` + `handlerCfg`（`processRelatedDSTable`、`processTIDColumn`、`processPIDColumn`、`processHaveParams`、`processParams[{k,type,v}]`）
**② openFormService**：需要 `handlerCfg`（`formServicePath`、`formServiceFormState`、`formServiceRelatedDSTable`、`formServiceKey`、`formServiceHaveParams`、`formServiceParams[{k,type,v}]`）
**③ deleteRecords**：需要 `handlerCfg`（`processRelatedDSTable`、`deleteFieldColumn`）
**④ custom**：需要 `handlerCfg.js`（自定义 JS，可访问 `me.Store_数据源_表名`、`me.Grid_数据源_表名`）

## PageToolbar 搜索配置

| 字段 | 说明 |
|------|------|
| `SearchDSTableName` | 搜索表名（`DSName.TableName`） |
| `ExportExcelDSTableName` | 导出 Excel 表名 |
| `ExportExcel` | 是否启用导出 |
| `QuickSearch` | 快速搜索（多列 LIKE，参考模板中的 `YZSoft.src.form.field.Search`） |
| `AdvancedSearch` | 高级搜索（User/OUCode/ComboBox/Text 组件 + Panel + 搜索/重置按钮） |

## 国际化控制

- `i18n: true`（默认）：使用 `ZY.$("All_XXX")` 或 `RS.$("All_XXX")`
- `i18n: false`：直接输出中文文本

## 参考模板

生成 ExtJS 代码时，参考 `references/extjs-page-sample.js`：
- `Ext.define('YZModules.{prefix}.Modules.{PageClassName}', { extend: 'Ext.panel.Panel' })`
- Store：`Ext.create('Ext.data.JsonStore', { remoteSort: true, pageSize: $S.pageSize.defaultSize, proxy: { type: 'ajax', url: YZSoft.$url(me, '../StoreDataService/{PageClassName}_Handler.ashx'), extraParams: { method: 'GetPage{TableName}' } } })`
- Grid：`Ext.create('Ext.grid.Panel', { store, columns: [{ xtype: 'rownumberer' }, ...], bbar: Ext.create('Ext.toolbar.Paging', { store }) })`
- 渲染函数：`renderAsDate`、`renderAsLink`、`renderAsDecimal`、`renderAsCurrency`、`renderAsBPMImageAttachment`、`renderAsBPMAttachment`、`renderStateAsChinese`、`renderStatusFlag`、`renderYesNo`、`renderAsTagWithElementUI`、`renderAsPicture`、`renderAsBPMAttachments`、`renderAsUser`
- 双击行：`YZSoft.bpm.src.ux.FormManager.openTaskForRead` / `openFormApplication`
- 按钮：`YZSoft.src.button.Button`、`YZSoft.src.button.ExcelExportButton`
- 删除：`YZSoft.Ajax.request` + `me.store.reload()`
- 操作列：`xtype: 'actioncolumn'` + 编辑/启用/禁用图标

生成 Handler 代码时，参考 `references/handler-sample.ashx`：
- `<%@ WebHandler Language="C#" Class="{PageClassName}_Handler" %>`
- using：System、System.Web、System.Configuration、System.Data、System.Data.SqlClient、Newtonsoft.Json.Linq、BPM.Client、YZSoft.Web.DAL
- 继承 `YZServiceHandler`
- `GetPage{TableName}` 方法：CTE + ROW_NUMBER 分页，`SqlParameter` 参数化
- 连接串：`BPMConnection` + `DataSourceServer.Open(cn, "", dsName)`
- QuickSearch：多列 LIKE
- AdvancedSearch：日期区间/用户/部门/下拉
- `Delete{TableName}By{Field}`：批量删除

## 交互流程

1. 确认页面名称、PageClassName、布局类型
2. 确认数据表（主表/明细表、关联关系）
3. 确认列配置（显示名称、排序、宽度、隐藏、格式化等）
4. 确认搜索配置（搜索表、快速搜索字段、高级搜索字段及类型）
5. 确认按钮配置（文字、图标、类型、参数）
6. 确认操作列配置（编辑/状态）
7. 确认双击行事件
8. 全部确认后生成 JS + Handler

### 进度汇报（生成期间）

生成过程中（步骤 8），每完成一个阶段向用户汇报进度：

- `✅ 已确认页面名称、PageClassName、布局类型`
- `✅ 已确认数据表配置（主表 + X 个明细表）`
- `✅ 已确认列配置（共 Y 列）`
- `✅ 已确认搜索配置（快速: Z 个, 高级: W 个）`
- `✅ 已确认按钮配置（N 个按钮）`
- `✅ 已确认操作列配置`
- `✅ 已确认双击行事件`
- `🔄 正在生成 ExtJS 页面 (.js)`
- `🔄 正在生成 C# Handler (.ashx)`
- `✅ 文件编码 BOM 已添加`
- `📄 生成完毕，待确认`

## 输出

- ExtJS `.js` 文件（路径：配置的 `jsOutputPath` 模板解析）
- C# `.ashx` Handler 文件（路径：配置的 `handlerOutputPath` 模板解析）
- 编码：UTF-8 with BOM
- **直接写入**（不要用 Write 工具 + 后处理两步）：

  ```bash
  cd "{目标目录路径}"
  powershell -Command "[System.IO.File]::WriteAllLines('{FileName}.js', $jsContent, [System.Text.UTF8Encoding]::new($true)); [System.IO.File]::WriteAllLines('{FileName}.ashx', $handlerContent, [System.Text.UTF8Encoding]::new($true))"
  ```
