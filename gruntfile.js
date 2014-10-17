var path = require('path');
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-express');


  grunt.initConfig({
    'node-inspector': {
      custom: {
        options: {
          'web-port': 8080,
          'web-host': '127.0.0.1',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 4,
          'hidden': ['node_modules']
        }
      }
    },
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
  //grunt.loadNpmTasks('grunt-node-inspector');
  grunt.registerTask('default', ['express','watch']);
};
