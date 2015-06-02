/**
 * Created by BIKUI on 15/4/23.
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
            searchKey: "searchValue",
            showClear: true,  //是否要显示清空图标
            panelCancel: true,  //是否允许从面板中取消
            model: "normal",   //grid | tree
            data: [],
            $valueField: "value",
            $textField: "display",
            $pageSize: 10,
            $split: ",",
            usePager: true,
            dataSetId: null,
            url: null,
            mainAlias: null,
            beforeSelectEvent: null,
            selectedEvent: null,
            beforeOpenEvent: null,

            $pagination: null,
            downShow: true,
            clearShow: false, //控制清空图标是否显示
            showPager: true,
            $firstLoad: true,
            selectedItems: [],
            showPanel: false,
            focused: false,
            inputWidth: 25,
            searchValue: "",
            panelLeft: null,
            panelTop: null,

            onAfterRender: function(vm) {

                //把下拉面板放到body节点下
                var element = jQuery(vm.getCmpMgr().getElement());
                var panelObj = element.find("#comboBox_panel_"+vm.vid);
                jQuery('body').append(panelObj);
            },
            isDisabled: function() {
                return this.status=='disabled' ? true:false;
            },
            comboBoxFocus: function (vid, span) {
                var vm = avalon.vmodels[vid];
                if(vm.isDisabled()) return;
                vm.focused = true;
                jQuery(this).find('input').focus();
                if(!vm.showPanel) {
                    vm.changePanelShow(vid, event);
                }
            },
            inputFocus: function(vid, event) {
                var vm = avalon.vmodels[vid];
                if(vm.isDisabled()) return;
                vm.focused = true;
                vm.clickItem = false;
                if(!vm.showPanel) {
                    vm.changePanelShow(vid, event);
                }
            },
            showClearIcon: function(vid, $event) {
                var vm = avalon.vmodels[vid];
                if(vm.isDisabled()) return;
                vm.clearShow = true;
            },
            displayClearIcon: function(vid, $event) {
                var vm = avalon.vmodels[vid];
                if(vm.isDisabled()) return;
                vm.clearShow = false;
            },
            keyDown: function (vid, e) {
                var vm = avalon.vmodels[vid];
                if(vm.isDisabled()) return;
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
            changePanelShow: function(vid, event) {
                var vm = avalon.vmodels[vid];
                if(vm.isDisabled()) return;
                //下拉面板打开前事件
                if(!vm.showPanel) {
                    if(vm.beforeOpenEvent && "function"==typeof vm.beforeOpenEvent) {
                        var res = vm.beforeOpenEvent();
                        if(res == false) {
                            return;
                        }
                    }
                }
                if(!vm.$firstLoad) {
                    vm.judgePanelPosition(vm, event);
                }
                if(vm.$firstLoad) {
                    vm.getCmpMgr()._renderPanel(event);
                }
            },
            judgePanelPosition: function(vm, event) {
                var element = jQuery(this.getCmpMgr().getElement());
                var panelObj = jQuery("#comboBox_panel_"+vm.vid);

                var panelHeight = panelObj.height();

                var obj =  element.find("[name^='ComboBoxWidget_']");
                var offset = obj.offset();

                var downHeight =  jQuery(window).height()-offset.top;
                var upHeight = offset.top;
                if(downHeight < panelHeight && downHeight < upHeight && panelHeight<upHeight) {
                    this.downShow = false;
                }else {
                    this.downShow = true;
                    if(downHeight<panelHeight) {
                        panelObj.find("ul").height(downHeight);
                    }
                }

                if(this.downShow) {
                    vm.panelTop = offset.top + obj.outerHeight()-obj.scrollTop();
                }
                else {
                    vm.panelTop = offset.top+obj.scrollTop()-panelHeight;
                }

                panelObj.width(obj.outerWidth()-2);

                //判断下拉面板打开之前是否有滚动条
                var existScroll = false;
                if(document.body.scrollHeight > document.body.clientHeight) {
                    existScroll = true;
                }

                vm.focused = true;
                vm.showPanel = !vm.showPanel;
                vm.panelLeft = offset.left;
                //有可能出现滚动条，宽度最后设置
                if(!existScroll && document.body.scrollHeight > document.body.clientHeight) {
                    vm.panelLeft -= 9;
                }
            },

            initNormalItem: function() {
                var vm = this;
                var optionData = vm.data.length>0 ? vm.data : vm.optionData;   //如果data中有值，则从data中获取下拉数据，以便以后对选中项的操作
                if(!optionData) return;
                for(var i=0; i<optionData.length; i++) {
                    optionData[i].checked = false;
                    //匹配搜索值
                    var text = optionData[i][vm.$textField];
                    var textArr = [];
                    var searchValue = vm.searchValue;
                    if(!vm.multi && vm.searchable) {
                        searchValue = vm.display;
                    }
                    if(searchValue) {
                        var index = text.indexOf(searchValue);
                        var searchLen = searchValue.length;
                        var textLen = text.length;
                        if(index<0) {
                            textArr.push(text);
                        }
                        else if(index == 0) {
                            textArr.push(searchValue);
                            textArr.push(text.slice(index+searchLen));
                        }
                        else{
                            textArr.push(text.slice(0, index));
                            textArr.push(searchValue);
                            if(index+searchLen < textLen) {
                                textArr.push(text.slice(index+searchLen));
                            }
                        }
                    }
                    else {
                        textArr.push(text);
                    }
                    optionData[i]['displayArr'] = textArr;


                    for(var j=0; j<vm.selectedItems.length; j++) {
                        if(vm.selectedItems[j][vm.$valueField] == optionData[i][vm.$valueField]) {
                            optionData[i].checked = true;
                            break;
                        }
                    }
                }
            },
            initGridItem: function() {},
            toggleItemSelect: function(vid, el, index, event) {
                var vm = avalon.vmodels[vid];
                var cmpMgr = vm.getCmpMgr();
                if(!vm.panelCancel && el.checked) return;
                if(vm.beforeSelectEvent && "function"==typeof vm.beforeSelectEvent) {
                    var res = vm.beforeSelectEvent(el[vm.$valueField], el[vm.$textField], cmpMgr, el.$model);
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
                    var res = vm.selectedEvent(el[vm.$valueField], el[vm.$textField], cmpMgr, el.$model);
                    if(res == false) {
                        return;
                    }
                }
                event.stopPropagation();
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
                    vm.clickItem = true;            //单选模式下，选中后，不再发送查询请求
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
                if(vm.isDisabled()) return;
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
            removeAll: function(vid, event) {
                event && event.stopPropagation();
                var vm = avalon.vmodels[vid];
                if(vm.isDisabled()) return;
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
            if(opts) {
                if(opts.dataSetId && opts.url) {
                    Page.dialog.alert("下拉框组件中dataSetId和url属于互斥属性，只能设置一个！");
                    return;
                }
                if (opts.value && opts.display) {
                    var splitChar = opts.split || this.options.$split;
                    var valueArr = opts.value.split(splitChar);
                    var displayArr = opts.display.split(splitChar);
                    for(var i=0; i<valueArr.length; i++) {
                        var item = {};
                        item[opts.valueField || this.options.$valueField] = valueArr[i];
                        item[opts.textField || this.options.$textField] = displayArr[i];
                        this.options.selectedItems.push(item);
                    }
                }
            }

            this.parent(opts);
            var that = this;
            //点击其它区域，隐藏掉下拉面板
            jQuery(document).click(function(event) {
                var name = "ComboBoxWidget_"+that.options.vid;
                if(!jQuery(event.target).closest("[name='"+name+"']").length) {
                    var vm = that._getCompVM();
                    if(!vm) return;
                    vm.showPanel = false;
                    vm.focused = false;
                    vm.searchValue = "";
                }
            });
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
                if(!vm.multi && vm.searchable && !vm.clickItem && vm.showPanel) {
                    that._handleSearch(newValue);
                }
            });
        },
        _handleSearch: function(newValue){
            if(!newValue || newValue.length>1) {
                var page = {
                    pageNo: "1",
                    pageSize: this.options.usePager ? this.options.$pageSize : "10000"
                };
                this._getSelectData(page, newValue);
            }
        },
        _renderPanel: function(event) {
            var options = this.options;
            if("normal" == options.model) {
                var page = {
                    pageNo: 1,
                    pageSize: this.options.usePager ? this.options.$pageSize : "10000"
                };
                //this._getSelectData(page, false);   //如果是第一次渲染面板时，不需要根据searchValue查询（单选可搜索时display可能会有值）
                this._getSelectData(page, undefined, event);
            }else if("grid" == options.model) {

            }else if("tree" == options.model) {

            }
        },
        _getSelectData: function(page, searchValue, event) {
            var vm = this._getCompVM();
/*            var searchValue="";
            if(needSearchValue || needSearchValue==undefined) {
                if(vm.multi) {
                    searchValue = vm.searchValue;
                }
                else if(vm.searchable){
                    searchValue = vm.display;
                }
            }*/
            var ds = this._getDataSet();
            if(!ds) return;
            //配置查询条件
            if(searchValue && searchValue.trim() != "") {
                var fetchParam = {};
                fetchParam[vm.searchKey] = searchValue;
                ds.setAttr("fetchParam", fetchParam);
                //TODO 测试
                //ds.setAttr("fetchUrl", "DataSearch.demo.json");
            }
            else {
                ds.setAttr("fetchParam", {});
                //ds.setAttr("fetchUrl", "Data.demo.json");
            }
            //设置分页数据
            page && page.pageNo && ds.setAttr("pageNo",page.pageNo);
            page && page.pageSize && ds.setAttr("pageSize",page.pageSize);
            //发送获取数据请求
            var that = this;
            if(!ds.getAttr("fetchUrl")) {
                that._renderSelectData();
                if(event && vm.$firstLoad) {
                    vm.judgePanelPosition(vm, event);
                    vm.$firstLoad = false;
                }
            }
            else {
                Promise.all([ds.fetch()]).then(function() {
                    that._renderSelectData();
                    if(event && vm.$firstLoad) {
                        vm.judgePanelPosition(vm, event);
                        vm.$firstLoad = false;
                    }

                });
            }

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
                if(totalSize <= vm.$pageSize || undefined==totalSize) {
                    //如果第一次加载数据时，总条数小于pageSize，则禁分页条和搜索功能
                    vm.showPager = false;
                }
                else {
                    vm.showPager = true;
                }
                if(!vm.usePager || !vm.showPager) return;
                var that = this;
                if(!this.options.pagination) {
                    this.options.pagination = Page.create("pagination", {
                        $parentId: 'page_'+vm.vid,
                        $id: 'page_'+vm.vid,
                        totalNum: totalSize,
                        pageSize: vm.$pageSize,
                        showPageDetail: false,
                        pageChangeEvent:function(pager, pageNo){
                            var page = {
                                pageNo: pageNo,
                                pageSize: pager.getAttr("pageSize")
                            };
                            that._getSelectData(page);
                            event.stopPropagation();
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
            if(this.options.dataSetId) {
                return Page.manager.components[this.options.dataSetId];
            }
            else if(this.options.url) {
                if(!this.dataSet) {
                    this.dataSet = Page.create("dataSet", {
                        fetchUrl: this.options.url,
                        model: {
                            mainAlias: this.options.mainAlias
                        }
                    });
                }
                return this.dataSet;
            }
        },
        getTemplate: function () {
            return template;
        },
        getDisplay: function() {
            var vm = this._getCompVM();
            return vm.display;
        },
        //设置选中项，参数为{value|display}或者[{value|display}]
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
                if(vm.selectedEvent && "function"==typeof vm.selectedEvent) {
                    var res = vm.selectedEvent(value, display, this);
                    if(res == false) {
                        return;
                    }
                }
            }
        },
        clearSelect: function() {
            var vm = this._getCompVM();
            vm.removeAll(vm.vid);
        },
        reloadSelectData: function() {
            this._renderPanel();
        },

        //设置值，参数为{value|display}
        setValue: function(value , notFireFormValueChangeEvent) {
            if(!value) return;
            this.parent(value, notFireFormValueChangeEvent);
            //修改选中项
            var vm = this._getCompVM();
//            if(vm.multi || !vm.searchable) {
            if(true) {
                var splitChar = this.options.$split;
                var valueArr = value.value ? value.value.split(splitChar) : [];
                var displayArr = value.display ? value.display.split(splitChar) : [];
                //vm.selectedItems.clear();
                var array = [];
                for(var i=0; i<valueArr.length; i++) {
                    var item = {};
                    item[this.options.$valueField] = valueArr[i];
                    item[this.options.$textField] = displayArr[i];
                    array.push(item);
                }
                vm.selectedItems = array;
            }
            if(vm.selectedEvent && "function"==typeof vm.selectedEvent) {
                var res = vm.selectedEvent(this.getValue(), this.getDisplay(), this);
                if(res == false) {
                    return;
                }
            }
        },
        reset: function () {
            this.setValue({
                value: this.getInitValue(),
                display: this.getInitDisplay()
            });
        },
        _valueChange: function (value) {
            this.setAttr("display", value);
        },
        _getInputElement: function () {
            var input = jQuery(this.getElement()).find('input');
            return input;
        },
        focus: function () {
            //console to invoke this method is not ok...
            var input = this._getInputElement();
            avalon.nextTick(function () {
                input.focus();
            });
            this._getCompVM().focused = true;
        },
        blur: function () {
            var input = this._getInputElement();
            avalon.nextTick(function () {
                input.blur();
            });
            this._getCompVM().focused = false;
        },
        _valueChange:function(){//值改变时校验
            this.validate();
        },
        destroy: function() {
            if(this.options.pagination) {
                this.options.pagination.destroy();
            }
            if(this.dataSet) {
                this.dataSet.destroy();
            }
            this.parent();
        }
    });
    ComboBoxWidget.xtype = xtype;
    return ComboBoxWidget;
});