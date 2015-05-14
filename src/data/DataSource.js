/**
 * Created by qianqianyi on 15/5/12.
 *
 * define dataSet or dataValue' id & remote service address
 *
 * options:
 *  auto sync
 * methods:
 *  fetch
 *  sync
 */
define(["./DataConstant"], function (Constant) {
    var DataSource = new Class({
        isAutoSync: function () {
            return this.options.autoSync;
        },
        _valueChanged: function () {
            if (this.isAutoSync()) {
                window.console.log("auto sync.");
                this.sync();
            }
        },

        getFetchParam: function () {
            var other = this._otherFetchParam();
            var fp = this.options.fetchParam
            if (other) {
                Object.merge(fp, other);
            }
            return fp;
        },

        getSyncParam: function () {
            var p = {};
            Object.merge(p, this.getValue(), this.options.syncParam);
            return p;
        },

        fetch: function () {
            var $this = this;
            return new Promise(function(resolve){
                var params = $this.getFetchParam();
                Page.utils.ajax($this.options.fetchUrl, params, function (data) {
                    var result = data.result;
                    $this.options.data = result['data'];
                    $this.options.pageSize = result[Constant.pageSize];
                    $this.options.pageNo = result[Constant.pageNo];
                    $this.options.totalSize = result[Constant.totalSize];
                    $this._initData();
                    resolve();
                }, null);
            });

        },
        sync: function () {
            var $this = this;
            return new Promise(function(resolve){
                var params = $this.getSyncParam();
                Page.utils.ajax($this.options.syncUrl, params, function (data) {
                    //TODO reset $status$
                    $this._initData(true);
                    resolve();

                }, null);
            });
        },
        getAttr: function (key) {
            return this.options[key];
        },
        setAttr: function (key, value) {
            var oldValue = this.options[key];
            this.options[key] = value;
            var privateMethod2Invoke = '_' + key + "Change";
            if (this[privateMethod2Invoke]) {
                // old value, new value, vm.model
                this[privateMethod2Invoke](value, oldValue);
            }
            this.fireEvent(key + "Change", [value, oldValue]);
            return this;
        }
    });
    return DataSource;
});