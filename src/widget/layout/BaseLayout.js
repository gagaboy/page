define(['../Base'], function (Base) {
    var BaseLayout = new Class({
        Extends: Base,
        options: {
            _addWrapDiv: false,
            isLazyLoad:false
        },
        _rendered:false,
        initialize: function (opts) {
            this.parent(opts);
            this.itemsArr = [];
        },
        render: function (parent, formWidgetBag, parentLayoutWidgetId) {
            var goFlag = true;
            this.parent(parent);
            if(this.options.isLazyLoad&&!this._rendered){
                $w = $(window);
                aparent = parent;
                if(!aparent){
                    aparent = $("#"+this.options.$parentId);
                }
                if(aparent&&aparent.offset&&aparent.offset()){
                    var height = $w.scrollTop() + $w.height();
                    if(height<(aparent.offset().top+aparent.height())) {
                        (function(aparent,that,BaseLayout, formWidgetBag, parentLayoutWidgetId){
                            $(window).on("scroll", function () {
                                var height = $w.scrollTop() + $w.height();
                                if(height >= (aparent.offset().top+aparent.height())&&!that._rendered) {
                                    if (that.options.items) {
                                        for (var i = 0; i < that.options.items.length; i++) {
                                            var it = that.options.items[i];
                                            that._renderWidget(it, formWidgetBag, parentLayoutWidgetId);
                                        }
                                    }
                                    that._rendered = true;
                                }
                            });
                        })(aparent,this,BaseLayout, formWidgetBag, parentLayoutWidgetId);
                        goFlag = false;
                    }
                }
            }
            if(goFlag){
                if (this._beforLayoutRender) {
                    this._beforLayoutRender();
                }
                if (this.options.items) {
                    for (var i = 0; i < this.options.items.length; i++) {
                        var it = this.options.items[i];
                        this._renderWidget(it, formWidgetBag, parentLayoutWidgetId);
                    }
                }
                if (this._afterLayoutRender) {
                    this._afterLayoutRender();
                }
                this._rendered = true;
            }
        },
        _renderWidget: function (it, formWidgetBag, parentLayoutWidgetId) {

            if (it['$xtype']) {
                var config = {};
//                if(this.options.isLazyLoad){
//                    config.isLazyLoad = this.options.isLazyLoad;
//                }
                Object.merge(config, it);
                delete config['$xtype'];
                var widget = Page.create(it['$xtype'], config);
                if (widget.isFormWidget && widget.isFormWidget()) {
                    formWidgetBag && formWidgetBag.push(widget);
                    if(parentLayoutWidgetId){
                        widget.setAttr("parentLayoutWidgetId",parentLayoutWidgetId)
                    }
                }
                widget.render(this.getElementToAppend(), formWidgetBag, widget.getId());
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