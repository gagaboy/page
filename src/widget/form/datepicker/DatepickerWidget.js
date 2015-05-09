/**
 * Created by zeng x.p on 15/5/7.
 * 基于avalon的datepicker的组件进行封装
 * @cnName 日期选择器
 * @enName datepicker
 * @introduce
 *    <p>datepicker组件方便快速创建功能齐备的日历组件，通过不同的配置日历可以满足显示多个月份、通过prev、next切换月份、或者通过下拉选择框切换日历的年份、月份，当然也可以手动输入日期，日历组件也会根据输入域中的日期值高亮显示对应日期等等各种需求</p>
 */
define(['../BaseFormWidget',
        './avalon.datepicker',
        'text!./DatepickerWidget.html',
        'css!./DatepickerWidget.css'], function (BaseFormWidget, datepicker, template) {
    var xtype = "datepicker";
    var defaults = {
        $xtype: xtype,
        $opt:{
            startDay: 1, //@config 设置每一周的第一天是哪天，0代表Sunday，1代表Monday，依次类推, 默认从周一开始
            minute: 0, //@config 设置time的默认minute
            hour: 0, //@config 设置time的hour
            width: 90, //@config 设置日历框宽度
            showTip: true, //@config 是否显示节日提示
            disabled: false, //@config 是否禁用日历组件
            changeMonthAndYear: false, //@config 是否可以通过下拉框选择月份或者年份
            mobileMonthAndYear: false, //@config PC端可以通过设置changeMonthAndYear为true使用dropdown的形式选择年份或者月份，但是移动端只能通过设置mobileMonthAndYear为true来选择月份、年份
            showOtherMonths: false, //@config 是否显示非当前月的日期
            numberOfMonths: 1, //@config 一次显示的日历月份数, 默认一次显示一个
            allowBlank : false, //@config 是否允许日历框为空
            minDate : null, //@config 最小的可选日期，可以配置为Date对象，也可以是yyyy-mm-dd格式的字符串，或者当分隔符是“/”时，可以是yyyy/mm/dd格式的字符串
            maxDate : null, //@config 最大的可选日期，可以配置为Date对象，也可以是yyyy-mm-dd格式的字符串，或者当分隔符是“/”时，可以是yyyy/mm/dd格式的字符串
            stepMonths : 1, //@config 当点击next、prev链接时应该跳过几个月份, 默认一个月份
            toggle: false, //@config 设置日历的显示或者隐藏，false隐藏，true显示
            separator: "-", //@config 日期格式的分隔符,默认“-”，可以配置为"/"，而且默认日期格式必须是yyyy-mm-dd
            calendarLabel: "选择日期", //@config 日历组件的说明label
            widgetElement: "", // accordion容器
            formatErrorTip: "格式错误",
            onSelect:function(date,vmodel,data){
                var cmp = Page.manager.components[vmodel.$id];
                //cmp.fireEvent('onSelect', arguments);
                cmp.fireEvent('onSelect');
            }
        }
    };
    var DatepickerWidget = new Class({
        Extends: BaseFormWidget,
        options: defaults,
        //
        getTemplate: function () {
            return template;
        }
    });
    DatepickerWidget.xtype = xtype;
    return DatepickerWidget;
});
