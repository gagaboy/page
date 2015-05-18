/**
 * Created by BIKUI on 15/4/23.
 */
define(['../Base', 'text!./CustomSearcherWidget.html', 'css!./CustomSearcherWidget.css'
    ,'css!../../../lib/bootstrap/css/plugins/chosen/chosen.css'], function (Base, template) {
    var xtype = "customSearcher";
    var CustomSearcherWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            value: null,
            dataSetId: null,
            groupOper: "or", //条件分组之间的连接符
            controls: [],

            QuickSearchShow: false,
            customSearchShow: false,
            clearShow: false,  //清空图标是否显示
            searchSubmit: null


        },
        initialize: function (opts) {
            if (opts && opts.value && opts.display) {

            }
            this.parent(opts);


        },

        _valueChange: function (value) {
            this.setAttr("display", value);
        },
        _getInputElement: function () {
            var input = jQuery(this.getElement()).find('input');
            return input;
        },
        focus: function () {
            //console to invoke this method is not ok...
            var input = this._getInputElement();
            avalon.nextTick(function () {
                input.focus();
            });
            this._getCompVM().focused = true;
        },
        blur: function () {
            var input = this._getInputElement();
            avalon.nextTick(function () {
                input.blur();
            });
            this._getCompVM().focused = false;
        },
        _valueChange:function(){//值改变时校验
            this.validate();
        }
    });
    ComboBoxWidget.xtype = xtype;
    return ComboBoxWidget;
});