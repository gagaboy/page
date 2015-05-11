define(['../BaseFormWidget', 'text!./CheckboxWidget.html', 'css!./CheckboxWidget.css'], function (BaseFormWidget, template) {
    var xtype = "checkbox";
    var CheckboxWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            cols: 3,//布局列数
            data: [],//选项
            //valueFiled:"value",//值字段
            //textFiled:"display",//显示字段
            //showAllcheckBtn: false,//提供全选按钮
            data: [{
                value: '1',
                display: '足球',
                clicked: false
            }, {
                value: '11',
                display: '足球1',
                clicked: false
            }, {
                value: '12',
                display: '足球2',
                clicked: false
            }, {
                value: '13',
                display: '足球3',
                clicked: false
            }, {
                value: '2',
                display: '台球',
                clicked: false
            }, {
                value: '21',
                display: '台球1',
                clicked: false
            }, {
                value: '22',
                display: '台球2',
                clicked: false
            }, {
                value: '23',
                display: '台球3',
                clicked: false
            }, {
                value: '24',
                display: '台球4',
                clicked: false
            }, {
                value: '25',
                display: '台球5',
                clicked: false
            }],
            value: [],
            itemCheck: function (vid,d) {
                var vm = avalon.vmodels[vid];
                d.clicked = !d.clicked;
                var value = [];
                for (var i = 0; i < vm.data.length; i++) {
                    if (vm.data[i].clicked) {
                        value.push(vm.data[i].value);
                    }
                }
                vm.value = value;
            }
        },
        initialize: function (opts) {
            this.parent(opts);
        },
        getTemplate: function () {
            return template;
        },
        setValue: function (valueArr) {
            //重写
            if(valueArr&&this.getAttr("data")){
                var items = this.getAttr("data");
                this.setAttr("value",[]);
                for (var i = 0; i < items.length; i++) {//清楚原选项
                    items[i].clicked = false;
                }
                for (var t = 0; t < valueArr.length; t++) {//设置新的值
                    var valueT = valueArr[t];
                    for (var i = 0; i < items.length; i++) {
                        if (valueT==items[i].value) {
                            items[i].clicked = true;
                        }
                    }
                }
            }
        },
        getCheckedDetail:function(){
            //获取所选选项详情
        },
        checkAll:function(){

        },
        _dataChange:function(){

        },
        _setValueByData:function(){
            var datas = this.getAttr("data");
            this.setAttr("value",[]);
            for (var i = 0; i < datas.length; i++) {
                if (datas[i].clicked) {
                    value.push(vm.data[i].value);
                }
            }
            vm.value = value;
        }
    });
    CheckboxWidget.xtype = xtype;
    return CheckboxWidget;
});
