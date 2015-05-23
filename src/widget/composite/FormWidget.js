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
            widgets: [], //组件列表
            dataSources: null
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

        _wrapWidgetConfig: function (cfg) {
            //预处理widget 得配置
            var col = {$xtype: 'col', items: []}
            col.md = 12 / this.options.cols; //列
            var c = Object.merge({}, cfg);
            //处理绑定
            var bindField = c['bind'];
            if (bindField) {
                var f = bindField.split(".");
                if (f.length != 2) {
                    throw new Error('bind error' + bindField);
                }
                var dsId = f[0];
                var dsField = f[1];
                this.dataBindCfg[bindField] = {
                    dataValueId: dsId,
                    fieldId: dsField,
                    widgetId: cfg['$id'] ? cfg['$id'] : cfg['id']
                };
            }
            col.items.push(c);
            return col;
        },

        appendExtend: function () {
            this.dataBindCfg = {};
            var widgets = this.options.widgets;
            var cols = this.options.cols;
            var currentRow = null;
            var panel = {$xtype: 'panel', showTitle: false, items: []};
            for (var i = 0; i < widgets.length; i++) {
                if (i == 0 || i % cols == 0) {
                    currentRow = {$xtype: 'row', items: []};
                    panel.items.push(currentRow);
                }
                currentRow.items.push(this._wrapWidgetConfig(widgets[i]));
            }
            var db = this.dataBindCfg;
            var ds = this.options.dataSources;
            this.fragment = Page.create("fragment", {
                dataSources: ds,
                dataBinders: db,
                items: [panel]
            });
            this.fragment.render(this.$element);
            //预先加载数据
            var ds = this.fragment.getDataSources();
            for(var i=0; i<ds.length; i++) {
                ds[i].fetch()
            }

        },

        submitForm: function () {
            if (this.isValid()) {
                for (var v in this.options.dataSources) {
                    Page.manager.components[v].sync();
                }
            }
        },

        isValid: function () {
            for (var c in this.dataBindCfg) {
                var widId = this.dataBindCfg[c].widgetId
                if (!Page.manager.components[widId].isValid()) {
                    return false;
                }
            }
            return true;
        },

        destroy: function () {
            this.fragment.destroy();
            this.parent();
        }
    });
    Form.xtype = xtype;
    return Form;
});