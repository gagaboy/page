/**
 * Created by JK_YANG on 15/5/22.
 */
define(["../Base", "text!./FormWidget.html"], function (Base, formTpl) {
    var xtype = "form";
    var Form = new Class({
        Extends: Base,
        options: {
            _addWrapDiv: false,
            cols: 2, //每行多少列
            widgets: [] //组件列表
        },
        getTemplate: function () {
            return formTpl;
        },
        initialize: function (opts) {
            this.parent(opts);
        },
        render: function (parent) {
            this.parent(parent);
            this.appendExtend();
        },
        appendExtend: function () {
            this.fragment = Page.create("fragment", {
                dataSources: {
                    ds1: {
                        type: 'dataValue', options: {
                            data: {
                                xb: 1
                            }
                        }
                    }
                },
                dataBinders: {
                    db1: {
                        dataValueId: 'ds1', fieldId: 'xb', widgetId: 'xb'
                    }
                },
                items: [
                    {$id: 'xb', $xtype: 'input', label: '性别'}
                ]
            });
            this.fragment.render(this.$element);
        },
        destroy:function(){
            this.fragment.destroy();
            this.parent();
        }
    });
    Form.xtype = xtype;
    return Form;
});