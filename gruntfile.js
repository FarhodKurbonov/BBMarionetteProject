var path = require('path');
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-express');


  grunt.initConfig({
    express: {
      options: {
        port: 3000,
        hostname: '*'
      },
      livereload: {
        options: {
          server: path.resolve('./app.js'),
          livereload: true,
          bases: [
            path.resolve(__dirname, './public'),
            path.resolve(__dirname, './views')
          ]
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
      options: { livereload: true },

      sass: {
        files: ['public/css/components/apps/*.scss'],
        tasks: ['compass:dev']
      }

    }//watch
  });//initConfig
  grunt.registerTask('default', ['express','watch']);
};
