define(['../BaseFormWidget','./kendo.maskedtextbox', 'text!./MaskedtextboxWidget.html'], function (BaseFormWidget,maskedtextbox,template) {
    var xtype = "maskedtextbox";
    var MaskedtextboxWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            promptChar: "_",
            clearPromptChar:false,
            rules: {},
            value: "",
            mask: "",
            labelClick: function (vid) {
                var cmp = Page.manager.components[vid];
                cmp.fireEvent('labelClick', cmp);
            }
        },
        render: function (opts) {
            this.parent(opts);
            this._getInputElement().kendoMaskedTextBox(this.options);
        },
        getTemplate: function () {
            return template;
        },
        _valueChange: function (value) {
            this.setAttr("display", value);
            this.validate();//即时校验
        },
        _getInputElement: function () {
            //var input = this.getElement()[0].getElement("input.form-widget-to-focus-class");
            var input = jQuery(this.getElement()).find("input.form-widget-to-focus-class");
            return input;

        },
        focus: function () {
            //console to invoke this method is not ok...
            var input = this._getInputElement();
            avalon.nextTick(function () {
                input.focus();
            });
        },
        blur: function () {
            var input = this._getInputElement();
            avalon.nextTick(function () {
                input.blur();
            });
        },
        validate: function () {
            //var valRes = Page.validation.validateValue(this.getValue(),this.getAttr("validationRules"));
            var validateTool = Page.create("validation", {onlyError: true});//后续由系统统一创建，只需调用即可

            var valRes = null;
            if (this.getAttr("required")) {//先判断是否必填
                valRes = validateTool.checkRequired(this.getValue());
            }
            if ((!valRes || valRes.result) && this.getAttr("validationRules")) {//再判断校验规则
                valRes = validateTool.validateValue(this.getValue(), this.getAttr("validationRules"));
            }
            if (valRes && !valRes.result) {//将错误信息赋值给属性
                this.setAttr("errorMessage", valRes.errorMsg);
            } else {//清空错误信息
                this.setAttr("errorMessage", "");
            }
        }
    });
    MaskedtextboxWidget.xtype = xtype;
    return MaskedtextboxWidget;
});