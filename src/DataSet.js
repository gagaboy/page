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
 *     扩展：计算属性
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

    var DataSet = new Class({
        Implements: [Events, Options],
        initialize: function (opts) {
            this.setOptions(opts);
        },
        options: {
            data: [],//[{wid:'1',name:''},{wid:'2',name:''}]
            _dataMap: {},
            readUrl: '',
            syncUrl: '',
            defaultArg: {},
            model: {
                id: 'wid',
                status: status,
                notModify: notModify,
                add: add,
                update: update,
                remove: remove
            }
        },
        fetch: function (callback) {
            var $this = this;
            var params = {};

            Page.utils.ajax(this.options.readUrl, params, function (data) {
                $this.data = data;
                for (var i = 0; i < $this.data.length; i++) {
                    var d = $this.data[i];
                    d[status] = notModify;
                    $this.options._dataMap[d[$this.options.model.id]] = d;
                }
                //TODO
                callback()
            }, null);
        },
        sync: function (callback) {
            var $this = this;
            var params = {};
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
        deleteRecord: function (id) {

        },
        addRecord: function (record) {
            var re = record;
            this.options.data.push(re);
        },
        updateRecord: function (record) {

        }
    });
    return DataSet;
});