/*global module*/
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            build: {
                options: {
                    name:"demo",
                    baseUrl: "./",
                    paths: {
                        text: 'bower_components/text/text',
                        css: 'bower_components/require-css/css',
                        "css-builder": 'bower_components/require-css/css-builder',
                        "normalize": "bower_components/require-css/normalize",
                        "avalon": "bower_components/oniui/avalon",
                        "art": 'lib/artdialog/artDialog.source',
                        "artIframe": 'lib/artdialog/iframeTools.source',
                        "my97DatePicker": "lib/My97DatePicker/WdatePicker",
                        "zTree": "lib/zTree_v3/js/jquery.ztree.all-3.5.min",
                        "kindeditor": "/lib/kindeditor-4.1.10/kindeditor"
                    },
                    optimize: 'none',
                    preserveLicenseComments:false,
                    generateSourceMaps: true,
                    out: 'dist/page-build.js'
                }
            }
        },
        uglify: {
            builda: {//任务一：添加banner，支持Source Map
                options: {
                    banner: '//@ sourceMappingURL=page-build.js.map\n'//添加banner
                },
                files: {
                    'dist/page-build-min.js': 'dist/page-build.js'
                }
            },
            buildb: {
                files: {//任务二：不添加banner
                    'dist/page-build-min.js': 'dist/page-build.js'
                }
            }
        },
        clean:["!dist/*.ignore" ,'dist/*.js','dist/*.map']
    });

    require('load-grunt-tasks')(grunt);
    // 注册任务
    grunt.registerTask('default', ['clean','requirejs','uglify:builda']);
    //不支持Source Map
    grunt.registerTask('buildNoMap', ['clean','requirejs','uglify:buildb']);
};