/**
 * Created by qianqianyi on 15/4/23.
 */
define(['../Base', 'text!./BaseFormWidget-form.html', 'text!./BaseFormWidget-inline.html'], function (Base, formTpl, inlineTpl) {
    var xtype = "baseFormWidget";
    var BaseFormWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            status: 'edit',//default = edit |edit|readonly|disabled

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
            tipPosition:"bottom",

            glyphicon: '',//eg:glyphicon-ok
            showGlyphicon: false,

            required: false,
            showRequired: true,

            validationRules: {},

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            labelSpan: 4,
            $rowNum: 1,
            $colNum: 1,
            height: null,
            controlPadding: '0',

            //data binding
            bind: '',

            parentLayoutWidgetId:''//在表单布局的时候使用

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
            //compTemp = tmp;


            var e = jQuery("<div></div>").addClass("page_" + $this.getAttr('$xtype')).attr("ms-important", $this.getId());
            e.append(compTemp);
            var parentDOM = parent;
            if (!parentDOM) {
                parentDOM = $this.getParentElement();
            }
            //parentDOM.append(e);
            $this.$element = e;
            $this.element = e[0];

            if ("inline" == $this.options.parentTpl && (this.getAttr("showMessage") || this.getAttr("showErrorMessage"))) {
                var msgs = "";
                if (this.getAttr("showMessage")) {
                    msgs += this.getAttr("message");
                }
                if (this.getAttr("showErrorMessage") && this.getAttr("errorMessage")) {
                    msgs += this.getAttr("errorMessage") + " ";
                }
                if (msgs) {
                    this.toolTip = Page.create("tooltip", {
                        content: msgs,
                        target: this.options.$parentId,
                        parentDom:this.getParentElement()||this.getElement(),
                        position: this.options.tipPosition,
                        autoHide: false
                    });
                    this.toolTip.render();
                    this.toolTip.show();
                }
            }


            //avalon.nextTick(function(){
            //setTimeout(function(){
                //avalon.scan($this.getParentElement()[0], $this.vmodel);
                avalon.scan($this.element, $this.vmodel);
                $this.fireEvent("afterRender", [$this.vmodel]);
                if ($this["_afterRender"]) {
                    $this["_afterRender"]($this.vmodel);
                }
                if ($this.options.bind != '') {
                    var bindField = $this.options.bind;
                    if (bindField) {
                        var f = bindField.split(".");
                        if (f.length != 2) {
                            throw new Error('bind error' + bindField);
                        }
                        var dsId = f[0];
                        var dsField = f[1];
                        var ds = {
                            dataValueId: dsId,
                            fieldId: dsField,
                            widgetId: $this.getId()
                        };
                        var dbinder = Page.create('dataBinder', ds);
                        $this.dataBind = dbinder;
                    }
                }
            //var e = $('<div class="page_combobox" avalonctrl="sex1"><div><table class="form-horizontal-table"><tbody><tr><td class="form-label col-md-4 col-xs-4 col-sm-4 col-lg-4">        <span class="ampS-required-asterisk" style="display: none;">        *</span>        <label class="control-label">学院（多选）</label>        </td>        <td class="col-xs-7 col-sm-7 col-md-7 col-lg-7" style="padding: 0px;">            <!--调用组件模板-->        <div class="form-group" style=" margin-bottom: 0px;" name="ComboBoxWidget_sex1">        <div class="input-group chosen-container chosen-with-drop chosen-container-multi" style="width: 100%;">            <!--多选区域-->        <div style="border: 1px solid #CBD5DD;  border-radius: 2px;min-height: 34px;" title="">        <ul class="chosen-choices" style="border: 0px;">            <!--repeat481977894902--><li class="search-choice">        <span>计算机学院</span>        <a class="search-choice-close" data-option-array-index="105"></a>        </li><!--repeat481977894902--><li class="search-choice">        <span>经管学院</span>        <a class="search-choice-close" data-option-array-index="105"></a>        </li><!--repeat481977894902--><!--repeat481977894902:end-->        <li class="search-field">        <input type="text" autocomplete="off" tabindex="4" style="width: 25px;">        </li>        </ul>        </div>            <!--单选可搜索-->            <!--ms-if-->            <!--单选不可搜索-->            <!--ms-if-->            <!--下拉面板区域-->            <!--ms-if-->        </div>        </div>            <!--ms-if-->        </td>        <td class="form-icon-container  col-xs-1 col-sm-1 col-md-1 col-lg-1">        <span class="glyphicon" style="display: none;"></span>        </td>        </tr>        <tr class="form-horizontal-message">        <td></td>        <td class="text-muted" colspan="2" style="padding: 0px;">        <span>  </span>        <span></span>        </td>        </tr>        </tbody></table>        </div></div>');
            //var e = $('<div class="page_input" avalonctrl="username"><div>            <table class="form-horizontal-table">            <tbody><tr>            <td class="form-label col-md-2 col-xs-2 col-sm-2 col-lg-2">            <span class="ampS-required-asterisk" style="display: none;">            *            </span>            <label class="control-label">您的姓名</label>            </td>            <td class="col-xs-9 col-sm-9 col-md-9 col-lg-9" style="padding: 0px;">                <!--调用组件模板-->            <input class="form-control form-widget-to-focus-class form-text" readonly="true">            </td>            <td class="form-icon-container  col-xs-1 col-sm-1 col-md-1 col-lg-1">            <span class="glyphicon glyphicon-ok" style="display: none;"></span>            </td>            </tr>            <tr class="form-horizontal-message">            <td></td>            <td class="text-muted" colspan="2" style="padding: 0px;">            <span> 请输入2-5个汉字 </span>            <span></span>            </td>            </tr>            </tbody></table>            </div></div>');

                parentDOM.append(e);
            //}, 100);


            return this;
        },
        getValue: function () {
            return this.getAttr('value');
        },
        getDisplay: function () {
            return this.getAttr("display");
        },
        setValue: function (value, notFireFormValueChangeEvent) {
            //if(undefined == notFireFormValueChangeEvent) notFireFormValueChangeEvent = true;
            if (typeOf(value) == 'string' || typeOf(value) == 'number') {
                this.setAttr("value", value, notFireFormValueChangeEvent);
                this.setAttr("display", value);
                this.setAttr("valueChanged", true);
            } else if (typeOf(value) == 'object') {
                if (value['value'] != undefined) {
                    this.setAttr("value", value['value'], notFireFormValueChangeEvent);
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
            } else if (status == 'disabled') {
                this.setAttrs({
                    status: status,
                    showErrorMessage: false,
                    showMessage: false,
                    showRequired: that.getAttr("required")
                });
            }else if (status == 'ready2edit') {

            } else {
                window.console.error("unknown status, it should be in edit|readonly|ready2edit|disabled");
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
                    this.setAttr("showErrorMessage", true);
                }
                return false;
            } else {//清空错误信息
                if (notShowMessage) {

                } else {
                    this.setAttr("errorMessage", "");
                    this.setAttr("showErrorMessage", false);
                }
                return true;
            }
        },
        isFormWidget: function () {
            return true;
        },

        destroy: function () {
            this.parent();
            if (this.dataBind) {
                this.dataBind.destroy();
            }
        },
        _showMessageChange:function(){
            this._errorMessageChange();
        },
        _showErrorMessageChange:function(){
            this._errorMessageChange();
        },
        _errorMessageChange: function () {
            var msgs = "";

            if (this.getAttr("showErrorMessage") && this.getAttr("errorMessage")) {
                msgs = this.getAttr("errorMessage");
            }else if(this.getAttr("showMessage")) {
                msgs = this.getAttr("message");
            }
            if (msgs === "") {
                if (this.toolTip) {
                    this.toolTip.destroy();
                    this.toolTip = null;
                }
            } else if ("inline" == this.options.parentTpl && (this.getAttr("showMessage") || this.getAttr("showErrorMessage"))) {
                if(this.toolTip) {
                      this.toolTip.setAttr("content", msgs||"");
                }else{
                    this.toolTip = Page.create("tooltip", {
                        content: msgs,
                        target: this.options.$parentId,
                        parentDom:this.getElement(),
                        position:this.options.tipPosition,
                        autoHide: false
                    });
                    this.toolTip.render();
                    this.toolTip.show();
                }
            } else if (this.toolTip) {
                this.toolTip.destroy();
            }

        }
    });
    BaseFormWidget.xtype = xtype;
    return BaseFormWidget;
});