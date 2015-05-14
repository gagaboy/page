/**
 * Created by JKYANG on 15/4/23.
 */
define(['../BaseFormWidget', 'text!./ComboboxWidget.html', 'css!./ComboboxWidget.css'
    ,'css!../../../../lib/bootstrap/css/plugins/chosen/chosen.css'], function (BaseFormWidget, template) {
    var xtype = "combobox";
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
            searchValue: null,

            model: "normal",   //grid | tree
            data: [],
            $valueField: "value",
            $textField: "display",
            $pageSize: 10,
            $split: ",",
            $firstLoad: true,
            usePager: true,
            $dataSource: null,
            $pagination: null,

            comboBoxFocus: function (vid, span) {
                var vm = avalon.vmodels[vid];
                vm.focused = true;
                jQuery(this).find('input').focus();
                vm.changePanelShow(vid);

            },
            inputFocus: function(vid, $event) {
                var vm = avalon.vmodels[vid];
                vm.focused = true;
                vm.changePanelShow(vid);
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
                    vm.getCmpMgr(vm.vid)._renderPanel(vm.vid);
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
            },
            getCmpMgr: function(vid) {
                return Page.manager.components[vid];
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
            var that = this;
            vm.$watch("searchValue", function (newValue, oldValue)  {
                that._handleSearch(newValue, vm);
            });
            //单选时，输入区绑定了display
            vm.$watch("display", function (newValue, oldValue)  {
                if(!vm.multi && vm.searchable) {
                    that._handleSearch(newValue, vm);
                }
            });
        },
        _handleSearch: function(newValue, vm){
            if(!newValue || newValue.length>3) {
                var page;
                if(vm.usePager) {
                    page = {
                        pageNo: 1,
                        pageSize: vm.$pageSize
                    };
                }
                this._getSelectData(vm.vid, page);
            }
        },
        _getSelectData: function(vid, page) {
            var vm = this._getCompVM(vid);
            //TODO fetch Data page==undefined 时为无分页
            var searchValue;
            if(vm.multi) {
                searchValue = vm.searchValue;
            }
            else if(vm.searchable){
                searchValue = vm.display;
            }

            var data = this._getDataSource().getValue();
            if(searchValue)
            data = [{value: "1", display: "篮球"}, {value: "2", display: "足球"}, {value: "3", display: "排球"}];
            this._renderSelectData(data, vm);
        },
        //可作为回调传递
        _renderSelectData: function(data, vm) {
            if(data) {
                vm.data.clear();
                vm.optionData = data;
                if( vm.optionData) {
                    vm.initNormalItem(vm);
                    vm.data = vm.optionData;
                }
                //TODO 改变分页的总条数
                if(!vm.usePager) return;
                var that = this;
                if(!this.options.pagination) {
                    this.options.pagination = Page.create("pagination", {
                        $parentId: 'page_'+vm.vid,
                        totalNum: 20,  //TODO 总条数应该从数据中获取
                        pageSize: vm.$pageSize,
                        showPageDetail: false,
                        pageChangeEvent:function(pager, pageNo){
                            var page = {
                                pageNo: pageNo,
                                pageSize: pager.getAttr("pageSize")
                            };
                            that._getSelectData(vm.vid, page);
                        }
                    });
                    this.options.pagination.render();
                }
                else {
                    this.options.pagination.setAttr("totalNum", "50");
                }
            }
        },

        _renderPanel: function(vid) {
            var vm = this._getCompVM(vid);
            if("normal" == vm.model) {
                var page;
                if(vm.usePager) {
                    page = {
                        pageNo: 1,
                        pageSize: vm.$pageSize
                    };
                }
                this._getSelectData(vm.vid, page)
            }else if("grid" == vm.model) {

            }else if("tree" == vm.model) {

            }

        },
        _getCompVM: function(vid) {
            return avalon.vmodels[vid]
        },
        _getDataSource: function() {
            if(!this.options.dataSource) {
                this.options.dataSource =  Page.create("dataSet", {data: [{value: "1", display: "男"}, {value: "2", display: "女"}, {value: "3", display: "未知"}]});
                //dataSource = Page.create("dataSet", {data: [{id: "1", text: "男"}, {id: "2", text: "女"}, {id: "3", text: "未知"}]});
            }
            return this.options.dataSource;
        },
        getTemplate: function () {
            return template;
        },
        getDisplay: function() {
            var vid = this.options.vid;
            var vm = this._getCompVM(vid);
            return vm.display;
        },
        setSelect: function(item) {
                    var a,b;
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