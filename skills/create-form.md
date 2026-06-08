# create-form — 表单 .aspx 生成

## 输入

表结构（字段列表）+ 表单配置。

## 生成规则

### 模板替换

1. 从配置读取 `form.tplFilePath` 和 `form.tplInsertSign`
2. 替换 `<%@ Page language="C#"%%ClassName, ClassName="{0}"%% %>` 为 `<%@ Page Language="C#" %>`
3. 将生成的表单内容替换到 `form.tplInsertSign` 位置

### 主表布局

- 字段**倒序**排列
- 按 `form.tableCols`（默认 2 列）布局
- 支持 ColSpan 跨列
- 放不下则换行（不压缩列）
- Label 宽度使用 `form.primaryTableLabelWidth`（默认 150）

### 明细表布局

- 添加 `XAddBlockButton`（+ 按钮）
- 添加 `XGridLineNo`（序号列）
- 可编辑行
- 隐藏字段 > 4 个时，在序号列展示独立小表格

### 控件库（10 种）

| 控件 | 用途 | 默认条件 |
|------|------|----------|
| `XTextBox` | 文本输入 | 默认控件 |
| `XDateTimePicker` | 日期选择器 | 数据类型含 date/datetime 或列名含 date |
| `XDropDownList` | 下拉列表 | 手动指定 |
| `XAttachments` | 附件上传 | 列名含 Attachment |
| `XCheckBoxList` | 复选框列表 | 手动指定 |
| `XRadioButtonList` | 单选按钮列表 | 手动指定 |
| `XRadioButton` | 单个单选按钮 | 手动指定 |
| `XCheckBox` | 单个复选框 | 手动指定 |
| `XImageAttachment` | 图片附件 | 手动指定 |
| `XHistoryFormLink` | 历史表单链接 | 手动指定 |

### 控件自动映射规则

当未手动指定 `XFormControl` 时：
1. 数据类型含 `date` / `datetime`，或列名含 `date` → `XDateTimePicker`
2. 列名含 `Attachment` → `XAttachments`
3. 其余 → `XTextBox`

### 列默认属性

- `ReadOnly` 默认 `true`：`Creater`、`CreationAccount`、`CreationDept`、`CreationDeptCode`、`SN`、`CreationDate`
- `Hidden` 默认 `true`：列名含 `ID`、含 `Code`、含 `Account`，或等于 `SN`
- `Generate` 默认 `false`（不生成到表单）：`ID`、`TaskID`、`TID`、`MID`

### 必填字段

- 添加 `XRequiredFieldValidator` + 红色 `*` 标记
- `ErrorMessage` 格式：`{DisplayName}必填`

### 隐藏字段

- 底部添加 `hidden` 表格集中展示
- 包含组件 ID、位置描述、说明列

### 签收跟踪

- 配置中 `form.showSignTrace=true` 时，底部添加 `XSignTrace` 控件

### CSS 类名

- 标题栏：`form.tplClassNames.title`（默认 `xttl`）
- 主表 Label：`form.tplClassNames.primaryTableLabel`（默认 `xfld`）
- 明细表 Label：`form.tplClassNames.repeatTableLabel`（默认 `xtbd`）

### 编码

- GBK (936)
- 文件后缀 `.aspx`

### 双语表单

- 用户要求双语时，生成逻辑相同，仅模板来源不同
- 对应 C# 端的 `QMWFormGeneratorService`

## 输出路径

用户指定路径，或 `form.formSavePath` + `{FormName}.aspx`（默认 `YZSoft/forms/XForm/{FormName}.aspx`）

## 生成前验证

1. `form.tplFilePath` 路径下的文件存在
2. `form.tplInsertSign` 在模板文件中存在
3. 至少有一个数据表

## 交互流程

1. 确认表结构和字段
2. 确认表单配置（宽度、列数、CSS 类名等）
3. 生成 .aspx 文件内容
4. 供用户确认后输出
