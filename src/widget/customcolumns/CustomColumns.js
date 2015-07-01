/**
 * Created by hhxu on 15/6/28.
 *
 */
define(['../Base','text!./CustomColumnsWidget.html', 'css!./CustomColumnsWidget.css'], function (Base,template) {
    var xtype = "customColumns";
    var CustomColumnsWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            items: [],
            fixItems: [],
            value:[],
            $textField:"text",
            $valueField:"value",
            showAllCheck:false,
            $split: ",",
            afterSave:null,//param:customcolumn,value
            beforeOpenDialog:null,
            afterOpenDialog:null,
            itemCheck: function (vid,el) {
                var vm = avalon.vmodels[vid];
                el.checked = !el.checked;
                var values = [];
                for (var i = 0; i < vm.items.length; i++) {
                    if (vm.items[i].checked) {
                        values.push(vm.items[i][vm.$valueField]);
                    }
                }
                vm.value = values;
            },
            allCheck: function (vid, element) {
                var vm = avalon.vmodels[vid];
                if(vm){

                }
            },
            allUnCheck: function (vid, element) {
                var vm = avalon.vmodels[vid];
                if(vm){

                }
            }
        },
        initialize: function (opts) {
            this.parent(this._formatOptions(opts));
        },
        render:function(){
            var that = this;
            this.dialog = Page.create('dialog', {
                width: "650px",
                title:"自定义显示列",
                button: [{
                    name: "保存",
                    focus:true,
                    callback: function(dialog, window, param) {
                        alert("子页面参数："+that.options.value);
                        //TODO saveToServer
                        //afterSave
                        if(that.options.afterSave){
                            that.options.afterSave(that,that.options.value);
                        }
                        return false;
                    }
                },{
                    name: "关闭",
                    focus:false,
                    callback: function(dialog) {
                        dialog.close();
                    }
                }]
            });
            this.dialog.render();
            var tmp = this.getTemplate();
            var e = jQuery("<div></div>");
            if (!this.options._addWrapDiv) {
                e = jQuery(tmp);
            }else{
                e.append(tmp);
            }
            e.addClass("page_" + this.getAttr('$xtype')).attr("ms-controller", this.getId());
            avalon.scan(e[0]);
            this.dialog.content(e[0]);
        },
        getTemplate: function () {
            return template;
        },
        getDomContent: function () {
            var tem = this.getTemplate();
            return tem;
        },
        _formatOptions: function (opts) {
            if(opts){
                if(opts.items&&opts.items.length){
                    for(var t=0;t<opts.items.length;t++){
                        var item = opts.items[t];
                        if(item){
                            item.checked = false;
                            if(opts.value) {
                                var valueArr;
                                if(Object.prototype.toString.call(vm.value) == "[object Array]") {
                                    valueArr = vm.value;
                                }else{
                                    valueArr = vm.value.split(vm.$split);
                                }
                                for(var j=0; j<valueArr.length; j++) {
                                    if(item[this.option.$valueField] == valueArr[j]) {
                                        item.checked = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return opts
        }
    });
    CustomColumnsWidget.xtype = xtype;
    return CustomColumnsWidget;
})