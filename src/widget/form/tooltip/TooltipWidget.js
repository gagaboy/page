define(['../BaseFormWidget','../../../../lib/kendoui/js/kendo.tooltip', 'css!./TooltipWidget.css'], function (BaseFormWidget,slider) {
    var xtype = "tooltip";//
    var TooltipWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            target:"", //绑定tip的对象id
            content:"",
            showAfter: 100,
            position: "bottom",
            showOn: "mouseenter",
            autoHide: true,
            show:null
        },
        tipObj:{},
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
            var that = this;
            if(!p.filter){
                p.filter = function(){
                    if(!that.getAttr("content")){
                        that.tipObj.hide();
                        return false;
                    }
                }
            }
            if(this._getInputElement()){
                this._getInputElement().kendoTooltip(p);
                this.tipObj = this._getInputElement().data("kendoTooltip");
                if(!this.getAttr("content")){
                    this.tipObj.hide();
                }
            }
        },
        destroy:function(){
            this.tipObj.destroy()
            this.parent();
        },
        show:function(){
            this.tipObj.show();
        },
        hide:function(){
            this.tipObj.hide();
        },
        _contentChange:function(content,oldContent){
            this.tipObj.options.content = content;
            if(!content){
                this.tipObj.refresh();
                this.hide();
            }else{
                this.tipObj.refresh();
                this.show();
            }
        }

    });
    TooltipWidget.xtype = xtype;
    return TooltipWidget;
});