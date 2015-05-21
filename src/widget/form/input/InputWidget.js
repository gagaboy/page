/**
 * Created by qianqianyi on 15/4/23.
 */
define(['../BaseFormWidget', 'text!./InputWidget.html', 'css!./InputWidget.css'], function (BaseFormWidget, template) {
    var xtype = "input";
    var InputWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            placeholder:null
        },
        getTemplate: function () {
            return template;
        },
        _valueChange: function (value) {
            this.setAttr("display", value);
            this.validate();//即时校验
        },
        _getInputElement: function () {
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
        }

    });
    InputWidget.xtype = xtype;
    return InputWidget;
});