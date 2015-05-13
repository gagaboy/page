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
                var e = jQuery("<div></div>").addClass("page_"+$this.getAttr('$xtype')).attr("ms-controller", $this.getId());
                e.append(tmp);
                $this.getParentElement().html(e);

                var tableObj = tmp.find("table.table");
                this.dataTableObj = jQuery(tableObj).dataTable(this.options);//调用dataTable
                $this.element = e[0];
                //avalon.scan($this.getParentElement()[0]);
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
        }
    });
    DataTableWidget.xtype = xtype;
    return DataTableWidget;
});