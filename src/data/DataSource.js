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

        getSyncParam: function (filterNotModify) {
            var p = {};
            var value = this.getUploadValue(filterNotModify);
            Object.merge(p, {data: value});
            Object.merge(p, this.options.syncParam);
            return p;
        },

        fetch: function () {
            var $this = this;
            return new Promise(function (resolve) {
                $this.fireEvent("beforeFetch");
                var params = $this.getFetchParam();
                Page.utils.ajax($this.options.fetchUrl, params, function (data) {
                    var result = data.result;

                    ///***************wrap for emp start *****************************
                    result = result[Constant.data];
                    if ($this.options.model.mainAlias && $this.options.model.mainAlias != '') {
                        result = result[$this.options.model.mainAlias];
                    }
                    if ($this.options.model.childAlias && $this.options.model.childAlias.length > 0) {
                        for (var i = 0; i < $this.options.model.childAlias.length; i++) {
                            var calias = $this.options.model.childAlias[i];
                            result[calias] = ((data.result)[Constant.data])[calias];
                        }
                    }
                    ///***************wrap for emp end *****************************

                    $this.options.data = result[Constant.rows];
                    $this.options.pageSize = result[Constant.pageSize];
                    $this.options.pageNo = result[Constant.pageNo];
                    $this.options.totalSize = result[Constant.totalSize];
                    $this._initData();
                    resolve();
                }, null);
            });

        },
        sync: function (filterNotModify, uploadString) {
            var $this = this;
            return new Promise(function (resolve) {
                var params = $this.getSyncParam(filterNotModify);
                if(uploadString) {
                    params.data = JSON.stringify(params.data);
                }
                Page.utils.ajax($this.options.syncUrl, params, function (data) {
                    //TODO reset $status$ 返回ID ??
                    $this._initData(true);
                    resolve(data);

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
        },
        destroy: function () {
            Page.manager.remove(this.getId());
        }
    });
    return DataSource;
});