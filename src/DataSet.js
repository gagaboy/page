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
    var DataSet = new Class({
        Implements: [Events, Options],
        initialize: function (opts) {
            this.setOptions(opts);
        },
        options: {
            data: [],
            readUrl: '',
            syncUrl: '',
            defaultArg: {}
        },
        ajax: function (url, params, success, fail) {
            jQuery.ajax({
                url: url,
                data: params,
                dataType: 'json',
                cache: false,
                success: function (data) {
                    //TODO
                    success(data);
                },
                error: fail
            });
        },
        fetch: function (callback) {
            var $this = this;
            var params = {};
            this.ajax(this.options.readUrl, params, function (data) {
                $this.data = data;
                //TODO
                callback()
            }, null);
        },
        sync: function (callback) {
            var $this = this;
            var params = {};
            this.ajax(this.options.syncUrl, params, function (data) {
                //TODO
                callback()
            }, null);
        },
        readRecord: function (id) {

        },
        deleteRecord: function (id) {

        },
        addRecord: function (record) {

        },
        updateRecord: function (record) {

        }
    });
    return DataSet;
});