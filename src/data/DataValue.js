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
define(["./DataConstant", "./DataSource"], function (Constant, DataSource) {

    var xtype = "dataValue";
    var DataValue = new Class({
        Implements: [Events, Options, DataSource],
        options: {
            $id: "",
            $xtype: xtype,
            data: {},
            fetchUrl: '',
            fetchParam: {},
            syncUrl: '',
            syncParam: {},
            autoSync: false,
            model: {
                id: 'wid',
                childAlias: [],
                refAlias: [],
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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        getFetchParam: function () {
            return {};
        },

        getSyncParam: function () {
            return this.getValue();
        },
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        _initData: function (forceNotModify) {
            var $this = this;
            if (!this.options.data[this.options.model.status] || forceNotModify) {
                this.options.data[this.options.model.status] = this.options.model.notModify;
            }
            this.options.model.childAlias.each(function (v, i) {
                if ($this.options.data[v]) {
                    var child = Page.create("dataSet", {
                        data: $this.options.data[v]
                    });
                    $this.childDS[v] = child;
                    delete $this.options.data[v];
                }
            });
            this.options.model.refAlias.each(function (v, i) {
                if ($this.options.data[v]) {
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
        changeStatus: function (status) {
            this.options.data[this.options.model.status] = status;
        },
        getStatus: function () {
            return this.options.data[this.options.model.status];
        },
        getValue: function () {
            var value = {};
            var $this = this;
            Object.merge(value, this.options.data);
            this.options.model.childAlias.each(function (v, i) {
                if ($this.childDS[v]) {
                    var cvalue = $this.childDS[v].getValue();
                    value[v] = cvalue;
                }
            });
            this.options.model.refAlias.each(function (v, i) {
                if ($this.refDS[v]) {
                    var cvalue = $this.refDS[v].getValue();
                    value[v] = cvalue;
                }

            });
            return value;
        },
        updateRecord: function (value, notFireEvent) {
            var r = this.options.data;
            if (!notFireEvent) {
                this.fireEvent("beforeUpdateRecord", [value, r]);
            }
            Object.merge(r, value);
            if (r[this.options.model.status] != this.options.model.add) {
                r[this.options.model.status] = this.options.model.update;
            }
            if (!notFireEvent) {
                this.fireEvent("afterUpdateRecord", [value]);
            }
            this._valueChanged();
        },

        deleteRecord: function () {
            var r = this.options.data;
            r[this.options.model.status] = this.options.model.remove;
            this._valueChanged();
        }
    });
    DataValue.xtype = xtype;
    return DataValue;
});