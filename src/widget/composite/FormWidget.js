/**
 * Created by JK_YANG on 15/5/22.
 */
define(["../Base", "text!./FormWidget.html"], function (Base, formTpl) {
    var xtype = "form";
    var Form = new Class({
        Extends: Base,
        options: {
            _addWrapDiv: false,
            title: '',
            initData: true,
            showTitle: true,
            title: '',
            dataSources: {},
            dataSourcesIds: [],
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

        _wrapWidgetConfig: function (cfg) {
            //预处理widget 得配置
            var col = {$xtype: 'col', items: []}
            col.md = 12 / this.options.cols; //列
            col.xs = 12 / this.options.cols; //列
            col.sm = 12 / this.options.cols; //列
            col.lg = 12 / this.options.cols; //列
            var c = Object.merge({}, cfg);
            if (c.show != undefined) {
                col.show = c.show;
            }
            col.items.push(c);
            return col;
        },


        appendExtend: function () {
            var widgets = this.options.widgets;
            var cols = this.options.cols;
            var currentRow = null;
            var panel = {$xtype: 'panel', title: this.options.title, showTitle: this.options.showTitle, items: []};
            for (var i = 0; i < widgets.length; i++) {
                if (i == 0 /* || i % cols == 0*/) {
                    currentRow = {$xtype: 'row', items: []};
                    panel.items.push(currentRow);
                }
                currentRow.items.push(this._wrapWidgetConfig(widgets[i]));
            }
            var ds = this.options.dataSources;
            var dsids = this.options.dataSourcesIds;
            this.fragment = Page.create("fragment", {
                dataSources: ds,
                items: [panel],
                dataSourcesIds: dsids
            });
            this.formWidgetBag = [];
            this.fragment.render(this.$element, this.formWidgetBag);
            //预先加载数据
            if (this.options.initData) {
                var ds = this.fragment.getDataSources();
                var dsfetch = [];
                for (var i in ds) {
                    dsfetch.push(ds[i].fetch());
                }
            } else {
                //不加载数据
            }
        },

        submitForm: function () {
            if (this.isValid()) {
                var pros = [];
                for (var v in this.options.dataSources) {
                    var p = Page.manager.components[v].sync();
                    pros.push(p);
                }
                return pros;
            }
        },

        getFormValue: function () {
            var value = {};
            for (var i = 0; i < this.formWidgetBag.length; i++) {
                var widget = this.formWidgetBag[i]
                value[widget.getId()] = widget.getValue();
            }
            return value;
        },

        isValid: function () {
            for (var i = 0; i < this.formWidgetBag.length; i++) {
                var widget = this.formWidgetBag[i]
                if (!widget.isValid()) {
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