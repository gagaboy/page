/**
 * Created by JKYANG on 15/5/18.
 */

define(["../BaseLayout", "text!./Panel.html"], function (BaseLayout, panelTpl) {
    var xtype = "panel";
    var Panel = new Class({
        Extends: BaseLayout,
        options: {
            title:'未设置标题'
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