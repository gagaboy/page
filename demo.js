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
});