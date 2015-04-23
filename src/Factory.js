/**
 *
 */
require([], function () {
    var Factory = new Class({
        initialize: function () {
            this.classMap = {};
        },
        add: function (xtype, clazz) {
            this.classMap[xtype] = clazz;
        }
    });

    //**********************************
    var factory = new Factory();
    return factory;
});