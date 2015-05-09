/**
 * Created by JKYANG on 15/4/23.
 */
//define(['../BaseFormWidget', 'text!./ComboBoxWidget.html', 'css!./ComboBoxWidget.css'], function (BaseFormWidget, template) {
define(['../BaseFormWidget', 'text!./ComboBoxWidget.html', 'css!./ComboBoxWidget.css'], function (BaseFormWidget, template) {
    var xtype = "combobox";
    var ComboBoxWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            showPulldown: false,
            pullDownDisplay: "",
            data1: [{value: '1', display: '333'}, {value: '2', display: '2'}],
            pullDownDisplay: null,
            focused: false,
            multi: false,
            _inputWidth: 25,
            data: [{value: '1', display: '333'}, {value: '2', display: '2'}],
            selectedItem: null,
            value: null,
            display: null,
            select: function (vid, span) {
                var vm = avalon.vmodels[vid];
                vm.showPulldown = !vm.showPulldown;
                vm.pullDownDisplay = vm.showPulldown ? "block" : "none";
            },
            selectValue: function(vid, data) {
                var vm = avalon.vmodels[vid];
                vm.selectedItem = data;
                vm.value = data.value;
                vm.display = data.display;
                if(!vm.multi) {
                    vm.showPulldown = false;
                    vm.pullDownDisplay = "none";
                }
            },
            comboBoxFocus: function (vid, span) {
                var vm = avalon.vmodels[vid];
                vm.focused = true;
                span.getElement("input").focus();
            },
            comboBoxBlur: function (vid, span) {
                var vm = avalon.vmodels[vid];
                vm.focused = false;
                //vm.showPulldown = false;
                //vm.pullDownDisplay = "none";
            }
        },
        initialize: function (opts) {
            if (opts) {
                // TODO initData

                if(opts.data && opts.value) {
                    if(opts.multi) {
                        opts.display = [];
                        opts.selectedItem = [];
                        for (var s in opts.value) {
                            for (var o in opts.data) {
                                if (s == o.value) {
                                    opts.display.push(o.display);
                                    opts.selectedItem.push(o);
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        for (var o in opts.data) {
                            if (opts.value == o.value) {
                                opts.display = o.display;
                                opts.selectedItem = o;
                                break;
                            }
                        }
                    }
                }
            }
            this.parent(opts);
        },
        getTemplate: function () {
            return template;
        },
        _valueChange: function (value) {
            this.setAttr("display", value);
            inputWidth = value.length * 7 + 25;
        },
        _getInputElement: function () {
            var input = this.getElement()[0].getElement("input.comboBoxInput");
            return input;
        },
        focus: function () {
            //console to invoke this method is not ok...
            alert(111);
            var input = this._getInputElement();
            avalon.nextTick(function () {
                input.focus();
            });
            this.options.focused = true;
        },
        blur: function () {
            var input = this._getInputElement();
            avalon.nextTick(function () {
                input.blur();
            });
            this.options.focused = false;
        }

    });
    ComboBoxWidget.xtype = xtype;
    return ComboBoxWidget;
});