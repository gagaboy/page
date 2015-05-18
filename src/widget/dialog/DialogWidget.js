/**
 * Created by hhxu on 15/5/12.
 */
define(['../Base','text!./DialogWidget.html', 'art','artIframe','css!./DialogWidget.css','css!./../../../lib/artdialog/skins/blue.css','css!./../../../lib/artdialog/skins/blue.css','css!./../../../lib/artdialog/css/ui-dialog.css'
], function (Base, template, art, artIframe) {
    var xtype = "dialog";
    var DialogWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,

            title:'提示',
            url:'',
            content:'',
            width:'',
            height:'',
            button:[],
            params:""

        },
        dialogObj:null,
        render: function () {
            this.fireEvent("beforeRender", [this.vmodel]);
            var $this = this;
            var options = $this.options;
            var paramsstr = options.params;  //TODO 可能处理传入的参数
            var url = options.url+paramsstr;

            var dialogParams = {
                lock: true,
                title: options.title,
                url: options.url,
                button: options.button,
                width: options.width!=""?options.width:undefined,
                height: options.height!=""?options.height:undefined
            }

            if(options.url){
                this.dialogObj = art.dialog.open(url, dialogParams);
            }else{
                dialogParams.content = options.content;
                this.dialogObj = art.dialog(dialogParams);
            }


            $this.fireEvent("afterRender", [this.vmodel]);
            if (this["_afterRender"]) {
                this["_afterRender"](this.vmodel);
            }
            return this;
        },
        close: function() {
            this.dialogObj.close();
        },
        show: function() {
            this.dialogObj.show();
        },
        hide: function() {
            this.dialogObj.hide();
        },
        lock: function() {
            this.dialogObj.lock();
        },
        unlock: function() {
            this.dialogObj.unlock();
        },
        title: function(value) {
            this.dialogObj.title(value);
        },
        content: function(value) {
            this.dialogObj.content(value);
        },
        getTemplate: function(){
            return template;
        }
    });
    DialogWidget.xtype = xtype;
    return DialogWidget;
});