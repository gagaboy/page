/**
 *

var componentAlias = [
    "./Manager",
    "./Validation",
    "./Utils",
    "./widget/Base",
    "./widget/form/BaseFormWidget",
    "./widget/form/input/InputWidget",
    "./widget/form/combobox/ComboboxWidget",
    "./widget/layout/BaseLayout"
];
 */

define([
    "./Manager",
    "./Validation",
    "./Utils",
    "./data/DataValue",
    "./data/DataSet",
    "./data/DataBinder",
    "./widget/Base",
    "./widget/form/BaseFormWidget",
    "./widget/form/input/InputWidget",
    "./widget/form/combobox/ComboboxWidget",
    "./widget/form/datepicker/DatepickerWidget",
    "./widget/pagination/PaginationWidget",
    "./widget/layout/BaseLayout",
    "./widget/simple/SimpleGrid",
    "./widget/form/checkbox/CheckboxWidget",
    "./widget/form/radio/RadioWidget",
    "./widget/form/textarea/TextareaWidget"
], function () {
    var allComps = arguments;

    var Factory = new Class({
        initialize: function () {
            this.classMap = {};
            this.manager = new allComps[0]();
            this.validation = new allComps[1]();
            this.utils = new allComps[2]();
        },
        add: function (xtype, clazz) {
            this.classMap[xtype] = clazz;
        },
        getAll: function () {
            return this.classMap;
        },
        create: function (xtype, config) {
            if (this.classMap[xtype] === undefined) {
                //error
                return;
            }
            var instance = new this.classMap[xtype](config);
            var id = instance.getId();
            this.manager.add(id, instance);
            return instance;
        }
    });
    //**********************************
    var factory = new Factory();
    Array.each(allComps, function (c, index) {
        if(c.xtype) {
            factory.add(c.xtype, c);
        }
    });
    return factory;
});