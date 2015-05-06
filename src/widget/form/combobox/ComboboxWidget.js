/**
 * Created by JKYANG on 15/4/23.
 */
define(['../BaseFormWidget'], function (BaseFormWidget) {
    var xtype = "combobox";
    var fullName = "form/combobox/ComboboxWidget";
    var InputWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            $fullName: fullName,
            showPulldown: false,
            pullDownDisplay: "",
            data: [{value: '1', display: '333'}, {value: '2', display: '2'}],
            select: function (vid, span) {
                var vm = avalon.vmodels[vid];

                var obj = Page.manager.components[vid];
                vm.showPulldown = !vm.showPulldown;
                vm.pullDownDisplay = vm.showPulldown ? "block" : "none";
                var width = $(span).parentNode.getStyle("width");
            }
        },
        _valueChange: function (value) {
            this.setAttr("display", value);
        },
        _getInputElement: function () {
            var input = this.getElement()[0].getElement("input.form-widget-to-focus-class");
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