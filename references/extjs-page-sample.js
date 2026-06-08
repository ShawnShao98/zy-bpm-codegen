Ext.define('YZModules.Demo.Modules.Demo_DeveloperTools', {
    extend: 'Ext.panel.Panel',
    requires: [
        "YZSoft.bpm.src.ux.FormManager"
    ],

    constructor: function (config) {
        var me = this;

        me.store_Demo_DeveloperTools_M = Ext.create('Ext.data.JsonStore', {
            actionMethods: { read: 'POST' },
            autoLoad: true,
            remoteSort: true,
            pageSize: $S.pageSize.defaultSize,
            sorters: [
                { property: 'TaskID', direction: 'DESC' },
            ],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/Demo_DeveloperTools_Handler.ashx'),
                extraParams: {
                    method: 'GetPageDemoDeveloperToolsM'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid_Demo_DeveloperTools_M = Ext.create('Ext.grid.Panel', {
            collapsible: false,
            region: 'center',
            border: true,
            split: true,
            selModel: {
                mode: 'SINGLE'
            },
            store: me.store_Demo_DeveloperTools_M,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function(record, rowIndex, rowParams, store) {
                        var data = record.data;
                },
            },
            columns: [
                { xtype: 'rownumberer', text: '#', width: 50, align:'center', },
                { dataIndex: 'ID', text: ZY.$("All_ID"), width: 150, sortable: true, locked: false, hidden: false, align: 'center', renderer: function(value, metaData, record){ return me.renderAsLink(value); }, listeners: { click: function (grid, td, rowIndex, cellIndex, element, record, tr) { if (element.getTarget().tagName == 'A') me.onLinkClick('openTaskForRead', record.data.TaskID, ''); } } },
                { dataIndex: 'TaskID', text: ZY.$("All_TaskID"), width: 150, sortable: true, locked: false, hidden: false, align: 'center', renderer: function(value, metaData, record){ return me.renderAsLink(value); }, listeners: { click: function (grid, td, rowIndex, cellIndex, element, record, tr) { if (element.getTarget().tagName == 'A') me.onLinkClick('openFormApplication', record.data.ID, 'IT/IT_ApplicationHandler'); } } },
                { dataIndex: 'Creater', text: ZY.$("All_Creater"), width: 150, sortable: true, locked: false, hidden: false, align: 'center', renderer: function(value, metaData, record){ return me.renderAsLink(value); } },
                { dataIndex: 'CreationAccount', text: ZY.$("All_CreationAccount"), width: 150, sortable: true, locked: false, hidden: false, align: 'center', renderer: function(value, metaData, record){ return me.renderAsBPMImageAttachment(value,record.data.CreationAccount); } },
                { dataIndex: 'CreationDept', text: ZY.$("All_CreationDept"), width: 150, sortable: true, locked: false, hidden: false, align: 'center', renderer: function(value, metaData, record){ return me.renderAsBPMAttachment(value,record.data.CreationDept); } },
                { dataIndex: 'CreationDeptCode', text: ZY.$("All_CreationDeptCode"), width: 150, sortable: true, locked: false, hidden: true, align: 'center',  },
                { dataIndex: 'CreationDate', text: ZY.$("All_CreationDate"), width: 150, sortable: true, locked: false, hidden: false, align: 'center', renderer: function(value, metaData, record){ return me.renderAsDate(value); } },
                { dataIndex: 'SN', text: ZY.$("All_SN"), width: 150, sortable: true, locked: false, hidden: false, align: 'center',  },
                { dataIndex: 'Remarks', text: ZY.$("All_Remarks"), width: 220, sortable: true, locked: false, hidden: false, align: 'center',  },
            ],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store_Demo_DeveloperTools_M,
                displayInfo: true,
            }),
            listeners: {
                rowclick: function (grid, record, item, index, e, eOpts) {
                    var extParams_TestDB_Demo_DeveloperTools_T = me.store_Demo_DeveloperTools_T.getProxy().getExtraParams();
                    extParams_TestDB_Demo_DeveloperTools_T.TaskID = record.data.TaskID;
                    me.store_Demo_DeveloperTools_T.loadPage(1, { loadMask: { start: 0 } });
                },
                rowdblclick: function (grid, record, item, index, e, eOpts) {
                      if (!record.data.TaskID)
                          return null;

                      var token = ZY_Sha1(record.data.TaskID);
                      YZSoft.bpm.src.ux.FormManager.openTaskForRead(record.data.TaskID, {
                          sender: this,
                          title: RS.$("Process_ReadForm"),
                          params: {
                              token: token
                          },
                      });
                },
            }
        });

        me.store_Demo_DeveloperTools_T = Ext.create('Ext.data.JsonStore', {
            actionMethods: { read: 'POST' },
            autoLoad: false,
            remoteSort: true,
            pageSize: $S.pageSize.defaultSize,
            sorters: [
                { property: 'TaskID', direction: 'DESC' },
            ],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url(me, '../StoreDataService/Demo_DeveloperTools_Handler.ashx'),
                extraParams: {
                    method: 'GetPageDemoDeveloperToolsT'
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.grid_Demo_DeveloperTools_T = Ext.create('Ext.grid.Panel', {
            collapsible: false,
            region: 'east',
            width: '50%',
            border: true,
            split: true,
            selModel: Ext.create('Ext.selection.CheckboxModel', {
                mode: 'MULTI'
            }),
            store: me.store_Demo_DeveloperTools_T,
            viewConfig: {
                stripeRows: true,
                enableTextSelection: true,
                getRowClass: function(record, rowIndex, rowParams, store) {
                        var data = record.data;
                },
            },
            columns: [
                { xtype: 'rownumberer', text: '#', width: 50, align:'center', },
                { dataIndex: 'ID', text: ZY.$("All_ID"), width: 150, sortable: true, locked: false, hidden: true, align: 'center',  },
                { dataIndex: 'TaskID', text: ZY.$("All_TaskID"), width: 150, sortable: true, locked: false, hidden: true, align: 'center',  },
                { dataIndex: 'Name', text: ZY.$("All_Name"), width: 150, sortable: true, locked: false, hidden: false, align: 'center',  },
                { dataIndex: 'Amount', text: ZY.$("All_Amount"), width: 150, sortable: true, locked: false, hidden: false, align: 'center',  },
                { dataIndex: 'Quantity', text: ZY.$("All_Quantity"), width: 150, sortable: true, locked: false, hidden: false, align: 'center',  },
                { dataIndex: 'Notes', text: ZY.$("All_Notes"), width: 150, sortable: true, locked: false, hidden: false, align: 'center',  },
            ],
            bbar: Ext.create('Ext.toolbar.Paging', {
                store: me.store_Demo_DeveloperTools_T,
                displayInfo: true,
            }),
            listeners: {
                rowclick: function (grid, record, item, index, e, eOpts) {
                },
                rowdblclick: function (grid, record, item, index, e, eOpts) {
                      if (!record.data.TaskID)
                          return null;

                      YZSoft.bpm.src.ux.FormManager.openFormApplication('Demo/Demo_TestDoubleClick',record.data.TaskID,'Read', {
                          sender: this,
                          title: RS.$("Process_ReadForm"),
                          params: {
                          },
                      });
                },
            }
        });

        // 按钮：RS.$("All_FormApp_New")
        me.btn1 = Ext.create('YZSoft.src.button.Button', {
            text: RS.$("All_FormApp_New"),
            iconCls: 'yz-glyph yz-glyph-e61d',
            sm: me.grid_Demo_DeveloperTools_M.getSelectionModel(),
            updateStatus: function () {
                //this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid_Demo_DeveloperTools_M, '', 1, -1))
            },
            handler: function () {
                var params = {};

                YZSoft.bpm.src.ux.FormManager.openPostWindow('开发者工具示例', {
                    title: '开发者工具示例',
                    sender: this,
                    collapseCommentsPanel: false,
                    dlgModel: 'Tab', //Tab,Window,Dialog
                    params: params,
                    listeners: {
                        submit: function (action, data, flag) {
                            me.store_Demo_DeveloperTools_M.reload();
                            me.store_Demo_DeveloperTools_T.reload();
                        }
                    }
                });
            }
        })

        // 按钮：RS.$("All_Edit")
        me.btn2 = Ext.create('YZSoft.src.button.Button', {
            text: RS.$("All_Edit"),
            iconCls: 'yz-glyph yz-glyph-edit',
            sm: me.grid_Demo_DeveloperTools_M.getSelectionModel(),
            updateStatus: function () {
                //this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid_Demo_DeveloperTools_M, '', 1, -1))
            },
            handler: function () {
                var key = '';
                var formstate = '';
                var params = {};

                var selected = me.grid_Demo_DeveloperTools_M.getSelectionModel().getSelection();
                var row = selected[0] || { data: {} };
                key = row.data['TaskID'] || '';

                if(formstate == '') {
                    formstate = (key && key != '') ? 'edit' : 'new';
                }

                YZSoft.bpm.src.ux.FormManager.openFormApplication('某某目录/某某表单服务', key, formstate, {
                    sender: this,
                    dlgModel: 'Tab', //Tab,Window,Dialog
                    width: 1000,
                    params: params,
                    listeners: {
                        submit: function (action, data, flag) {
                            me.store_Demo_DeveloperTools_M.reload();
                            me.store_Demo_DeveloperTools_T.reload();
                        }
                    }
                })
            }
        })

        // 按钮：RS.$("All_Delete")
        me.btn3 = Ext.create('YZSoft.src.button.Button', {
            text: RS.$("All_Delete"),
            iconCls: 'yz-glyph yz-glyph-delete',
            sm: me.grid_Demo_DeveloperTools_M.getSelectionModel(),
            updateStatus: function () {
                //this.setDisabled(!YZSoft.UIHelper.IsOptEnable(null, me.grid_Demo_DeveloperTools_M, '', 1, -1))
            },
            handler: function () {
                me.deleteByTaskID();
            }
        })

        // Excel导出按钮
        me.btnExcelExport = Ext.create('YZSoft.src.button.ExcelExportButton', {
            grid: me.grid_Demo_DeveloperTools_M,
            fileName: RS.$("All_FileTypeDesc_WordExcel"),
            defaultRadio: 'current',
            listeners: {
                beforeload: function (params) {
                    params.ReportDate = new Date();
                }
            }
        });

        // 快速搜索
        me.quickSearch = Ext.create('YZSoft.src.form.field.Search', {
            clearBtn: true,
            store: me.store_Demo_DeveloperTools_M,
            emptyText: RS.$("All_Keyword"),
            listeners: {
                searchclick: function () {
                    var store = me.store_Demo_DeveloperTools_M;
                    var extParams = store.getProxy().getExtraParams();
                    extParams.searchType = 'QuickSearch';
                    extParams.keyword = this.getValue();
                    store.loadPage(1, {
                        loadMask: {
                            start: 0
                        }
                    });
                },
                render: function(field) {
                    Ext.QuickTips.init();
                    field.getEl().on('mouseover', function(p) {
                        Ext.QuickTips.register({
                        target: field.el.id,
                        cls: 'LineBreakDisplay',
                        autoHide: true,
                        text:ZY.$("All_Creater")+"</br>"+ZY.$("All_CreationDept")
                        });
                    });
                },
            }
        })

        // 高级搜索字段_创建人账号
        me.adSearchItem_CreationAccount = Ext.create('YZSoft.src.form.field.User', {
            fieldLabel: ZY.$("All_CreationAccount"),
        });

        // 高级搜索字段_创建人部门编码
        me.adSearchItem_CreationDeptCode = Ext.create('YZSoft.src.form.field.OUCode', {
            fieldLabel: ZY.$("All_CreationDeptCode"),
        });

        // 高级搜索栏_搜索按钮
        me.btnSearch = Ext.create('Ext.button.Button', {
            text: RS.$('All_Search'),
            cls: 'yz-btn-submit yz-btn-round3',
            iconCls: 'yz-glyph yz-glyph-search',
            handler: function () {
                var store = me.store_Demo_DeveloperTools_M;
                var extParams = store.getProxy().getExtraParams();
                extParams.searchType = 'AdvancedSearch';
                extParams.CreationAccount = me.adSearchItem_CreationAccount.getValue();
                extParams.CreationDeptCode = me.adSearchItem_CreationDeptCode.getValue();

                store.loadPage(1, {
                    loadMask: {
                        start: 0
                    }
                });
            }
        });

        // 高级搜索栏_重置按钮
        me.btnReset = Ext.create('Ext.button.Button', {
            text: RS.$('All_Reset'),
            cls: 'yz-btn-round3',
            iconCls: 'yz-glyph yz-glyph-refresh',
            handler: function () {
                me.adSearchItem_CreationAccount.setValue('');
                me.adSearchItem_CreationDeptCode.setValue('');

                var store = me.store_Demo_DeveloperTools_M;
                var extParams = store.getProxy().getExtraParams();

                Ext.apply(extParams, {
                    searchType: '',
                });
                store.loadPage(1, {
                    loadMask: {
                        start: 0
                    }
                });
            }
        });

        // 高级搜索栏
        me.pnlAdvancedSearch = Ext.create('Ext.panel.Panel', {
            hidden: true,
            region: 'north',
            layout: 'column',
            bodyStyle: {
                padding: '8px',
                background: '#f5f5f5'
            },
            defaults: {
                layout: 'fit',
                border: false,
                columnWidth: '.33',
                bodyStyle: {
                    background: '#f5f5f5'
                },
                defaults: {
                    labelWidth: 120,
                    labelAlign: 'right',
                    margin: '3 0 3 12'
                }
            },
            items: [
                {
                    items: [
                        // 创建人账号
                        me.adSearchItem_CreationAccount
                    ],
                },
                {
                    items: [
                        // 创建人部门编码
                        me.adSearchItem_CreationDeptCode
                    ],
                },
                {
                    margin: '6 0 0 0',
                    layout: 'hbox',
                    columnWidth: '1',
                    defaults: {
                        margin: '0 10 0 0',
                        width: 100
                    },
                    items: [{ flex: 1 }, me.btnSearch, me.btnReset]
                }
            ]
        });

        // 高级搜索按钮
        me.btnAdvancedSearch = Ext.create('YZSoft.src.button.PanelExpandButton', {
            text: RS.$("All_AdvSearch"),
            expandPanel: me.pnlAdvancedSearch
        });

        // Grid容器
        me.pnlWrapper = Ext.create('Ext.panel.Panel', {
            region: 'center',
            layout: {  "type": "border"},
            items: [
                me.grid_Demo_DeveloperTools_M,
                me.grid_Demo_DeveloperTools_T,
            ]
        });

        var cfg = {
            layout: 'border',
            tbar: {
              cls: 'yz-tbar-module',
              items: [
                  me.btn1,
                  me.btn2,
                  me.btn3,
                  '->',
                  me.btnExcelExport,
                  me.btnReload,
                  me.quickSearch,
                  me.btnAdvancedSearch
              ]
            },
            items: [
                me.pnlAdvancedSearch,
                me.pnlWrapper
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActivate: function (times) {
        var me = this;
    },

    // 渲染：日期
    renderAsDate: function (value) {
        if (!isNaN(Date.parse(value)))
            return Ext.Date.format(new Date(value), "Y-m-d");
        else
            return value;
    },

    // 渲染：链接
    renderAsLink: function (value) {
        return '<a href="#"><span class="yz-glyph yz-glyph-e916" style="margin-right:5px"></span>' + value + '</a>';
    },

    // 渲染：小数
    renderAsDecimal: function (value, digit) {
        return Math.round(value * 100 / 100).toFixed(digit);
    },

    // 渲染：货币
    renderAsCurrency: function (value, symbol, digit) {
        return symbol + ' ' + Math.round(value * 100 / 100).toFixed(digit);
    },

    // 渲染：BPM图片附件
    renderAsBPMImageAttachment: function (value,attachmentNameField) {
        return '<img src="YZSoft/attachment/Download.ashx?method=ImageStreamFromFileID&fileid=' + value + '" style="width: 70px; height: 70px;" /> '+ attachmentNameField +'</img>';
    },

    // 渲染：BPM附件
    renderAsBPMAttachment: function (value,attachmentNameField) {
        return '<a target="_blank" href="YZSoft/attachment/Download.ashx?method=Download&fileid=' + value + '"><i class="yz-glyph yz-glyph-e601" style="font-style: normal;" /> '+ attachmentNameField +'</a>';
    },

    // 渲染：提示用户组件
    renderAsUser: function (value, metaData, record) {
        var me = this,
            data = record.data;

            return Ext.String.format('<span class="yz-s-uid"  uid="{0}">{1}</span>',
                Ext.util.Format.text(data.CreateAccount),
                Ext.util.Format.text(data.CreateName || data.CreateAccount));
    },

    // 链接点击事件
    onLinkClick: function (type, key,formServicepath) {
        if (!key)
            return null;

        if (type == "openTaskForRead") {
            var token = ZY_Sha1(key);
            YZSoft.bpm.src.ux.FormManager.openTaskForRead(key, {
                sender: this,
                title: RS.$("Process_ReadForm"),
                params: {
                    token: token
                },
            });
        }
        else if (type == 'openFormApplication') {
            YZSoft.bpm.src.ux.FormManager.openFormApplication(formServicepath, key, 'read', {
                sender: this,
                title: RS.$("Process_ReadForm"),
            });
        }
    },

    // 渲染：审批状态为中文
    renderStateAsChinese: function(value) {
            if (value)
                value = Ext.util.Format.trim(value.toLowerCase());

            switch (value)
            {
                case 'running':
                    return RS.$('All_Running');
                case 'approved':
                    return RS.$('All_Approved');
                case 'rejected':
                    return RS.$('All_Rejected');
                case 'aborted':
                    return RS.$('All_Aborted');
                case 'deleted':
                    return RS.$('All_Deleted');
                default:
                    return RS.$('All_UnknownStatus');
            }
        },

    // 批量删除
    deleteByTaskID: function (value) {
        var me = this,
            recs = me.grid_Demo_DeveloperTools_M.getSelectionModel().getSelection(),
            ids = [],
            store = me.store_Demo_DeveloperTools_M;
        if (recs.length == 0)
            return;

        Ext.each(recs, function(rec) {
            ids.push(rec.data.TaskID);
        });

        Ext.MessageBox.show({
            title: RS.$("All_Alert_Title"),
            msg: RS.$("All_DelCfmMulti_Msg"),
            buttons: Ext.Msg.OKCANCEL,
            defaultFocus: 'cancel',
            icon: Ext.MessageBox.INFO,

            fn: function (btn, text) {
                if (btn != 'ok')
                     return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url(me, '../StoreDataService/Demo_DeveloperTools_Handler.ashx'),
                    method: 'POST',
                    params: {
                        method: 'DeleteDemoDeveloperToolsMByTaskID',
                        ids: JSON.stringify(ids),
                    },
                    waitMsg: { msg: RS.$("All_Deleting"), target: me.grid_Demo_DeveloperTools_M },
                    success: function (action) {
                        store.reload({
                            loadMask:
                            {
                                 msg: Ext.String.format(RS.$("All_Deleted_Multi"), recs.length),
                                 delay: 'x'
                            }
                        });
                    },
                    failure: function (action) {
                        var mbox = Ext.Msg.show({
                            title: RS.$("All_MsgTitle_Error"),
                            msg: YZSoft.HttpUtility.htmlEncode(action.result.errorMessage, true),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.WARNING
                        });

                        store.reload({ mbox: mbox });
                    }
                });
            }
        });
    },

});