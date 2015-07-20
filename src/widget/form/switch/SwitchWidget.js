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
            textField:"display",//调用setValue方法，value为对象时，显示值的key
            valueChangeFunc:null,
            getChecked:function(vid){
                var swi = Page.manager.components[vid];
                return swi.switchObj.isChecked();
            }
        },
        switchObj:{},
        render:function(){
            this.parent();
            var inputObj = this.getParentElement().find(".e-switch")[0];
            if(inputObj){
                var that = this;
                this.switchObj = new Switchery(inputObj,this.options);
                if(this.options.value!=undefined&&this.options.value==this.options.checkValue){
                    //this.setAttr("checked",true);
                    this.setAttr("display",this.options.checkDisplay);
                    this.switchObj.setPosition(true);
                }else{
                    if(this.getAttr("checked")){
                        this.switchObj.setPosition(true);
                    }else{
                        this.setAttr("display",this.options.unCheckDisplay);
                    }
                }
                var switcheryDom = this.getParentElement().find(".switchery");
                if(switcheryDom&&switcheryDom[0]&&that.options.valueChangeFunc){
                    switcheryDom[0].onclick = function(){
                        that.setAttr("value",that.getValue());
                        that.setAttr("display",that.getDisplay());
                        that.options.valueChangeFunc(that,that.switchObj);
                    }
                }
            }
        },
        getTemplate: function(){
            return template;
        },
        show:function(){
            this.switchObj.show();
        },
        hide:function(){
            this.switchObj.hide();
        },
        getValue:function(){
            this.options.value = this.switchObj.isChecked()?this.options.checkValue:this.options.unCheckValue;
            return this.options.value;
        },
        getDisplay:function(){
            this.options.display = this.switchObj.isChecked()?this.options.checkDisplay:this.options.unCheckDisplay;
            return this.options.display;
        },
        setValue:function(value){
            if(value!=undefined&&this.switchObj&&this.switchObj.isChecked){
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
        switchStatus: function (status) {
            this.parent(status);
            this.setAttr("value",this.getValue());
            this.setAttr("display",this.getDisplay());
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