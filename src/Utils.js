/**
 * Created by qianqianyi on 15/5/6.
 */
define([], function () {
    var Utils = new Class({
        uuid: function () {
            return String.uniqueID();
        }
    });
    return Utils;
});