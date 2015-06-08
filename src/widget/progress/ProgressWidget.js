define(['../Base', '../../../lib/pace/pace','text!./ProgressWidget.html', 'css!./ProgressWidget.css'], function (Base, pace, template) {
    var xtype = "progress";
    var ProgressWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype
        },
        progressObj:null,
        render: function () {
            this.fireEvent("beforeRender", [this.vmodel]);
            this.progressObj = pace.start();
            this.fireEvent("afterRender", [this.vmodel]);
            if (this["_afterRender"]) {
                this["_afterRender"](this.vmodel);
            }
            return this;
        },
        getTemplate: function(){
            return template;
        }
    });
    ProgressWidget.xtype = xtype;
    return ProgressWidget;
});