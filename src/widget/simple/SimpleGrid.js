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
            activeRow:null,
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
            activeRow:function(vid,row){
                var vm = avalon.vmodels[vid];
                vm.activeRow = row;
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
                var vm = avalon.vmodels[vid];
                row = null;
                var nArr = [];
                for (var i = 0; i < vm.data.length; i++) {
                    if (vm.data[i]) {
                        nArr.push(vm.data[i]);
                    }
                }
                vm.data = nArr;
                //重新判断全选属性
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
            if(opts.allChecked){//默认全部勾选
                for (var i = 0; i < d.length; i++) {
                    if (d[i]) {
                        d[i].checked = true;
                    }
                }
            }else{
                for (var i = 0; i < d.length; i++) {
                    if (d[i].checked == undefined) {
                        d[i].checked = false;
                    }
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
        /**
         * 获取勾选的行，数组
         */
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
        /**
         * 获取当前激活的行，鼠标点击的行
         */
        getActiveRow:function(){
            return this.getAttr("activeRow");
        },
        /**
         * 新增一行数据
         */
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
        /**
         * 删除某行
         */
        deleteRow: function (row) {
            //删除行，remove掉
            row = null;
            var upFlag = false;
            var datas = this.getAttr("data");
            this.setAttr("data",this._formArr(datas));
            this._updateAllCheckedByDatas();
        },
        /**
         * 根据主键删除某行
         */
        deleteRowByDataId: function (dataId) {
            if(dataId&&this.getAttr("idField")){
                var idField = this.getAttr("idField");
                var datas = this.getAttr("data");
                for (var i = 0; i < datas.length; i++) {
                    if(datas[i]&&datas[i][idField]
                    &&datas[i][idField]==dataId){
                        datas[i] = null;
                    }
                }
                this.setAttr("data",this._formArr(datas));
            }
            this._updateAllCheckedByDatas();
        },
        /**
         * 删除当前行
         */
        deleteActiveRow: function () {
            //删除行，remove掉
            var datas = this.getAttr("data");
            var acRow = this.getActiveRow();
            if(acRow){
                for(var s=0;s<datas.length;s++){
                    if(datas[s]&&acRow==datas[s]){
                        datas[s] = null;
                        this.setAttr("data",this._formArr(datas));
                        this._updateAllCheckedByDatas();
                        break;
                    }
                }
            }
        },
        /**
         * 删除选中的行
         */
        deleteCheckedRows: function () {
            //删除行，remove掉
            var datas = this.getAttr("data");
            var cdatas = this.getCheckedRows();
            for(var s=0;s<datas.length;s++){
                for (var i = 0; i < cdatas.length; i++) {
                    if(datas[s]&&cdatas[i]&&cdatas[i]==datas[s]){
                        datas[s] = null;
                    }
                }
            }
            this.setAttr("data",this._formArr(datas));
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
        },
        _formArr:function(arr){
            if(arr){
                var nArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]) {
                        nArr.push(arr[i]);
                    }
                }
                arr = nArr;
            }
            return arr;
        }

    });
    SimpleGridWidget.xtype = xtype;
    return SimpleGridWidget;
})