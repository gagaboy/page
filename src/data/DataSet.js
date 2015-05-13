/**
 * Created by qianqianyi on 15/5/7.
 * 获取数据
 *     url | data
 *     list
 *        fields, orders, filters, page
 *     one
 *        fields
 *     parameter
 * 处理数据
 *     if has model -> to map model
 *     扩展：计算属性 TODO
 *
 * 返回数据
 *     过滤过，扩展过的数据
 *
 *  哪些组件会用DataSource 例如：grid, form, charts, combobox, tree etc..
 *  可以被扩展
 */
define(["./DataConstant", "./DataSource"], function (Constant, DataSource) {

    var xtype = "dataSet";
    var DataSet = new Class({
        Implements: [Events, Options, DataSource],
        options: {
            $id: "",
            $xtype: xtype,
            data: [],//[{wid:'1',name:''},{wid:'2',name:''}]

            _dataMap: {},
            _dataArray: [],
            fetchUrl: '',
            fetchParam: {},
            syncUrl: '',
            syncParam: {},
            autoSync: false,
            model: {
                id: 'wid',
                status: Constant.status,
                notModify: Constant.notModify,
                add: Constant.add,
                update: Constant.update,
                remove: Constant.remove
            }
        },

        initialize: function (opts) {
            this.setOptions(opts);
            if (!this.options || this.options.$id == "") {
                this.options.$id = this.options.$xtype + String.uniqueID();
            }
            this._initData();

        },

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        getFetchParam: function () {
            return {};
        },

        getSyncParam: function () {
            return this.getValue();
        },

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        _initData: function () {
            if (this.options.data && this.options.data.length > 0) {
                for (var i = 0; i < this.options.data.length; i++) {
                    var d = this.options.data[i];
                    var dv = Page.create("dataValue", {
                        data: d
                    });
                    this.options._dataMap[d[this.options.model.id]] = dv;
                    this.options._dataArray.push(dv);
                }
            }
        },

        getValue: function () {
            var o = [];
            var array = this.options._dataArray;
            for (var i = 0; i < array.length; i++) {
                var value = array[i];
                o.push(value.getValue());
            }
            return o;
        },

        getModifiedValue: function () {
            var o = [];
            var array = this.options._dataArray;
            for (var i = 0; i < array.length; i++) {
                var value = array[i];
                if (value[this.options.model.notModify]) {
                    continue;
                }
                o.push(value.getModifiedValue());
            }
            return o;
        },

        getId: function () {
            return this.options.$id;
        },

        at: function (index) {
            return this.options._dataArray[index];
        },
        readRecord: function (id) {
            if (id == undefined) {
                return this.options._dataArray;
            } else {
                return this.options._dataMap[id];
            }
        },
        deleteRecord: function (id) {
            if (id) {
                var r = this.readRecord(id);
                if (r) {
                    var status = r.options.data[this.options.model.status];
                    this.fireEvent("beforeDeleteRecord", [r]);
                    if (status == this.options.model.add) {
                        //real delete
                        this.options._dataArray.erase(r);
                        delete this.options._dataMap[id];
                    } else {
                        r.changeStatus(this.options.model.remove);
                    }
                    this.fireEvent("afterDeleteRecord", [r]);
                    this._valueChanged();
                }
            } else {
                window.console.log("没有找到指定ID的纪录.");
            }
        },
        addRecord: function (record) {
            var vid = this.options.model.id;
            if (!vid) {
                //error
                window.console.log("纪录没有指定ID.");
                return;
            }
            var rid = record[this.options.model.id];
            if (rid) {
                this.fireEvent("beforeAddRecord", [r]);
                var dv = Page.create("dataValue", {
                    data: record
                });
                this.options._dataMap[rid] = dv;
                this.options._dataArray.push(dv);
                this.fireEvent("afterAddRecord", [r]);
                this._valueChanged();
            } else {
                window.console.log("纪录没有指定ID.");
            }
        },
        updateRecord: function (record) {
            var vid = this.options.model.id;
            if (!vid) {
                //error
                window.console.log("纪录没有指定ID.");
                return;
            }
            var r = this.readRecord(record[vid]);
            if (r) {
                r.updateRecord(record);
                this._valueChanged();
            }
        }
    });
    DataSet.xtype = xtype;
    return DataSet;
});