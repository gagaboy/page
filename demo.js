//require.config({
//    baseUrl: "src"
//})
require(["./src/Bootstrap"], function () {
    var inp = Page.create("input", {
        $parentId: 'inputContainer',
        value: '',
        required: false,
        glyphicon: 'glyphicon-ok',
        message: '请输入用户名',
        label: '用户名',
        hasError: false,
        $id: 'username'//,
        //value: 'init'
    });
    inp.render();
    console.log(inp);
    var combo = Page.create('combobox', {
        $parentId: 'comboboxContainer',
        $id: 'sex',
        label: '性别'
    })
    combo.render();

    var datepicker = Page.create("datepicker", {
        $parentId: 'datepickerContainer',
        $id: 'datepicker123456',
        time: '2015-04-28',
        onSelect: function(date, vmodel, data) {
            avalon.log("选中日期后的用户回调")
            avalon.log(arguments);
        }
    });
    datepicker.render();
});