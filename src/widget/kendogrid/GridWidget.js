define(['../Base','../../../lib/kendoui/js/kendo.grid','text!./GridWidget.html'], function (Base,grid, template) {
    var xtype = "grid";
    var GridWidget = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            columns: [],
            toolbar: null,
            autoBind: true,
            filterable: false,
            scrollable: true,
            sortable: false,
            selectable: false,
            navigatable: false,
            pageable: false,
            editable: false,
            groupable: false,
            rowTemplate: "",
            altRowTemplate: "",
            dataSource: {},
            height: null,
            resizable: false,
            reorderable: false,
            columnMenu: false,
            detailTemplate: null,
            columnResizeHandleWidth: 3,
            mobile: ""
        },
        gridObj:null,
        render: function () {
            this.fireEvent("beforeRender", [this.vmodel]);
            var $this = this;

            var tmp = $(this.getTemplate());
            var e = jQuery("<div></div>").addClass("page_"+$this.getAttr('$xtype')).attr("ms-controller", $this.getId());
            e.append(tmp);
            $this.getParentElement().html(e);

            var tableObj = tmp;
            this.gridObj = jQuery(tableObj).kendoGrid(this.options);
            $this.element = e[0];

            $this.fireEvent("afterRender", [this.vmodel]);
            if (this["_afterRender"]) {
                this["_afterRender"](this.vmodel);
            }
            return this;
        },
        getTemplate: function(){
            return template;
        }
    });
    GridWidget.xtype = xtype;
    return GridWidget;
});