/**
 * Created by zeng x.p on 15/5/7.
 * 基于avalon的datepicker的组件进行封装
 * @cnName 日期选择器
 * @enName datepicker
 * @introduce
 *    <p>datepicker组件方便快速创建功能齐备的日历组件，通过不同的配置日历可以满足显示多个月份、通过prev、next切换月份、或者通过下拉
 *    选择框切换日历的年份、月份，当然也可以手动输入日期，日历组件也会根据输入域中的日期值高亮显示对应日期等等各种需求</p>
 */
define(['../BaseFormWidget',
    './avalon.datepicker',
    'text!./DatepickerWidget.html',
    'css!./DatepickerWidget.css'], function (BaseFormWidget, datepicker, template) {
    //组件类型
    var xtype = "datepicker1";
    //组件可以配置的选项
    var configs = {
        startDay: 1, //@config 设置每一周的第一天是哪天，0代表Sunday，1代表Monday，依次类推, 默认从周一开始
        minute: 0, //@config 设置time的默认minute
        hour: 0, //@config 设置time的hour
        showTip: true, //@config 是否显示节日提示
        disabled: false, //@config 是否禁用日历组件
        changeMonthAndYear: false, //@config 是否可以通过下拉框选择月份或者年份
        showOtherMonths: false, //@config 是否显示非当前月的日期
        numberOfMonths: 1, //@config 一次显示的日历月份数, 默认一次显示一个
        minDate: null, //@config 最小的可选日期，可以配置为Date对象，也可以是yyyy-mm-dd格式的字符串，或者当分隔符是“/”时，可以是yyyy/mm/dd格式的字符串
        maxDate: null, //@config 最大的可选日期，可以配置为Date对象，也可以是yyyy-mm-dd格式的字符串，或者当分隔符是“/”时，可以是yyyy/mm/dd格式的字符串
        stepMonths: 1, //@config 当点击next、prev链接时应该跳过几个月份, 默认一个月份
        toggle: false, //@config 设置日历的显示或者隐藏，false隐藏，true显示
        separator: "-", //@config 日期格式的分隔符,默认“-”，可以配置为"/"，而且默认日期格式必须是yyyy-mm-dd
        watermark: true, //@config 是否显示水印文字
        zIndex: -1, //@config设置日历的z-index
        timer: false, //@config 是否在组件中可选择时间
        /**
         * @config {Function} 选中日期后的回调
         * @param date {String} 当前选中的日期
         * @param vmodel {Object} 当前日期组件对应的Vmodel
         * @param data {Object} 绑定组件的元素的data属性组成的集合
         */
        onSelect: avalon.noop,
        /**
         * @config {Function} 日历关闭的回调
         * @param date {Object} 当前日期
         * @param vmodel {Object} 当前日期组件对应的Vmodel
         */
        onClose: avalon.noop,
        /**
         * @config {Function} 在设置了timer为true时，选择日期、时间后的回调
         * @param vmodel {Object} 当前日期组件对应的Vmodel
         */
        onSelectTime: avalon.noop,
        /**
         * @config {Function} 将符合日期格式要求的字符串解析为date对象并返回，不符合格式的字符串返回null,用户可以根据自己需要自行配置解析过程
         * @param str {String} 要解析的日期字符串
         * @returns {Date} Date格式的日期
         */
        parseDate: avalon.noop,
        /**
         * @config {Function} 将日期对象转换为符合要求的日期字符串
         * @param date {Date} 要格式化的日期对象
         * @returns {String} 格式化后的日期
         */
        formatDate: avalon.noop
    };

    //定义日期组件
    var DatepickerWidget = new Class({
        Extends: BaseFormWidget,
        options: {
            $xtype: xtype,
            $fullName: 'emap.widget.form.datepicker'
        },
        initialize: function (opts) {
            this.options.$opts=mergeUserConfigs(opts);
            //默认可以通过下拉框选择月份或者年份
            this.options.$opts["changeMonthAndYear"]=true;
            //将“required”属性映射为avalon datepicker能够识别的"allowBlank"属性
            if(opts.hasOwnProperty("required")){
                this.options.$opts["allowBlank"]=!opts["required"];
            }
            this.parent(opts);
        },
        _statusChange:function(value, oldValue, model){
            if(value !== oldValue){
                var dateIcon = jQuery(this.getElement()).find(".oni-datepicker-tip");
                if(value === "readonly"){
                    dateIcon.hide();
                }else if(value === "edit"){
                    dateIcon.show();
                }
            }
        },
        //返回日期控件的模板
        getTemplate: function () {
            return template;
        },
        _getInputElement: function () {
            return jQuery(this.getElement()).find("input.form-widget-to-focus-class");
        },
        focus: function () {
            var input = this._getInputElement();
            input.focus();
        },
        blur: function () {
            var input = this._getInputElement();
            input.blur();
        }
    });

    /**
     * 将用户传递过来的扁平话的属性，转换成可以被avalon日期控件识别的属性
     * @param opts {Object} 要解析的日期字符串
     * @returns {Object} 转换之后的属性
     */
    function mergeUserConfigs(opts){
        var $opts={};
        if (opts) {
            for (var opt in opts) {
                if (opts.hasOwnProperty(opt) && configs.hasOwnProperty(opt)) {
                    $opts[opt]=opts[opt];
                }
            }
        }
        return $opts;
    }
    DatepickerWidget.xtype = xtype;
    return DatepickerWidget;
});
