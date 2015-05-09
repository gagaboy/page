//require.config({
//    baseUrl: "src"
//})

//function deleteRow(row){
//    var index = parseInt(jQuery(row).parent().attr('rowIndex'));
//    var r = Page.manager.components.grid.getAttr('data')[index].$model;
//    window.console.log(r);
//}
//avalon.config({loader: false});
/*
require.config({
    paths: {
        text : "bower_components/text/text",
        css:"bower_components/require-css/css"
    }
    //baseUrl:"src"
});
*/

require(["src/Bootstrap"], function () {
    var inp = Page.create("input", {
        $parentId: 'inputContainer',
        value: '',
        required: false,
        glyphicon: 'glyphicon-ok',
        message: '请输入用户名',
        label: '用户名',
        hasError: false,
        $id: 'username',//,
        //value: 'init'
        onValueChange:function(){
            window.console.log('a');
        }
    });
    inp.addEvent('labelClick',function(c){
        alert(c.getAttr("value"));
    });
    inp.render();
    console.log(inp);
    var combo = Page.create('combobox', {
        $parentId: 'comboboxContainer',
        $id: 'sex',
        label: '性别'
    })
    combo.render();

    var grid = Page.create("simpleGrid", {
        $id: 'grid',
        $parentId: 'simpleGrid',
        header: [{
            title: '职工号',
            ctitle: 'zgh'

        }, {
            title: '起始年月',
            ctitle: 'qsny'
        }, {
            title: '性别',
            ctitle: 'xb',
            type: 'ctype'

        }],
        opColumn: {
            template: '<button ms-click="opColumn.deleteRow(a)">delete111</button>',
            deleteRow: function (a) {
                //alert(a);
                window.console.log(a);
            }
        },
        data: [{zgh: '123', qsny: '1923-11', xb: "1", xbDisplay: '男'}, {zgh: '345', qsny: '1923-12'}]


    });
    grid.render();
});