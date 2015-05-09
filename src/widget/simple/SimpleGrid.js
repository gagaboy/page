/**
 * Created by qianqianyi on 15/5/8.
 */
define(['../Base', 'text!./SimpleGridWidget.html', 'css!./SimpleGridWidget.css'], function (Base, template) {
    var xtype = "simpleGrid";
    var SimpleGridWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            header: [],
            data: [],
            allChecked: false,
            allClick: function (vid, element) {
                var vm = avalon.vmodels[vid];
                for (var i = 0; i < vm.data.$model.length; i++) {
                    vm.data[i]['checked'] = element.checked;
                }
            },
            checkMe: function (row, vid) {
                var vm = avalon.vmodels[vid];
                var all = true;
                for (var i = 0; i < vm.data.$model.length; i++) {
                    if (!vm.data[i]['checked']) {
                        all = false;
                        break;
                    }
                }
                vm.allChecked = all;
            },
            opColumn: {}
        },
        initialize: function (opts) {
            var d = opts.data;
            for (var i = 0; i < d.length; i++) {
                if (d[i].checked == undefined) {
                    d[i].checked = false;
                }
            }
            //opts.opColumn.deleteRow

            this.parent(opts);
            window.console.log("aaaa:" + this.options.opColumn.template);
        },
        getTemplate: function () {
            return template;
        },
        getSelected: function () {
            //var arr = [];
            //var ds = this.getAttr('data');
            //return arr;
        }

    });
    SimpleGridWidget.xtype = xtype;
    return SimpleGridWidget;
})