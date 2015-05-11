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
            totalNum:0,//总数据数
            pageSize:10,//每页条数
            totalPage:0,//总页数,计算所得，设置无效
            pageIndex:1,//当前页，默认显示第一页
            recordBegin:1,//显示从第几条开始
            recordTo:10,//显示到第几条

            showPageIndexInput:true,//显示跳转到某页输入框
            showPageSizeInput:true,//显示每页条数输入框

            showFirstPage:true,//显示第一页按钮
            showLastPage:true,//显示最后一页按钮
            showPreviousAndNextPage:true,//显示上一页和下一页按钮

            showPageDetail:true,//显示分页详情
            showTipWhenNull:true,//无数据时显示提示信息
            pageChangeEvent:null,
            goFirstPage:function(vid){
                var vm = avalon.vmodels[vid];
                vm.goPage(vid,1);
            },
            goLastPage:function(vid){
                var vm = avalon.vmodels[vid];
                vm.goPage(vid,vm.totalPage);
            },
            goPreviousPage:function(){
                var vm = avalon.vmodels[vid];
                if(vm.pageIndex>1){
                    vm.goPage(vm.pageIndex-1);
                }
            },
            goNextPage:function(vid){
                var vm = avalon.vmodels[vid];
                if(vm.pageIndex<vm.totalPage){
                    vm.goPage(vid,vm.pageIndex+1);
                }
            },
            goPage:function(vid,pindex){
                var vm = avalon.vmodels[vid];
                if(pindex>0&&pindex<vm.totalPage){
                    vm.pageIndex = pindex;
                }
            }
        },
        initialize: function (opts) {
            this.parent(opts);
            if(this.getAttr("totalNum")){
                //计算totalPage
                this.setAttr("totalPage",12);
            }
        },
        _pageIndexChange:function(pindex,oldIndex,model){
            this.options.pageChangeEvent(this,pindex,oldIndex,model);
        },
        _totalNumChange:function(tNum,oldNum,model){
            this.setAttr("totalPage",12);
        },
        _pageSizeChange:function(tNum,oldNum,model){
            this.setAttr("totalPage",12);
        },
        getTemplate: function () {
            return template;
        }

    });
    PaginationWidget.xtype = xtype;
    return PaginationWidget;
});