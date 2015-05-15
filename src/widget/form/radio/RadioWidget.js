define(['../checkbox/CheckboxWidget', 'text!./RadioWidget.html', 'css!./RadioWidget.css'],function(CheckboxWidget, template){
    var xtype = "radio";
    var RadioWidget = new Class({
        Extends: CheckboxWidget,
        options: {
            $xtype: xtype,
            value:null,
            itemCheck: function (vid,d) {
                var vm = avalon.vmodels[vid];
                if(vm.status == 'readonly'){
                    return;
                }
                if(!d.checked){
                    d.checked = true;
                    vm._setOthersUnCheck(vid,d);
                    vm.value = d.value;
                }
            },
            _setOthersUnCheck:function(vid,d){
                var vm = avalon.vmodels[vid];
                for (var i = 0; i < vm.items.length; i++) {
                    var itemi = vm.items[i];
                    if (itemi.checked&&itemi.value!= d.value) {
                        itemi.checked = false;
                    }
                }
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
        setValue: function (value) {
            //重写
            if(value&&this.getAttr("items")){
                var items = this.getAttr("items");
                this.setAttr("value",value);
                for (var i = 0; i < items.length; i++) {//清楚原选项
                    if(items[i]&&value==items[i].value){
                        items[i].checked = true;
                    }else{
                        items[i].checked = false;
                    }
                }
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
        _setValueByItems:function(){
            var items = this.getAttr("items");
            for (var i = 0; i < items.length; i++) {
                if (items[i].checked) {
                    this.setAttr("value",items[i].value);
                }
            }
        }
    });
    RadioWidget.xtype = xtype;
    return RadioWidget;
});
