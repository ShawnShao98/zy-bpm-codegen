# C# FormGeneratorService 标准输出参考

基于 `D:\CompanyProject\QingDao\武船\7.备份文件\武船\2-项目程序\BPM\WEB\YZSoft\forms\XForm\信披事项.aspx` 分析。

## 模板结构（非生成器生成）

```aspx
<%@ Page Language="C#" %>
<%@ Register TagPrefix="aspxform" Namespace="XFormDesigner.Framework.Web.UI" Assembly="XFormDesigner.Framework" %>
<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
        MyLink.Href = "~/YZSoft/Forms/Style/ZYXFormCSSHidden.css";
    }
</script>
<html xmlns:xform="xmlns:xform">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
    <title>BPM Form</title>
    <style>...</style>
    <link runat="server" id="MyLink" href="" rel="stylesheet" type="text/css" />
    <link href="~/YZSoft/Forms/Style/TKXFormCSS.css" rel="stylesheet" />
    <script type="text/javascript">
        function OnAfterLoad() { }
    </script>
</head>
<body>
    <form runat="server">
        <!-- Logo/SN 行 -->
        <table width="1000" align="center" border="0" cellspacing="0" cellpadding="0">...</table>
        <!-- 生成器插入点 -->
        <!-- Insert content here -->
        <!-- 底部说明（模板自带） -->
        <table width="1000" align="center" class="hidden" ...>...</table>
    </form>
</body>
</html>
```

## 生成器输出结构

生成器只输出 `<div>` 包裹的表单内容，插入到模板的 `<!-- Insert content here -->` 位置。

### 整体结构

```
<div>
    <table>主表</table>
    <div style="margin: 0 auto; ...">明细表1</div>
    <div style="margin: 0 auto; ...">明细表2</div>
    <br />
    <table>隐藏字段表格</table>
</div>
```

### 主表结构（tableCols=6）

```xml
<table align="center" cellspacing="0" cellpadding="0" width="1000" style="BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid">
    <!-- 表头行 -->
    <tr>
        <td class="xttl" Height="21px" style="边框" colspan="6">
            <span style="margin: 0 6px; font-weight: bold;">基本信息</span>
        </td>
    </tr>
    <!-- 数据行 1：3对 label+control -->
    <tr>
        <td class="xfld" style="边框" align="center" width="150">
            <span>创建人</span>
        </td>
        <td style="边框">
            <aspxform:XTextBox runat="server" id="BPMDATA_XZ_InfoDisclosureItem_M_Creater" XDataBind="BPMDATA:XZ_InfoDisclosureItem_M.Creater" Width="100%" FieldName="创建人" ReadOnly="True" />
        </td>
        <td class="xfld" style="边框" align="center" width="150"><span>...</span></td>
        <td style="边框">控件</td>
        <td class="xfld" style="边框" align="center" width="150"><span>...</span></td>
        <td style="边框">控件</td>
    </tr>
    <!-- 数据行 2：带必填 -->
    <tr>
        <td class="xfld" style="边框" align="center" width="150">
            <span style="color:red; font-weight:bold">*</span>
            <aspxform:XRequiredFieldValidator runat="server" ForeColor="Red" Display="None" ControlToValidate="BPMDATA_XZ_InfoDisclosureItem_M_StartDay" ErrorMessage="请填写起始日">R</aspxform:XRequiredFieldValidator>
            <span>起始日</span>
        </td>
        <td style="边框"><aspxform:XTextBox ... /></td>
        <td class="xfld" style="边框" align="center" width="150">...</td>
        <td style="边框">...</td>
        <!-- 补齐空列 -->
        <td class="xfld" align="center" style="边框" />
        <td class="xfld" align="center" style="边框" />
    </tr>
    <!-- colspan 行 -->
    <tr>
        <td class="xfld" style="边框" align="center" width="150"><span>备注</span></td>
        <td style="边框" colspan="5"><aspxform:XTextBox ... /></td>
    </tr>
</table>
```

### 明细表结构

