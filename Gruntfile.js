module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
					sourceMap: false,
					outputStyle: 'compressed'
				},
				files: {
					'Project/Assets/Styles/Production/theme.css': 'Project/Assets/Styles/app.scss'
				}
			}
		},
		watch: {
			css: {
				files: 'Project/**/*.scss',
				tasks: ['sass:dist']
			},
			js: {
				files: ['Project/Assets/Scripts/**/*.js','!**/*.min.js'],
				tasks: ['includereplace', 'uglify:min']
			},
			html: {
				files: ['Project/**/*.dev.html','Project/Assets/Html/**/*.html'],
				tasks: ['includereplace']
			}
		},
		includereplace: {
			dist: {
				options: {
					globals: {
						// Global variables
						'version':'0.0.3',
						// Directories
						'libsDir': 'Assets/Scripts/Libraries',
						'cssDir':'Assets/Styles/Production',
						'jsRootDir': 'Assets/Scripts',
						'htmlDir': 'Assets/Html',
						'imgDir': 'Assets/Images'
					},
				},
			    files: {
			    	'Project/Assets/Scripts/Global/app.js': ['Project/Assets/Scripts/Global/app.dev.js'],
			    	'Project/Assets/Html/Pages/layout.html': ['Project/Assets/Html/Pages/layout.dev.html'],
			    	'index.html': ['Project/index.dev.html']
				}
			}
		},
		uglify: {
			min: {
				options: {
					sourceMap: false
				},
				files: {
					'Project/Assets/Scripts/Global/app.min.js': ['Project/Assets/Scripts/Global/app.js']
				}
			}
		},
		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 5, // maximum number of notifications from jshint output
				title: 'SellSei', // defaults to the name in package.json, or will use project directory's name
				success: false, // whether successful grunt executions should be notified automatically
				duration: 3 // the duration of notification in seconds, for `notify-send only
			}
		},
		notify: {
			uglify: {
				options: {
					title: 'Grunt tasks completed',  // optional
					message: 'Sass compiled, js minified.', //required
				}
			}
		}
	});

  /*
	Running grunt tasks
	1) Compilling sass to css
	2) Watcher task
	3) Merge, concat files
	4) JS minifier task
	5) Template import / Variable replace in html
	*) All tasks
  */

  // 1)
  grunt.loadNpmTasks('grunt-sass');

  // 2)
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 3)
  //grunt.loadNpmTasks('grunt-contrib-concat');

  // 4)
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // 5)
  grunt.loadNpmTasks('grunt-include-replace');

  // 6)
  grunt.loadNpmTasks('grunt-notify');
  grunt.task.run('notify_hooks');

  // *)
  grunt.registerTask('default', ['sass:dist', 'includereplace', 'uglify', 'watch', 'notify:uglify']);

};