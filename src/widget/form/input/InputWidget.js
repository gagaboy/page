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
            value: "aa",
            label:"姓名",
            message:"message"
        }
    });
    InputWidget.xtype = "input";
    return InputWidget;
});