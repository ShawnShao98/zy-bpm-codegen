---
name: bpm-create-table
description: BPM 建表 SQL 生成 — 根据自然语言描述生成 SQL Server 建表脚本（含审计字段 + 注释）
---

# bpm-create-table — 建表 SQL 生成

## 输入

用户自然语言描述表结构（表名、字段、类型、注释）。

## 生成规则

### 表结构规则

1. **自动添加字段**：
   - 所有表：`ID INT IDENTITY(1,1) PRIMARY KEY NOT NULL` + `TaskID INT`
   - 非 `_T` 表（主表）额外添加审计字段：`Creater`、`CreationAccount`、`CreationDept`、`CreationDeptCode`、`CreationDate`、`SN`
   - `_T` 表（明细表）不添加审计字段

2. **数据类型映射**：
   | 用户描述 | SQL 类型 |
   |---------|----------|
   | 文本、字符串、名称、账号、部门等 | `NVARCHAR(50)` |
   | 数字、整数、数量、ID | `INT` |
   | 日期、时间 | `DATE` |
   | 长文本、备注、说明、内容 | `NVARCHAR(500)` |
   | 小数、金额、价格 | `DECIMAL(18,2)` |
   | 布尔、是否、状态 | `BIT` |

3. **字段注释**：
   - 使用 `sp_addextendedproperty` 添加 MS_Description
   - 用户指定注释 100% 按用户要求匹配
   - 无要求时自行翻译为中文后使用

### SQL 模板

参考 `references/sql-template.txt` 中的模板，按以下结构生成：

```sql
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '{TableName}')
BEGIN
    CREATE TABLE {TableName}
    (
        ID INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
        TaskID INT,
        {用户字段},
        {审计字段（仅非_T表）}
    );

    -- 表注释
    EXEC sp_addextendedproperty 'MS_Description', '{表注释}', ...;
    -- 每个字段注释
    EXEC sp_addextendedproperty 'MS_Description', '{字段注释}', ...;
END
```

## 交互流程

1. 用户描述表结构
2. 生成 SQL 供用户确认
3. 用户确认后完成

## 示例

用户输入：`创建员工表，字段：姓名（文本）、工号（文本）、部门（文本）、入职日期（日期）、薪资（小数）、备注（长文本）`

生成 SQL：

```sql
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Employee_M')
BEGIN
    CREATE TABLE Employee_M
    (
        ID INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
        TaskID INT,
        Name NVARCHAR(50),
        EmployeeNo NVARCHAR(50),
        Department NVARCHAR(50),
        HireDate DATE,
        Salary DECIMAL(18,2),
        Remarks NVARCHAR(500),
        Creater NVARCHAR(50),
        CreationAccount NVARCHAR(50),
        CreationDept NVARCHAR(50),
        CreationDeptCode NVARCHAR(50),
        CreationDate DATETIME,
        SN INT
    );

    EXEC sp_addextendedproperty 'MS_Description', '员工表', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M';
    EXEC sp_addextendedproperty 'MS_Description', '主键ID', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'ID';
    EXEC sp_addextendedproperty 'MS_Description', '流程实例ID', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'TaskID';
    EXEC sp_addextendedproperty 'MS_Description', '姓名', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'Name';
    EXEC sp_addextendedproperty 'MS_Description', '工号', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'EmployeeNo';
    EXEC sp_addextendedproperty 'MS_Description', '部门', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'Department';
    EXEC sp_addextendedproperty 'MS_Description', '入职日期', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'HireDate';
    EXEC sp_addextendedproperty 'MS_Description', '薪资', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'Salary';
    EXEC sp_addextendedproperty 'MS_Description', '备注', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'Remarks';
    EXEC sp_addextendedproperty 'MS_Description', '创建人', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'Creater';
    EXEC sp_addextendedproperty 'MS_Description', '创建人账号', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'CreationAccount';
    EXEC sp_addextendedproperty 'MS_Description', '创建人部门', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'CreationDept';
    EXEC sp_addextendedproperty 'MS_Description', '创建人部门编码', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'CreationDeptCode';
    EXEC sp_addextendedproperty 'MS_Description', '创建时间', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'CreationDate';
    EXEC sp_addextendedproperty 'MS_Description', '序号', 'SCHEMA', 'dbo', 'TABLE', 'Employee_M', 'COLUMN', 'SN';
END
```

## 错误处理

- 缺少字段类型时给出默认值并确认
- 表名以 `_T` 结尾时自动识别为明细表，不添加审计字段
