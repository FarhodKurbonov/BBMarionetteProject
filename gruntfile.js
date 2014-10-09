module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');


  grunt.initConfig({
    uglify: {
      my_target: {
        files: {
          '_/js/script.js': ['_/components/js/*.js']
        }
      }
    },
    compass: {
      dev: {
        options: {
          config: 'config.rb'
        }
      }
    },
    watch: {
      scripts: {
	      files: ['_/components/js/*.js'],
	      tasks: ['uglify']
      },
      sass: {
        options: { livereload: true },
        files: ['_/components/sass/*.scss'],
        tasks: ['compass:dev']
      },
      html: {
        files: ['*.html']
      },
      options: { livereload: true }

    }//watch
  });//initConfig
  grunt.registerTask('default', 'watch');
}
