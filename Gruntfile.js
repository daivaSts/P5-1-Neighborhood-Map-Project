module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
	grunt.initConfig({
		concat: {
		    dist: {
		     	src: ['dist/css/bootstrap.min.css', 'dist/css/jquery-ui.min.css', 'dist/css/style.min.css'],
		      	dest: 'dist/css/built.css',
		    },

		  },
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
        			'dist/js/knockout-3.3.0.min.js': ['src/js/knockout-3.3.0.js']
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
		'cssmin',
		'concat'
		]);
};