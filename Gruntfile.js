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
                        "avalon": "bower_components/oniui/avalon"
                    },
                    optimize: 'none',
                    preserveLicenseComments:false,
                    generateSourceMaps: true,
                    out: 'dist/page-build.js'
                }
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/page-build-min.js': 'dist/page-build.js'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-requirejs'); //requirejs优化
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // 注册任务
    grunt.registerTask('default', ['requirejs','uglify']);
};