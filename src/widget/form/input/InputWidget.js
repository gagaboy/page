/**
 * Created by qianqianyi on 15/4/23.
 */
define(['../BaseFormWidget'], function (BaseFormWidget) {
    var xtype = "input";
    var fullName = "form/input/InputWidget";
    var InputWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            $fullName: fullName
        },
        _valueChange: function (value) {
            this.setAttr("display", value);
        },
        focus: function () {
            var input = this.getElement()[0].getElement("input.form-widget-to-focus-class");
            setTimeout(function(){
                input.focus();
            },200);
        }
    });
    InputWidget.xtype = "input";
    return InputWidget;
});