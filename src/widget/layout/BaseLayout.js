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
        render: function (parent) {
            this.parent(parent);
            if (this.options.items) {
                for (var i = 0; i < this.options.items.length; i++) {
                    var it = this.options.items[i];
                    this._renderWidget(it);
                }
            }
        },
        _renderWidget: function (it) {
            if (it['$xtype']) {
                var config = {};
                Object.merge(config, it);
                delete config['$xtype'];
                var widget = Page.create(it['$xtype'], config);
                widget.render(this.getElementToAppend());
                this.itemsArr.push(widget.getId());
            }
        },
        getElementToAppend: function () {


        },
        addItem: function (config) {
            this._renderWidget(config);
        },
        removeItem: function (index) {
            var widgetId = this.itemsArr.splice(index, 1);
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