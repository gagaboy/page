/**
 *
 * meta :{
 *   mainAlias:'',
 *
 *
 *
 * }
 *
 *
 *
 */
define(["./DataConstant"], function (Constant) {

    var xtype = "dataValue";
    var DataValue = new Class({
        Implements: [Events, Options],
        options: {
            $id: "",
            $xtype: xtype,
            data: {},
            model: {
                id: 'wid',
                childAlias: ['items'],
                refAlias: ["xb"],
                status: Constant.status,
                notModify: Constant.notModify,
                add: Constant.add,
                update: Constant.update,
                remove: Constant.remove
            }
        },

        initialize: function (opts) {
            this.childDS = {};
            this.refDS = {};

            this.setOptions(opts);
            if (!this.options || this.options.$id == "") {
                this.options.$id = this.options.$xtype + String.uniqueID();
            }
            this._initData();
        },

        getId: function () {
            return this.options.$id;
        },

        _initData: function () {
            var $this = this;
            if (!this.options.data[this.options.model.status]) {
                this.options.data[this.options.model.status] = this.options.model.notModify;
            }
            this.options.model.childAlias.each(function (v, i) {
                if($this.options.data[v]){
                    var child = Page.create("dataSet", {
                        data: $this.options.data[v]
                    });
                    $this.childDS[v] = child;
                    delete $this.options.data[v];
                }
            });
            this.options.model.refAlias.each(function (v, i) {
                if($this.options.data[v]){
                    var ref = Page.create("dataValue", {
                        data: $this.options.data[v]
                    });
                    $this.refDS[v] = ref;
                    delete $this.options.data[v];
                }

            });
        },

        getChildDS: function (alias) {
            return this.childDS[alias];
        },
        getRefDS: function (alias) {
            return this.refDS[alias];
        },
        changeStatus:function(status){
            this.options.data[this.options.model.status] = status;
        },
        getStatus:function(){
            return this.options.data[this.options.model.status];
        },
        getValue: function () {
            var value = {};
            var $this = this;
            Object.merge(value, this.options.data);
            this.options.model.childAlias.each(function (v, i) {
                if($this.childDS[v]){
                    var cvalue = $this.childDS[v].getValue();
                    value[v] = cvalue;
                }

            });
            this.options.model.refAlias.each(function (v, i) {
                if($this.refDS[v]){
                    var cvalue = $this.refDS[v].getValue();
                    value[v] = cvalue;
                }

            });
            return value;
        },
        updateRecord: function (value) {
            var r = this.options.data;
            Object.merge(r, value);
            if (r[status] != this.options.model.add) {
                r[status] = this.options.model.update;
            }
        },
        deleteRecord: function () {
            var r = this.options.data;
            r[status] = this.options.model.remove;
        }
    });
    DataValue.xtype = xtype;
    return DataValue;
});