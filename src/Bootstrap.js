require.config({
    paths: {
        art: '../../../../page/lib/artdialog/artDialog.source',
        artIframe: '../../../../page/lib/artdialog/iframeTools.source',
        my97DatePicker: "../../../../../../page/lib/My97DatePicker/WdatePicker",
        zTree: "../../../../../../page/lib/zTree_v3/js/jquery.ztree.all-3.5.min"
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
        },
        zTree: {
            exports: "zTree"
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