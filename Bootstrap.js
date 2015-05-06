
require(["./src/Factory", "./lib/mmPromise"], function (factory) {

    var named = "Page";

    if(window[named] == undefined) {
        window[named] = factory;
    }

});