require(["./src/Factory", "./lib/mmPromise"], function (factory) {
    var allclass = factory.getAll();
    console.log(allclass);
    var inp = factory.create("input", {

        $parentId: 'inputContainer',
        value: '',
        required: true,
        //glyphicon: 'glyphicon-ok',
        message: '请输入用户名',
        label: '用户名',
        $id: 'username'//,
        //value: 'init'
    });
    inp.render();
    console.log(inp);
    window['JOT'] = factory;
});