/**
 * Created by qianqianyi on 15/4/23.
 */

require(["../Factory"], function (factory) {
    var Base = new Class({
        Implements: [Events, Options],
        initialize: function (opts) {
            this.setOptions(opts);
        },
        render: function () {

        }
    });
    factory.add("base", Base);
    return Base;
});
