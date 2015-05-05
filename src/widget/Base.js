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
            vid: "",
            uuid: "",
            $xtype: xtype,
            $fullName: fullName,
            $parentId: null,
            $appendEl: null,
            show: true
        },
        initialize: function (opts) {
            this.setOptions(opts);
            if (!this.options || this.options.$id == "") {
                this.options.$id = this.options.$xtype + String.uniqueID();
            }
            if (this.options.vid == '') {
                this.options.vid = this.options.$id;
            }
            if (this.options.uuid == '') {
                this.options.uuid = String.uniqueID();
            }
            var that = this;
            this.vmodel = avalon.define(this.options);
            this.vmodel.$watch("$all", function (name, value) {
                that.setAttr(name, value);
            });
        },

        getId: function () {
            return this.vmodel.$id;
        },
        getAttr: function (key) {
            return this.vmodel[key];
        },
        setAttr: function (key, value) {
            var oldValue = this.vmodel[key];
            this.vmodel[key] = value;
            var privateMethod2Invoke = '_' + key + "Change";
            if (this[privateMethod2Invoke]) {
                this[privateMethod2Invoke](value, oldValue, this.vmodel.model);
                // old value, new value, vm.model
            }
            this.fireEvent(key + "Change", [value, oldValue, this.vmodel.model]);
            return this;
        },
        setAttrs: function (opts) {
            //todo
            for (var o in opts) {
                this.setAttr(o, opts[o]);
            }
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
            this.element = null;
            render();
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
