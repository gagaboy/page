define(['../BaseFormWidget', 'text!./CheckboxWidget.html', 'css!./CheckboxWidget.css'], function (BaseFormWidget, template) {
    var xtype = "checkbox";
    var CheckboxWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            cols: null,//布局列数
            value: null,
            display: null,
            $valueField: "value",//值字段
            $textField: "display",//显示字段
            $split: ",",
            dataSetId: null,
            url: null,
            mainAlias: null,
            //showAllcheckBtn: false,//提供全选按钮

            items: [],//选项

            itemCheck: function (vid,el) {
                var vm = avalon.vmodels[vid];
                if(vm.status == 'readonly' || vm.status == 'disabled'){
                    return;
                }
                el.checked = !el.checked;
                var values = [];
                var display = "";
                for (var i = 0; i < vm.items.length; i++) {
                    if (vm.items[i].checked) {
                        values.push(vm.items[i][vm.$valueField]);
                        if("" !== display) {
                            display += vm.$split;
                        }
                        display += vm.items[i][vm.$textField];
                    }
                }
                vm.value = values;
                vm.display = display;
            },
            _preProcessData: function() {
                var vm = this;
                var obj = vm.getCmpMgr();
                var ds = obj._getDataSet();
                if(ds) {
                    Promise.all([ds.fetch()]).then(function() {
                        var data = ds.getValue();
                        if(data) {
                            for(var i=0; i<data.length; i++) {
                                var el = data[i];
                                el.checked = false;
                                if(vm.value) {
                                    var valueArr = vm.value.split(vm.$split);
                                    for(var j=0; j<valueArr.length; j++) {
                                        if(el[vm.$valueField] == valueArr[j]) {
                                            el.checked = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            vm.items = data;
                        }
                    });
                }
            },
            getCmpMgr: function() {
                return Page.manager.components[this.vid];
            }
        },
        initialize: function (opts) {
            if(opts) {
                if(opts.dataSetId && opts.url) {
                    Page.dialog.alert("复选框组件中dataSetId和url属于互斥属性，只能设置一个！");
                    return;
                }
            }
            this.parent(opts);
        },
        render: function (parent) {
            this.parent(parent);
            //处理items的数据
            var vm = this._getCompVM();
            vm._preProcessData();
        },
        _getCompVM: function() {
            var vid = this.options.vid;
            return avalon.vmodels[vid]
        },
        _getDataSet: function() {
            if(this.options.dataSetId) {
                return Page.manager.components[this.options.dataSetId];
            }
            else if(this.options.url) {
                if(!this.dataSet) {
                    this.dataSet = Page.create("dataSet", {
                        fetchUrl: this.options.url,
                        model: {
                            mainAlias: this.options.mainAlias
                        }
                    });
                }
                return this.dataSet;
            }
        },
        getTemplate: function () {
            return template;
        },
        setValue: function (valueArr, notFireFormValueChangeEvent) {
            //重写
            if(valueArr&&this.getAttr("items")){
                var items = this.getAttr("items");
                this.setAttr("value",valueArr, notFireFormValueChangeEvent);
                //this._getCompVM().value = valueArr;
                for (var i = 0; i < items.length; i++) {//清楚原选项
                    items[i].checked = false;
                }
                for (var t = 0; t < valueArr.length; t++) {//设置新的值
                    var valueT = valueArr[t];
                    for (var i = 0; i < items.length; i++) {
                        if (valueT==items[i][this.options.$valueField]) {
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
                values.push(items[i][this.options.$valueField]);
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
        }
    });
    CheckboxWidget.xtype = xtype;
    return CheckboxWidget;
});
