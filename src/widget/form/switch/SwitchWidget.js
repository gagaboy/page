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
            value:null,
            display:null,
            checkValue:1,// 选中的值，默认为1,
            unCheckValue:0,// 未选中的值，默认为0
            checkDisplay:"是",// 选中的显示（readonly时显示），默认为‘是’,
            unCheckDisplay:"否",//选中的显示（readonly时显示），默认为‘否’,
            valueField:"value",//调用setValue方法，value为对象时，值的key
            textField:"display"//调用setValue方法，value为对象时，显示值的key
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
        getDisplay:function(){
            return this.switchObj.isChecked()?this.options.checkDisplay:this.options.unCheckDisplay;
        },
        setValue:function(value){
            if(value!=undefined){
                var val = null;
                if(typeof(value)=="object"){
                    val = value[this.options.valueField];
                    this.options.value = value[this.options.valueField];
                    this.options.display = value[this.options.textField];
                }else{
                    val = value;
                }
                var checked = false;
                if(val==this.options.checkValue){
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