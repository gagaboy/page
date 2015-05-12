/**
 * Created by qianqianyi on 15/5/9.
 * 废弃
 */
define(['../BaseFormWidget', 'text!./DatePickerWidget.html', 'bower_components/oniui/datepicker/avalon.datepicker','css!./DatePickerWidget.css'], function (BaseFormWidget, template, datePi) {
    var xtype = "datePicker";
    var DatePickerWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            $param:{
                changeMonthAndYear:false,
                vid: function(){
                    alert(1);
                },
                onClose:function(value, vm){
                    //alert('s');
                    Page.manager.components['date'].fireEvent('onClose');
                }
            }
        },
        getTemplate: function () {
            return template;
        }

    });
    DatePickerWidget.xtype = xtype;
    return DatePickerWidget;
});