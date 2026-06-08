<%@ WebHandler Language="C#" Class="Demo_DeveloperTools_Handler" %>

using System;
using System.Web;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using BPM.Client;
using YZSoft.Web.DAL;

public class Demo_DeveloperTools_Handler : YZServiceHandler
{

    // 获取分页
    public JObject GetPageDemoDeveloperToolsM(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        SqlServerProvider queryProvider = new SqlServerProvider();
        string searchType = request.GetString("searchType", "");
        string keyword = request.GetString("kwd", "");
        string order = request.GetSortString("(SELECT 0)");

        JObject rv = new JObject();

        // string connStr = ConfigurationManager.ConnectionStrings["BPMDB"].ConnectionString;
        string connStr = string.Empty;
        using(BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            connStr = DataSourceServer.Open(cn, "", "TestDB").ConnectionString;
        }

        var parameters = new List<SqlParameter>
        {
            new SqlParameter("@RowNumStart", request.RowNumStart),
            new SqlParameter("@RowNumEnd", request.RowNumEnd),
        };

        string filter = " 1 = 1 ";


        if (searchType == "QuickSearch")
        {
            if (!string.IsNullOrEmpty(keyword))
            {
                 filter += "AND ( Creater  LIKE  CONCAT('%',@keyword,'%') OR CreationDept  LIKE  CONCAT('%',@keyword,'%'))";
                 parameters.Add(new SqlParameter("@keyword", keyword));
            }
        }
        if (searchType == "AdvancedSearch")
        {
            //创建人账号
            string adSearchValue_CreationAccount = request.GetString("CreationAccount","");
            if(!string.IsNullOrEmpty(adSearchValue_CreationAccount))
            {
                filter += " AND CreationAccount LIKE CONCAT('%',@CreationAccount,'%') ";
                parameters.Add(new SqlParameter("@CreationAccount", adSearchValue_CreationAccount));
            }

            //创建人部门编码
            string adSearchValue_CreationDeptCode = request.GetString("CreationDeptCode","");
            if(!string.IsNullOrEmpty(adSearchValue_CreationDeptCode))
            {
                filter += " AND CreationDeptCode LIKE CONCAT('%',@CreationDeptCode,'%') ";
                parameters.Add(new SqlParameter("@CreationDeptCode", adSearchValue_CreationDeptCode));
            }

        }

        string query = @"
            WITH X AS( SELECT ROW_NUMBER() OVER(ORDER BY {0}) AS RowNum, * FROM Demo_DeveloperTools_M WHERE {1} ),
            Y AS( SELECT COUNT(*) AS TotalRows FROM X ),
            Z AS( SELECT Y.TotalRows, X.* FROM Y,X )
            SELECT * FROM Z WHERE RowNum BETWEEN @RowNumStart AND @RowNumEnd
        ";
        query = string.Format(query, order, filter);

        using (SqlConnection cn = new SqlConnection(connStr))
        {
            var ds = SqlHelper.ExecuteDataset(cn, System.Data.CommandType.Text, query, parameters.ToArray());
            var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
            rv["success"] = true;
            rv["children"] = JArray.FromObject(dt);
            rv["total"] = dt.Rows.Count > 0 ? Convert.ToInt32(dt.Rows[0]["TotalRows"]) : 0;
        }

        return rv;
    }

    // 删除
    public void DeleteDemoDeveloperToolsMByTaskID(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JArray ids = JArray.Parse(request.GetString("ids"));

        // string connStr = ConfigurationManager.ConnectionStrings["BPMDB"].ConnectionString;
        string connStr = string.Empty;
        using(BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            connStr = DataSourceServer.Open(cn, "", "TestDB").ConnectionString;
        }

        string query = "DELETE FROM Demo_DeveloperTools_M WHERE TaskID = @TaskID";

        foreach (var id in ids)
        {
            SqlHelper.ExecuteNonQuery(connStr, CommandType.Text, query, new SqlParameter("@TaskID", Convert.ToString(id)));
        }

    }



    // 获取分页
    public JObject GetPageDemoDeveloperToolsT(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        SqlServerProvider queryProvider = new SqlServerProvider();
        string searchType = request.GetString("searchType", "");
        string keyword = request.GetString("kwd", "");
        string order = request.GetSortString("(SELECT 0)");

        JObject rv = new JObject();

        // string connStr = ConfigurationManager.ConnectionStrings["BPMDB"].ConnectionString;
        string connStr = string.Empty;
        using(BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            connStr = DataSourceServer.Open(cn, "", "TestDB").ConnectionString;
        }

        var parameters = new List<SqlParameter>
        {
            new SqlParameter("@RowNumStart", request.RowNumStart),
            new SqlParameter("@RowNumEnd", request.RowNumEnd),
        };

        string filter = " 1 = 1 ";

        string filterValue_TaskID = request.GetString("TaskID", "");
        filter += " AND TaskID = '" + filterValue_TaskID + "' ";


        if (searchType == "QuickSearch")
        {
            if (!string.IsNullOrEmpty(keyword))
            {
            }

        }
        if (searchType == "AdvancedSearch")
        {
        }

        string query = @"
            WITH X AS( SELECT ROW_NUMBER() OVER(ORDER BY {0}) AS RowNum, * FROM Demo_DeveloperTools_T WHERE {1} ),
            Y AS( SELECT COUNT(*) AS TotalRows FROM X ),
            Z AS( SELECT Y.TotalRows, X.* FROM Y,X )
            SELECT * FROM Z WHERE RowNum BETWEEN @RowNumStart AND @RowNumEnd
        ";
        query = string.Format(query, order, filter);

        using (SqlConnection cn = new SqlConnection(connStr))
        {
            var ds = SqlHelper.ExecuteDataset(cn, System.Data.CommandType.Text, query, parameters.ToArray());
            var dt = ds.Tables.Count > 0 ? ds.Tables[0] : new DataTable();
            rv["success"] = true;
            rv["children"] = JArray.FromObject(dt);
            rv["total"] = dt.Rows.Count > 0 ? Convert.ToInt32(dt.Rows[0]["TotalRows"]) : 0;
        }

        return rv;
    }

}