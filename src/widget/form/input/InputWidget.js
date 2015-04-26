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
            $fullName: fullName,
            value: "aa"
        }
    });
    InputWidget.xtype = "input";
    return InputWidget;
});