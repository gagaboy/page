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
            //console to invoke this method is not ok...
            var input = this.getElement()[0].getElement("input.form-widget-to-focus-class");
            avalon.nextTick(function(){
                input.focus();
            });
        }
    });
    InputWidget.xtype = "input";
    return InputWidget;
});