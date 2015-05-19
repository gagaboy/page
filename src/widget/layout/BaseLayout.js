define(['../Base'], function (Base) {
    var BaseLayout = new Class({
        Extends: Base,
        options: {
            _addWrapDiv:false,
            items: [] //{$xtype:'',items:}
        },
        render: function (parent) {
            this.parent(parent);
            if (this.options.items) {
                for (var i = 0; i < this.options.items.length; i++) {
                    var it = this.options.items[i];
                    if (it['$xtype']) {
                        var config = {};
                        Object.merge(config, it);
                        delete config['$xtype'];
                        var widget = Page.create(it['$xtype'], config);
                        widget.render(this.getElementToAppend());
                    }
                }
            }
        },
        getElementToAppend: function () {


        }
    });
    BaseLayout.xtype = "baseLayout";
    return BaseLayout;
});