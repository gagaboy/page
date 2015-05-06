/**
 *
 */
var componentAlias = [
    "src/Manager",
    "src/Validation",
    "src/widget/Base",
    "src/widget/form/BaseFormWidget",
    "src/widget/form/input/InputWidget",
    "src/widget/form/combobox/ComboboxWidget",
    "src/widget/layout/BaseLayout"
];


define(componentAlias, function () {
    var allComps = arguments;

    var Factory = new Class({
        initialize: function () {
            this.classMap = {};
            this.manager = new allComps[0]();
            this.validation = new allComps[1]();
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
        factory.add(c.xtype, c);
    });
    return factory;
});