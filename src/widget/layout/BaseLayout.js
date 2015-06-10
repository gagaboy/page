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
        render: function (parent, formWidgetBag, parentLayoutWidgetId) {
            if (this._beforLayoutRender) {
                this._beforLayoutRender();
            }
            this.parent(parent);
            if (this.options.items) {
                for (var i = 0; i < this.options.items.length; i++) {
                    var it = this.options.items[i];
                    this._renderWidget(it, formWidgetBag, parentLayoutWidgetId);
                }
            }
            if (this._afterLayoutRender) {
                this._afterLayoutRender();
            }
        },
        _renderWidget: function (it, formWidgetBag, parentLayoutWidgetId) {

            if (it['$xtype']) {
                var config = {};
                Object.merge(config, it);
                delete config['$xtype'];
                var widget = Page.create(it['$xtype'], config);
                if (widget.isFormWidget && widget.isFormWidget()) {
                    formWidgetBag && formWidgetBag.push(widget);
                    if(parentLayoutWidgetId){
                        widget.setAttr("parentLayoutWidgetId",parentLayoutWidgetId)
                    }
                }
                widget.render(this.getElementToAppend(), formWidgetBag, this.getId());
                this.itemsArr.push(widget.getId());
                return widget;
            }
        },
        getElementToAppend: function () {


        },
        addItem: function (config) {
           return this._renderWidget(config);
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