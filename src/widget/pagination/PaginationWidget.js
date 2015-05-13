/**
 * Created by hhxu on 15/5/11.
 */
//define(['../BaseFormWidget', 'text!./ComboBoxWidget.html', 'css!./ComboBoxWidget.css'], function (BaseFormWidget, template) {
define(['../Base', 'text!./PaginationWidget.html', 'css!./PaginationWidget.css'], function (Base, template) {
    var xtype = "pagination";
    var PaginationWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,//类型
            totalNum: 0,//总数据数
            pageSize: 10,//每页条数
            pageIndex: 1,//当前页，默认显示第一页

            totalPage: 0,//总页数,计算所得，设置无效
            recordBegin: 1,//显示从第几条开始,计算所得，设置无效
            recordTo: 10,//显示到第几条,计算所得，设置无效

            showPageIndexInput: true,//显示跳转到某页输入框
            showPageSizeInput: true,//显示每页条数输入框]
            showFirstPage: true,//显示第一页按钮
            showLastPage: true,//显示最后一页按钮
            showPreviousAndNextPage: true,//显示上一页和下一页按钮
            showPageDetail: true,//显示分页详情
            //showTipWhenNull: true,//无数据时显示提示信息
            pageChangeEvent: null,
            goFirstPage: function (vid) {
                var vm = avalon.vmodels[vid];
                vm.goPage(vid, 1);
            },
            goLastPage: function (vid) {
                var vm = avalon.vmodels[vid];
                vm.goPage(vid, vm.totalPage);
            },
            goPreviousPage: function (vid) {
                var vm = avalon.vmodels[vid];
                if (vm.pageIndex > 1) {
                    vm.goPage(vid,vm.pageIndex - 1);
                }
            },
            goNextPage: function (vid) {
                var vm = avalon.vmodels[vid];
                if (vm.pageIndex < vm.totalPage) {
                    vm.goPage(vid, vm.pageIndex + 1);
                }
            },
            goPage: function (vid, pindex) {
                var vm = avalon.vmodels[vid];
                if (pindex > 0 && pindex < (vm.totalPage + 1)) {
                    vm.pageIndex = pindex;
                }
            }
        },
        initialize: function (opts) {
            this.parent(opts);
            if (this.getAttr("totalNum")) {
                //计算totalPage
                this._calculateTotalPage();
                this._calculateBeginAndTo();
            }
        },
        getTemplate: function () {
            return template;
        },
        show: function () {
            this.setAttr("show", true);
        },
        hide: function () {
            this.setAttr("show", false);
        },
        _pageIndexChange: function (pindex, oldIndex, model) {
            this.options.pageChangeEvent(this, pindex, oldIndex, model);
            this._calculateBeginAndTo();
        },
        _totalNumChange: function (tNum, oldNum, model) {
            this._calculateTotalPage();
            this._calculateBeginAndTo();
        },
        _pageSizeChange: function (tNum, oldNum, model) {
            this._calculateTotalPage();
            this._calculateBeginAndTo();
        },
        _calculateTotalPage: function () {
            if (this.getAttr("totalNum") && this.getAttr("pageSize")) {
                var _totalPage = this.getAttr("totalNum") % this.getAttr("pageSize") == 0 ? (this.getAttr("totalNum") / this.getAttr("pageSize")) : parseInt(this.getAttr("totalNum") / this.getAttr("pageSize")) + 1
                this.setAttr("totalPage",_totalPage);
            }
        },
        _calculateBeginAndTo: function () {
            if (this.getAttr("pageIndex") && this.getAttr("pageSize")) {
                var _startNum = this.getAttr("pageSize")*(this.getAttr("pageIndex")-1)+1;
                var _endNum = this.getAttr("pageSize")*this.getAttr("pageIndex");
                this.setAttr("recordBegin",_startNum);
                this.setAttr("recordTo",_endNum>this.getAttr("totalNum")?this.getAttr("totalNum"):_endNum);
            }
        }

    });
    PaginationWidget.xtype = xtype;
    return PaginationWidget;
});