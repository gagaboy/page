require.config({
    paths: {
        art: '../../../../page/lib/artdialog/artDialog.source',
        artIframe: '../../../../page/lib/artdialog/iframeTools.source',
        my97DatePicker: "../../../../../../page/lib/My97DatePicker/WdatePicker"
    },
    shim: {
        art: {
            exports: 'art'
        },
        artIframe: {
            deps: ['art'],
            exports: 'artIframe'
        },
        my97DatePicker: {
            exports: "my97DatePicker"
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