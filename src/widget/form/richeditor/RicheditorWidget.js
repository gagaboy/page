define(['../BaseFormWidget','text!./RicheditorWidget.html','kindeditor','css!./RicheditorWidget.css',
    'css!./../../../../lib/kindeditor-4.1.10/themes/default/default.css',
    'css!./../../../../lib/kindeditor-4.1.10/plugins/code/prettify.css'], function (BaseFormWidget,template,kindEditor) {
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
            //var inputObj = this.getParentElement().find(".e-richEditor")[0];
            //if(inputObj){
                var that = this;
                if(!window.contextPath){
                    window.contextPath = this.options.contextPath;
                }
                if(that.options.simple){
                    that.options.items = [
                        'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                        'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                        'insertunorderedlist', '|', 'emoticons', 'image', 'link'];
                    //关键  同步KindEditor的值到textarea文本框   解决了多个editor的取值问题
                    that.options.afterBlur = function(){
                        this.sync();
                    };
                }
                that.editorObj = KindEditor.create("#tex_"+that.getId(),that.options);
                if(that.options.value){
                    that.editorObj.html(that.options.value);
                }
            //}
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
            if(this.editorObj&&this.editorObj.html){
                return this.editorObj.html();
            }
            return "";
        },
        setValue:function(htmlCon){
            var value = null;
            if(typeof(htmlCon)=="object"){
                value = htmlCon.value;
            }else{
                value = htmlCon;
            }
            if(this.editorObj&&this.editorObj.html&&value){
                this.editorObj.html(htmlCon);
            }
        }
    });
    TooltipWidget.xtype = xtype;
    return TooltipWidget;
});