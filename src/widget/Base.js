/**
 * Created by JKYANG on 15/4/23.
 */
/**
 * configs
 * properties
 * methods
 * events
 * css_var
 */
define([], function () {
    var xtype = "base";
    var fullName = "Base";
    var baseURL = "./src/widget/";
    var Base = new Class({
        Implements: [Events, Options],
        options: {
            $id: "",
            $xtype: xtype,
            $fullName: fullName,
            $parentId: null,
            show: true
        },
        initialize: function (opts) {
            this.setOptions(opts);
            if (!this.options || this.options.$id == "") {
                this.options.$id = (this.options.$xtype + Math.random() + Math.random()).replace(/0\./g, "")
            }
            var that = this;
            this.vmodel = avalon.define(this.options);
            this.vmodel.$watch("$all", function (name, value) {
                that.setAttr(name,value);
            });
        },
        getId: function () {
            return this.vmodel.$id;
        },
        getAttr: function (key) {
            return this.vmodel[key];
        },
        setAttr: function (key, value) {
            this.vmodel[key] = value;
            this.fireEvent(key + "Change", [this.vmodel]);
            return this;
        },
        setAttrs:function(opts){
            //todo
        },
        render: function () {
            this.fireEvent("beforeRender", [this.vmodel]);
            //var element = this.getElement();
            var $this = this;
            //mmPromise
            Promise.all([this.getTemplate()]).then(function (element) {
                $this.getParentElement().adopt(element);
                $this.element = element;
                $this.fireEvent("afterRender", [this.vmodel]);
            });
            return this;
        },

        getElement: function () {
            return this.element;
        },

        refresh: function () {

        },
        getTemplate: function () {
            var $this = this;
            return new Promise(function (resolve) {
                if (!$this.element) {
                    $this.element = new Element("div." + $this.getAttr('$xtype'));
                    $this.element.set("ms-controller", $this.getId());
                    require(['text!' + baseURL + $this.getAttr('$fullName') + ".html", 'css!' + baseURL + $this.getAttr('$fullName') + ".css"], function (template) {
                        $this.element.appendHTML(template);
                        avalon.scan($this.element);
                        resolve($this.element);
                    });
                } else {
                    resolve($this.element);
                }
            });
        },

        getParentElement: function () {
            if (this.options.$parentId == null) {
                return $$(document.body);
            } else {
                return $(this.options.$parentId);
            }
        },
        show: function () {
            this.setAttr("show", true);
        },
        hide: function () {
            this.setAttr("show", false);
        },
        destroy: function () {
            this.element.destroy();
        }
    });
    Base.xtype = xtype;
    return Base;
});
