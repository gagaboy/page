define(['../BaseFormWidget','../../../../lib/kendoui/js/kendo.slider', 'text!./SliderWidget.html', 'css!./SliderWidget.css'], function (BaseFormWidget,slider, template) {
    var xtype = "slider";
    var SliderWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            multi: false, //true时，有两个slider
            showButtons: true,
            min: 0,
            max: 10,
            smallStep: 1,
            largeStep: 5,
            orientation: "horizontal",
            increaseButtonTitle: "Increase",
            decreaseButtonTitle: "Decrease",
            dragHandleTitle: "drag", //multi=false时，设置slider滑块标题
            leftDragHandleTitle: "drag", //multi=true时，设置左边的slider滑块标题
            rightDragHandleTitle: "drag",//multi=true时，设置右边的slider滑块标题
            tooltip: { format: "{0:#,#.##}" },
            value: null,
            enabled: true,
            tickPlacement: "both"
        },
        sliderObj:null,
        getTemplate: function () {
            return template;
        },
        _getInputElement: function () {
            var input = jQuery(this.getElement()).find(".sliderWidget");
            return input;
        },
        render: function (opts) {
            this.parent(opts);
            if(this.options.multi){
                this.sliderObj = this._getInputElement().kendoRangeSlider(this.options).data("kendoRangeSlider");
            }else{
                this.sliderObj = this._getInputElement().kendoSlider(this.options).data("kendoSlider");
            }
        },
        getValue:function(){
            return this.sliderObj.value();
        },
        setValue:function(value){
            this.sliderObj.value(value);
            this.setAttr("valueChanged", true);
        },
        _statusChange:function(value, oldValue, model){
            if(value !== oldValue){
                if(value === "readonly"){
                    this.sliderObj.disable();
                }else if(value === "edit"){
                    this.sliderObj.enable();
                }
            }
        }
    });
    SliderWidget.xtype = xtype;
    return SliderWidget;
});