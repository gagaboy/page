/**
 * Grid�ؼ���װ
 * mengbin
 */
!function($){
    var Grid = function(element,options){
        this.options = options; // ������Ϣ
        this.container = element; // �����ڵ�
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

    // ���幫������
    $.extend(Grid.prototype,{
        /**
         * ��ȡѡ�еļ�¼
         * @returns ���ض�������
         */
        getSelected : function(){
            return $.map($(this.container).find("[name='chk']:checked"),function(item){
                var $tr = $(item).closest("tr");
                return $tr.get(0)["data-data"]["$model"];
            });
        },
        /**
         * ѡ��ĳһ�м�¼
         * @param data ���Դ����±�����(��0��ʼ),Ҳ���Դ��ݼ�¼������ֵ
         * @param checked �Ƿ�ѡ�� true/false
         */
        select : function(data,checked){
            if(checked !== true && checked !== false){
                return;
            }
            if($.type(data) == 'number'){
                // ��������ѡ��
                $(this.container).find("[name='chk']:eq(" + data + ")").prop("checked",checked).trigger("change");
            }else{
                // ��������ѡ��
                $(this.container).find("tr[key='" + data + "']").find("[name='chk']").prop("checked",checked).trigger("change");
            }
        },
        /**
         * ѡ�����м�¼
         * @param checked �Ƿ�ѡ�� true/false
         */
        selectAll : function(checked){
            if(checked !== true && checked !== false){
                return;
            }
            $(this.container).find("[name='chkAll']").prop("checked",checked).trigger("change");
        },
        /**
         * ��Ӽ�¼
         * @param data ���Դ��ݵ�������,Ҳ���Դ��ݶ�������
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
         * ɾ��ĳһ�м�¼
         * @param data ���Դ����±�����(��0��ʼ),Ҳ���Դ��ݼ�¼������ֵ
         */
        remove : function(data){
            if(!data){
                // �Ƴ�����
                this.vModel.datas.removeAll();
            }else{
                if($.type(data) == 'number'){
                    // ��������ѡ��
                    this.vModel.datas.removeAt(data);
                }else{
                    // ��������ѡ��
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
         * ���¼�¼
         * @param data ���Դ��ݵ�������,Ҳ���Դ��ݶ�������,�����б��뱣֤��������,���򲻸���
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
                        // ƥ��
                        $.extend(vmDatas[j],_data);
                        break;
                    }
                }
            }
        }
    });

    // ��ʼ��UI
    function initUI(grid){
        var options = grid.options; // ���������
        if(!options.id){
            options.id = "_" + new Date().getTime(); // ���û�д���ID���������һ��
        }
        options["$id"] = options.id + "-controller"; // controllerĬ�Ϲ������,id-controller
        var template = Grid.prototype.template; // �ؼ�ģ��
        if(!template) {
            // ��ȡ�ؼ�ģ��
            $.get("/page/src/widget/grid/GridWidget.html", function (html) {
                Grid.prototype.template = html; // ����ؼ�ģ��
                parseTemplate(grid,html,options);
            });
        }else{
            parseTemplate(grid,template,options);
        }
    }

    // ��ʼ���¼�
    function initEvents(grid){
        // ȫѡ��ť��
        var $cont = $(grid.container);
        $cont.delegate("[name='chkAll']","change",function(){
           $cont.find("[name='chk']").prop("checked",this.checked);
        }).delegate("[name='chk']","change",function(){
            if(this.checked &&
                ($cont.find("[name='chk']:checked").size() == $cont.find("[name='chk']").size())){
                // �ж��Ƿ����ж�ѡ��
                $cont.find("[name='chkAll']").prop("checked",true);
            }else{
                // �ж��Ƿ����ж�δѡ��
                if($cont.find("[name='chk']:checked").size() != $cont.find("[name='chk']").size()){
                    $cont.find("[name='chkAll']").prop("checked",false);
                }
            }
        });
    }

    // ʹ��avalon�����ݺ�ģ��
    function parseTemplate(grid,template,model) {
        $(grid.container).html(template).attr("ms-controller", grid.options["$id"]);// ��������Ϊ������
        grid.vModel = avalon.define(model);
        avalon.scan(grid.container); // ɨ���������
    }
}(window.jQuery);