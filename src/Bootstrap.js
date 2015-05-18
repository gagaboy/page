require.config({
    paths: {
        art: '../../../../../page/lib/artdialog/artDialog.source',
        artIframe: '../../../../../page/lib/artdialog/iframeTools.source'
    },
    shim: {
        art: {
            exports: 'art'
        },
        artIframe: {
            deps: ['art'],
            exports: 'artIframe'
        }
    }
});

define(["./Factory"], function (factory) {

    var named = "Page";

    if (window[named] == undefined) {
        window[named] = factory;
    }
    return factory;
});