```xml
<div style="margin: 0 auto; width: 1000px; height: auto; overflow: auto">
    <table align="center" cellspacing="0" cellpadding="0" width="1000" dynamicarea="2,1">
        <!-- 表头行 -->
        <tr>
            <td class="xttl" Height="21px" style="边框" colspan="3">
                <span style="margin: 0 6px; font-weight: bold;">事项明细</span>
                <aspxform:XAddBlockButton runat="server" Text="+" DataSource="BPMDATA" TableName="XZ_InfoDisclosureItem_Matter_T" />
            </td>
        </tr>
        <!-- 列头行 -->
        <tr>
            <td class="xtbd" width="50" align="center" style="边框">#</td>
            <td class="xtbd" align="center" width="50.00%" style="边框" />
            <span style="color:red; font-weight:bold">* </span>
            <aspxform:XRequiredFieldValidator ...>R</aspxform:XRequiredFieldValidator>
            <span>类别</span>
            <td class="xtbd" align="center" width="50.00%" style="边框" />
            <span style="color:red; font-weight:bold">* </span>
            <aspxform:XRequiredFieldValidator ...>R</aspxform:XRequiredFieldValidator>
            <span>具体事项</span>
        </tr>
        <!-- 数据行 -->
        <tr>
            <td style="边框">
                <aspxform:XGridLineNo runat="server" Width="100%" TextAlign="Center" BackColor="Transparent" />
                <!-- 隐藏字段 > 4 个时在此处嵌套控件 -->
                <aspxform:XTextBox ... CssClass="hidden" hiddenexpress="1" />
            </td>
            <td style="边框"><aspxform:XDropDownList ... /></td>
            <td style="边框"><aspxform:XTextBox ... /></td>
        </tr>
    </table>
</div>
```

### 隐藏字段表格

```xml
<br />
<table width="1000" align="center" cellspacing="0" cellpadding="0" style="边框" hiddenexpress="1" class="hidden">
    <tr>
        <td class="xttl" height="21px" colspan="4" style="边框">
            <span style="margin: 0 6px; font-weight: bold;">隐藏字段</span>
        </td>
    </tr>
    <tr>
        <td width="20%" align="center" colspan="1" style="边框">组件ID</td>
        <td width="20%" align="center" colspan="1" style="边框">位置描述</td>
        <td width="30%" align="center" colspan="1" style="边框">说明</td>
        <td width="30%" align="center" colspan="1" style="边框">作用</td>
    </tr>
    <!-- 每个隐藏字段一行 -->
    <tr>
        <td align="center" colspan="1" style="边框">BPMDATA_XZ_InfoDisclosureItem_M_CreationAccount</td>
        <td align="center" colspan="1" style="边框">
            <aspxform:XTextBox ... CssClass="hidden" hiddenexpress="1" />
        </td>
        <td align="center" colspan="1" style="边框">创建人账号</td>
        <td align="center" colspan="1" style="边框" />
    </tr>
</table>
```

## 常见错误对照表

基于 skill 生成与 C# 生成器的实际对比结果。

| # | 错误类型 | 错误输出 | 正确输出 | 严重度 |
|---|---------|---------|---------|--------|
| 1 | **控件 ID 简化** | `id="M_Creater"` | `id="BPMDATA_XZ_InfoDisclosureItem_M_Creater"` | 🔴 致命 |
| 2 | **明细表嵌套错误** | 嵌套明细表有 div 包裹 | 嵌套明细表直接在父 td 内生成 table，无 div | 🟡 中等 |
| 3 | **兄弟明细表缺少 div 包裹** | 明细表直接在 `<div>` 容器内，没有独立 div | 每个兄弟明细表都应有 `<div style="margin: 0 auto; width: {formWidth}px; height: auto; overflow: auto">` 包裹 | 🔴 致命 |
| 4 | **空 div 占位** | 第2个明细表位置出现空的 div | 不应出现空 div | 🟡 中等 |
| 5 | **CSS 属性顺序** | `style="FONT-WEIGHT: bold; MARGIN: 0px 6px"` | `style="margin: 0 6px; font-weight: bold;"` | 🟢 轻微 |
| 6 | **Height 无单位** | `height="21"` | `Height="21px"` | 🟢 轻微 |
| 7 | **ListItem 标签** | `<asp:ListItem>` | `<aspxform:XListItem>` | 🟡 中等 |

