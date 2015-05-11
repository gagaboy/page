define(['../BaseFormWidget', 'text!./CheckboxWidget.html', 'css!./CheckboxWidget.css'], function (BaseFormWidget, template) {
    var xtype = "checkbox";
    var CheckboxWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            cols: 3,//布局列数
            data: [],//选项
            valueFiled:"value",//值字段
            textFiled:"text",//显示字段
            //showAllcheckBtn: false,//提供全选按钮
            checkItem: function(vid,itemValue) {

            }
        },
        initialize: function (opts) {
            this.parent(opts);
        },
        getTemplate: function () {
            return template;
        },
        setValue: function (values) {
            //需要重写
        },
        getCheckedDetail:function(){
            //获取所选选项详情
        },
        checkAll:function(){

        }
    });
    CheckboxWidget.xtype = xtype;
    return CheckboxWidget;
});
