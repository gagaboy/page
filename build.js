/**
 * Created by qianqianyi on 15/5/6.
 */
({
    name:"demo",
    paths: {
        text: 'bower_components/text/text',
        css: 'bower_components/require-css/css',
        "css-builder": 'bower_components/require-css/css-builder',
        "normalize": "bower_components/require-css/normalize",
        "avalon": "bower_components/oniui/avalon"

    },
    out: 'dist/page-builD.js'
    //baseUrl:"src",
    /*
    modules: [{
        name: 'demo',
        exclude: "avalon",
        out:"dist/demo.js"
    }]
    */
})


/**
 *
 *   base path: src/
 *
 *   load Factory.js 's componentAlias[所有组件路径]
 *
 *   按照顺序合并Javascript －> componentAlias -> Factory.js -> Bootstrap.js
 *
 *   按照顺序合并Html(if exists) -> componentAlias
 *
 *   按照顺序合并Css(if exists)
 *
 *
 *
 *
 *
 **/