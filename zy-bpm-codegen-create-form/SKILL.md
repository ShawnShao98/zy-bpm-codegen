---
name: bpm-create-form
description: BPM 表单生成 — 根据表结构生成 ASP.NET WebForm (.aspx) 表单页面，支持 10 种控件自动映射
---

# bpm-create-form — 表单 .aspx 生成

## 输入

表结构（字段列表）+ 表单配置。

## 前置检查

执行前确认 `.bpm-codegen-config.json` 存在。

## 生成规则

### 严格遵循配置

**⚠️ 核心原则**：生成时必须严格按照用户提供的配置项执行，**不添加**任何配置之外的内容。

- **不自动添加**用户未要求的控件、列、字段
- **不自动修改**用户已配置的属性
- **不自动补充**用户未提及的布局元素
- 仅执行配置中明确指定的操作

### 模板替换

1. 从配置读取 `form.tplFilePath` 和 `form.tplInsertSign`
2. 替换 `<%@ Page language="C#"%%ClassName, ClassName="{0}"%% %>` 为 `<%@ Page Language="C#" %>`
3. 将生成的表单内容替换到 `form.tplInsertSign` 位置

### 输出结构

生成器输出一个 `<div>` 包裹的内容，插入到模板的替换标识位置：

```xml
<div>
    <table>主表</table>
    <div>明细表1</div>
    <div>明细表2</div>
    ...
    <br />
    <table>隐藏字段表格</table>
</div>
```

### 主表布局

- 外层 `<table>` 属性：`align="center" cellspacing="0" cellpadding="0" width="{formWidth}" style="边框"`
- 字段**倒序**排列（最后一个字段最先显示）
- 按 `form.tableCols`（默认 6 列）布局
- 每行结构：`Label | Control | Label | Control | ...`（Label 和 Control 交替）
- 支持 ColSpan 跨列（如 `colspan="5"` 用于宽字段）
- 放不下则换行（不压缩列）
- 行末尾用空 `<td>` 补齐到 tableCols 列
- Label 宽度使用 `form.primaryTableLabelWidth`（默认 150）

**表头行**：
```xml
<tr>
    <td class="xttl" Height="21px" style="边框" colspan="{tableCols}">
        <span style="margin: 0 6px; font-weight: bold;">{表DisplayName}</span>
    </td>
</tr>
```

**Label 单元格**：
```xml
<td class="xfld" style="边框" align="center" width="150">
    <span>{DisplayName}</span>
</td>
```

**必填 Label 单元格**：
```xml
<td class="xfld" style="边框" align="center" width="150">
    <span style="color:red; font-weight:bold">*</span>
    <aspxform:XRequiredFieldValidator runat="server" ForeColor="Red" Display="None" ControlToValidate="{控件ID}" ErrorMessage="{错误消息}">R</aspxform:XRequiredFieldValidator>
    <span>{DisplayName}</span>
</td>
```

**Control 单元格**：
```xml
<td style="边框">
    <aspxform:XTextBox runat="server" id="{控件ID}" XDataBind="{数据绑定}" Width="100%" FieldName="{DisplayName}" ReadOnly="True" />
</td>
```

**Colspan 行**（跨多列的字段）：
```xml
<tr>
    <td class="xfld" style="边框" align="center" width="150"><span>备注</span></td>
    <td style="边框" colspan="5"><aspxform:XTextBox ... /></td>
</tr>
```

**空列补齐**：
```xml
<td class="xfld" align="center" style="边框" />
```

### 明细表布局

**每个明细表都是独立的 table，嵌套关系由用户配置决定**

- **兄弟明细表**：每个明细表包裹在 div 中：
  ```xml
  <div style="margin: 0 auto; width: {formWidth}px; height: {height}px; overflow: auto">
      <table align="center" cellspacing="0" cellpadding="0" width="{formWidth}" dynamicarea="2,1">
          ...
      </table>
  </div>
  ```
  - height 为 "0" 或空时使用 `auto`

- **嵌套明细表**（用户配置了 ParentTable 时）：
  - 子明细表直接生成在父明细表的对应 `<td>` 内
  - **不需要 div 包裹**，直接生成 `<table>`
  - 嵌套的 table 仍然需要 `dynamicarea` 属性
  - 嵌套 table 的宽度根据父 td 的宽度计算（通常 `width="100%"`）

- 表格属性：`align="center" cellspacing="0" cellpadding="0" width="{formWidth}" dynamicarea="2,1"`
- 添加 `XAddBlockButton`（+ 按钮）
- 添加 `XGridLineNo`（序号列）
- 可编辑行

**表头行**：
```xml
<tr>
    <td class="xttl" Height="21px" style="边框" colspan="{显示列数+1}">
        <span style="margin: 0 6px; font-weight: bold;">{表DisplayName}</span>
        <aspxform:XAddBlockButton runat="server" Text="+" DataSource="{DSName}" TableName="{TableName}" />
    </td>
</tr>
```

