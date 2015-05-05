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
            status: 'edit',//default = edit |edit|readonly
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            initValue: '',// 初始值
            initDisplay: '',

            value: '', // 具体值
            display: '',//显示值

            valueChanged:false, //初始值发生了变化
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            label: '未设置标题', //标题
            showLabel: true,
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            message: '',
            showMessage: true,

            errorMessage: '',
            showErrorMessage: false,

            glyphicon: '',//eg:glyphicon-ok
            showGlyphicon: false,

            required: false,
            showRequired: true,

            validationRules: [],

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            labelSpan: 4,
            controlPadding: '0'

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
                this.setAttr("valueChanged", true);
            } else if (typeOf(value) == 'object') {
                if (value['value'] != undefined) {
                    this.setAttr("value", value['value']);
                    if (value['display']) {
                        this.setAttr("display", value['display']);
                    } else {
                        this.setAttr("display", value['value']);
                    }
                }
                this.setAttr("valueChanged", true);
            } else {
                window.console.log('set value error,unknown structure ...' + value);
            }
        },
        getInitValue: function () {
            return this.getAttr("initValue");
        },
        getInitDisplay: function () {
            return this.getAttr("initDisplay");
        },
        reset: function () {
            var that = this;
            this.setValue({
                value: that.getInitValue(),
                display: that.getInitDisplay()
            })
        },
        switchStatus: function (status) {
            //readonly | edit | ready2edit ?
            var that = this;
            if (status == 'edit') {
                this.setAttrs({
                    status:status,
                    showErrorMessage: false,
                    showMessage: true,
                    showRequired: that.getAttr("required")
                });
            } else if (status == 'readonly') {
                this.setAttrs({
                    status:status,
                    showErrorMessage: false,
                    showMessage: false,
                    showRequired: false
                });
            } else if (status == 'ready2edit') {

            } else {
                window.console.error("unknown status, it should be in edit|readonly|ready2edit");
            }
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