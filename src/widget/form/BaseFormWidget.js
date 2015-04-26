/**
 * Created by qianqianyi on 15/4/23.
 */
define(['../Base'], function (Base) {
    var xtype = "baseFormWidget";
    var fullName = "BaseFormWidget";
    var BaseFormWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            $fullName: fullName
        }
    });
    BaseFormWidget.xtype = xtype;
    return BaseFormWidget;
});