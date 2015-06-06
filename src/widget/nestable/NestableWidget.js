/**
 * Created by hhxu on 15/5/12.
 */
define(['../Base', 'text!./NestableWidget.html', 'css!./NestableWidget.css'], function (Base, template) {
    var xtype = "eNestable";
    var DataTableWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            autoTable:true
            //其他nestable属性
        },
        nestableObj:null,
        render: function () {
            this.fireEvent("beforeRender", [this.vmodel]);
            var $this = this;
            if(this.getAttr("autoTable")){//给出容器，如div
                var tmp = $(this.getTemplate());
                var e = jQuery("<div></div>").addClass("page_"+$this.getAttr('$xtype'));
                e.append(tmp);
                $this.getParentElement().html(e);

                var tableObj = tmp.find("table.table");

                this.nestableObj = jQuery(tableObj).nestable(this.options);//调用nestable
                $this.element = e[0];
            }else{//使用已有table渲染
                this.nestableObj = $this.getParentElement().nestable(this.options);//调用nestable
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