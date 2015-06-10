/**
 * Created by JK_YANG on 15/5/22.
 */
define(['../Base','text!./TreeWidget.html', 'zTree',
    'css!./TreeWidget.css','css!./../../../lib/zTree_v3/css/zTreeStyle/zTreeStyle.css'], function (Base, treeTpl, zTree) {
    var xtype = "tree";
    var Tree = new Class({
        Extends: Base,
        options: {
            $xtype: xtype,
            $showCheckBox: false,  //是否显示checkbox
            $showIcon: false,  //是否显示图标
            $idKey: "id",  //节点id Key
            $nodeName: "name",  //节点文本key
            $pIdKey: "pId",  //父节点id
            $treeLine: true,  //是否显示连线
            $multi: false,  //是否支持多选
            $async: true,  //是否异步加载数据
            $dataSetId: null,  //数据源Id
            $mainAlias: null,  //数据源主实体别名
            $url: null,  //数据源url
            $searchable: true,
            $searchKey: "searchValue",
            searchValue: "",



            /*事件*/
            beforeAsync: avalon.noop(),
            beforeCheck: avalon.noop(),
            beforeClick: avalon.noop(),
            beforeCollapse: avalon.noop(),
            beforeDblClick: avalon.noop(),
            beforeDrag: avalon.noop(),
            beforeDragOpen: avalon.noop(),
            beforeDrop: avalon.noop(),
            beforeEditName: avalon.noop(),
            beforeExpand: avalon.noop(),
            beforeMouseDown: avalon.noop(),
            beforeMouseUp: avalon.noop(),
            beforeRemove: avalon.noop(),
            beforeRename: avalon.noop(),
            beforeRightClick: avalon.noop(),
            onAsyncError: avalon.noop(),
            onAsyncSuccess: avalon.noop(),
            onCheck: avalon.noop(),
            onClick: avalon.noop(),
            onCollapse: avalon.noop(),
            onDblClick: avalon.noop(),
            onDrag: avalon.noop(),
            onDragMove: avalon.noop(),
            onDrop: avalon.noop(),
            onExpand: avalon.noop(),
            onMouseDown: avalon.noop(),
            onMouseUp: avalon.noop(),
            onNodeCreated: avalon.noop(),
            onRemove: avalon.noop(),
            onRename: avalon.noop(),
            onRightClick: avalon.noop(),


            searchTreeData: function(vid, event) {
                var vm = avalon.vmodels[vid];
                var obj = vm.getCmpMgr();
                var searchValue = vm.searchValue;
                //重新搜索所有数据
                if("" === searchValue) {
                    obj.zTreeObj.setting.view.selectedMulti = false;
                    obj.zTreeObj.setting.async.enable = obj.options.$async;
                }
                //此处可限制字符长度, 按值搜索数据
                else if(true) {
                    obj.zTreeObj.setting.view.selectedMulti = true;
                    obj.zTreeObj.setting.async.enable = false;
                }
                var dataParam = {};
                dataParam[obj.options.$searchKey] = searchValue;
                jQuery.ajax({
                    url: obj.options.$url,
                    data: dataParam,
                    type:'POST',
                    dataType: 'json',
                    cache: false
                }).done(function(res) {
                    if (res) {
                        var data = res.result.datas[obj.options.$mainAlias].rows;
                        jQuery.fn.zTree.init(obj._getTreeDom(), obj.setting, data);
                        if(searchValue != ""){
                            var selectedNodes = obj.zTreeObj.getNodesByParamFuzzy(obj.options.$nodeName, searchValue, null);
                            for( var i=0, l=selectedNodes.length; i<l; i++) {
                                obj.zTreeObj.selectNode(selectedNodes[i], true);
                            }
                        }
                    }
                });
            },
            getCmpMgr: function() {
                return Page.manager.components[this.vid];
            }

        },
        /**
         * 组装ztree基本设置
         * @returns {}
         * @private
         */
        _geneSetting: function(){
            var options = this.options;

            return {
                async: {
                    enable: true,
                    url: options.$url,
                    dataFilter: function (treeId, parentNode, responseData) {
                        var res = [];
                        if(responseData) {
                            res = responseData.result.datas[options.$mainAlias].rows;
                        }
                        return res;
                    }
                },
                check: {
                    enable: options.$showCheckBox,
                    chkStyle: "checkbox",
                    chkboxType: { "Y": "ps", "N": "ps" },
                    autoCheckTrigger: true
                },
                data: {
                    key:{
                        name: options.$nodeName
                    },
                    simpleData:{
                        enable: true,// 默认使用简单数据
                        idKey: options.$idKey,
                        pIdKey: options.$pIdKey
                    }
                },
                edit:{
                    enable: true,
                    showRenameBtn: false,
                    showRemoveBtn: false
                },
                view:{
                    showIcon: options.$showIcon,
                    showLine: options.$treeLine,
                    selectedMulti: options.$multi,
                    dblClickExpand: false
                },
                callback:{
                    beforeAsync: options.beforeAsync,
                    beforeCheck: options.beforeCheck,
                    beforeClick: options.beforeClick,
                    beforeCollapse: options.beforeCollapse,
                    beforeDblClick: options.beforeDblClick,
                    beforeDrag: options.beforeDrag,
                    beforeDragOpen: options.beforeDragOpen,
                    beforeDrop: options.beforeDrop,
                    beforeEditName: options.beforeEditName,
                    beforeExpand: options.beforeExpand,
                    beforeMouseDown: options.beforeMouseDown,
                    beforeMouseUp: options.beforeMouseUp,
                    beforeRemove: options.beforeRemove,
                    beforeRename: options.beforeRename,
                    beforeRightClick: options.beforeRightClick,
                    onAsyncError: options.onAsyncError,
                    onAsyncSuccess: options.onAsyncSuccess,
                    onCheck: options.onCheck,
                    onClick: options.onClick,
                    onCollapse: options.onCollapse,
                    onDblClick: options.onDblClick,
                    onDrag: options.onDrag,
                    onDragMove: options.onDragMove,
                    onDrop: options.onDrop,
                    onExpand: options.onExpand,
                    onMouseDown: options.onMouseDown,
                    onMouseUp: options.onMouseUp,
                    onNodeCreated: options.onNodeCreated,
                    onRemove: options.onRemove,
                    onRename: options.onRename
                }
            };
        },
        getTemplate: function () {
            return treeTpl;
        },
        initialize: function (opts) {
            if(opts) {
 /*               if (opts.$dataSetId && opts.$url) {
                    Page.dialog.alert("树组件中dataSetId和url属于互斥属性，只能设置一个！");
                    return;
                }*/
                this.parent(opts);
            }
        },
        render: function (parent) {
            var that = this;
            that.fireEvent("beforeRender", [that.vmodel]);
            var tmp = jQuery(that.getTemplate());

            var e = tmp.find("ul");
            that.treeDom = e;
            tmp.append(e);

            tmp.addClass("page_" + that.getAttr('$xtype')).attr("ms-controller",that.getId());
            var parentDOM = parent;
            if (!parentDOM) {
                parentDOM = that.getParentElement();
            }
            parentDOM.append(tmp);
            that.$element = tmp;
            that.element = tmp[0];
            avalon.scan(parentDOM[0]);

            //调用ztree接口，创建树
            that.setting  = that._geneSetting();
            that.zTreeObj = jQuery.fn.zTree.init(e, that.setting);

/*            //合并自定义事件与组件事件
            that.zTreeObj.setting.callback.beforeExpand = that._extendExpandEvent;
            that.zTreeObj.cusExpandFunc = setting.callback.beforeExpand;
            that.zTreeObj.treeObj = that;*/

            that.fireEvent("afterRender", [that.vmodel]);
            if (that["_afterRender"]) {
                that["_afterRender"](that.vmodel);
            }

            if(!that.options.$async) {
                that.zTreeObj.setting.async.enable = false;
            }


            return that;
        },
        _getTreeDom: function() {
            return this.treeDom;
        },
        _extendExpandEvent: function( treeId, treeNode) {
            var zTree = this.getZTreeObj(treeId);
            var beforeExpand = zTree.cusExpandFunc;
            //先执行用户自定义的事件
            var res = beforeExpand && typeof beforeExpand == "function" && beforeExpand((treeId, treeNode));
            if(false == res) return false;

            //模拟异步加载数据
            var treeObj = zTree.treeObj;
            if(treeObj.options.$async == true) {
                var ds = treeObj._getDataSet();
                //增加查询参数，拉取数据
                var fetchParam = {};
                //fetchParam[vm.searchKey] = searchValue;
                ds.setAttr("fetchParam", fetchParam);
            }

        },

        _getDataSet: function() {
            if(this.options.$dataSetId) {
                return Page.manager.components[this.options.$dataSetId];
            }
            else if(this.options.$url) {
                if(!this.dataSet) {
                    this.dataSet = Page.create("dataSet", {
                        fetchUrl: this.options.$url,
                        model: {
                            mainAlias: this.options.$mainAlias
                        }
                    });
                }
                return this.dataSet;
            }
        },
        destroy: function () {
            this.parent();
        }
    });
    Tree.xtype = xtype;
    return Tree;
});