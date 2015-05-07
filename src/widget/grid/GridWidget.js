/**
 * Grid控件封装
 * mengbin
 *
 * options :
 * id : 控件ID,如果不传则自动为控件生成一个ID,该ID会绑定在父元素上作为controller.
 * datas : [{}] 数据集合,形如: [{ZGH : '01113200','XM': '孟斌',XB : '1',XB_DISP : '男'},...]
 * cols : [{}] 数据列信息,形如:[{ENAME : 'ZGH',CNAME : '职工号'},{ENAME : 'XM',CNAME : '姓名'},...]
 * checkbox : true/false 是否显示复选框
 *
 * methods :
 * getSelected() : [{}] 返回选中的数据集合
 * select(pos/key,checked) : 根据索引或者主键选中或取消记录
 * selectAll(checked) : 全选或全不选
 * add(datas) : 添加记录,可以传递对象或者对象数组
 * remove(pos/key) : 移除记录
 * update(datas) : 更新记录,可以传递对象或者对象数组
 *
 * events :
 * onSelectAll(checked) : 全选时触发
 * onSelect(checked,data) : 选择时触发
 *
 */
!function($){
    var Grid = function(element,options){
        this.options = options; // 配置信息
        this.container = element; // 容器节点
        initUI(this);
        initEvents(this);
    };
    Grid.prototype.constructor = Grid;
    Grid.prototype.DEFAULTS = {
        keyName : 'WID',
        checkbox : false
    };
    $.fn.grid = function(){
        var option = arguments[0];
        var args = Array.prototype.slice.call(arguments,1);
        var result = null;
        this.each(function(){
            var $this = $(this);
            var data = $this.data("grid"),
                options = $.extend({},Grid.prototype.DEFAULTS,typeof option == 'object' && option);
            if(!data){
                $this.data("grid",(data = new Grid(this,options)));
                result = $this;
            }
            if(typeof option == 'string'){
                result = data[option].apply(data,args);
            }
        });
        return result;
    };

    // 定义公开方法
    $.extend(Grid.prototype,{
        /**
         * 获取选中的记录
         * @returns 返回对象数组
         */
        getSelected : function(){
            return $.map($(this.container).find("[name='chk']:checked"),function(item){
                var $tr = $(item).closest("tr");
                return $tr.get(0)["data-data"]["$model"];
            });
        },
        /**
         * 选中某一行记录
         * @param data 可以传递下标索引(从0开始),也可以传递记录的主键值
         * @param checked 是否选中 true/false
         */
        select : function(data,checked){
            if(checked !== true && checked !== false){
                return;
            }
            if($.type(data) == 'number'){
                // 根据索引选择
                $(this.container).find("[name='chk']:eq(" + data + ")").prop("checked",checked).trigger("change");
            }else{
                // 根据主键选择
                $(this.container).find("tr[key='" + data + "']").find("[name='chk']").prop("checked",checked).trigger("change");
            }
        },
        /**
         * 选中所有记录
         * @param checked 是否选中 true/false
         */
        selectAll : function(checked){
            if(checked !== true && checked !== false){
                return;
            }
            $(this.container).find("[name='chkAll']").prop("checked",checked).trigger("change");
        },
        /**
         * 添加记录
         * @param data 可以传递单个对象,也可以传递对象数组
         */
        add : function(data){
            var datas = [];
            if($.type(data) != 'array'){
                datas.push(data);
            }else{
                datas = data;
            }
            var vm = this.vModel;
            for(var i=0;i<datas.length;i++){
                vm.datas.push(datas[i]);
            }
        },
        /**
         * 删除某一行记录
         * @param data 可以传递下标索引(从0开始),也可以传递记录的主键值
         */
        remove : function(data){
            if(!data){
                // 移除所有
                this.vModel.datas.removeAll();
            }else{
                if($.type(data) == 'number'){
                    // 根据索引选择
                    this.vModel.datas.removeAt(data);
                }else{
                    // 根据主键选择
                    var datas = this.vModel.datas;
                    if(datas){
                        for(var i=0;i<datas.size();i++){
                            if(datas[i][this.options.keyName] === data){
                                datas.remove(datas[i]);
                                return;
                            }
                        }
                    }
                }
            }
        },
        /**
         * 更新记录
         * @param data 可以传递单个对象,也可以传递对象数组,对象中必须保证有主键项,否则不更新
         */
        update : function(data){
            var datas = [];
            if($.type(data) != 'array'){
                datas.push(data);
            }else{
                datas = data;
            }
            var vmDatas = this.vModel.datas;
            for(var i=0;i<datas.length;i++){
                var _data = datas[i];
                var key = _data[this.options.keyName];
                if(!key){
                    continue;
                }
                for(var j=0;j<vmDatas.size();j++){
                    if(vmDatas[j][this.options.keyName] === key){
                        // 匹配
                        $.extend(vmDatas[j],_data);
                        break;
                    }
                }
            }
        }
    });

    // 初始化UI
    function initUI(grid){
        var options = grid.options; // 传入的属性
        if(!options.id){
            options.id = "_" + new Date().getTime(); // 如果没有传入ID则随机生成一个
        }
        options["$id"] = options.id + "-controller"; // controller默认构造规则,id-controller
        var template = Grid.prototype.template; // 控件模板
        if(!template) {
            // 获取控件模板
            $.get("/page/src/widget/grid/GridWidget.html", function (html) {
                Grid.prototype.template = html; // 缓存控件模板
                parseTemplate(grid,html,options);
            });
        }else{
            parseTemplate(grid,template,options);
        }
    }

    // 初始化事件
    function initEvents(grid){
        // 全选按钮绑定
        var $cont = $(grid.container);
        $cont.delegate("[name='chkAll']","change",function(){
            $cont.find("[name='chk']").prop("checked",this.checked);
            if(grid.options.onSelectAll){
                grid.options.onSelectAll(this.checked); // 触发全选事件,传递选择状态
            }
        }).delegate("[name='chk']","change",function(){
            if(grid.options.onSelect){
                var data = $(this).closest("tr").get(0)["data-data"];
                grid.options.onSelect(this.checked,data);  // 触发选中某行记录事件,传递选择状态以及当前数据
            }
            if(this.checked &&
                ($cont.find("[name='chk']:checked").size() == $cont.find("[name='chk']").size())){
                // 判断是否所有都选中
                $cont.find("[name='chkAll']").prop("checked",true);
            }else{
                // 判断是否所有都未选中
                if($cont.find("[name='chk']:checked").size() != $cont.find("[name='chk']").size()){
                    $cont.find("[name='chkAll']").prop("checked",false);
                }
            }
        });
    }

    // 使用avalon绑定数据和模板
    function parseTemplate(grid,template,model) {
        $(grid.container).html(template).attr("ms-controller", grid.options["$id"]);// 设置容器为监听器
        grid.vModel = avalon.define(model);
        avalon.scan(grid.container); // 扫描监听容器
    }
}(window.jQuery);