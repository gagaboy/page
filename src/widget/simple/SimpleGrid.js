/**
 * Created by qianqianyi on 15/5/8.
 */
define(['../Base',"../../data/DataConstant", 'text!./SimpleGridWidget.html', 'css!./SimpleGridWidget.css'], function (Base,Constant,template) {
    var xtype = "simpleGrid";
    var SimpleGridWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            columns: [],
            data: [],
            dataSetId: null,//数据集
            //queryParams:null,//查询条件
            idField:"wid",
            showCheckbox:true,
            checkboxWidth:"10%",
            allChecked: false,//设置为true，则默认全部选中
            //分页信息
            usePager:true,
            pageIndex:1,
            pageSize:15,
            totalNum:0,
            totalPage:1,
            showPageIndexInput: true,//显示跳转到某页输入框
            showPageSizeInput: true,//显示每页条数输入框]
            showFirstPage: true,//显示第一页按钮
            showLastPage: true,//显示最后一页按钮
            showPreviousAndNextPage: true,//显示上一页和下一页按钮
            showPageDetail: true,//显示分页详情
            //操作列
            opColumns:[],//{title:"操作",width:'10%',position:2,template:''}//position支持值为front、end和具体数字
            //行编辑
            canEdit:false,//是否可编辑
            dbClickToEditRow:false,//双击编辑行
            clickToEditField:true,//单击编辑事件
            editMultiRow:false,//同时编辑多行
            editRowFunc:null,//编辑行事件
            editFieldFunc:null,//编辑单属性事件
            //事件
            beforeSetData:null,//设置数据前
            afterSetData:null,//设置数据后
            beforeCheckRow:null,
            afterCheckRow:null,
            onChangeOrder:null,

            //中间参数，不可初始化
            opColumnMap:{},//操作列
            editCompMap:{},
            allColumns:[],
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
                var vm = avalon.vmodels[vid];
                if(vm.beforeCheckRow&&row.checked){
                    vm.beforeCheckRow(row);//选中后事件
                }
                row.checked = !row.checked;
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
            sortByCol:function(vid,col,orderType){
                var vm = avalon.vmodels[vid];
                col.orderType = orderType;
                if(vm.onChangeOrder){
                    vm.onChangeOrder(vm,col,orderType);
                }else{
                    var grid = Page.manager.components[vid];
                    grid.reloadData();// 调用dataset接口进行查询
                }
            },
            editRow:function(vid,row,rowDom){
                var vm = avalon.vmodels[vid];
                if(vm.editRowFunc){
                    vm.editRowFunc(vm,row,rowDom);
                }else{
                    var grid = Page.manager.components[vid];
                    grid._defaultEditRow(vm,row,rowDom);
                }
            },
            editField:function(vid,row,fieldName,fieldXtype,tdDom){
                var vm = avalon.vmodels[vid];
                if(vm.editFieldFunc){
                    vm.editFieldFunc(vm,row,fieldName,fieldXtype,tdDom);
                }else{
                    var grid = Page.manager.components[vid];
                    grid._defaultEditField(vm,row,fieldName,fieldXtype,tdDom);
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
            if(this.getAttr("usePager")){
                this.pagination = Page.create("pagination", {
                    $parentId: "pager_" + this.getAttr("vid"),
                    totalNum: this.getAttr("totalNum"),
                    pageIndex:this.getAttr("pageIndex"),
                    pageSize: this.getAttr("pageSize"),
                    showPageIndexInput: this.getAttr("showPageIndexInput"),//显示跳转到某页输入框
                    showPageSizeInput: this.getAttr("showPageSizeInput"),//显示每页条数输入框]
                    showFirstPage: this.getAttr("showFirstPage"),//显示第一页按钮
                    showLastPage: this.getAttr("showLastPage"),//显示最后一页按钮
                    showPreviousAndNextPage: this.getAttr("showPreviousAndNextPage"),//显示上一页和下一页按钮
                    showPageDetail: this.getAttr("showPageDetail"),//显示分页详情
                    pageChangeEvent: function (pager) {
                        that.reloadData()// 调用dataset接口进行查询
                    }
                });
                this.pagination.render();
            }
            if(!this.getAttr("data")||this.getAttr("data").length<1){
                this.reloadData();
            }else{
                this._renderEditComp();
            }

        },
        reloadData:function(){
            var ds = this._getDataSet();
            if(!ds) return;
            //配置分页信息
            if(this.getAttr("usePager")){
                ds.setAttr(Constant.pageNo,this.pagination?this.pagination.getAttr("pageIndex"):this.getAttr("pageIndex"));
                //到底叫什么名字？待删除
                ds.setAttr("pageNo",this.pagination?this.pagination.getAttr("pageIndex"):this.getAttr("pageIndex"));
                ds.setAttr(Constant.pageSize,this.pagination?this.pagination.getAttr("pageSize"):this.getAttr("pageSize"));
            }
            //配置查询条件
            var fetchParams = {};
            //===合并ds缓存的查询条件===
            var fetchParamy = ds.getAttr("fetchParam");
            if(fetchParamy) {
                jQuery.extend(fetchParams, fetchParamy);
            }
            //===新设置的查询条件===
            var columns = this.getAttr("columns");
            if(columns&&columns.length>0){
                var orders = "";
                for(var k=0;k<columns.length;k++){
                    if(columns[k].orderType){
                        if(orders!=""){
                            orders += ",";
                        }
                        orders += columns[k].orderType=="desc"?"-"+columns[k].dataField:"+"+columns[k].dataField;
                    }
                }
                if(orders!={}){
                    fetchParams.order = orders;
                }
            }
            ds.setAttr("fetchParam",fetchParams);

            //发送获取数据请求
            var that = this;
            Promise.all([ds.fetch()]).then(function() {
                var newDatas = ds.getValue();
                if(that.getAttr("beforeSetData")){
                    that.getAttr("beforeSetData")(newDatas);
                }
                that.setAttr("data",that._formatDatas(newDatas));
                if(that.pagination){
                    that.pagination.setAttr("totalNum",ds.getTotalSize());
                    that.pagination.setAttr("pageSize",ds.getPageSize());
                    //that.pagination.setAttr("pageIndex",ds.getPageNo());
                }else{
                    that.setAttr("totalNum",ds.getTotalSize());
                    that.setAttr("pageSize",ds.getPageSize());
                    that.setAttr("pageIndex",ds.getPageNo());
                }
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
        getData:function(){
            return this.getAttr("data").$model;
        },
        /**
         * 选中某些行
         */
        checkRows: function (rows,checked) {
            if(checked==undefined){
                checked = true;
            }
            if(rows&&rows.length>0){
                for(var t=0;t<rows.length;t++){
                    var row = rows[t];
                    if(row){
                        row.checked = checked?checked:false;
                    }
                }
            }
            this._updateAllCheckedByDatas();
        },
        /**
         * 根据主键选中某些行
         */
        checkRowsByDataId: function (dataIds,checked) {
            if(checked==undefined){
                checked = true;
            }
            if(dataIds&&dataIds.length>0&&this.getAttr("idField")){
                var idField = this.getAttr("idField");
                var datas = this.getAttr("data");
                for (var i = 0; i < datas.length; i++) {
                    if(datas[i]&&datas[i][idField]){
                        for(var t=0;t<dataIds.length;t++){
                            var da = dataIds[t];
                            if(da&&da==datas[i][idField]){
                                datas[i].checked = checked?checked:false;
                            }
                        }
                    }
                }
                this._formArr(datas);
                //this.setAttr("data",this._formArr(datas));
            }
            this._updateAllCheckedByDatas();
        },
        /**
         * 新增一行数据
         */
        addRow:function(rowData,pos){//{}则表示新增空行,pos指新增位置，表示放到第几行，默认表示最后一行
            var datas = this.getAttr("data");
            var pSize = datas.length;
            if(pos&&pos>0&&pos<(pSize+2)){
                var newDataArr = [];
                if(pSize<1){
                    newDataArr.push(this._formatData(rowData));
                }else{
                    for(var t=0;t<pSize;t++){
                        if(t==(pos-1)){
                            newDataArr.push(this._formatData(rowData));
                            if(datas[t]){
                                newDataArr.push(datas[t]);
                            }
                        }else if(datas[t]){
                            newDataArr.push(datas[t]);
                        }
                    }
                }
                this.setAttr("data",newDataArr);
            }else{
                this.getAttr("data").push(this._formatData(rowData));
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
                this._formArr(datas);
                //this.setAttr("data",this._formArr(datas));
            }
            //this._updateAllCheckedByDatas();
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
        _renderEditComp:function(){
            if(this.getAttr("canEdit")){
                var datas = this.getAttr("data");
                var cols = this.getAttr("columns");
                var editCompMap = this.getAttr("editCompMap");
                for (var i = 0; i < datas.length; i++) {
                    if(datas[i]&&datas[i].uuid){
                        var data = datas[i];
                        var rowEditComps = [];
                        for(var t=0;t<cols.length;t++){
                            var col = cols[t];
                            if(col.dataField&&col.xtype){
                                var fieldName = col.dataField;
                                var xtype = col.xtype || "input";
                                if(!$("#con_"+fieldName+"_"+data.uuid)||!Page.manager.components['comp_'+fieldName+"_"+data.uuid]){
                                    var editField = Page.create(xtype, {
                                        $parentId: 'con_'+fieldName+"_"+data.uuid,
                                        $id:'comp_'+fieldName+"_"+data.uuid,
                                        parentTpl:"inline",
                                        value: data[fieldName],
                                        showLabel: false,
                                        bindField:fieldName,
                                        disabledEdit:col.disabledEdit,
                                        validationRules:col.validationRules,
                                        showErrorMessage:true,
                                        valueChange:function(){
                                            data[fieldName] = editField.getValue();
                                        },
                                        status:(data.state=='edit'&&!col.disabledEdit)?"edit":"readonly"
                                    });
                                    rowEditComps.push(editField);
                                    editField.render();
                                }else{
                                    rowEditComps.push(Page.manager.components['comp_'+fieldName+"_"+data.uuid]);
                                }
                            }
                        }
                        editCompMap[data.uuid] = rowEditComps;
                    }
                }
            }
        },
        _getDataSet: function() {
            return Page.manager.components[this.getAttr("dataSetId")];
        },
        _defaultEditRow:function(vm,row,rowDom){
            var toStatus = (row.state&&row.state=="view")?"edit":"readonly";
            var editCompMap = this.getAttr("editCompMap").$model;
            if(editCompMap&&editCompMap[row.uuid]&&editCompMap[row.uuid].length>0){
                var editComps = editCompMap[row.uuid];
                for(var t=0;t<editComps.length;t++){
                    if(editComps[t]&&!editComps[t].getAttr("disabledEdit")){
                       editComps[t].switchStatus(toStatus);
                    }
                }
            }
            if(row.state=="view"){
                row.state = "edit";
            }else{
                row.state = "view";
            }
        },
        _defaultEditField:function(){

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
        _dataChange:function(){
            //this._updateAllCheckedByDatas();
            if(this.getAttr("afterSetData")){
                this.getAttr("afterSetData")(this.getAttr("data").$model);
            }
            this._renderEditComp();
        },
        _formatOptions:function(opts){
            var d = opts.data||[];
            //是否默认全部勾选
            if(opts.allChecked){
                for (var i = 0; i < d.length; i++) {
                    if (d[i]) {
                        d[i].checked = true;
                        d[i].state = d[i].state?d[i].state:'view';
                        if(!d[i].uuid){
                            d[i].uuid = String.uniqueID();
                        }
                    }
                }
            }else{
                for (var i = 0; i < d.length; i++) {
                    if (d[i].checked == undefined) {
                        d[i].checked = false;//未设置，默认不选中
                        d[i].state = d[i].state?d[i].state:'view';
                        if(!d[i].uuid){
                            d[i].uuid = String.uniqueID();
                        }
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
                        if(!coli.xtype){
                            coli.xtype = "input";
                        }
                        if(coli.disabledEdit==undefined){
                            coli.disabledEdit = false;
                        }
                        if(coli.showDisplay==undefined){
                            coli.showDisplay = false;
                        }
                        if(coli.isOpColumn==undefined){
                            coli.isOpColumn = false;
                        }
                        if(coli.sortDisabled==undefined){
                            coli.sortDisabled = false;
                        }
                    }
                }
            }
            var allColumns = [];
            if(cols&&cols.length>0) {
                for (var i = 0; i < cols.length; i++) {
                    if (cols[i]&&!cols[i].hidden) {
                        allColumns.push(cols[i]);
                    }
                }
            }
            var opCols = opts.opColumns;
            if(opCols&&opCols.length>0){
                var opColumnMap = {};
                for(var t=0;t<opCols.length;t++){
                    if(opCols[t]){
                        var positioni = opCols[t].position||"end";
                        if(typeof(positioni)=='number'&&positioni>(cols.length-1)){
                            positioni = "end";
                        }
                        if(typeof(positioni)=='number'){
                            for(var s=0;s<allColumns.length;s++){
                                if(allColumns[s]&&allColumns[s]==cols[positioni]){
                                    if(cols[positioni].hidden){
                                        positioni = positioni +1;
                                        if(positioni>cols.length-1){//达到最后一个时
                                            opColumnMap['op_end'].push(opCols[t]);
                                            break;
                                        }
                                    }else{
                                        opCols[t].isOpColumn = true;
                                        allColumns = this._pushIntoArr(allColumns,opCols[t],s);
                                        break;
                                    }
                                }
                            }
                        }
                        opCols[t].title = opCols[t].title?opCols[t].title:"操作";
                        if(!opColumnMap['op_'+positioni]){
                            opColumnMap['op_'+positioni] = [];
                        }
                        opColumnMap['op_'+positioni].push(opCols[t]);
                    }
                }
                opts.opColumnMap = opColumnMap;
            }
            opts.allColumns = allColumns;
            return opts;
        },
        _formatDatas:function(datas){
            //是否默认全部勾选
            if(datas){
                if(this.getAttr("allChecked")){
                    for (var i = 0; i < datas.length; i++) {
                        if (datas[i]) {
                            datas[i].checked = true;
                            datas[i].state = datas[i].state?datas[i].state:'view';
                            if(!datas[i].uuid){
                                datas[i].uuid = String.uniqueID();
                            }
                        }
                    }
                }else{
                    for (var i = 0; i < datas.length; i++) {
                        if(datas[i]){
                            datas[i].checked = (datas[i].checked==true||datas[i].checked=="true")?true:false;//未设置，默认不选中
                            datas[i].state = datas[i].state?datas[i].state:'view';
                            if(!datas[i].uuid){
                                datas[i].uuid = String.uniqueID();
                            }
                        }
                    }
                }
            }
            return datas;
        },
        _formatData:function(data){
            //是否默认全部勾选
            if(data){
                if(this.getAttr("allChecked")){
                    data.checked = true;
                }else{
                    data.checked = false;//未设置，默认不选中
                }
                data.state = data.state?data.state:'view';
                if(!data.uuid){
                    data.uuid = String.uniqueID();
                }
            }
            return data;
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
        _pushIntoArr:function(arr,ele,position){
            if(arr&&ele&&position){
                var nArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i]) {
                        if(i==position){
                            nArr.push(ele);
                        }
                        nArr.push(arr[i]);
                    }
                }
                return nArr;
            }
            return arr;
        }
    });
    SimpleGridWidget.xtype = xtype;
    return SimpleGridWidget;
})