**列头行**：
```xml
<tr>
    <td class="xtbd" width="50" align="center" style="边框">#</td>
    <td class="xtbd" align="center" width="{百分比}%" style="边框" />
    <span style="color:red; font-weight:bold">* </span>
    <aspxform:XRequiredFieldValidator runat="server" ForeColor="Red" Display="None" ControlToValidate="{控件ID}" ErrorMessage="{错误消息}">R</aspxform:XRequiredFieldValidator>
    <span>{列名}</span>
    <!-- 更多列... -->
</tr>
```

**数据行**：
```xml
<tr>
    <td style="边框">
        <aspxform:XGridLineNo runat="server" Width="100%" TextAlign="Center" BackColor="Transparent" />
        <!-- 隐藏字段在此处 -->
    </td>
    <td style="边框">控件1</td>
    <td style="边框">控件2</td>
    <!-- 更多列... -->
</tr>
```

**明细表隐藏列**（隐藏字段 ≤ 4 个时）：
- 放在序号列 `<td>` 内，直接在 XGridLineNo 后面

**明细表隐藏字段独立表格**（隐藏字段 > 4 个时）：
- 在序号列 `<td>` 内嵌套一个独立的小表格

### 隐藏字段表格

- 前面加 `<br />`
- 表格外层属性：`width="{formWidth}" align="center" cellspacing="0" cellpadding="0" style="边框" hiddenexpress="1" class="hidden"`
- 4 列：**组件ID**（20%）、**位置描述**（20%）、**说明**（30%）、**作用**（30%）
- 表头：`<td class="xttl" height="21px" colspan="4" style="边框"><span style="margin: 0 6px; font-weight: bold;">隐藏字段</span></td>`
- 列头行：4 个 `<td>` 分别显示"组件ID"、"位置描述"、"说明"、"作用"
- 每个隐藏字段一行：
  - 组件ID 列：纯文本 `{DSName}_{TableName}_{ColumnName}`
  - 位置描述列：放置控件（`CssClass="hidden"`, `hiddenexpress="1"`）
  - 说明列：DisplayName 纯文本
  - 作用列：空 `<td>`

### 签收跟踪

- 配置中 `form.showSignTrace=true` 时，在隐藏字段表格之前添加 `XSignTrace` 控件
- 属性：`runat="server"`, `BorderColor="#dcdcdc"`, `BorderWidth="1"`, `Width="{formWidth}"`

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

**仅当用户配置中未指定 `XFormControl` 时**应用以下规则：
1. 数据类型含 `date` / `datetime`，或列名含 `date` → `XDateTimePicker`
2. 列名含 `Attachment` → `XAttachments`
3. 其余 → `XTextBox`

**如果用户已指定控件类型，严格按用户配置生成，不应用自动映射规则。**

### 列默认属性

**仅当用户配置中未指定以下属性时**应用默认值：

- `ReadOnly` 默认 `true`：`Creater`、`CreationAccount`、`CreationDept`、`CreationDeptCode`、`SN`、`CreationDate`
- `Hidden` 默认 `true`：列名含 `ID`、含 `Code`、含 `Account`，或等于 `SN`
- `Generate` 默认 `false`（不生成到表单）：`ID`、`TaskID`、`TID`、`MID`

**如果用户已明确指定属性值，严格按用户配置生成，不应用默认值。**

### 控件属性格式（必须严格遵循 C# 格式）

**⚠️ 控件 ID 是最关键的格式错误！** 必须使用完整格式，**不能使用简化格式**！

| 属性 | C# 格式 | 错误示例 |
|------|---------|----------|
| `runat` | `runat="server"` | — |
| `id` | `{DSName}_{TableName}_{ColumnName}` | `M_Creater`（错误）、`txtCreater`（错误）|
| `XDataBind` | `{DSName}:{TableName}.{ColumnName}` | `DataField="Creater"`（错误）|
| `FieldName` | `{DisplayName}` 或 `{ColumnName}` | — |
| `Width` | `100%`（主表控件默认） | 固定像素值 |
| `ReadOnly` | `ReadOnly="True"`（大写 T） | `ReadOnly="true"` |
| `DisplayOnly` | `DisplayOnly="True"`（日期只读时用） | — |
| `CssClass` | `CssClass="hidden"`（隐藏字段） | — |
| `hiddenexpress` | `hiddenexpress="1"`（隐藏字段） | — |

**⚠️ 验证：生成后检查所有控件 ID，必须包含 DSName 前缀！**

示例对比：
```xml
<!-- ✅ 正确格式 -->
<aspxform:XTextBox runat="server" id="BPMDATA_XZ_InfoDisclosureItem_M_Creater" XDataBind="BPMDATA:XZ_InfoDisclosureItem_M.Creater" Width="100%" FieldName="创建人" ReadOnly="True" />

<!-- ❌ 错误格式（缺少 DSName 和 TableName） -->
<aspxform:XTextBox runat="server" id="M_Creater" XDataBind="BPMDATA:XZ_InfoDisclosureItem_M.Creater" Width="100%" FieldName="创建人" ReadOnly="True" />
```

