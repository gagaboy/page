/**
 * Created by qianqianyi on 15/4/23.
 */
define(['./BaseFormWidget'], function (BaseFormWidget) {
    var InputWidget = new Class({
        Extends: BaseFormWidget,
        initialize: function () {
            console.log("input init")
        }
    });
    InputWidget.xtype = "input";
    return InputWidget;
});