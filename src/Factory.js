/**
 *
 */
var componentAlias = [
    "src/widget/Base",
    "src/widget/form/BaseFormWidget",
    "src/widget/form/InputWidget",
    "src/widget/layout/BaseLayout"
];


define(componentAlias, function () {
    var allComps = arguments;
    var Factory = new Class({
        initialize: function () {
            this.classMap = {};
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
            return new this.classMap[xtype](config)
        }
    });
    //**********************************
    var factory = new Factory();
    Array.each(allComps, function (c, index) {
        factory.add(c.xtype, c);
    });
    return factory;
});