## 验证清单

生成表单后，逐项检查：

- [ ] 所有控件 ID 包含 DSName 前缀（如 `BPMDATA_`）
- [ ] 兄弟明细表都有独立 div 包裹
- [ ] 嵌套明细表无 div 包裹，直接在父 td 内生成 table
- [ ] 无空 div 占位
- [ ] 所有边框样式使用 `BORDER-TOP` 大写格式
- [ ] 必填星号位置正确（Label 单元格内星号在前，validator 在中间，字段名在后）
- [ ] 隐藏字段表格在 `<br />` 之后
- [ ] 验证器 `ControlToValidate` 与对应控件 ID 一致
- [ ] 验证器 InnerText 为 `R`
- [ ] 文件编码为 UTF-8 with BOM

格式：`{DSName}_{TableName}_{ColumnName}`

| 示例 |
|------|
| `BPMDATA_XZ_InfoDisclosureItem_M_Creater` |
| `BPMDATA_XZ_InfoDisclosureItem_Matter_T_Category` |

### 2. XDataBind

格式：`{DSName}:{TableName}.{ColumnName}`

| 示例 |
|------|
| `BPMDATA:XZ_InfoDisclosureItem_M.Creater` |
| `BPMDATA:XZ_InfoDisclosureItem_Matter_T.Category` |

### 3. 验证器

```xml
<aspxform:XRequiredFieldValidator runat="server" ForeColor="Red" Display="None" ControlToValidate="控件ID" ErrorMessage="错误消息">R</aspxform:XRequiredFieldValidator>
```

- InnerText 永远是 `R`
- `ForeColor="Red"`, `Display="None"`
- `ControlToValidate` = 控件 ID

### 4. 必填星号

**主表 Label 单元格内**：
```xml
<span style="color:red; font-weight:bold">*</span>
<aspxform:XRequiredFieldValidator ...>R</aspxform:XRequiredFieldValidator>
<span>字段名</span>
```

**明细表列头**（注意星号后有空格）：
```xml
<span style="color:red; font-weight:bold">* </span>
<aspxform:XRequiredFieldValidator ...>R</aspxform:XRequiredFieldValidator>
<span>列名</span>
```

### 5. 边框样式

所有 `<table>` 和 `<td>` 的边框：
```
BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid; BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid
```

### 6. 空列补齐

主表每行末尾如果列数不足 tableCols，用空 `<td>` 补齐：
```xml
<td class="xfld" align="center" style="边框" />
```

### 7. 明细表 div 包裹

明细表必须包裹在：
```xml
<div style="margin: 0 auto; width: {formWidth}px; height: {height}px; overflow: auto">
```
- height 为 "0" 或空时使用 `auto`
- formWidth 默认 1000

### 8. 明细表 dynamicarea

```xml
<table ... dynamicarea="2,1">
```

### 9. 明细表列宽

- 序号列：`width="50"`
- 数据列：百分比，如 `width="50.00%"`

### 10. XGridLineNo

```xml
<aspxform:XGridLineNo runat="server" Width="100%" TextAlign="Center" BackColor="Transparent" />
```

### 11. XAddBlockButton

```xml
<aspxform:XAddBlockButton runat="server" Text="+" DataSource="BPMDATA" TableName="表名" />
```

### 12. 隐藏字段

```xml
<aspxform:XTextBox ... CssClass="hidden" hiddenexpress="1" />
```

### 13. 只读控件

- 普通字段：`ReadOnly="True"`
- 日期字段：`DisplayOnly="True"`

### 14. 字段倒序

主表字段按**倒序**排列（最后一个字段最先显示）。

### 15. 错误消息规则

| 条件 | 格式 |
|------|------|
| 列名以 Date/Time 结尾 | `{DisplayName}请选择` |
| DisplayName 以 人/账号 结尾 | `{DisplayName}请选择` |
| 其他 | `{DisplayName}请填写` |
