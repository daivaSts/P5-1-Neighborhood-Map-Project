module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		jshint: {
			options: {
				"eqeqeq": true
			},
			all: [
			'src/js/*.js'
			]
		},
	    htmlmin: {
	        options: {
	            cdata: true
	        },
	        dist: {
			    options: {
			        removeComments: true,
			        collapseWhitespace: true
		      	},
	            files: {
	                'dist/index.html': 'src/index.html'
	            }
	        }
	    },
	    uglify: {
    		my_target: {
      			files: {
        			'dist/js/knockout.mapping.min.js': ['src/js/knockout.mapping.js']
      			}
    		}
  		},
  		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'src/css/',
					src: ['style.css'],
					dest: 'dist/css',
					ext: '.min.css'
				}]
			}
		}
	});

	grunt.registerTask("default", [
		"jshint",
		"uglify",
		'htmlmin',
		'cssmin'
		]);
};