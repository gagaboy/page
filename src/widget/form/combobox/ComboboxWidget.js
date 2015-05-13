/**
 * Created by JKYANG on 15/4/23.
 */
define(['../BaseFormWidget', 'text!./ComboboxWidget.html', 'css!./ComboboxWidget.css'
    ,'css!../../../../lib/bootstrap/css/plugins/chosen/chosen.css'], function (BaseFormWidget, template) {
    var xtype = "combobox";
    var dataSource, pagination;
    var ComboBoxWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            value: null,
            display: null,
            multi: false,
            searchable: true,
            selectedItems: [],
            showPanel: false,
            focused: false,
            inputWidth: 25,
            searchValue: " ",

            model: "normal",   //grid | tree
            data: [],
            $valueField: "value",
            $textField: "display",
            $pageSize: 10,
            $split: ",",
            $firstLoad: true,

            comboBoxFocus: function (vid, span) {
                var vm = avalon.vmodels[vid];
                vm.focused = true;
                jQuery(this).find('input').focus();
                vm.changePanelShow(vid);

                vm.searchValue = "";  //使其触发搜索
            },
            inputFocus: function(vid, $event) {
                var vm = avalon.vmodels[vid];
                vm.focused = true;
                vm.searchValue = "";  //使其触发搜索
            },
            keyDown: function (vid, e) {
                var vm = avalon.vmodels[vid];
                //如果是多选，则需要动态改变输入区域的宽度
                if (vm.multi) {
                    var maxWidth = jQuery(this).parent().parent().width();
                    //删除已选项（如果是删除且输入区域为空字符串）
                    if (e.keyCode == 8 && jQuery(this).val() == "") {
                        var el = vm.selectedItems.pop();
                    }
                    var selected = jQuery(this).parent().find("div");
                    for (var i = 0, len = selected.length; i < len; i++) {
                        maxWidth = maxWidth - selected[i].offsetWidth - 8;
                    }

                    var inputWidth = jQuery(this).val().length * 7 + 25;
                    if (inputWidth > maxWidth) {
                        inputWidth = maxWidth;
                    }
                    vm.inputWidth = inputWidth;
                }
            },
            changePanelShow: function(vid, e) {
                var vm = avalon.vmodels[vid];
                vm.focused = true;
                vm.showPanel = !vm.showPanel;
                if(vm.$firstLoad) {
                    vm.$firstLoad = false;
                    Page.manager.components[vm.vid].renderPanel(vm.vid);
                }
            },

            initNormalItem: function(vm) {
                var optionData = vm.data.length>0 ? vm.data : vm.optionData;   //如果data中有值，则从data中获取下拉数据，以便以后对选中项的操作
                if(!optionData) return;
                for(var i=0; i<optionData.length; i++) {
                    optionData[i].checked = false;
                    for(var j=0; j<vm.selectedItems.length; j++) {
                        if(vm.selectedItems[j][vm.$valueField] == optionData[i][vm.$valueField]) {
                            optionData[i].checked = true;
                            break;
                        }
                    }
                }
            },
            initGridItem: function() {},
            toggleItemSelect: function(vid, el) {
                var vm = avalon.vmodels[vid];
                vm.changeSelectedItems(vm, el, !el.checked);
                if(!vm.multi) {
                    vm.showPanel = false;
                    vm.focused = false;
                }
            },
            changeSelectedItems: function(vm, el, addFlag) {
                var item = {};
                item[vm.$valueField] = el[vm.$valueField];
                item[vm.$textField] = el[vm.$textField];
                //增加选中项
                if(addFlag) {
                    if(!vm.multi) {
                        vm.selectedItems.clear();   //单选模式下，先删除，再插入，才能监控到selecetedItems数据的变化
                    }
                    vm.selectedItems.push(item);
                }
                //删除选中项
                else {
                    for(var i=0; i<vm.selectedItems.length; i++) {
                        if(vm.selectedItems[i][vm.$valueField] ==  item[vm.$valueField] ) {
                            vm.selectedItems.removeAt(i);
                            break;
                        }
                    }
                }
            },
            removeItem: function(vid, item, index, evnet) {
                var vm = avalon.vmodels[vid];
                vm.selectedItems.removeAt(index);
                event.stopPropagation();
            },
            removeAll: function(vid) {
                var vm = avalon.vmodels[vid];
                vm.value = "";
                vm.display = "";
                vm.selectedItems.clear();
            }

        },
        initialize: function (opts) {
            if (opts && opts.value && opts.display) {
                var splitChar = opts.$split || this.options.$split;
                var valueArr = opts.value.split(splitChar);
                var displayArr = opts.display.split(splitChar);
                for(var i=0; i<valueArr.length; i++) {
                    var item = {};
                    item[opts.$valueField || this.options.$valueField] = valueArr[i];
                    item[opts.$textField || this.options.$textField] = displayArr[i];
                    this.options.selectedItems.push(item);
                }
            }
            this.parent(opts);

            this._watchSelectedItems(this.vmodel);
            this._watchSearchValue(this.vmodel);
        },
        _watchSelectedItems: function(vm) {
            vm.selectedItems.$watch("length", function (newValue, oldValue) {
                if("normal" == vm.model) {
                    //疑为BUG,不应该再次清除
                    if(0 == newValue)   vm.selectedItems.clear();
                    //重新渲染下拉面板中的选中项
                    vm.initNormalItem(vm);
                }
                //更新组件值
                var value = "";
                var display = "";
                for(var i=0; i<vm.selectedItems.length; i++) {
                    var item = vm.selectedItems[i];
                    value += item[vm.$valueField];
                    display += item[vm.$textField];
                    if(i != vm.selectedItems.length-1) {
                        value += ",";
                        display += ",";
                    }
                }
                vm.value = value;
                vm.display = display;
            });
        },
        _watchSearchValue: function(vm) {
            vm.$watch("searchValue", function (newValue, oldValue)  {
                if(!newValue || newValue.length>3) {
                    alert(newValue)
                }
            });
        },
        renderPanel: function(vid) {
            var vm = this._getCompVM(vid);
            if("normal" == vm.model) {
                vm.optionData = this._getDataSource().getValue();
                if( vm.optionData) {
                    vm.initNormalItem(vm);
                    vm.data = vm.optionData;
                }
                //创建分页条
                pagination = Page.create("pagination", {
                    $parentId: 'page_'+vm.vid,
                    totalNum: 20,
                    showPageDetail: false,
                    pageChangeEvent:function(pager){
                        alert(1);
                    }
                });
                pagination.render();
            }else if("grid" == vm.model) {

            }else if("tree" == vm.model) {

            }

        },
        _getCompVM: function(vid) {
            return avalon.vmodels[vid]
        },
        _getDataSource: function() {
            if(!dataSource) {
                dataSource =  Page.create("dataSet", {data: [{value: "1", display: "男"}, {value: "2", display: "女"}, {value: "3", display: "未知"}]});
                //dataSource = Page.create("dataSet", {data: [{id: "1", text: "男"}, {id: "2", text: "女"}, {id: "3", text: "未知"}]});
            }
            return dataSource;
        },
        getTemplate: function () {
            return template;
        },
        _valueChange: function (value) {
            this.setAttr("display", value);
        },
        _getInputElement: function () {
            var input = this.getElement().find('input.comboBoxInput');
            return input;
        },
        focus: function () {
            //console to invoke this method is not ok...
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