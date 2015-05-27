/**
 * Created by qianqianyi on 15/5/8.
 *
 */
define(['../Base',"../../data/DataConstant", 'text!./SimpleGridWidget.html', 'css!./SimpleGridWidget.css'], function (Base,Constant,template) {
    var xtype = "simpleGrid";
    var SimpleGridWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            tableClass:"table table-bordered",
            columns: [],/**
                         * 列信息,每列可配置属性如下：
                         *｛title:"性别",
                         * dataField:"sex",
                         * width:"4%",
                         * showDisplay:true,//showDisplay：显示Display字段，
                         * disabledEdit:true,
                         * sortDisabled:true,
                         * xtype:"combobox",
                         * isOpColumn:true,//isOpColumn，自定义显示，
                         * template:""} //template：自定义显示的内容（html，可以是avalon片段），内容中可通过avalon访问grid信息，如，rowdata，行数据，col，列模型
                         */
            data: [],    //静态数据
            dataSetId: null,    //数据集ID，设置了dataSetId则data无效
            //queryParams:null, //默认查询条件，目前不需要，请设置到ds中
            idField:"wid",  //主键属性
            canSort:true,   //是否可排序
            showCheckbox:true,  //是否显示复选框
            checkboxWidth:"10%",    //复选框宽度
            allChecked: false,  //设置为true，则默认全部选中
            //分页信息
            usePager:true,  //是否分页
            pageIndex:1,    //默认当前页
            pageSize:15,    //默认每页条数
            totalNum:0, //总数据条数
            totalPage:0,    //总页数
            showPageIndexInput: true,   //显示跳转到某页输入框
            showPageSizeInput: true,    //显示每页条数输入框]
            showFirstPage: true,    //显示第一页按钮
            showLastPage: true, //显示最后一页按钮
            showPreviousAndNextPage: true,  //显示上一页和下一页按钮
            showPageDetail: true,   //显示分页详情
            showTipWhenNull:true,//没有数据时显示分页提示
            noDataTip:null,//无数据时分页区的提示信息
            //操作列
            opColumns:[],/**操作列信息
                         * 每列配置属性{title:"操作",width:'10%',position:2,template:''}
                         * position支持值为front、end和具体数字
                         */
            //行编辑
            canEdit:false,  //是否可编辑
            dbClickToEditRow:false, //双击编辑行
            clickToEditField:true,  //单击编辑事件
            editMultiRow:false, //同时编辑多行
            editRowFunc:null,   //编辑行事件
            editFieldFunc:null, //编辑单属性事件
            //事件
            beforeSetData:null, //设置数据前，参数：即将设置的数据datas
            afterSetData:null,  //设置数据后，参数：已经设置的数据datas
            beforeCheckRow:null,    //勾选行事件
            afterCheckRow:null, //勾选行后事件
            beforeChangeOrder:null, //改变排序前事件
            beforeChangePageNo:null,    //改变页码前事件

            //中间参数，不可初始化
            opColumnMap:{},
            editCompMap:{},
            allColumns:[],
            activedRow:null,    //激活的行
            editComp:null,  //行编辑对象
            activedRowDom:null, //行编辑Dom
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
                var cols = vm.columns;
                for(var s=0;s<cols.length;s++){
                    if(cols[s]==col||cols[s].dataField==col.dataField){
                        cols[s].orderType = orderType;
                    }
                }
                col.orderType = orderType;
                if(vm.beforeChangeOrder){
                    vm.beforeChangeOrder(vm,col,orderType);
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
                    showTipWhenNull: this.getAttr("showTipWhenNull"),//无数据时显示提示信息
                    noDataTip: this.getAttr("noDataTip"),
                    pageChangeEvent: function (pager) {
                        if(that.getAttr("beforeChangePageNo")){
                            that.getAttr("beforeChangePageNo")(pager,that);//参数为分页对象,grid对象
                        }
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
                if(orders!=""){
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
                if(that.pagination){
                    that.pagination.setAttr("totalNum",ds.getTotalSize());
                    that.pagination.setAttr("pageSize",ds.getPageSize());
                    //that.pagination.setAttr("pageIndex",ds.getPageNo());
                }else{
                    that.setAttr("totalNum",ds.getTotalSize());
                    that.setAttr("pageSize",ds.getPageSize());
                    that.setAttr("pageIndex",ds.getPageNo());
                }
                that.setAttr("data",that._formatDatas(newDatas));
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
        /**
         * 跳转到某页
         */
        goPage: function(pageNo) {
            if(pageNo){
                this.pagination.setAttr("pageIndex",pageNo);
            }
        },
        getTemplate: function () {
            return template;
        },
        _renderEditComp:function(){
            if(this.getAttr("canEdit")){
                var datas = this.getAttr("data").$model;
                var cols = this.getAttr("columns");
                var editCompMap = this.getAttr("editCompMap");
                var dsId = "ds_"+this.getAttr("vid");
                //dataSources
                //var dsSetting = {
                //    type:'dataSet',
                //    options:{data: datas}
                //};
                var dataSources = {};
                //dataSources[dsId] = dsSetting;
                //dataBinders
                var dataBinders = {}

                for (var i = 0; i < datas.length; i++) {
                    if(datas[i]&&datas[i].uuid){
                        //行ds
                        var idsId = "ds_"+datas[i].uuid;
                        var idsSetting = {
                            type:'dataValue',
                            options:{data: datas[i]}
                        };
                        dataSources[idsId] = idsSetting;

                        var data = datas[i];
                        var rowEditComps = [];
                        for(var t=0;t<cols.length;t++){
                            var col = cols[t];
                            if(col.dataField&&col.xtype&&!col.isOpColumn&&!col.hidden){
                                var fieldName = col.dataField;
                                var xtype = col.xtype || "input";
                                if(!$("#con_"+fieldName+"_"+data.uuid)||!Page.manager.components['comp_'+fieldName+"_"+data.uuid]){
                                    (function(xtype,fieldName,data,rowEditComps,dataBinders){
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
                                            status:(data.state=='edit'&&!col.disabledEdit)?"edit":"readonly"
                                        });
                                        //在属性中写displayChange无效，暂时用以下写法代替，TODO
                                        editField._displayChange = function(){
                                            data[fieldName] = editField.getValue();
                                        };
                                        rowEditComps.push(editField);

                                        editField.render();

                                        //行dataBinder
                                        var idbId = "db_"+datas[i].uuid+"_"+fieldName;
                                        var idbSetting = {
                                            dataValueId: "ds_"+data.uuid,
                                            fieldId: fieldName,
                                            widgetId: editField.getId()
                                        };
                                        //if(fieldName=="name"){
                                            dataBinders[idbId] = idbSetting;
                                        //}
                                    }(xtype,fieldName,data,rowEditComps,dataBinders));
                                }else{
                                    rowEditComps.push(Page.manager.components['comp_'+fieldName+"_"+data.uuid]);
                                }
                            }
                        }
                        editCompMap[data.uuid] = rowEditComps;
                    }
                }
                this.widgetContainer = Page.create("widgetContainer", {
                    dataSources:dataSources,
                    dataBinders:dataBinders
                });
            }
        },
        _getDataSet: function() {
            return Page.manager.components[this.getAttr("dataSetId")];
        },
        _defaultEditRow:function(vm,row,rowDom){
            var toStatus = (row.state&&row.state=="view")?"edit":"readonly";
            var editCompMap = this.getAttr("editCompMap");
            if(editCompMap&&editCompMap[row.uuid]&&editCompMap[row.uuid].length>0){
                var editComps = editCompMap[row.uuid];
                for(var t=0;t<editComps.length;t++){
                    if(editComps[t]&&!editComps[t].getAttr("disabledEdit")){
                       editComps[t].switchStatus(toStatus);
                    }
                }
            }
            if(row.state=="view"){
                if(this.getAttr("editMultiRow")){
                    //校验，将其他编辑设置为只读,校验不通过不更改状态

                }else{
                    row.state = "edit";
                }
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