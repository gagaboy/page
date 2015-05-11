define(['../BaseFormWidget', 'text!./CheckboxWidget.html', 'css!./CheckboxWidget.css'], function (BaseFormWidget, template) {
    var xtype = "checkbox";
    var CheckboxWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            rowcols: 1,//ÿ����ʾ����
            data: [],//չʾ�����
            allchecked: false,
            clickCheck: function (d) {
                d.clicked = !d.clicked;
            }
        },
        initialize: function (opts) {
            var d = opts.data;
            for (var i = 0; i < d.length; i++) {
                if (d[i].clicked == undefined) {
                    d[i].clicked = false;
                }
            }
            this.parent(opts);
        },
        getTemplate: function () {
            return template;
        },
        getOptions: function () {
            var d = this.getAttr('data');
            var arr = [];
            for (var i = 0; i < d.length; i++) {
                if (d[i].clicked) {
                    var one_arr = [];
                    one_arr.push("value:" + d[i].value);
                    one_arr.push("display:" + d[i].display);
                    arr.push(one_arr);
                }
            }
            return arr;
        },
        getValue: function () {
            var d = this.getAttr('data');
            var values = [];
            for (var i = 0; i < d.length; i++) {
                if (d[i].clicked) {
                    values.push(d[i].value);
                    //values+=d[i].value+','
                }
            }
            return values;
        },
        setValue: function (key, clicked) {
            var d = this.getAttr('data');
            for (var i = 0; i < d.length; i++) {
                if (d[i].value == key) {
                    d[i].clicked = clicked;
                }
            }
            return;
        }
    });
    CheckboxWidget.xtype = xtype;
    return CheckboxWidget;
});
