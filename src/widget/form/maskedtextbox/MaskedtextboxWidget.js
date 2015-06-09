define(['../BaseFormWidget','../../../../lib/kendoui/js/kendo.maskedtextbox', 'text!./MaskedtextboxWidget.html'], function (BaseFormWidget,maskedtextbox,template) {
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
            },
            change:function(){
                var vid = this.options.vid;
                var cmp = Page.manager.components[vid];
                cmp._valueChange(this.value());
            }
        },
        maskedObj:null,
        render: function (opts) {
            var p = jQuery.extend({}, this.options, opts || {});
            this.parent(opts);
            this._getInputElement().kendoMaskedTextBox(p);
            this.maskedObj = this._getInputElement().data("kendoMaskedTextBox");
        },
        getTemplate: function () {
            return template;
        },
        getValue:function(){
            var _value = "";
            if(this.maskedObj){
                _value = this.maskedObj.value();
            }
            return _value;
        },
        setValue: function (value, notFireFormValueChangeEvent) {
            if (typeOf(value) == 'string' || typeOf(value) == 'number') {
                this.maskedObj.value(value);
                this.setAttr("display", value);
                this.setAttr("valueChanged", true);
            } else if (typeOf(value) == 'object') {
                if (value['value'] != undefined) {
                    this.maskedObj.value(value['value']);
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
        _valueChange: function (value) {
            this.setAttr("display", value);
            this.validate();//即时校验
        },
        _statusChange:function(value, oldValue, model){
            if(value !== oldValue){
                if(value === "readonly"){
                    this.maskedObj && this.maskedObj.readonly(true);
                }else if(value === "edit"){
                    this.maskedObj && this.maskedObj.readonly(false);
                }else if(value === "disabled"){
                    this.maskedObj && this.maskedObj.enable(false);
                }
            }
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