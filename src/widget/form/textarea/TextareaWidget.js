define(['../BaseFormWidget', 'text!./TextareaWidget.html', 'css!./TextareaWidget.css'],function(BaseFormWidget, template){
    var xtype = "textarea";
    var TextareaWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            rows: '',//ռ���� ������ʱ��Ч
            cols:''//������ʱ��Ч
        },
        initialize: function (opts) {
            var rows = opts.rows;
            if(rows==undefined) rows=3;
            var cols = opts.cols;
            if(cols==undefined)cols=10;
            this.parent(opts);
        },
        getTemplate: function () {
            return template;
        },
        getValue:function(){
            var ret_val = this.getAttr('value');
            return ret_val;
        },
        setValue:function(text){
            this.setAttr('value',text);
        }
    });
    TextareaWidget.xtype = xtype;
    return TextareaWidget;
});
