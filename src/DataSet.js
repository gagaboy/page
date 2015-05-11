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
define([], function () {
    var status = "$status$";
    var notModify = "$notModify$";
    var add = "$add$";
    var update = "$update$";
    var remove = "$remove$";
    var xtype = "dataSet";
    var DataSet = new Class({
        Implements: [Events, Options],
        options: {
            $id: "",
            $xtype: xtype,
            data: [],//[{wid:'1',name:''},{wid:'2',name:''}]
            _dataMap: {},
            _childrenData: {},
            _refData: {},
            readUrl: '',
            syncUrl: '',
            defaultArg: {},
            model: {
                id: 'wid',
                childAlias: ['items'],
                refAlias: ["xb"],
                status: status,
                notModify: notModify,
                add: add,
                update: update,
                remove: remove
            }
        },

        initialize: function (opts) {
            this.setOptions(opts);
            if (!this.options || this.options.$id == "") {
                this.options.$id = this.options.$xtype + String.uniqueID();
            }
            this._initData();
        },
        _initData: function () {
            if (this.options.data && this.options.data.length > 0) {
                for (var i = 0; i < this.options.data.length; i++) {
                    var d = this.options.data[i];
                    for (var j = 0; j < this.options.model.childAlias.length; j++) {
                        var alias = this.options.model.childAlias[j];
                        var cRecord = d[alias];
                        if (cRecord) {
                            this.options._childrenData[alias] = new DataSet({
                                data: cRecord
                            });
                        }
                        delete d[alias];
                    }
                    for (var j = 0; j < this.options.model.refAlias.length; j++) {
                        var alias = this.options.model.refAlias[j];
                        var cRecord = d[alias];
                        if (cRecord) {
                            this.options._refData[alias] = new DataSet({
                                data: [cRecord]
                            });
                        }
                        delete d[alias];
                    }
                    d[status] = notModify;
                    this.options._dataMap[d[this.options.model.id]] = d;
                }
            }
        },
        getValue: function () {
            var o = [];
            var array = this.options.data;
            for (var i = 0; i < array.length; i++) {
                var value = array[i];
                var oo = Object.merge({}, value);
                o.push(oo);
                for (var j = 0; j < this.options.model.childAlias.length; j++) {
                    var key = this.options.model.childAlias[j];
                    var ds = this.getChildDS(key);
                    if (ds) {
                        oo[key] = ds.getValue();
                    }
                }
                for (var j = 0; j < this.options.model.refAlias.length; j++) {
                    var key = this.options.model.refAlias[j];
                    var ds = this.getRefDS(key);
                    if (ds) {
                        oo[key] = ds.getValue()[0];
                    }
                }
            }
            return o;
        },
        getId: function () {
            return this.options.$id;
        },
        fetch: function (callback) {
            var $this = this;
            var params = {};
            Page.utils.ajax(this.options.readUrl, params, function (data) {
                $this.data = data;
                this._initData();
                //TODO
                callback()
            }, null);
        },
        sync: function (callback) {
            var $this = this;
            var params = this.getValue();
            Page.utils.ajax(this.options.syncUrl, params, function (data) {
                //TODO
                callback()
            }, null);
        },
        at: function (index) {
            return this.options.data[index];
        },
        readRecord: function (id) {
            if (id == undefined) {
                return this.options.data;
            } else {
                return this.options._dataMap[id];
            }
        },
        getChildDS: function (alias) {
            return this.options._childrenData[alias];
        },
        getRefDS: function (alias) {
            return this.options._refData[alias];
        },
        readChildRecord: function (alias, id) {
            if (this.options._childrenData[alias]) {
                return this.options._childrenData[alias].readRecord(id);
            }
            return null;
        },
        deleteRecord: function (id) {
            if (id) {
                var r = this.readRecord(id);
                if (r) {
                    if (r[status] == add) {
                        //real delete
                        this.options.data.erase(r);
                        delete this.options._dataMap[id];
                    } else {
                        r[status] = remove;
                    }
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
                var re = record;
                re[status] = add;
                this.options.data.push(re);
                this.options._dataMap[rid] = re;
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
                Object.merge(r, record);
                if (r[status] != add) {
                    r[status] = update;
                }
            }
        }
    });
    DataSet.xtype = xtype;
    return DataSet;
});