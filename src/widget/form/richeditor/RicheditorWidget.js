define(['../BaseFormWidget','text!./RicheditorWidget.html','css!./RicheditorWidget.css'], function (BaseFormWidget,template) {
    var xtype = "richeditor";//
    var TooltipWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            show:true,
            simple:false,
            minWidth : 200,//最小宽度
            minHeight : 100,//最小高度
            width:"100%",
            height:"100%",
            contextPath:""
        },
        editorObj:{},
        _afterRender:function(){
            var inputObj = this.getParentElement().find(".e-richEditor")[0];
            if(inputObj){
                var that = this;
                if(!window.contextPath){
                    window.contextPath = this.options.contextPath;
                }
                if(that.options.simple){
                    that.options.items = [
                        'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                        'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                        'insertunorderedlist', '|', 'emoticons', 'image', 'link']
                }
                KindEditor.ready(function(K) {
                    that.editorObj = K.create(inputObj,that.options);
                });
            }
        },
        getTemplate: function(){
            return template;
        },
        destroy:function(){
            this.editorObj.destroy()
            this.parent();
        },
        show:function(){
            this.editorObj.show();
        },
        hide:function(){
            this.editorObj.hide();
        },
        switchStatus: function (status) {
            this.parent(status);
            this.setAttr("value",this.getValue());
        },
        getValue:function(){
            return this.editorObj.html();
        },
        setValue:function(htmlCon){
            this.editorObj.html(htmlCon);
        }
    });
    TooltipWidget.xtype = xtype;
    return TooltipWidget;
});