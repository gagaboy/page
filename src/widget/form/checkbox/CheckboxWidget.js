define(['../BaseFormWidget', 'text!./CheckboxWidget.html', 'css!./CheckboxWidget.css'], function (BaseFormWidget, template) {
    var xtype = "checkbox";
    var CheckboxWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            cols: null,//布局列数
            items:[],//选项
            value:null,
            //valueFiled:"value",//值字段
            //textFiled:"display",//显示字段
            //showAllcheckBtn: false,//提供全选按钮

            itemCheck: function (vid,d) {
                var vm = avalon.vmodels[vid];
                if(vm.status == 'readonly'){
                    return;
                }
                d.checked = !d.checked;
                var values = [];
                for (var i = 0; i < vm.items.length; i++) {
                    if (vm.items[i].checked) {
                        values.push(vm.items[i].value);
                    }
                }
                vm.value = values;
            }
        },
        initialize: function (opts) {
            this.parent(opts);
            this._setValueByItems();
            //this.validate();
        },
        getTemplate: function () {
            return template;
        },
        setValue: function (valueArr, notFireFormValueChangeEvent) {
            //重写
            if(valueArr&&this.getAttr("items")){
                var items = this.getAttr("items");
                this.setAttr("value",valueArr, notFireFormValueChangeEvent);
                for (var i = 0; i < items.length; i++) {//清楚原选项
                    items[i].checked = false;
                }
                for (var t = 0; t < valueArr.length; t++) {//设置新的值
                    var valueT = valueArr[t];
                    for (var i = 0; i < items.length; i++) {
                        if (valueT==items[i].value) {
                            items[i].checked = true;
                        }
                    }
                }
            }
        },
        getCheckedDetail:function(){
            //获取所选选项详情
        },
        checkAll:function(){
            var items = this.getAttr("items");
            var values = [];
            for (var i = 0; i < items.length; i++) {
                items[i].checked = true;
                values.push(items[i].value);
            }
            this.setAttr("value",values);
        },
        deCheckAll:function(){
            var items = this.getAttr("items");
            for (var i = 0; i < items.length; i++) {
                items[i].checked = false;
            }
            this.setAttr("value",[]);
        },
        validate: function () {
            //var valRes = Page.validation.validateValue(this.getValue(),this.getAttr("validationRules"));
            var validateTool = Page.create("validation", {onlyError: true});//后续由系统统一创建，只需调用即可

            var valRes = null;
            if (this.getAttr("required")) {//先判断是否必填
                valRes = validateTool.checkRequired(this.getValue());
            }
            if ((!valRes || valRes.result) && this.getAttr("validationRules")) {//再判断校验规则
                valRes = validateTool.validateValue(this.getValue(), this.getAttr("validationRules"));
            }
            if (valRes && !valRes.result) {//将错误信息赋值给属性
                this.setAttr("errorMessage", valRes.errorMsg);
            } else {//清空错误信息
                this.setAttr("errorMessage", "");
            }
        },
        _valueChange:function(){//值改变时校验
            this.validate();
        },
        _statusChange:function(value, oldValue, model){
            if(value !== oldValue){
                var formWidgetContainer = jQuery(this.getElement()).find(".form-widget-container");
                if(value === "readonly"){
                    formWidgetContainer.hide();
                    var items = this.getAttr("items");
                    var displays = " ";
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].checked) {
                            displays+=items[i].display+" ";
                        }
                    }
                    formWidgetContainer.parent().append(jQuery('<input class="checkedValue form-control form-text" readonly value="'+displays+'"></input>'));
                }else if(value === "edit"){
                    formWidgetContainer.show();
                    formWidgetContainer.parent().find(".checkedValue").remove();
                }
            }
        },
        _itemCheck: function (item) {
            item.checked = !item.checked;
            this._setValueByItems();
        },
        _setValueByItems:function(){
            var items = this.getAttr("items");

            var values = [];
            for (var i = 0; i < items.length; i++) {
                if (items[i].checked) {
                    values.push(items[i].value);
                }
            }
            if(values.length>0){
                this.setAttr("value",values);
            }
        }
    });
    CheckboxWidget.xtype = xtype;
    return CheckboxWidget;
});
