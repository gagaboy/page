/**
 * Created by BIKUI on 15/4/23.
 */
define(['../Base', 'text!./CustomSearcherWidget.html', 'css!./CustomSearcherWidget.css'
    ,'css!../../../lib/bootstrap/css/plugins/chosen/chosen.css'], function (Base, template) {
    var xtype = "customSearcher";
    var CustomSearcherWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            value: null,
            dataSetId: null,
            groupOper: "or", //条件分组之间的连接符
            autoSubmit: true, //自动提交查询条件
            matchAllFields: false,//查询条件是否匹配所有字段
            controls: [],
            builderLists: null,
            dataSetId: null,

            focused: false,
            quickSearchArr: [],  //快速查询的选中项
            viewSearchArr: [],  //视图查询选中项
            customSearchArr: [], //自定义查询选中项
            tipsArr: [],
            fragmentArr: [],
            viewsArr: [{viewId: "testView1", viewName: "查询方案（默认）", defaultView: "1", viewValue: [
                {"name": "stuName", "nameDisplay": "姓名", "value": "234", "valueDisplay": "234", "builder": "notequal", "builderDisplay": "不等于", "group": "1"},
                {"show": false, "name": "stuName", "nameDisplay": "姓名", "value": "234", "valueDisplay": "234", "builder": "notequal", "builderDisplay": "不等于", "group": "1"},
                {"name": "stuSex", "nameDisplay": "性别", "value": "1", "valueDisplay": "男", "builder": "equal", "builderDisplay": "不、等于", "group": "1"}
            ]},{viewId: "testView2", viewName: "test", defaultView: "0", viewValue: [
                {"name": "stuName", "nameDisplay": "姓名", "value": "234", "valueDisplay": "234", "builder": "notequal", "builderDisplay": "不等于", "group": "1"},
                {"show": false, "name": "stuName", "nameDisplay": "姓名", "value": "234", "valueDisplay": "234", "builder": "notequal", "builderDisplay": "不等于", "group": "1"},
                {"name": "stuSex", "nameDisplay": "性别", "value": "1", "valueDisplay": "男", "builder": "equal", "builderDisplay": "不、等于", "group": "1"}
            ]}], //查询视图的数据
            viewSelectedIndex: null,

            showPanel: "",   // quickPanel | viewPanel
            showTips: false,  //查询条件详情面板显示控制
            customSearchPanel: true, //控制自定义查询区域面板
            saveViewPanel: true,  //控制保存视图区域面板

            searchValue: "", //查询输入值
            inputWidth: 25, //查询输入框的宽度
            iconShowIndex: null,  //删除图标显示控制
            QuickSearchShow: false,
            customSearchShow: false,
            clearShow: false,  //清空图标是否显示
            searchSubmit: null,

            searcherFocus: function (vid, span) {
                var vm = avalon.vmodels[vid];
                vm.focused = true;
                jQuery(this).find('input').focus();

            },
            inputFocus: function(vid, $event) {
                var vm = avalon.vmodels[vid];
                vm.focused = true;
                vm.clickItem = false;

            },
            showClearIcon: function(vid, $event) {
                var vm = avalon.vmodels[vid];
                vm.clearShow = true;
            },
            displayClearIcon: function(vid, $event) {
                var vm = avalon.vmodels[vid];
                vm.clearShow = false;
            },
            showRemoveIcon: function(vid, index, $event) {
                var vm = avalon.vmodels[vid];
                vm.iconShowIndex = index;
            },
            displayRemoveIcon: function(vid, $event) {
                var vm = avalon.vmodels[vid];
                vm.iconShowIndex = null;
            },
            keyDown: function (vid, e) {
                var vm = avalon.vmodels[vid];
                var maxWidth = jQuery(this).parent().parent().width();
                //删除已选项（如果是删除且输入区域为字符串长度为1）  键按下触发优先于值改变 vm.searchValue.length==1
                if (e.keyCode == 8 && vm.searchValue=="" ) {
                    var cmpMgr = vm.getCmpMgr();

                    //删除选中的快速查询项|视图查询项|自定义查询项
                    if(vm.quickSearchArr.length > 0) {
                        var el = vm.quickSearchArr.pop();
                    }
                    else {
                       vm.viewSearchArr.clear();
                        vm.viewSelectedIndex = null;
                    }
                    vm.showPanel = "";
                }
                else {
                    vm.showPanel = "quickPanel";
                }
                vm.showTips = false;
                var selected = jQuery(this).parent().find("div");
                for (var i = 0, len = selected.length; i < len; i++) {
                    maxWidth = maxWidth - selected[i].offsetWidth - 8;
                }

                var inputWidth = jQuery(this).val().length * 7 + 25;
                if (inputWidth > maxWidth) {
                    inputWidth = maxWidth;
                }
                vm.inputWidth = inputWidth;


            },

            selectQuickItem: function(vid, el, event) {
                var vm = avalon.vmodels[vid];
                var searchValue = vm.searchValue;
                if(!searchValue) return;
                var inArr = false;
                //如果字段已被选中，则追加value即可；否则新增
                for(var i=0; i<vm.quickSearchArr.length; i++) {
                    if(vm.quickSearchArr[i].bindField == el.bindField) {
                        vm.quickSearchArr[i].value.push(searchValue);
                        inArr = true;
                        break;
                    }
                }
                if(!inArr) {
                    vm.quickSearchArr.push({
                        label: el.label,
                        fieldName: el.fieldName,
                        bindField: el.bindField,
                        value: [searchValue]
                    });
                }
            },

            removeItem: function(vid, type, event, item, index) {
                var vm = avalon.vmodels[vid];
                if("quickSearch" == type) {
                    vm.quickSearchArr.removeAt(index);
                }
                else if("viewSearch" == type) {
                    vm.viewSearchArr.clear();
                    vm.viewSelectedIndex = null;
                }
                else {
                    vm.customSearchArr.clear();
                }
                vm.showTips = false;

                event.stopPropagation();
            },
            removeAll: function(vid, event) {
                event && event.stopPropagation();
                var vm = vid ? avalon.vmodels[vid] : this;
                vm.quickSearchArr.clear();
                vm.viewSearchArr.clear();
                vm.customSearchArr.clear();
                vm.showTips = false;
                vm.viewSelectedIndex = null;
            },
            showTipsPanel: function(vid, type, event) {
                var vm = vid ? avalon.vmodels[vid] : this;
                if(vm.showPanel=="viewPanel") return;   //如果视图面板展开了，Tips
                if("viewSearch" == type) {
                    vm.tipsArr = vm.viewSearchArr[0].viewValue;
                }
                else if("customSearch" == type) {
                    vm.tipsArr = vm.customSearchArr;
                }
                vm.showTips = true;
            },

            selectView: function(vid, el, index, event) {
                var vm = vid ? avalon.vmodels[vid] : this;
                vm.viewSearchArr = [el.$model];
                vm.viewSelectedIndex = index;
                event.stopPropagation();
            },
            deleteView: function(vid, el, index, event) {
                var vm = vid ? avalon.vmodels[vid] : this;
                //发送删除查询方案请求

                //如果该方案已被选中，则清空

                //放入回调中
                if(vm.viewSearchArr.length>0 && vm.viewSearchArr[0].viewName == el.viewName) {
                    vm.viewSearchArr.clear();
                    vm.viewSelectedIndex = null;
                }
                vm.viewsArr.removeAt(index);
                //切换选中项，数组长度发生变化
                if(vm.viewSelectedIndex == index) {
                    vm.viewSelectedIndex = null;
                }
                else if(vm.viewSelectedIndex > index) {
                    vm.viewSelectedIndex--;
                }

                event.stopPropagation();
            },
            saveView: function(vid, event) {
                var vm = vid ? avalon.vmodels[vid] : this;
                if(!Page.manager.components.viewName.isValid()) {
                    Page.dialog.alert("请填写查询视图的名称后，再作保存！");
                    return;
                }
                var viewName = Page.manager.components.viewName.getValue();
                var defaultView = "0";
                var checkBoxArr = Page.manager.components.defaultView.getValue();
                if(checkBoxArr.length>1) {
                    defaultView = "1";
                }
                // TODO 获取条件值


            },
            toggleCustomPanel: function(vid, type, event) {
                var vm = vid ? avalon.vmodels[vid] : this;
                if('customPanel' == type) {
                    vm.customSearchPanel = !vm.customSearchPanel;
                }
                else if("saveViewPanel" == type) {
                    vm.saveViewPanel = !vm.saveViewPanel;
                }
            },
            _renderView: function() {
                var ds = this._getDataSet();
                if(!ds) return;
                //发送获取数据请求
                var that = this;
                Promise.all([ds.fetch()]).then(function() {

                    that._preProcessView();
                });
            },
            _preProcessView: function() {
                var ds = this._getDataSet();
                var vm = this;
                var views = ds.getValue();
                var viewData;
                if(views) {
                    //处理defaultView
                    for(var i=0; i<views.length; i++) {
                        //处理defaultView
                        if(views[i].defaultView == "1") {
                            viewData = views[i];
                            vm.viewSearchArr.push(views[i]);
                            vm.viewSelectedIndex = i;
                            break;
                        }
                    }
                    vm.viewsArr = views;
                    //TODO 渲染自定义查询

                }
                //渲染保存视图面板
                Page.create("input", {
                    $parentId: 'viewName',
                    $id: 'viewName',
                    value: viewData ? viewData.viewName:"",
                    required: true,
                    showLabel: false,
                    showErrorMessage: true
                }).render();
                Page.create('checkbox', {
                    $parentId: 'defaultView',
                    $id: 'defaultView',
                    showLabel: false,
                    required: false,
                    showErrorMessage: false,
                    items: [{
                        value: '1',
                        display: '默认方案',
                        checked: viewData ? true:false
                    }]
                }).render();
            },
            addCustomFilter: function(vid, initData) {
//                initData = {"name": "stuSex", "nameDisplay": "性别", "value": "1", "valueDisplay": "男", "builder": "contain", "builderDisplay": "包含", "group": "1"};
                var vm = vid ? avalon.vmodels[vid] : this;
                if(undefined == vm.filterIndex)
                    vm.filterIndex = 0;
                var index = vm.filterIndex++;
                var fragmentId = "filterIndex_"+index;
                vm.fragmentArr.push(fragmentId);
                //创建DS
                Page.create("dataSet", {
                    $id: 'operSelectDs_'+index
                });

                //增加行片段
                var fragment = Page.create("fragment", {
                    $id: fragmentId,
                    $parentId: fragmentId,
                    items: [{
                        $xtype: 'col',
                        md: 4,
                        items: [{
                            $id: 'field_'+index,
                            $xtype: 'combobox',
                            showLabel: false,
                            multi: false,
                            value: "",
                            display: "",
                            dataSetId: "fieldSelectDs",
                            showErrorMessage:true,
                            required:true,
                            selectedEvent: function(value, display, obj) {
                                //重新刷新操作符的下拉面板数据
                                var fieldModel = vm.$fieldMap[value];
                                var operSelectDs = vm.getCmpMgr('operSelectDs_'+index);
                                operSelectDs.setData(vm.builderLists[fieldModel.builderList].$model);
                                var operObj = Page.manager.components['oper_'+index];
                                operObj.clearSelect();
                                operObj.reloadSelectData();
                                //重新渲染值选择
                                var rowObj = Page.manager.components[fragmentId];
                                var valColObj = Page.manager.components[rowObj.itemsArr[2]];
                                if(valColObj.itemsArr.length>0) {
                                    valColObj.removeItem(0);
                                }

                                fieldModel.id = 'value_'+index;
                                valColObj.addItem(fieldModel);
                            }
                        }]
                    },{
                        $xtype: 'col',
                        md: 4,
                        items: [{
                            $id: 'oper_'+index,
                            $xtype: 'combobox',
                            showLabel: false,
                            multi: false,
                            searchable: false,
                            value: "",
                            display: "",
                            valueField: "name",
                            textField: "caption",
                            dataSetId: 'operSelectDs_'+index,
                            showErrorMessage:true,
                            required:true
                        }]
                    },{
                        $xtype: 'col',
                        md: 4,
                        items: initData ? [] : [{
                            $id: 'value_'+index,
                            $xtype: 'input',
                            showLabel: false}]
                    }]
                }).render();

                //初始化值
                if(!initData) return;
                var fieldObj = Page.manager.components['field_'+index];
                fieldObj.setValue({value: initData.name, display: initData.nameDisplay});
                var operObj = Page.manager.components['oper_'+index];
                operObj.setValue({value: initData.builder, display: initData.builderDisplay});
                var valueObj = Page.manager.components['value_'+index];
                valueObj.setValue({value: initData.value, display: initData.valueDisplay});
            },
            removeCustomFilter: function(vid, el, index, $event) {
                var vm = vid ? avalon.vmodels[vid] : this;
                vm.fragmentArr.removeAt(index);
                //销毁行内所有组件
                vm.getCmpMgr(el).destroy();

            },
            _getDataSet: function() {
                return Page.manager.components[this.dataSetId];
            },
            getCmpMgr: function(vid) {
                return Page.manager.components[vid ? vid:this.vid];
            }


        },
        initialize: function (opts) {
            if (opts && opts.value && opts.display) {

            }

            //处理Control模型数据：1、判断哪些字段可以快速查询
            this._handleControlsData(opts);
            this.parent(opts);

            var that = this;
            //点击其它区域，隐藏掉下拉面板
            jQuery(document).click(function(event) {
                var name = "CustomSearcherWidget_"+that.options.vid;
                if(!jQuery(event.target).closest("[name='"+name+"']").length) {
                    var vm = that._getCompVM();
                    vm.showPanel = "";
                    vm.focused = false;
                    vm.showTips = false;
                    vm.searchValue = "";
                }
            });

            var vm = this._getCompVM();
            vm._renderView();
        },
        _handleControlsData: function(opts) {
            if(opts.controls) {
                var quickType = ["input", "textarea", "slider"];
                opts.$fieldMap = {};
                opts.$fieldSelectData = [];
                for(var i=0; i<opts.controls.length; i++) {
                    var fieldModel = opts.controls[i];
                    if(undefined == fieldModel.quickSearch) {
                        if(quickType.contains(fieldModel.xtype)) {
                            fieldModel.quickSearch = true;
                        }
                    }
                    var bindField = fieldModel.bindField;
                    var label = fieldModel.label;
                    opts.$fieldSelectData.push({
                        value: bindField,
                        display: label
                    });
                    opts.$fieldMap[fieldModel.bindField] = fieldModel;

                }
                //创建字段选择的下拉框DS
                Page.create("dataSet", {
                    $id: 'fieldSelectDs',
                    data: opts.$fieldSelectData
                });

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
        }
    });
    CustomSearcherWidget.xtype = xtype;
    return CustomSearcherWidget;
});