**完整控件示例**：
```xml
<aspxform:XTextBox runat="server" id="BPMDATA_XZ_InfoDisclosureItem_M_Creater" XDataBind="BPMDATA:XZ_InfoDisclosureItem_M.Creater" Width="100%" FieldName="创建人" ReadOnly="True" />
```

**隐藏字段控件示例**：
```xml
<aspxform:XTextBox runat="server" id="BPMDATA_XZ_InfoDisclosureItem_M_CreationAccount" XDataBind="BPMDATA:XZ_InfoDisclosureItem_M.CreationAccount" Width="100%" FieldName="创建人账号" ReadOnly="True" CssClass="hidden" hiddenexpress="1" />
```

**日期只读示例**：
```xml
<aspxform:XDateTimePicker runat="server" id="BPMDATA_XZ_InfoDisclosureItem_M_CreationDate" XDataBind="BPMDATA:XZ_InfoDisclosureItem_M.CreationDate" Width="100%" FieldName="创建日期" DisplayOnly="True" />
```

### 验证器格式

| 属性 | 值 |
|------|-----|
| `runat` | `server` |
| `ForeColor` | `Red` |
| `Display` | `None` |
| `ControlToValidate` | `{DSName}_{TableName}_{ColumnName}` |
| `ErrorMessage` | 根据 FormUtils 规则生成 |
| InnerText | `R` |

**完整验证器示例**：
```xml
<aspxform:XRequiredFieldValidator runat="server" ForeColor="Red" Display="None" ControlToValidate="BPMDATA_XZ_InfoDisclosureItem_M_StartDay" ErrorMessage="请填写起始日">R</aspxform:XRequiredFieldValidator>
```

### 必填星号位置

**主表 Label 单元格内**（星号后无空格）：
```xml
<span style="color:red; font-weight:bold">*</span>
<aspxform:XRequiredFieldValidator ...>R</aspxform:XRequiredFieldValidator>
<span>字段名</span>
```

**明细表列头**（星号后有空格）：
```xml
<span style="color:red; font-weight:bold">* </span>
<aspxform:XRequiredFieldValidator ...>R</aspxform:XRequiredFieldValidator>
<span>列名</span>
```

### 错误消息格式（FormUtils.SetFieldErrorMessage）

| 条件 | 错误消息格式 |
|------|-------------|
| 列名以 Date/Time 结尾 | `{DisplayName}请选择` |
| DisplayName 以 人/账号 结尾 | `{DisplayName}请选择` |
| 其他情况 | `{DisplayName}请填写` |

### 边框样式

- 所有 `<table>` 和 `<td>` 元素的边框样式：
  `style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid"`
- **所有边框颜色统一为 `black`**（不是 `#b2c9dd` 等其他颜色）
- 边框属性名使用**大写**（`BORDER-TOP` 不是 `border-top`）

### CSS 类名

- 标题栏：`form.tplClassNames.title`（默认 `xttl`）
- 主表 Label：`form.tplClassNames.primaryTableLabel`（默认 `xfld`）
- 明细表 Label：`form.tplClassNames.repeatTableLabel`（默认 `xtbd`）

### 编码

- **UTF-8 with BOM**
- 文件后缀 `.aspx`
- **BOM 添加步骤**（Write 工具输出无 BOM，必须手动添加）：

```bash
# 先 cd 到目标目录，避免中文路径编码问题
cd "{目标目录路径}"
powershell -ExecutionPolicy Bypass -Command "Get-ChildItem -Filter '{FileName}.aspx' | ForEach-Object { \$f=\$_.FullName; \$c=[System.IO.File]::ReadAllBytes(\$f); if(\$c[0]-eq 0xEF -and \$c[1]-eq 0xBB -and \$c[2]-eq 0xBF){Write-Host 'Has BOM'}else{\$b=[byte[]]@(0xEF,0xBB,0xBF)+\$c;[System.IO.File]::WriteAllBytes(\$f,\$b);Write-Host 'BOM added'}}"
```

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

1. 确认 DSName（数据源名称，如 `BPMDB`、`OADB`，用于生成控件 ID 和 XDataBind）
2. 确认表结构和字段
3. 确认表单配置（宽度、列数、CSS 类名等）
4. 确认明细表关系（是否有嵌套明细表，父表/子表对应关系）
5. 生成 .aspx 文件并添加 BOM
6. 供用户确认后输出

### 进度汇报（生成期间）

生成过程中（步骤 4），每完成一个阶段向用户汇报进度，避免用户长时间等待而无反馈。汇报格式：

- `✅ 已确认 DSName：{DSName}`
- `✅ 已确认表结构，共 X 个字段`
- `✅ 主表布局完成（Y 行）`
- `✅ 明细表布局完成（Z 个控件，{兄弟/嵌套}）`
- `✅ 隐藏字段整理完成`
- `✅ 签收跟踪控件已添加`
- `✅ 文件编码 BOM 已添加`
- `📄 生成完毕，待确认`
