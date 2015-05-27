define(['../BaseFormWidget', 'text!./My97DateWidget.html', 'my97DatePicker'], function (BaseFormWidget, template, my97DatePicker) {
    var xtype = "datepicker";
    var My97DateWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            value: null,
            $opts:{
                doubleCalendar: false,
                dateFmt:'yyyy-MM-dd',
                firstDayOfWeek:7
            },
            showPanel: function(vid) {
                var vm = vid ? avalon.vmodels[vid] : this;
                var opt = Object.merge({}, vm.$opts);
                opt.el = "datePicker_"+vid;
                WdatePicker(opt);
            }
        },


        initialize: function (opts) {
            var $opts = {};
            var formOpt = Page.create("baseFormWidget", {}).options;
            for(var key in opts) {
                if(!(key in formOpt) && key!="$id" && !key.startsWith("on")) {
                    $opts[key] = opts[key];
                    if("formatDate" == key) {
                        $opts["dateFmt"] = opts[key];
                    }
                    delete opts[key];
                }
            }
            opts.$opts = $opts;
            this.parent(opts);
        },
        render: function(parent) {
            this.parent(parent);

            var that = this;
            this._getInputElement().bind("focus",function(){
                WdatePicker(that.options.$opts);
            });
        },
        _valueChange: function (value) {
            this.setAttr("display", value);
            this.validate();//即时校验
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