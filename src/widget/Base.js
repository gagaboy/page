/**
 * Created by qianqianyi on 15/4/23.
 */

define([], function () {
    var Base = new Class({
        Implements: [Events, Options],

        initialize: function (opts) {
            this.setOptions(opts);
        },
        render: function () {

        }
    });
    Base.xtype = 'base';
    return Base;
});
