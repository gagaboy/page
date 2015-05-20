/**
 * Created by JKYANG on 15/5/12.
 */
define([], function () {
    var xtype = "dataBinder";
    var DataBinder = new Class({
        Implements: [Events, Options],
        options: {
            $id: "",
            $xtype: xtype,
            dataValueId: null,// 可以为dataValue  也可以为dataSet
            fieldId: null, //如果为空，则widget要实现绑定机制,即setValue，getValue,参数为对象
            widgetId: null
        },
        initialize: function (opts) {
            this.setOptions(opts);
            if (!this.options || this.options.$id == "") {
                this.options.$id = this.options.$xtype + String.uniqueID();
            }
            this.bind();
        },
        bind: function () {
            var dataValue = Page.manager.components[this.options.dataValueId];
            var widget = Page.manager.components[this.options.widgetId];
            var $this = this;
            this.widgetValueChangeCallback = function (value) {
                var fieldId = $this.options.fieldId;
                var val = {};
                if (fieldId) {
                    val[fieldId] = value;
                } else {
                    val = value;
                }
                dataValue.updateRecord(val, true);
            }
            this.dataValueChangeCallback = function (record) {
                var fieldId = $this.options.fieldId;
                widget.setValue(record[fieldId]);
            }
            widget.addEvent("valueChange", this.widgetValueChangeCallback);
            dataValue.addEvent("afterUpdateRecord", this.dataValueChangeCallback);
        },
        getId: function () {
            return this.options.$id;
        },

        destroy: function () {
            var dataValue = Page.manager.components[this.options.dataValueId];
            var widget = Page.manager.components[this.options.widgetId];
            dataValue.removeEvent("afterUpdateRecord", this.dataValueChangeCallback);
            widget.removeEvent("valueChange", this.widgetValueChangeCallback);
        }
    });
    DataBinder.xtype = xtype;
    return DataBinder;
});