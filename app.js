/*
 requirejs.config({
 //By default load any module IDs from js/lib
 baseUrl: 'src',
 //except, if the module ID starts with "app",
 //load it from the js/app directory. paths
 //config is relative to the baseUrl, and
 //never includes a ".js" extension since
 //the paths config could be for a directory.
 paths: {

 }
 });
 */


require.config({
    //baseUrl: "src",
    paths: {}
})


require(["./src/Factory", "./lib/mmPromise"], function (factory) {
    var allclass = factory.getAll();
    console.log(allclass);
    for (var i = 0; i < 10; i++) {
        var inp = factory.create("input", {
            onValueChange: function (vm) {
                console.log(vm.value);
            },
            $parentId: 'container',
            value: ''
        });
        inp.render();
    }

    console.log(inp);

    window['JOT'] = factory;
});