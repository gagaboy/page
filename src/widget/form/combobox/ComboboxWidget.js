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
            searchKey: "searchValue",

            model: "normal",   //grid | tree
            data: [],
            $valueField: "value",
            $textField: "display",
            $pageSize: 10,
            $split: ",",
            $firstLoad: true,
            usePager: true,
            showPager: true,
            dataSetId: null,
            $pagination: null,


            beforeSelectEvent: null,
            selectedEvent: null,
            beforeOpenEvent: null,

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
                        var cmpMgr = vm.getCmpMgr();
                        if(vm.beforeSelectEvent && "function"==typeof vm.beforeSelectEvent) {
                            var el = vm.selectedItems[vm.selectedItems.length-1];
                            var res = vm.beforeSelectEvent(el[vm.$valueField], el[vm.$textField], cmpMgr);
                            if(res == false) {
                                return;
                            }
                        }
                        var el = vm.selectedItems.pop();
                        if(vm.selectedEvent && "function"==typeof vm.selectedEvent) {
                            var res = vm.selectedEvent(el[vm.$valueField], el[vm.$textField], cmpMgr);
                            if(res == false) {
                                return;
                            }
                        }
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
                //下拉面板打开前事件
                if(!vm.showPanel) {
                    if(vm.beforeOpenEvent && "function"==typeof vm.beforeOpenEvent) {
                        var res = vm.beforeOpenEvent();
                        if(res == false) {
                            return;
                        }
                    }
                }
                vm.focused = true;
                vm.showPanel = !vm.showPanel;
                if(vm.$firstLoad) {
                    vm.$firstLoad = false;
                    vm.getCmpMgr()._renderPanel();
                }
            },

            initNormalItem: function() {
                var vm = this;
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
                var cmpMgr = vm.getCmpMgr();
                if(vm.beforeSelectEvent && "function"==typeof vm.beforeSelectEvent) {
                    var res = vm.beforeSelectEvent(el[vm.$valueField], el[vm.$textField], cmpMgr);
                    if(res == false) {
                        return;
                    }
                }
                vm.changeSelectedItems(el, !el.checked);
                if(!vm.multi) {
                    vm.showPanel = false;
                    vm.focused = false;
                }
                if(vm.selectedEvent && "function"==typeof vm.selectedEvent) {
                    var res = vm.selectedEvent(el[vm.$valueField], el[vm.$textField], cmpMgr);
                    if(res == false) {
                        return;
                    }
                }
            },
            changeSelectedItems: function(el, addFlag) {
                var vm = this;
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
                var el = vm.selectedItems[index];

                var cmpMgr = vm.getCmpMgr();
                if(vm.beforeSelectEvent && "function"==typeof vm.beforeSelectEvent) {

                    var res = vm.beforeSelectEvent(el[vm.$valueField], el[vm.$textField], cmpMgr);
                    if(res == false) {
                        return;
                    }
                }
                vm.selectedItems.removeAt(index);
                if(vm.selectedEvent && "function"==typeof vm.selectedEvent) {
                    var res = vm.selectedEvent(el[vm.$valueField], el[vm.$textField], cmpMgr);
                    if(res == false) {
                        return;
                    }
                }
                event.stopPropagation();
            },
            removeAll: function(vid) {
                var vm = avalon.vmodels[vid];
                var el = vm.selectedItems[0];
                if(!el) return;
                var cmpMgr = vm.getCmpMgr();
                if(vm.beforeSelectEvent && "function"==typeof vm.beforeSelectEvent) {

                    var res = vm.beforeSelectEvent(el[vm.$valueField], el[vm.$textField], cmpMgr);
                    if(res == false) {
                        return;
                    }
                }
                vm.value = "";
                vm.display = "";
                vm.selectedItems.clear();
                if(vm.selectedEvent && "function"==typeof vm.selectedEvent) {
                    var res = vm.selectedEvent(el[vm.$valueField], el[vm.$textField], cmpMgr);
                    if(res == false) {
                        return;
                    }
                }
            },
            getCmpMgr: function() {
                return Page.manager.components[this.vid];
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
                    vm.initNormalItem();
                }
                //更新组件值
                var value = "";
                var display = "";
                for(var i=0; i<vm.selectedItems.length; i++) {
                    var item = vm.selectedItems[i];
                    value += item[vm.$valueField];
                    display += item[vm.$textField];
                    if(i != vm.selectedItems.length-1) {
                        value += vm.$split;
                        display += vm.$split;
                    }
                }
                vm.value = value;
                vm.display = display;
            });
        },
        _watchSearchValue: function(vm) {
            var that = this;
            vm.$watch("searchValue", function (newValue, oldValue)  {
                that._handleSearch(newValue);
            });
            //单选时，输入区绑定了display
            vm.$watch("display", function (newValue, oldValue)  {
                if(!vm.multi && vm.searchable) {
                    that._handleSearch(newValue);
                }
            });
        },
        _handleSearch: function(newValue){
            if(!newValue || newValue.length>3) {
                var page = {
                    pageNo: "1",
                    pageSize: this.options.usePager ? this.options.$pageSize : "10000"
                };
                this._getSelectData(page);
            }
        },
        _renderPanel: function() {
            var options = this.options;
            if("normal" == options.model) {
                var page = {
                    pageNo: 1,
                    pageSize: this.options.usePager ? this.options.$pageSize : "10000"
                };
                this._getSelectData(page)
            }else if("grid" == options.model) {

            }else if("tree" == options.model) {

            }
        },
        _getSelectData: function(page) {
            var vm = this._getCompVM();
            var searchValue;
            if(vm.multi) {
                searchValue = vm.searchValue;
            }
            else if(vm.searchable){
                searchValue = vm.display;
            }
            var ds = this._getDataSet();
            if(!ds) return;
            //配置查询条件
            if(searchValue) {
                var fetchParam = {};
                fetchParam[vm.searchKey] = searchValue;
                ds.setAttr("fetchParam", fetchParam);
                //TODO 测试
                ds.setAttr("fetchUrl", "DataSearch.demo.json");
            }
            else {
                ds.setAttr("fetchUrl", "Data.demo.json");
            }
            //设置分页数据
            page && page.pageNo && ds.setAttr("pageNo",page.pageNo);
            page && page.pageSize && ds.setAttr("pageSize",page.pageSize);
            //发送获取数据请求
            var that = this;
            Promise.all([ds.fetch()]).then(function() {
                that._renderSelectData();
            });
        },
        //可作为回调传递
        _renderSelectData: function() {
            var vm = this._getCompVM();
            var ds = this._getDataSet();
            var data = ds.getValue();
            if(data) {
                vm.data.clear();
                vm.optionData = data;
                if( vm.optionData) {
                    vm.initNormalItem();
                    vm.data = vm.optionData;
                }
                var totalSize = ds.getTotalSize();
                if(totalSize <= vm.$pageSize) {
                    //如果第一次加载数据时，总条数小于pageSize，则禁分页条和搜索功能
                    vm.showPager = false;
                }
                else {
                    vm.showPager = true;
                }
                if(!vm.usePager && !vm.showPager) return;
                var that = this;
                if(!this.options.pagination) {
                    this.options.pagination = Page.create("pagination", {
                        $parentId: 'page_'+vm.vid,
                        totalNum: totalSize,
                        pageSize: vm.$pageSize,
                        showPageDetail: false,
                        pageChangeEvent:function(pager, pageNo){
                            var page = {
                                pageNo: pageNo,
                                pageSize: pager.getAttr("pageSize")
                            };
                            that._getSelectData(page);
                        }
                    });
                    this.options.pagination.render();
                }
                else {
                    this.options.pagination.setAttr("totalNum", totalSize);
                }
            }
        },
        _getCompVM: function() {
            var vid = this.options.vid;
            return avalon.vmodels[vid]
        },
        _getDataSet: function() {
            return Page.manager.components[this.options.dataSetId];
        },
        getTemplate: function () {
            return template;
        },
        getDisplay: function() {
            var vm = this._getCompVM();
            return vm.display;
        },
        setSelect: function(item) {
            if(item) {
                var vm = this._getCompVM();
                vm.selectedItems.clear();
                if("[object Object]" == Object.prototype.toString.call(item)) {
                    vm.selectedItems.push(item);
                }
                else if("[object Array]" == Object.prototype.toString.call(item)) {
                    if(vm.multi) {
                        vm.selectedItems = item;
                    }
                    else {
                        vm.selectedItems.push(item[0]);
                    }
                }
            }
        },
        clearSelect: function() {
            var vm = this._getCompVM();
            vm.removeAll(vm.vid);
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