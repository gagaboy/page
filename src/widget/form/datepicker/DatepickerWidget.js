/**
 * Created by zengxianping on 15/5/7.
 * emap日期时间控件
 *
 * @cnName 日期选择器
 * @enName datepicker
 * @introduce
 *    <p>datepicker组件方便快速创建功能齐备的日历组件，通过不同的配置日历可以满足显示多个月份、通过prev、next切换月份、或者通过下拉选择框切换日历的年份、月份，当然也可以手动输入日期，日历组件也会根据输入域中的日期值高亮显示对应日期等等各种需求</p>
 */
define(['../BaseFormWidget',
    "./avalon.getModel",
    "./avalon.datepicker.lang.js",
    "text!./DatepickerWidget.html",
    "./avalon.dropdown.js",
    "./avalon.slider.js",
    "css!./oniui-common.css",
    "css!./DatepickerWidget.css",
    'text!./DatepickerWidget.html',
    'css!./DatepickerWidget.css'], function (BaseFormWidget, avalon, holidayDate, sourceHTML) {
    var xtype = "datepicker";
    var datepickerWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype
        }

    });
    datepickerWidget.xtype = xtype;
    return datepickerWidget;
});
