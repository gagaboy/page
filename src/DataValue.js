/**
 *
 * meta :{
 *   mainAlias:'',
 *
 *
 *
 * }
 *
 *
 *
 */
define([], function () {
    var DataValue = new Class({
        initialize: function (opts) {
            this.main = {};
            this.many2one = {};
            this.one2many = {};
        }
    });
    return DataValue;
});