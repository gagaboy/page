/**
 * Created by qianqianyi on 15/4/23.
 */
define(['../BaseFormWidget', 'text!./TextareaWidget.html', 'css!./TextareaWidget.css', "art"], function (BaseFormWidget, template) {
    var xtype = "textarea";
    var TextareaWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            rows:3,//显示行数，默认3;列数不设置，采取自适应的方式
            placeholder:null,
            labelClick: function (vid) {
                var cmp = Page.manager.components[vid];
                cmp.fireEvent('labelClick', cmp);
            }
        },
        getTemplate: function () {
            return template;
        },
        _valueChange: function (value) {
            this.setAttr("display", value);
            this.validate();//即时校验
        },
        _getInputElement: function () {
            var input = jQuery(this.getElement()).find("textarea.form-widget-to-focus-class");
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
    TextareaWidget.xtype = xtype;
    return TextareaWidget;
});