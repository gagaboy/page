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


require(["./src/Factory"], function (factory) {
    var allclass = factory.getAll();
    console.log(allclass);

    var inp = factory.create("input")

    console.log(inp);
});