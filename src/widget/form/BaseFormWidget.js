/**
 * Created by qianqianyi on 15/4/23.
 */
define(['../Base', 'text!./BaseFormWidget-form.html','text!./BaseFormWidget-inline.html'], function (Base, formTpl, inlineTpl) {
    var xtype = "baseFormWidget";
    var BaseFormWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            status: 'edit',//default = edit |edit|readonly

            parentTpl: "form",  //组件的父模板类型 default=form |form|inline
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            initValue: '',// 初始值
            initDisplay: '',

            value: '', // 具体值
            display: '',//显示值

            valueChanged: false, //初始值发生了变化
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            label: '未设置标题', //标题
            showLabel: true,
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

            hasMessageBar: true,

            message: '',
            showMessage: true,

            errorMessage: '',
            showErrorMessage: false,

            glyphicon: '',//eg:glyphicon-ok
            showGlyphicon: false,

            required: false,
            showRequired: true,

            validationRules: {},

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
            if (opts['display'] != undefined) {
                opts['initDisplay'] = opts['display'];
            }
            this.parent(opts);
        },
        render: function (parent) {
            this.fireEvent("beforeRender", [this.vmodel]);
            var $this = this;
            var tmp = this.getTemplate();

            var widgetType = $this.options.$xtype;

            var compTemp = formTpl;
            if ("inline" == $this.options.parentTpl) {
                compTemp = inlineTpl;  //待扩展，设置为表格的模板 gridTpl
            }
            //替换模板中的子模板名称
//            compTemp = compTemp.replace(/\{\{TEMPLATENAME\}\}/g, widgetType+"_temp_"+$this.options.uuid);
            //替换模板中的子模板内容
            compTemp = compTemp.replace(/\{\{TEMPLATEVALUE\}\}/g, tmp);


            var e = jQuery("<div></div>").addClass("page_" + $this.getAttr('$xtype')).attr("ms-controller", $this.getId());
            e.append(compTemp);
            var parentDOM = parent;
            if (!parentDOM) {
                parentDOM = $this.getParentElement();
            }
            parentDOM.append(e);
            $this.$element = e;
            $this.element = e[0];

            avalon.scan($this.getParentElement()[0]);
            $this.fireEvent("afterRender", [this.vmodel]);
            if (this["_afterRender"]) {
                this["_afterRender"](this.vmodel);
            }
            return this;
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
                    status: status,
                    showErrorMessage: false,
                    showMessage: true,
                    showRequired: that.getAttr("required")
                });
            } else if (status == 'readonly') {
                this.setAttrs({
                    status: status,
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
                this.setAttr("showErrorMessage", true);
            } else {//清空错误信息
                this.setAttr("errorMessage", "");
                this.setAttr("showErrorMessage", false);
            }
        },
        isValid: function (notShowMessage) {
            var validateTool = Page.create("validation", {onlyError: true});//后续由系统统一创建，只需调用即可

            var valRes = null;
            if (this.getAttr("required")) {//先判断是否必填
                valRes = validateTool.checkRequired(this.getValue());
            }
            if ((!valRes || valRes.result) && this.getAttr("validationRules")) {//再判断校验规则
                valRes = validateTool.validateValue(this.getValue(), this.getAttr("validationRules"));
            }
            if (valRes && !valRes.result) {//将错误信息赋值给属性
                if (notShowMessage) {

                } else {
                    this.setAttr("errorMessage", valRes.errorMsg);
                }
                return false;
            } else {//清空错误信息
                if (notShowMessage) {

                } else {
                    this.setAttr("errorMessage", "");
                }
                return true;
            }
        },
        isFormWidget: function () {
            return true;
        }
    });
    BaseFormWidget.xtype = xtype;
    return BaseFormWidget;
});