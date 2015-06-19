require.config({
    paths: {
        art: '../../../../page/lib/artdialog/artDialog.source',
        artIframe: '../../../../page/lib/artdialog/iframeTools.source',
        my97DatePicker: "../../../../../../page/lib/My97DatePicker/WdatePicker",
        zTree: "../../../../../../page/lib/zTree_v3/js/jquery.ztree.all-3.5",
        kindeditor: "../../../../../../page/lib/kindeditor-4.1.10/kindeditor"
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
        },
        kindeditor: {
            exports: "kindeditor"
        }
    }
});

define(["./Factory", "../lib/mmPromise"], function (factory) {

    var named = "Page";

    if (window[named] == undefined) {
        window[named] = factory;
    }
    return factory;
});