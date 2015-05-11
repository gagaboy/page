/**
 * Created by qianqianyi on 15/5/6.
 */

//cmd: node bower_components/r.js/dist/r.js -o build.js

//TODO 生成一个合并文件&一个合并压缩文件&一个SourceMap 文件
// http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html

({
    name:"demo",
    paths: {
        text: 'bower_components/text/text',
        css: 'bower_components/require-css/css',
        "css-builder": 'bower_components/require-css/css-builder',
        "normalize": "bower_components/require-css/normalize",
        "avalon": "bower_components/oniui/avalon"

    },
    out: 'dist/page-build.js'
    //baseUrl:"src",
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