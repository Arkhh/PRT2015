'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	
    
		watch: {
			jsLintApp: {
				files: [
            'app/scripts/*.js',
            'app/test/*.js',
            'app/*.js'],
				tasks: ['jshint']
			},
			compass: {
				files: ['app/styles/sass/*.{scss,sass}'],
				tasks: ['compass:dev']
      		},
			
			jsTest: {
			tasks: ['karma:unit'],
			    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/components/**/*.js',
      'app/view*/**/*.js'
    ]
			}
		},
	
    jshint: {
              files: [
            'app/scripts/*.js',
            'app/test/*.js',
            'app/*.js'
        ],
      options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
      }
    },
    compass: {
        dev: {
			options: {
			  sassDir: ['app/styles/sass'],
			  cssDir: ['app/styles/stylesheets'],
			  environment: 'development',
			  //require: 'zurb-foundation'
			}
		}
      
    },
			

		
		karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
	
			
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('test', ['jshint']);
  //grunt.registerTask('compass', ['compass']);

  //grunt.registerTask('default', ['jshint']);
  

};