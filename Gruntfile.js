module.exports = function(grunt) {
	'use strict';

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({

		watch: {

			styles: {
				files: ['assets/scss/**/*.{scss,sass}'],
				tasks: ['styles'],
				options: {
					debounceDelay: 500
				}
			},

			scripts: {
				files: ['assets/js/**/*.js'],
				tasks: ['scripts'],
				options: {
					debounceDelay: 500
				}
			}

		},

		jshint: {
			gruntfile: ['Gruntfile.js'],
			assets: ['assets/js/**/*.dev.js']
		},

		uglify: {
			dist: {
				files: {
					'assets/js/admin-single.min.js': ['assets/js/admin-single.js']
				}
			}
		},

		compass: {
			dist: {
				options: {
					config: 'assets/config.rb'
				}
			}
		},

		autoprefixer: {
			dist: {
				expand: true,
				flatten: true,
				src: 'assets/css/*.css',
				dest: 'assets/css'
			}
		},

		csso: {
			dist: {
				expand: true,
				flatten: true,
				src: 'assets/css/*.css',
				dest: 'assets/css'
			}
		},

		imagemin: {
			dist: {
				options: {
					optimizationLevel: 7,
					progressive: true
				},
				files: [{
					expand: true,
					cwd: 'assets/images/',
					src: '**/*',
					dest: 'assets/images/'
				}]
			}
		},

		includes: {
			options: {
				includePath: 'vendor',
				includeRegexp: /\/\/\s*import\s+['"]?([^'"]+)['"]?\s*?$/,
			},
			scripts: {
				src: ['assets/js/admin-single.dev.js'],
				dest: 'assets/js/admin-single.js'
			},
			styles: {
				src: ['assets/css/admin-single.css'],
				dest: 'assets/css/admin-single.css',
				options: {
					includeRegexp: /\/\*\s*import\s+['"]?([^'"]+)['"]?\s*\*\/?$/
				}
			}
		},

		clean: {
			deploy: ['deploy']
		},

		copy: {
			deploy: {
				files: [{
					expand: true,
					cwd: './',
					src: [
						'*',
						'includes/**/*',
						'admin/**/*',
						'assets/**/*',
						'languages/**/*',

						'!.travis.yml',
						'!.gitignore',
						'!.gitmodules',
						'!README.md',
						'!CHANGELOG.md',
						'!Gruntfile.js',
						'!package.json',
						'!phpunit.xml',
						'!**/Thumbs.db',
						'!composer.json',
						'!*.sublime-project',
						'!*.sublime-workspace',
						'!screenshot-*.{png,jpe?g}'
					],
					dest: 'deploy/',
					filter: 'isFile'
				}]
			}
		},

		shell: {

			/**
			 * Requires PhpDocumentor to be installed and in PATH
			 */
			phpdoc: {
				command: 'phpdoc -t docs/api -f code-snippets.php -d admin,includes --title "Code Snippets"'
			}
		}

	});

	grunt.registerTask( 'styles', ['compass', 'includes:styles', 'autoprefixer', 'csso'] );
	grunt.registerTask( 'scripts', ['jshint', 'includes:scripts'] );

	grunt.registerTask( 'deploy', ['clean:deploy', 'copy:deploy'] );
	grunt.registerTask( 'phpdoc', 'shell:phpdoc' );

	grunt.registerTask( 'default', ['styles', 'scripts', 'uglify'] );
};
