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
define([], function () {
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
        fetch: function (callback) {
            var $this = this;
            var params = this.getFetchParam();

            Page.utils.ajax(this.options.fetchUrl, params, function (data) {
                $this.data = data;
                $this._initData();
                //TODO
                callback()
            }, null);
        },
        sync: function (callback) {
            var $this = this;
            var params = this.getSyncParam();
            Page.utils.ajax(this.options.syncUrl, params, function (data) {
                //TODO reset $status$
                $this._initData(true);
                callback()
            }, null);
        }
    });
    return DataSource;
});