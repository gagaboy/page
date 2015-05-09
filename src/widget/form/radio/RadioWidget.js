define(['../BaseFormWidget', 'text!./RadioWidget.html', 'css!./RadioWidget.css'],function(BaseFormWidget, template){
    var xtype = "radio";
    var RadioWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            rowcols: 1,//每行显示列数
            data: [],//展示的数据
            clickCheck:function(d,data){
                for(var i =0;i<data.length;i++){
                    data[i].clicked=false;
                }
                d.clicked = true;
            }
        },
        initialize: function (opts) {
            var d = opts.data;
            for (var i = 0; i < d.length; i++) {
                if (d[i].clicked == undefined) {
                    d[i].clicked = false;
                }
            }
            this.parent(opts);
        },
        getTemplate: function () {
            return template;
        },
        getOptions : function(){
            var d = this.getAttr('data');
            var arr = [];
            for(var i =0;i< d.length;i++){
                if(d[i].clicked){
                    var one_arr = [];
                    one_arr.push("value:"+d[i].value);
                    one_arr.push("display:"+d[i].display);
                    arr.push(one_arr);
                }
            }
            return arr;
        },
        getValue:function(){
            var d = this.getAttr('data');
            var values=[];
            for(var i =0;i< d.length;i++){
                if(d[i].clicked){
                    values.push(d[i].value);
                }
            }
            return values;
        },
        setValue:function(key,clicked){
            var d = this.getAttr('data');
            for(var i =0;i< d.length;i++){
                if(d[i].value == key){
                    d[i].clicked=clicked;
                }
            }
            return;
        }

    });
    RadioWidget.xtype = xtype;
    return RadioWidget;
});
