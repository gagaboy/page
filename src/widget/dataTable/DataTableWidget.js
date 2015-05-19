/**
 * Created by hhxu on 15/5/12.
 */
define(['../Base', 'text!./DataTableWidget.html', 'css!./DataTableWidget.css'], function (Base, template) {
    var xtype = "eDataTable";
    var DataTableWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            autoTable:true
            //其他dataTable属性
        },
        dataTableObj:null,
        render: function () {
            this.fireEvent("beforeRender", [this.vmodel]);
            var $this = this;
            if(this.getAttr("autoTable")){//给出容器，如div
                var tmp = $(this.getTemplate());
                var e = jQuery("<div></div>").addClass("page_"+$this.getAttr('$xtype'));
                e.append(tmp);
                $this.getParentElement().html(e);

                var tableObj = tmp.find("table.table");

                this.dataTableObj = jQuery(tableObj).dataTable(this.options);//调用dataTable
                $this.element = e[0];
            }else{//使用已有table渲染
                this.dataTableObj = $this.getParentElement().dataTable(this.options);//调用dataTable
            }
            $this.fireEvent("afterRender", [this.vmodel]);
            if (this["_afterRender"]) {
                this["_afterRender"](this.vmodel);
            }
            return this;
        },
        getTemplate: function(){
            return template;
        },
        //将英文转为中文，引入文件即可，方法作废
        _changePageDetailToChinese:function(options){
            if(options){
               if(!options.oLanguage){
                   options.oLanguage = {};
               }
                if(!options.oLanguage.oPaginate){
                    options.oLanguage.oPaginate = {};
                }
                options.oLanguage.oPaginate.sFirst = "首页";
                options.oLanguage.oPaginate.sLast = "末页";
                options.oLanguage.oPaginate.sNext = "下一页";
                options.oLanguage.oPaginate.sPrevious = "上一页";
                options.oLanguage.sInfo = "显示 _START_ 到 _END_ ,共 _TOTAL_ 条数据";
                options.oLanguage.sInfoEmpty = "没有找到数据";
                options.oLanguage.sLengthMenu = "显示 _MENU_ 条记录";
            }
            return options;
        }
    });
    DataTableWidget.xtype = xtype;
    return DataTableWidget;
});