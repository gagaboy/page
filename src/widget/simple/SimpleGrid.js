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
                         * editParams:编辑组件属性
                         * isOpColumn:true,//isOpColumn，自定义显示，
                         * template:""} //template：自定义显示的内容（html，可以是avalon片段），内容中可通过avalon访问grid信息，如，rowdata，行数据，col，列模型
                         */
            data: [],    //静态数据
            dataSetId: null,    //数据集ID，设置了dataSetId则data无效
            idField:"WID",  //主键属性
            isMerge:false,
            tdSpans:{},
            canSort:true,   //是否可排序
            multiSort:false,//复合排序
            showCheckbox:true,  //是否显示复选框
            multiCheck:true,  //是否多选
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
            showTipWhenNull:false,//没有数据时显示分页提示
            hidePagerWhenNull:true,//没有数据时隐藏提示
            noDataTip:"暂无数据",//无数据时分页区的提示信息
            //操作列
            opColumns:[],/**操作列信息
                         * 每列配置属性{title:"操作",width:'10%',position:2,template:''}
                         * position支持值为front、end和具体数字
                         */
            //行编辑
            canEdit:false,  //是否可编辑
            dbClickToEditRow:false, //双击编辑行
            clickToEditField:false, //双击编辑行
            editMultiRow:true, //同时编辑多行
            editRowFunc:null,   //编辑行事件
            editFieldFunc:null, //编辑单属性事件
            //自定义显示列
            canCustomCols:false,
            fixedCols:[],
            customColFunc:null,
            showCustomAllCheck:false,
            fetchUrl:null,
            metaDataObj:null,
            //事件
            onClickRow:null,//内置参数未：vm－grid模型,rowdata－行数据,rowObj－行dom
            beforeSetData:null, //设置数据前，参数：即将设置的数据datas
            afterSetData:null,  //设置数据后，参数：已经设置的数据datas
            beforeCheckRow:null,    //勾选行事件
            afterCheckRow:null, //勾选行后事件
            onChangeOrder:null, //改变排序前事件
            beforeChangePageNo:null,    //改变页码前事件

            //中间参数，不可初始化
            _idField:"_uuid",
            opColumnMap:{},
            editCompMap:{},
            allColumns:[],
            activedRow:null,    //激活的行
            mouseoverToActive:false,
            clickToActive:true,
            editComp:null,  //行编辑对象
            activedRowDom:null, //行编辑Dom
            allClick: function (vid, element) {
                var vm = avalon.vmodels[vid];
                if(vm&&vm.multiCheck){
                    vm.allChecked = !vm.allChecked;
                    var datas = vm.data;
                    for (var i = 0; i < datas.length; i++) {
                        datas[i]['checked'] = vm.allChecked;
                    }
                    //vm.data = datas;
                }
            },
            activeRow:function(vid,row,rowObj){
                var vm = avalon.vmodels[vid];
                vm.activedRow = row;
                vm.activedRowDom = rowObj;
                if(vm.onClickRow){
                    vm.onClickRow(vm,row,rowObj);
                }
            },
            checkRow: function (vid,row) {
                var vm = avalon.vmodels[vid];
                var grid = Page.manager.components[vid];
                if(!vm.multiCheck&&!row.checked&&grid.getCheckedRows().length>0){
                    for (var i = 0; i < vm.data.$model.length; i++) {
                        if (vm.data[i]) {
                            vm.data[i]['checked'] = false;
                        }
                    }
                }
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
                if(vm.onChangeOrder){
                    vm.onChangeOrder(vm,col,orderType);
                }else{
                    var grid = Page.manager.components[vid];
                    grid.reloadData(col.dataField,orderType);// 调用dataset接口进行查询
                }
            },
            getColTemplate:function(vid,row,col){
                var vm = avalon.vmodels[vid];
                if(col.template){
                    return col.template;
                }else if(col.templateGenerator&&vm[col.templateGenerator]){
                    return vm[col.templateGenerator](row,col);
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
            deleteRow: function (vid,row,real) {
                //删除行，remove掉
                var vm = avalon.vmodels[vid];
                var grid = Page.manager.components[vid];
                if(grid){
                    grid.deleteRow(row,real);
                }
            }
        },
        pagination:null,//分页条对象
        initialize: function (opts) {
            this.parent(this._formatOptions(opts));
        },
        _beforeRender:function(){
            var that = this;
            if(this.options.canCustomCols&&this.options.metaDataObj){
                //后台取数据，更新columns显示列
                if(!this.options.fetchUrl){
                    var path = document.location.pathname;
                    var contentPath = path.split("/")[1];
                    this.options.fetchUrl = "/"+contentPath+"/sys/common/customPage/ymzjdz/select.do";
                }
                var metaData = this.options.metaDataObj;
                var params = {};
                params.PAGEID = metaData.geFormId();//pageId
                params.COMPONENTID = this.getId();//componentId
                var syncRes = Page.utils.syncAjax(this.options.fetchUrl, params);
                if(syncRes&&syncRes.result&&syncRes.result.datas
                    &&syncRes.result.datas.select.rows
                    &&syncRes.result.datas.select.rows.length>0){
                    var rowData = syncRes.result.datas.select.rows[0];
                    var setting = rowData.SETTING;
                    if(setting){
                        try{
                            var settingObj = JSON.parse(setting);
                            if(settingObj.columns&&settingObj.columns.length>0){
                                var columns = that.options.columns;
                                var settingCols = settingObj.columns;
                                if(columns&&columns.length>0){
                                    for (var i = 0; i < columns.length; i++) {
                                        var coli = columns[i];
                                        if(coli&&settingCols.contains(coli.dataField)){
                                            coli.hidden = false;
                                        }else if(coli){
                                            coli.hidden = true;
                                        }
                                    }
                                    that.setAttr("allColumns",that._calAllColumns(columns,that.options.opColumns),true);
                                }
                            }
                        }catch(e){
                            return false;
                        }
                    }
                }
            }
        },
        render:function(){
            this.parent();
            var that = this;
            if(!this.getAttr("data")||this.getAttr("data").length<1){
                this.reloadData();
            }else{
                this._renderEditComp();
            }
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
                    hidePagerWhenNull:this.getAttr("hidePagerWhenNull"),
                    noDataTip: this.getAttr("noDataTip"),//无数据时显示提示信息

                    pageChangeEvent: function (pager) {
                        if(that.getAttr("beforeChangePageNo")){
                            that.getAttr("beforeChangePageNo")(pager,that);//参数为分页对象,grid对象
                        }
                        that.reloadData()// 调用dataset接口进行查询
                    },
                    //TODO 以下未生效
                    totalNumChange:function(totalNum){
                        that.setAttr("totalNum",totalNum);//参数为分页对象,grid对象
                    },
                    pageIndexChange:function(pageIndex){
                        that.setAttr("pageIndex",pageIndex);//参数为分页对象,grid对象
                    },
                    pageSizeChange:function(pageSize){
                        that.setAttr("pageSize",pageSize);//参数为分页对象,grid对象
                    }
                });
                this.pagination.render();
            }
            this.customColFunc = this.options.customColFunc;
        },
        reloadData:function(colName,orderType){
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
                if(this.options.multiSort){
                    for(var k=0;k<columns.length;k++){
                        if(columns[k].orderType){
                            if(orders!=""){
                                orders += ",";
                            }
                            orders += columns[k].orderType=="desc"?"-"+columns[k].dataField:"+"+columns[k].dataField;
                        }
                    }
                }else if(colName&&orderType){
                    orders += (orderType=="desc"?"-"+colName:"+"+colName);
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
                    //that.pagination.setAttr("pageSize",ds.getPageSize());
                    //that.pagination.setAttr("pageIndex",ds.getPageNo());

                    that.setAttr("totalNum",that.pagination.getAttr("totalNum"),true);
                    that.setAttr("pageSize",that.pagination.getAttr("pageSize"),true);
                    that.setAttr("pageIndex",that.pagination.getAttr("pageIndex"),true);
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
            var formatData = this._formatData(rowData);
            //if(this.getAttr("canEdit")){
                var ds = this._getDataSet();
                if(ds){
                    ds.addRecord(formatData);
                }
            //}
            if(pos&&pos>0&&pos<(pSize+2)){
                var newDataArr = [];
                if(pSize<1){
                    newDataArr.push(formatData);
                }else{
                    for(var t=0;t<pSize;t++){
                        if(t==(pos-1)){
                            newDataArr.push(formatData);
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
                var nowData = this.getAttr("data");
                nowData.push(formatData);
                this.setAttr("data",nowData);
            }
            this._updateAllCheckedByDatas();
        },
        /**
         * 删除某行
         */
        deleteRow: function (row,real) {
            //删除行，remove掉
            var ds = this._getDataSet();
            if(ds){
                ds.deleteRecord(row[this.options._idField],real);
            }
            row = null;
            var upFlag = false;
            var datas = this.getAttr("data");
            this.setAttr("data",this._formArr(datas));
            this._updateAllCheckedByDatas();
        },
        /**
         * 根据主键删除某行
         */
        deleteRowByDataId: function (dataId,real) {
            if(dataId&&this.getAttr("idField")){
                var idField = this.getAttr("idField");
                var datas = this.getAttr("data");
                for (var i = 0; i < datas.length; i++) {
                    if(datas[i]&&datas[i][idField]
                    &&datas[i][idField]==dataId){
                        var ds = this._getDataSet();
                        if(ds){
                            ds.deleteRecord(datas[i][this.options._idField],real);
                        }
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
        deleteActiveRow: function (real) {
            //删除行，remove掉
            var datas = this.getAttr("data");
            var acRow = this.getActiveRow();
            if(acRow){
                for(var s=0;s<datas.length;s++){
                    if(datas[s]&&acRow==datas[s]){
                        var ds = this._getDataSet();
                        if(ds){
                            ds.deleteRecord(datas[s][this.options._idField],real);
                        }
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
        deleteCheckedRows: function (real) {
            //删除行，remove掉
            var datas = this.getAttr("data");
            var cdatas = this.getCheckedRows();
            for(var s=0;s<datas.length;s++){
                for (var i = 0; i < cdatas.length; i++) {
                    if(datas[s]&&cdatas[i]&&cdatas[i]==datas[s]){
                        var ds = this._getDataSet();
                        if(ds){
                            ds.deleteRecord(datas[s][this.options._idField],real);
                        }
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
                for (var i = 0; i < datas.length; i++) {
                    if(datas[i]&&datas[i][this.options._idField]){
                        var data = datas[i];
                        var rowEditComps = [];
                        for(var t=0;t<cols.length;t++){
                            var col = cols[t];
                            if(col.dataField&&col.xtype&&!col.isOpColumn&&!col.hidden){
                                var fieldName = col.dataField;
                                var xtype = col.xtype || "input";
                                if(!$("#con_"+fieldName+"_"+data[this.options._idField])||!Page.manager.components['comp_'+fieldName+"_"+data[this.options._idField]]){
                                    (function(that,xtype,keyField,fieldName,data,rowEditComps){
                                        var editParams = col.editParams?col.editParams.$model:{};
                                        var baseParams = {
                                            $parentId: 'con_'+fieldName+"_"+data[that.options._idField],
                                            $id:'comp_'+fieldName+"_"+data[that.options._idField],
                                            parentTpl:"inline",
                                            value: data[fieldName]||"",
                                            showLabel: false,
                                            bindField:fieldName,
                                            disabledEdit:col.disabledEdit||col.readonly,
                                            validationRules:col.validationRules,
                                            showErrorMessage:true,
                                            bind:that._getDataSet()?that._getDataValueIdByDataId(data[keyField]).getId()+"."+fieldName:null,
                                            status:(data.state=='edit'&&!col.disabledEdit)?"edit":"readonly"
                                        };
                                        var allParams = jQuery.extend(baseParams,editParams);
                                        var editField = Page.create(xtype,allParams);

                                        editField.bindField = fieldName;
                                        //在属性中写displayChange无效，暂时用以下写法代替，TODO
                                        editField._displayChange = function(){
                                            data[fieldName] = editField.getValue();
                                        };
                                        rowEditComps.push(editField);

                                        editField.render();
                                    }(this,xtype,this.options._idField,fieldName,data,rowEditComps));
                                }else{
                                    rowEditComps.push(Page.manager.components['comp_'+fieldName+"_"+data[this.options._idField]]);
                                }
                            }
                        }
                        editCompMap[data[this.options._idField]] = rowEditComps;
                    }
                }
                this.widgetContainer = Page.create("widgetContainer", {
                    dataSourcesIds:this._getDataValuesByDataSet()
                });
            }
        },
        _reSetTdSpans:function(){
            if(this.options.isMerge){
                var columns = this.getAttr("columns").$model;
                var dataRows = this.getAttr("data").$model;
                if(columns&&dataRows&&dataRows.length>0){
                    var tdSpans = {};
                    for(var i=0;i<dataRows.length;i++){
                        for(var k=0;k<columns.length;k++){
                            tdSpans[dataRows[i]._uuid+[columns[k].dataField]]= 1;
                        }
                    }
                }
                var formerName = "";
                for(var k=0;k<columns.length;k++){
                    var column = columns[k];
                    var data_0 = dataRows[0];
                    var rowKey = column.dataField;
                    if(k>0){
                        var formerCol = columns[k-1];
                        formerName = formerCol.dataField;
                    }
                    for(var t=1;t<dataRows.length;t++){
                        var dataRow = dataRows[t];
                        if(data_0[column.dataField]==dataRow[column.dataField]){
                            if(k>0){
                                if(tdSpans[dataRow._uuid+formerName]==0){
                                    tdSpans[data_0._uuid+rowKey]++;
                                    tdSpans[dataRow._uuid+rowKey]--;
                                }else{
                                    data_0 = dataRow;
                                }
                            }else{
                                tdSpans[data_0._uuid+rowKey]++;
                                tdSpans[dataRow._uuid+rowKey]--;
                            }
                        }else{
                            data_0 = dataRow;
                        }
                    }
                }
                this.setAttr("tdSpans",tdSpans);
            }
        },
        _getDataSet: function() {
            return Page.manager.components[this.getAttr("dataSetId")];
        },
        _getDataValuesByDataSet:function(){
            var dataValues = [];
            if(this._getDataSet()){
                var dataSet = this._getDataSet();
                if(dataSet.getAttr("_dataArray")){
                    var array = dataSet.getAttr("_dataArray");
                    for (var i = 0; i < array.length; i++) {
                        var value = array[i];
                        dataValues.push(value.getId());
                    }
                }
            }
            return dataValues;
        },
        _getDataValueIdByDataId:function(did){
            var dataSet = this._getDataSet();
            if(dataSet&&dataSet.getAttr("_dataMap")){
                return dataSet.getAttr("_dataMap")[did];
            }
            return null;
        },
        _defaultEditRow:function(vm,row,rowDom){
            var toStatus = (row.state&&row.state=="readonly")?"edit":"readonly";
            var editCompMap = this.getAttr("editCompMap");
            if(row.state=="readonly"){
                if(this.getAttr("editMultiRow")){
                    row.state = "edit";
                }else{
                    //校验，将其他编辑设置为只读,校验不通过不更改状态
                    var datas = this.getAttr("data");
                    for (var i = 0; i < datas.length; i++) {
                        if (datas[i]&&datas[i][this.options._idField]!=row[this.options._idField]) {
                            if(false){//校验不通过
                                return null;//直接返回，不再进行后续逻辑
                            }
                            var otherToStatus = "readonly";
                            row.state = otherToStatus;
                            var editComps = editCompMap?editCompMap[datas[i][this.options._idField]]:null;
                            for(var t=0;t<editComps.length;t++){
                                if(editComps[t]){
                                    editComps[t].switchStatus(otherToStatus);
                                }
                            }
                        }
                    }
                    row.state = "edit";
                }
            }else{
                row.state = "readonly";
            }
            if(editCompMap&&editCompMap[row[this.options._idField]]&&editCompMap[row[this.options._idField]].length>0){
                var editComps = editCompMap[row[this.options._idField]];
                for(var t=0;t<editComps.length;t++){
                    if(editComps[t]&&!editComps[t].getAttr("disabledEdit")){
                       editComps[t].switchStatus(toStatus);
                    }
                }
            }
        },
        _defaultEditField:function(vm,row,fieldName,fieldXtype,tdDom){
            var editCompMap = this.getAttr("editCompMap");
            var editComps = editCompMap?editCompMap[row[this.options._idField]]:null;
            for(var t=0;t<editComps.length;t++){
                if(editComps[t]&&editComps[t].bindField==fieldName){
                    var st = editComps[t].getAttr("status");
                    var toStatus = "edit";
                    editComps[t].switchStatus(toStatus);
                    break;
                }
            }
            if(!this.getAttr("editMultiRow")){
                //校验，将其他编辑设置为只读,校验不通过不更改状态
                var datas = this.getAttr("data");
                var otherToStatus = "readonly";
                for (var i = 0; i < datas.length; i++) {
                    if (datas[i]&&(datas[i][this.options._idField]!=row[this.options._idField])) {
                        if(false){//校验不通过
                            return null;//直接返回，不再进行后续逻辑
                        }
                        row.state = otherToStatus;
                        var otherEditComps = editCompMap?editCompMap[datas[i][this.options._idField]]:null;
                        for(var t=0;t<otherEditComps.length;t++){
                            if(otherEditComps[t]){
                                otherEditComps[t].switchStatus(otherToStatus);
                            }
                        }
                    }else if(datas[i]){
                        for(var t=0;t<editComps.length;t++){
                            if(editComps[t]&&editComps[t].bindField!=fieldName){
                                editComps[t].switchStatus(otherToStatus);
                            }
                        }
                    }
                }
            }
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
            this._reSetTdSpans();
        },
        _formatOptions:function(opts){
            opts = opts||{};
            var d = opts.data||[];
            var columns = opts.columns||[];
            //是否合并
            if(opts.isMerge){
                opts.canEdit = false;
            }
            if(opts.canCustomCols){
                opts.canEdit = false;
            }
            if(!opts.customColFunc){
                opts.customColFunc = this._defaultCustom;
            }
            //是否默认全部勾选
            if(opts.allChecked){
                for (var i = 0; i < d.length; i++) {
                    if (d[i]) {
                        d[i].checked = true;
                        d[i].state = d[i].state?d[i].state:'readonly';
                        if(!d[i][this.options._idField]){
                            d[i][this.options._idField] = String.uniqueID();
                        }
                    }
                }
            }else{
                for (var i = 0; i < d.length; i++) {
                    if (d[i]) {
                        d[i].checked = d[i].checked||false;//未设置，默认不选中
                        d[i].state = d[i].state?d[i].state:'readonly';
                        if(!d[i][this.options._idField]){
                            d[i][this.options._idField] = String.uniqueID();
                        }
                    }
                }
            }
            if(columns&&columns.length>0){
                for (var i = 0; i < columns.length; i++) {
                    var coli = columns[i];
                    coli.hidden = coli.hidden||false;
                }
            }
            opts.columns = columns;
            opts.allColumns = this._calAllColumns(opts.columns,opts.opColumns);

            return opts;
        },
        _columnsChange:function(){
            this.setAttr("allColumns",this._calAllColumns(this.options.columns,this.options.opColumns),true);
        },
        _calAllColumns:function(cols,opCols){
            //列信息
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
                this.options.opColumnMap = opColumnMap;
            }
            return allColumns;
        },
        _formatDatas:function(datas){
            //是否默认全部勾选
            if(datas){
                if(this.getAttr("allChecked")){
                    for (var i = 0; i < datas.length; i++) {
                        if (datas[i]) {
                            datas[i].checked = true;
                            datas[i].state = datas[i].state?datas[i].state:'readonly';
                            if(!datas[i][this.options._idField]){
                                datas[i][this.options._idField] = String.uniqueID();
                            }
                        }
                    }
                }else{
                    for (var i = 0; i < datas.length; i++) {
                        if(datas[i]){
                            datas[i].checked = (datas[i].checked==true||datas[i].checked=="true")?true:false;//未设置，默认不选中
                            datas[i].state = datas[i].state?datas[i].state:'readonly';
                            if(!datas[i][this.options._idField]){
                                datas[i][this.options._idField] = String.uniqueID();
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
                data.state = data.state?data.state:'readonly';
                //TODO widgetContainer必须wid的处理，后续会删除
                if(!data[this.options._idField]){
                    data[this.options._idField] = String.uniqueID();
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
        },
        _defaultCustom:function(objId){
            var obj = null;
            if(objId&&typeof(objId)=='string'){
                obj = Page.manager.components[objId];
            }else{
                obj = objId;
            }
            if(obj&&obj.options.canCustomCols&&obj.options.metaDataObj){
                var allColumns = [];
                var checkColumns = [];
                var colValues = [];
                var fixColumns = [];
                if(obj.options.columns){
                    var cols = obj.options.columns;
                    for(var s=0;s<cols.length;s++){
                        var col = cols[s];
                        var colObj = {};
                        colObj.text = col.title;
                        colObj.value = col.dataField;
                        allColumns.push(colObj);
                        if(!col.hidden){
                            checkColumns.push(colObj);
                            colValues.push(col.dataField);
                        }
                    }
                }
                var cusCols = Page.create("customColumns", {
                    items:allColumns,
                    value:colValues,
                    metaDataObj:obj.options.metaDataObj,
                    showAllCheck:obj.options.showCustomAllCheck,
                    fixItems:obj.options.fixedCols,
                    componentId:obj.getId(),
                    afterSave:function(cus){
                        var checkedCols = cus.options.value;
                        if(checkedCols&&obj.options.columns){
                            var cols =  obj.getAttr("columns");
                            for(var s=0;s<cols.length;s++){
                                var col = cols[s];
                                if(checkedCols.contains(col.dataField)){
                                    //col.dataField;
                                    col.hidden = false;
                                }else{
                                    col.hidden = true;
                                }
                            }
                            //obj.setAttr("columns",cols);
                            obj.setAttr("allColumns",obj._calAllColumns(cols,obj.options.opColumns),true);
                        }
                        return;
                    }
                });
                cusCols.render();
            }
        }
    });
    SimpleGridWidget.xtype = xtype;
    return SimpleGridWidget;
})