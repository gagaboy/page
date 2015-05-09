/**
 * Grid控件封装
 * mengbin
 *
 * options :
 * id : 控件ID,如果不传则自动为控件生成一个ID,该ID会绑定在父元素上作为controller.
 * datas : [{}] 数据集合,形如: [{ZGH : '01113200','XM': '孟斌',XB : '1',XB_DISP : '男'},...]
 * cols : [{}] 数据列信息,形如:[{ENAME : 'ZGH',CNAME : '职工号'},{ENAME : 'XM',CNAME : '姓名'},...]
 * hideCols : [] 隐藏的数据列,形如 ["WID","ZGH"]
 * keyName : 数据集主键字段
 * responsive : true/false 是否响应式表格
 * loadOnInit : true/false 是否初始化时加载数据
 * checkbox : true/false 是否显示复选框
 * pagination : 是否分页
 * pager : {} 分页信息, 形如: {pageSize : 10,pageIndex : 2, total : 100, pages : 10}
 * pageBlockSize : 分页条显示大小
 *
 * methods :
 * getSelected() : [{}] 返回选中的数据集合
 * getData(pos) : 返回指定索引行数据信息
 * select(pos/key,checked) : 根据索引或者主键选中或取消记录
 * selectAll(checked) : 全选或全不选
 * add(datas) : 添加记录,可以传递对象或者对象数组
 * remove(pos/key) : 移除记录
 * update(datas) : 更新记录,可以传递对象或者对象数组
 * showCol(ename,show) : 是否显示某列
 * showPagination(show) : 是否显示分页条
 * showCheckbox(show) : 是否显示复选框
 * showResponsive(show) : 响应式表格
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
        checkbox : false,
        pagination : false,
        responsive : false,
        loadOnInit : true,
        pageBlockSize : 3,
        datas : [],
        cols : [],
        hideCols : [],
        pager : {
            pages : 1,
            pageIndex : 1,
            pageSize : 10
        }
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
            if(!option){
                result = data;
            }
        });
        return result;
    };

    // 定义公开方法
    $.extend(Grid.prototype,{
        /**
         * 设置avalon属性,内部使用,不建议直接调用
         * @param opts
         */
        setOpts : function(opts){
            $.extend(this.vModel,opts);
        },
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
            if(data == undefined){
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
        },
        /**
         * 重新加载数据,会根据条件进行查询
         * @param opts
         */
        reload : function(opts){
            opts = $.extend({},this.options,opts);
            var url = opts.url;
            if(!url){
                return;
            }
            var fields = ["datas","cols","pager"];
            $.ajax({
                async : false,
                url : url,
                data : opts.param || "",
                dataType : 'text',
                type : 'POST',
                success : function(resp){
                    resp = eval("(" + resp + ")");
                    for(var i=0;i<fields.length;i++){
                        opts[fields[i]] = resp[fields[i]];
                    }
                }
            });
            if(this.vModel){
                for(var i=0;i<fields.length;i++) {
                    this.vModel[fields[i]] = opts[fields[i]];
                }
            }
            this.options = opts;
            // 重置复选框
            $(this.container).find(":checkbox").prop("checked",false);
        },
        /**
         * 根据索引获取指定行数据
         * @param pos 行索引,从0开始
         * @returns {*}
         */
        getData : function(pos){
            if($.type(pos) != 'number'){
                return null;
            }
            return this.vModel.datas.$model[pos];
        },
        /**
         * 显示或隐藏列
         * @param ename 列名
         * @param show true/false 是否显示
         */
        showCol : function(ename,show){
            if($.type(show) != 'boolean'){
                return;
            }
            var hideCols = this.vModel.hideCols;
            if(show){
                hideCols.remove(ename);
            }else{
                hideCols.ensure(ename);
            }
        },
        /**
         * 显示复选框
         * @param show
         */
        showCheckbox : function(show){
            if($.type(show) != 'boolean'){
                return;
            }
            this.setOpts({checkbox : show});
        },
        /**
         * 是否显示分页
         * @param show
         */
        showPagination : function(show){
            if($.type(show) != 'boolean'){
                return;
            }
            this.setOpts({pagination : show});
        },
        showResponsive : function(show){
            if($.type(show) != 'boolean'){
                return;
            }
            this.setOpts({responsive : show});
        }
    });

    // 初始化UI
    function initUI(grid){
        var options = grid.options; // 传入的属性
        if(!options.id){
            options.id = "_" + new Date().getTime(); // 如果没有传入ID则随机生成一个
        }
        options["$id"] = options.id + "-controller"; // controller默认构造规则,id-controller
        if(options.loadOnInit == true){
            grid.reload(options);
        }
        var template = Grid.prototype.template; // 控件模板
        if(!template) {
            // 获取控件模板
            $.get("/page/src/widget/grid/GridWidget.html", function (html) {
                Grid.prototype.template = html; // 缓存控件模板
                parseTemplate(grid,html,grid.options);
            },'html');
        }else{
            parseTemplate(grid,template,grid.options);
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

        // 分页事件
        $cont.delegate("ul.pagination [data-index]","click",function(){
            var $obj = $(this);
            var index = $obj.data("index");
            if(index == 0){
                return;
            }
            grid.reload({
                pager : {
                    pageIndex : index
                }
            })
        });
    }

    // 解析选项,生成avalon数据模型
    function prepareOptions(grid){
        var opts = grid.options;
        // 分页处理,显示当前页的前3条与后3条
        if(opts.pagination == true && opts.pager.pages > 1) {
            var $pages = [];
            var curPage = opts.pager.pageIndex;
            var pages = opts.pager.pages;
            for (var i = curPage; (i >= 1) && (curPage - i <= 3); i--) {
                $pages.unshift(i);
            }
            for (var i = curPage + 1; (i <= pages) && (i - curPage <= 3); i++) {
                $pages.push(i);
            }
            opts["$pages"] = $pages;
        }
        return opts;
    }

    // 使用avalon绑定数据和模板
    function parseTemplate(grid,template,model) {
        var opts = prepareOptions(grid);
        $(grid.container).html(template).attr("ms-controller", opts["$id"]);// 设置容器为监听器
        grid.vModel = avalon.define(model);
        avalon.scan(grid.container); // 扫描监听容器
    }
}(window.jQuery);