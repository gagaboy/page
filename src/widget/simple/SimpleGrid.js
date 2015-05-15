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
            dataSetId: null,//数据集
            queryParams:null,
            idField:"wid",
            showCheckbox:true,
            checkboxWidth:"10%",
            allChecked: false,//设置为true，则默认全部选中
            //分页信息
            usePager:true,
            pageSize:10,
            totalNum:0,
            totalPage:1,
            //操作列
            opColumn: {},
            opTitle:"操作",
            opWidth:"15%",
            //行编辑
            canEdit:true,//是否可编辑
            dbClickToEditRow:false,//双击编辑行
            clickToEditField:true,//单击编辑事件
            editRowFunc:null,//编辑行事件
            editFieldFunc:null,//编辑单属性事件
            //事件
            afterCheckRow:null,
            onChangeOrder:null,

            //中间参数，不可初始化
            activedRow:null,//激活的行
            editComp:null,//行编辑对象
            activedRowDom:null,//行编辑Dom
            allClick: function (vid, element) {
                var vm = avalon.vmodels[vid];
                vm.allChecked = !vm.allChecked;
                var datas = vm.data;
                for (var i = 0; i < datas.length; i++) {
                    datas[i]['checked'] = vm.allChecked;
                }
                vm.data = datas;
            },
            activeRow:function(vid,row,rowObj){
                var vm = avalon.vmodels[vid];
                vm.activedRow = row;
                vm.activedRowDom = rowObj;
            },
            checkRow: function (vid,row) {
                row.checked = !row.checked;
                var vm = avalon.vmodels[vid];
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
            sortByCol:function(vid,row,orderType){
                var vm = avalon.vmodels[vid];
                row.orderType = orderType;
                if(vm.onChangeOrder){
                    vm.onChangeOrder(vm,row,orderType);
                }else{
                    var grid = Page.manager.components[vid];
                    grid.reloadData();// 调用dataset接口进行查询
                }
            },
            editRow:function(vid,row,rowDom){
                var vm = avalon.vmodels[vid];
                if(vm.editRowFunc){
                    vm.editRowFunc(vm,row,rowDom);
                }
            },
            editField:function(vid,row,fieldName,fieldXtype,tdDom){
                var vm = avalon.vmodels[vid];
                if(vm.editFieldFunc){
                    vm.editFieldFunc(vm,row,fieldName,fieldXtype,tdDom);
                }
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
            this.parent(this._formatOptions(opts));
        },
        render:function(){
            this.parent();
            var that = this;
            this.pagination = Page.create("pagination", {
                $parentId: "pager_" + this.getAttr("vid"),
                totalNum: this.getAttr("totalNum"),
                pageSize: this.getAttr("pageSize"),
                pageChangeEvent: function (pager) {
                    that.reloadData()// 调用dataset接口进行查询
                }
            });
            this.pagination.render();
        },
        reloadData:function(){
            var ds = this._getDataSet();
            if(!ds) return;
            //配置分页信息
            if(this.getAttr("usePager")){
                ds.setAttr("pageNo",this.getAttr("pageIndex"));
                ds.setAttr("pageSize",this.getAttr("pageSize"));
                ds.setAttr("pageNo",this.getAttr("pageIndex"));
            }
            //配置查询条件
            var fetchParams = {};
            if(this.getAttr("queryParams")){
                jQuery.extend(fetchParams,this.getAttr("queryParams"));
            }
            var columns = this.getAttr("columns");
            if(columns&&columns.length>0){
                var orders = {};
                for(var k=0;k<columns.length;k++){
                    if(columns[k].orderType){
                        orders[columns[k].dataField] = columns[k].orderType;
                    }
                }
                fetchParams.orders = orders;
            }
            ds.setAttr("fetchParam",fetchParams);
            //发送获取数据请求
            var that = this;
            Promise.all([ds.fetch()]).then(function() {
                that.setAttr("data",ds.getValue());
                that.setAttr("totalNum",ds.getTotalSize());
                that.setAttr("pageSize",ds.getPageSize());
                that.setAttr("pageIndex",ds.getPageNo());
            });
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
            return this.getAttr("activedRow");
        },
        getActiveRowDom:function(){
            return this.getAttr("activedRowDom");
        },
        /**
         * 新增一行数据
         */
        addRow:function(rowData,pos){//{}则表示新增空行,pos指新增位置，表示放到第几行，默认表示最后一行
            var datas = this.getAttr("data");
            var pSize = datas.length;
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
        _getDataSet: function() {
            return Page.manager.components[this.getAttr("dataSetId")];
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

        _dataChange:function(){
            //this._updateAllCheckedByDatas();
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
        },
        _formatOptions:function(opts){
            var d = opts.data;
            //是否默认全部勾选
            if(opts.allChecked){
                for (var i = 0; i < d.length; i++) {
                    if (d[i]) {
                        d[i].checked = true;
                    }
                }
            }else{
                for (var i = 0; i < d.length; i++) {
                    if (d[i].checked == undefined) {
                        d[i].checked = false;//未设置，默认不选中
                    }
                }
            }
            //列信息
            var cols = opts.columns;
            if(cols&&cols.length>0){
                for (var i = 0; i < cols.length; i++) {
                    if (cols[i]) {
                        var coli = cols[i];
                        if(!coli.orderType){
                            coli.orderType = "";
                        }
                        if(!coli.type){
                            coli.xtype = "input";
                        }
                    }
                }
            }
            return opts;
        }

    });
    SimpleGridWidget.xtype = xtype;
    return SimpleGridWidget;
})