define(['../Base'], function (Base) {
    var BaseLayout = new Class({
        Extends: Base,
        options: {
            _addWrapDiv: false
        },
        initialize: function (opts) {
            this.parent(opts);
            this.itemsArr = [];
        },
        render: function (parent, formWidgetBag) {
            if (this._beforLayoutRender) {
                this._beforLayoutRender();
            }
            this.parent(parent);
            if (this.options.items) {
                for (var i = 0; i < this.options.items.length; i++) {
                    var it = this.options.items[i];
                    this._renderWidget(it, formWidgetBag);
                }
            }
            if (this._afterLayoutRender) {
                this._afterLayoutRender();
            }
        },
        _renderWidget: function (it, formWidgetBag) {
            if (it['$xtype']) {
                var config = {};
                Object.merge(config, it);
                delete config['$xtype'];
                var widget = Page.create(it['$xtype'], config);
                if (widget.isFormWidget && widget.isFormWidget()) {
                    formWidgetBag.push(widget);
                }
                widget.render(this.getElementToAppend(), formWidgetBag);
                this.itemsArr.push(widget.getId());
            }
        },
        getElementToAppend: function () {


        },
        addItem: function (config) {
            this._renderWidget(config);
        },
        removeItem: function (index) {
            var widgetId = this.itemsArr.splice(index, 1)[0];
            this.options.items.splice(index, 1);
            Page.manager.components[widgetId].destroy();
        },
        destroy: function () {
            for (var i = 0; i < this.itemsArr.length; i++) {
                Page.manager.components[this.itemsArr[i]].destroy();
            }
            this.parent();
        }
    });
    BaseLayout.xtype = "baseLayout";
    return BaseLayout;
});