module.exports = function(grunt) {
    var debug = !grunt.option('prod');
    
	grunt.initConfig({
        uglify: {
			js: {
				files: {
					'./public/js/app.js': [
                        './bower_components/angular/angular.js',
                        './bower_components/angular-route/angular-route.js',
                        './bower_components/angular-animate/angular-animate.js',
                        './bower_components/angular-translate/angular-translate.js',
                        './bower_components/angular-translate-loader-url/angular-translate-loader-url.js',
                        './bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                        './bower_components/angular-loading-bar/src/loading-bar.js',
                        './bower_components/ng-flow/dist/ng-flow-standalone.js',
                        './bower_components/fusty-flow.js/src/fusty-flow-factory.js',
                        './bower_components/fusty-flow.js/src/fusty-flow.js',
                        './bower_components/ngDialog/js/ngDialog.js',
						'./bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
						'./bower_components/TdGal/dist/js/tdgal.angular.standalone.js',
                        './public_dev/app/app.js',
                        './public_dev/app/controllers/registerController.js',
                        './public_dev/app/controllers/**/*.js',
                        './public_dev/app/services/**/*.js',
                        './public_dev/app/filters/**/*.js',
                        './public_dev/app/directives/**/*.js'
					]
				},
				options: {       
                    preserveComments: debug,
                    compress: (!debug ? {
                        drop_debugger: true,
                        drop_console: true,
                        angular: true
                    } : false),
                    beautify: debug,
                    mangle: !debug
				}
			}
		},
		less: {
			development: {
				options: {
					compress: !debug,
					yuicompress: false,
					optimization: (debug ? 2 : 10)
				},
				files: {
					"./public/css/common.css": [ 
                        "./bower_components/ngDialog/css/ngDialog.css",
                        "./bower_components/angular-loading-bar/src/loading-bar.css", 
						'./bower_components/TdGal/dist/css/tdgal.css',
                        "./public_dev/less/common.less"
                    ]
				}
			}
		},
        copy: {
            alte: {
                src: [ 
                    './bower_components/admin-lte/bootstrap/**/*', 
                    './bower_components/admin-lte/dist/**/*', 
                    './bower_components/admin-lte/plugins/**/*'
                ],
                dest: './public/',
                expand: true
            },
            player: {
                cwd: './redist/clappr/dist',
                src: [ 
                    '**/*'
                ],
                dest: './public/player',
                expand: true
            },
            player_plugin: {
                cwd: './bower_components/clappr-thumbnails-plugin/dist/',
                src: [
                    'clappr-thumbnails-plugin.js'
                ],
                dest: './public/player',
                expand: true
            }
        },
		watch: {
			styles: {
				files: [
					'./public_dev/less/*.less'
				], // which files to watch
				tasks: ['less'],
				options: {
					nospawn: true
				}
			},
			js: {
				files: [
                    './public_dev/app/**/*.js',
				],
				tasks: ['uglify']
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    /**
    * grunt.loadNpmTasks('grunt-ng-annotate');
	**/
    grunt.registerTask('default', [ 'watch' ]);
    grunt.registerTask('install-alte', [ 'copy:alte' ]);
    grunt.registerTask('install-player', [ 'copy:player', 'copy:player_plugin' ]);
    grunt.registerTask('install', [ 'copy', 'uglify', 'less' ])
    grunt.registerTask('build', [ 'uglify', 'less' ]);
};
