define(['../BaseFormWidget','text!./SwitchWidget.html','css!./SwitchWidget.css'], function (BaseFormWidget,template) {
    var xtype = "switch";//
    var TooltipWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            show:true,
            color: '#1AB394',
            checked:false,
            disabled: false,
            checkValue:1,// 默认为1,
            unCheckValue:0// 默认为0
        },
        switchObj:{},
        _afterRender:function(){
            var inputObj = this.getParentElement().find(".e-switch")[0];
            if(inputObj){
                this.switchObj = new Switchery(inputObj,this.options);
                if(this.getAttr("checked")){
                    this.switchObj.setPosition(true);
                }
            }
        },
        getTemplate: function(){
            return template;
        },
        destroy:function(){
            this.switchObj.destroy()
            this.parent();
        },
        show:function(){
            this.switchObj.show();
        },
        hide:function(){
            this.switchObj.hide();
        },
        getValue:function(){
            return this.switchObj.isChecked()?this.options.checkValue:this.options.unCheckValue;
        },
        setValue:function(value){
            if(value!=undefined){
                var checked = false;
                if(value==this.options.checkValue){
                    checked = true;
                }
                if(checked!=this.switchObj.isChecked()){
                    this.switchObj.setPosition(true);
                    this.setAttr("checked",checked,true);
                }
            }
        },
        isChecked:function(){
            return this.switchObj.isChecked();
        },
        check:function(){
            if(!this.switchObj.isChecked()){
                this.switchObj.setPosition(true);
                this.setAttr("checked",true,true);
            }
        }
    });
    TooltipWidget.xtype = xtype;
    return TooltipWidget;
});