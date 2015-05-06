
define(["./Factory"], function (factory) {

    var named = "Page";;

    if (window[named] == undefined) {
        window[named] = factory;
    }
    return factory;
});