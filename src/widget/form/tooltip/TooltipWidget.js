define(['../BaseFormWidget','../../../../lib/kendoui/js/kendo.tooltip', 'css!./TooltipWidget.css'], function (BaseFormWidget,slider) {
    var xtype = "tooltip";//
    var TooltipWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            target:"", //绑定tip的对象id
            showAfter: 100,
            position: "bottom",
            showOn: "mouseenter",
            autoHide: true,
            show:null
        },
        tipObj:null,
        _getInputElement: function () {
            if(this.options.target != ""){
                var input = jQuery("#"+this.options.target);
                return input;
            }else{
                return null;
            }
        },
        render: function (opts) {
            var p = jQuery.extend({}, this.options, opts || {})
            if(this._getInputElement()){
                this.tipObj = this._getInputElement().kendoTooltip(p);
            }
        }
    });
    TooltipWidget.xtype = xtype;
    return TooltipWidget;
});