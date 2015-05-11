/**
 * Created by JKYANG on 15/4/23.
 */
define(['../BaseFormWidget', 'text!./ComboboxWidget.html', 'css!./ComboboxWidget.css'], function (BaseFormWidget, template) {
//define(['../BaseFormWidget', 'text!./nnn.html', 'css!./ComboboxWidget.css'], function (BaseFormWidget, template) {
    var xtype = "combobox";
    var ComboBoxWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            showPulldown: false,
            pullDownDisplay: null,
            focused: false,
            multi: false,
            data: null,
            selectedItem: null,
            value: null,
            display: null,
            select: function (vid, span) {
                var vm = avalon.vmodels[vid];
                vm.showPulldown = !vm.showPulldown;
                vm.pullDownDisplay = vm.showPulldown ? "block" : "none";
            },
            selectItem: function (vid, data) {
                var vm = avalon.vmodels[vid];
                if (vm.multi) {
                    var contains = false;
                    for (var i = 0, len = vm.selectedItem.length; i < len; i++) {
                        if (vm.selectedItem[i].value == data.value) {
                            contains = true;
                            break;
                        }
                    }
                    if (!contains) {
                        vm.selectedItem.push(data);
                        vm.value.push(data.value);
                        vm.display.push(data.display);
                    }
                }
                else {
                    vm.selectedItem = data;
                    vm.value = data.value;
                    vm.display = data.display;
                    vm.showPulldown = false;
                    vm.pullDownDisplay = "none";
                }
            },
            removeItem: function (vid, data) {
                var vm = avalon.vmodels[vid];
                vm.selectedItem.remove(data);
                vm.value.remove(data.value);
                vm.display.remove(data.display);
            },
            comboBoxFocus: function (vid, span) {
                var vm = avalon.vmodels[vid];
                vm.focused = true;
                span.getElement("input").focus();
            },
            comboBoxBlur: function (vid, span) {
                var vm = avalon.vmodels[vid];
                vm.focused = false;
                if (!vm.multi) {
                    vm.showPulldown = false;
                    vm.pullDownDisplay = "none";
                }
            }
        },
        initialize: function (opts) {
            if (opts) {
                // TODO initData

                if (opts.multi) {
                    opts.value = opts.value || [];
                    opts.selectedItem = [];
                    opts.display = [];
                    for (var i = 0, valueLen = opts.value.length; i < valueLen; i++) {
                        for (var j = 0, dataLen = opts.data.length; j < dataLen; j++) {
                            if (opts.value[i] == opts.data[j].value) {
                                opts.display.push(opts.data[j].display);
                                opts.selectedItem.push(opts.data[j]);
                                break;
                            }
                        }
                    }
                }
                else {
                    opts.value = opts.value || null;
                    for (var o in opts.data) {
                        if (opts.value == o.value) {
                            opts.display = o.display;
                            opts.selectedItem = o;
                            break;
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