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

            focused: false,
            quickSearchArr: [],  //快速查询的选中项
            viewSearchArr: [],  //视图查询选中项
            customSearchArr: [], //自定义查询选中项
            tipsArr: [],
            showPanel: "",   // quickPanel | viewPanel
            showTips: false,  //查询条件详情面板显示控制
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

            getCmpMgr: function() {
                return Page.manager.components[this.vid];
            }


        },
        initialize: function (opts) {
            if (opts && opts.value && opts.display) {

            }

            //处理Control模型数据：1、判断哪些字段可以快速查询
            this._handleControlsData(opts.controls);
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
        },
        _handleControlsData: function(controls) {
            if(controls) {
                for(var i=0; i<controls.length; i++) {
                    var fieldModel = controls[i];
                    if(undefined == fieldModel.quickSearch) {
                        if(fieldModel.xtype == "input") {
                            fieldModel.quickSearch = true;
                        }
                    }
                }
            }
        },
        _getCompVM: function() {
            var vid = this.options.vid;
            return avalon.vmodels[vid]
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