/**
 * Created by qianqianyi on 15/5/6.
 */
({
    paths: {
        text: 'bower_components/text/text',
        css: 'bower_components/require-css/css',
        "css-builder": 'bower_components/require-css/css-builder',
        "normalize":"bower_components/require-css/normalize"
    },
    name: "src/Bootstrap",
    out: 'dist/page-build.js'
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