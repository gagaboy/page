/**
 * Created by JKYANG on 15/5/18.
 */

define(["../BaseLayout", "text!./Panel.html"], function (BaseLayout, panelTpl) {
    var xtype = "panel";
    var Panel = new Class({
        Extends: BaseLayout,
        options: {
            title:'',
            showTitle: true,
            showPanel: true,

            togglePanel: function(vid) {
                var vm = avalon.vmodels[vid];
                vm.showPanel = !vm.showPanel;
            }
        },
        getTemplate: function () {
            return panelTpl;
        },
        getElementToAppend: function () {
            return this.$element.find(".ibox-content");
        }
    });
    Panel.xtype = xtype;
    return Panel;

});