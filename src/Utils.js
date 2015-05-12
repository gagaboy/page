/**
 * Created by qianqianyi on 15/5/6.
 */
define([], function () {
    var Utils = new Class({
        uuid: function () {
            return String.uniqueID();
        },
        ajax: function (url, params, success, fail) {
            jQuery.ajax({
                url: url,
                data: params,
                type:'POST',
                dataType: 'json',
                cache: false,
                success: function (data) {
                    //TODO
                    success(data);
                },
                error: fail
            });
        }
    });
    return Utils;
});