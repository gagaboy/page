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
            $fullName: fullName,
            status: 'default',//default = edit |edit|readonly
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            initValue: '',// 初始值
            value: '', // 值
            display: '',//显示值
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            label: '未设置标题', //标题
            showLabel: true,
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            message: '',
            showMessage: true,
            hasError: false,
            required: false,
            validationRules: []
        },
        initialize: function (opts) {
            if (opts['display'] == undefined) {
                opts['display'] = opts['value'];
            }
            if (opts['value'] != undefined) {
                opts['initValue'] = opts['value'];
            }
            this.parent(opts);
        },
        getValue: function () {
            return this.getAttr('value');
        },
        getDisplay: function () {
            return this.getAttr("display");
        },
        setValue: function (value) {
            if (typeOf(value) == 'string') {
                this.setAttr("value", value);
                this.setAttr("display", value);
            } else if (typeOf(value) == 'object') {
                if (value['value']) {
                    this.setAttr("value", value['value']);
                    if (value['display']) {
                        this.setAttr("display", value['display']);
                    } else {
                        this.setAttr("display", value['value']);
                    }
                }
            } else {
                window.console.log('set value error,unknown structure ...' + value);
            }
        },
        reset: function () {
            var that = this;
            this.setValue({
                value: that.getValue(),
                display: that.getDisplay()
            })
        },
        focus: function () {
            //todo every form widget to extend
            window.console.error("need to be extended.");
        },
        blur: function () {
            //todo every form widget to extend
            window.console.error("need to be extended.");
        },
        validate: function () {
            //todo every form widget to extend
            window.console.error("need to be extended.");
        }
    });
    BaseFormWidget.xtype = xtype;
    return BaseFormWidget;
});