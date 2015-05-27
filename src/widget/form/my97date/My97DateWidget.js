define(['../BaseFormWidget', 'text!./My97DateWidget.html', 'my97DatePicker'], function (BaseFormWidget, template, my97DatePicker) {
    var xtype = "my97datepicker";
    var My97DateWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            doubleCalendar:true,
            dateFmt:'yyyy-MM-dd'
        },
        render: function (opts) {
            var p = jQuery.extend({}, this.options, opts || {});
            this.parent(opts);
            this._getInputElement().bind("focus",function(){
                WdatePicker(p);
            });
        },
        getTemplate: function () {
            return template;
        },
        _getInputElement: function () {
            var input = jQuery(this.getElement()).find("input.form-widget-to-focus-class");
            return input;
        }
    });
    My97DateWidget.xtype = xtype;
    return My97DateWidget;
});