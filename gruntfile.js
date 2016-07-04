module.exports = (grunt) => {
  'use strict';

  grunt.initConfig({
    babel: {
        options: {
            sourceMap: false,
            presets: ['es2015']
        },
        dist: {
            files: {
                'dist/bootstrap-without-jquery.js': 'src/bootstrap-without-jquery.js'
            }
        }
    },
    jshint: {
      options: {
        browser: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        quotmark: true,
        undef: true,
        unused: true,
        expr: true
      },
      all: ['bower.json', 'package.json', 'bootstrap2/bootstrap-without-jquery.js', 'bootstrap3/bootstrap-without-jquery.js']
    },
    uglify: {
      options: {
        preserveComments: false,
        sourceMap: false
      }
      dist: {
        files: {
          'dist/bootstrap-without-jquery.min.js': 'dist/bootstrap-without-jquery.js',
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-uglify')

  grunt.registerTask('default', ['babel', 'uglify'])
}
