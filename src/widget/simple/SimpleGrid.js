/**
 * Created by qianqianyi on 15/5/8.
 */
define(['../Base', 'text!./SimpleGridWidget.html', 'css!./SimpleGridWidget.css'], function (Base, template) {
    var xtype = "simpleGrid";
    var SimpleGridWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            columns: [],
            data: [],
            idField:"wid",
            allChecked: false,//设置为true，则默认全部选中
            usePager:true,
            pageSize:10,
            totalNum:0,
            totalPage:1,
            opColumn: {},
            //事件
            beforeCheckRow:null,
            afterCheckRow:null,

            allClick: function (vid, element) {
                var vm = avalon.vmodels[vid];
                for (var i = 0; i < vm.data.$model.length; i++) {
                    vm.data[i]['checked'] = element.checked;
                }
                vm.allChecked = element.checked;
            },
            checkRow: function (vid,row) {
                var vm = avalon.vmodels[vid];
                if(vm.beforeCheckRow&&!row.checked){
                    vm.beforeCheckRow(row);//选中前事件
                }
                row.checked = !row.checked;//不设置双向绑定 ms-duplex-checked="a['checked']"
                if(vm.afterCheckRow&&row.checked){
                    vm.afterCheckRow(row);//选中后事件
                }
                var all = true;
                for (var i = 0; i < vm.data.$model.length; i++) {
                    if (!vm.data[i]['checked']) {
                        all = false;
                        break;
                    }
                }
                vm.allChecked = all;
            },
            deleteRow: function (vid,row) {
                //删除行，remove掉
                row = null;
                var upFlag = false;
                for (var i = 0; i < vm.data.$model.length; i++) {
                    if (!vm.data[i]&&(i+1)<vm.data.$model.length) {
                        vm.data[i] = vm.data[i+1];
                        upFlag = true;
                    }else if((i+1)<vm.data.$model.length){
                        vm.data[i] = vm.data[i+1];
                    }
                }
                vm.data.length--;
                vm.data.$model.length--;
                var all = true;
                for (var i = 0; i < vm.data.$model.length; i++) {
                    if (!vm.data[i]['checked']) {
                        all = false;
                        break;
                    }
                }
                vm.allChecked = all;
            }
        },
        pagination:null,//分页条对象
        initialize: function (opts) {
            var d = opts.data;
            for (var i = 0; i < d.length; i++) {
                if (d[i].checked == undefined) {
                    d[i].checked = false;
                }
            }
            this.parent(opts);
        },
        render:function(){
            this.parent();
            this.pagination = Page.create("pagination", {
                $parentId: "pager_" + this.getAttr("vid"),
                totalNum: this.getAttr("totalNum"),
                pageChangeEvent: function (pager) {
                    var newDataCallBack = function(data,totalNum,pageSize){//回调
                        this.setAttr("data",data);
                        this.setAttr("totalNum",totalNum);
                        this.setAttr("pageSize",pageSize);
                    }
                    //this.dataSet.readRecord(pageIndex,newDataCallBack);// 调用dataset接口进行查询
                }
            });
            this.pagination.render();

        },
        getCheckedRows: function () {
            var arr = [];
            var datas = this.getAttr('data');
            for (var i = 0; i < datas.length; i++) {
                if (datas[i]['checked']) {
                    arr.push(datas[i]);
                }
            }
            return arr;
        },
        addRow:function(rowData,pos){//{}则表示新增空行,pos指新增位置，表示放到第几行，默认表示最后一行
            var pSize = this.getAttr("pageSize");
            var datas = this.getAttr("data");
            if(pos&&pos>0&&pos<(pSize+2)){
                var newDataArr = [];
                for(var t=0;t<pSize;t++){
                    if(t==(pos-1)){
                        newDataArr.push(rowData);
                        if(datas[t]){
                            newDataArr.push(datas[t]);
                        }
                    }else if(datas[t]){
                        newDataArr.push(datas[t]);
                    }
                }
                this.setAttr("data",newDataArr);
            }else{
                this.getAttr("data").push(rowData);
            }
            this._updateAllCheckedByDatas();
        },
        deleteRow: function (row) {
            //删除行，remove掉
            row = null;
            var upFlag = false;
            var datas = this.getAttr("data");
            for (var i = 0; i < datas.length; i++) {
                if (!datas[i]&&(i+1)<datas.length) {
                    datas[i] = datas[i+1];
                    upFlag = true;
                }else if((i+1)<datas.length){
                    datas[i] = datas[i+1];
                }
            }
            datas.length--;
            this._updateAllCheckedByDatas();
        },
        deleteCheckRows: function () {
            //删除行，remove掉

            this._updateAllCheckedByDatas();
        },
        getTemplate: function () {
            return template;
        },
        _updateAllCheckedByDatas:function(){
            var datas = this.getAttr("data");
            var all = true;
            for (var i = 0; i < datas.length; i++) {
                if (!datas[i]['checked']) {
                    all = false;
                    break;
                }
            }
            this.setAttr("allChecked",all);
        },
        _totalNumChange:function(totalNum){
            this.pagination.setAttr("totalNum",totalNum);
        },
        _pageSizeChange:function(pageSize){
            this.pagination.setAttr("pageSize",pageSize);
        }

    });
    SimpleGridWidget.xtype = xtype;
    return SimpleGridWidget;
})