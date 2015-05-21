/**
 * Created by JKYANG on 15/5/20.
 * 做数据的绑定动作
 */
define(['../BaseLayout', 'text!./Fragment.html'], function (BaseLayout, tpl) {
    var xtype = "fragment";
    var Fragment = new Class({
        Extends: BaseLayout,
        options: {
            $xtype: xtype,
            status: "default",
            dataSources: {}, // dataSet, dataValue,可能有多个,{ds1:{type:'', options:{}}}
            dataBinders: {} //{db1:{componentId:'',dsId:'', fieldId:''}}
        },

        getTemplate: function () {
            return tpl;
        },

        getElementToAppend: function () {
            return this.$element;
        },

        _afterLayoutRender: function () {
            //1. createDataSources
            //2. createDataBinders
            this.DS = {};
            this.DB = {};
            for (var d in this.options.dataSources) {
                var ds = this.options.dataSources[d];
                this.addDataSource(d, ds);
            }
            for (var d in this.options.dataBinders) {
                var ds = this.options.dataBinders[d];
                this.addDataBinder(d, ds);
            }

        },

        /**
         * @param id
         * @param ds {ds1:{type:'', options:{}}}
         */
        addDataSource: function (id, ds) {
            var dataSource = Page.create(ds['type'], Object.merge(ds['options'], {$id: id}));
            this.DS[id] = dataSource;
        },

        /**
         * @param id
         * @param ds
         */
        addDataBinder: function (id, ds) {
            var dataBind = Page.create('dataBinder', ds);
            this.DB[id] = dataBind;
        },

        getDataSource: function (id) {
            return this.DS[id];
        },

        destroy: function () {
            this.parent();
            //删除DS，DB
            Object.each(this.DB, function (value, key) {
                value.destory();
            });
            Object.each(this.DS, function (value, key) {
                value.destory();
            });
        }

    });
    Fragment.xtype = xtype;
    return Fragment;
});