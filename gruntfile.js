'use strict'

module.exports = grunt => {
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    babel: {
      dist: {
        files: {
          'dist/bootstrap-without-jquery.js': 'src/bootstrap-without-jquery.js'
        }
      }
    },
    browserSync: {
      bsFiles: {
        src: 'demo/bootstrap-without-jquery.js'
      },
      options: {
        server: './demo',
        watchTask: true
      }
    },
    copy: {
      bootstrapExample: {
        expand: true,
        flatten: true,
        cwd: 'bootstrap/docs/examples/theme',
        src: '*',
        dest: 'demo'
      },
      bootstrapAssets: {
        expand: true,
        // flatten: true,
        cwd: 'bootstrap/docs',
        src: [
          'assets/**',
          'dist/**'
        ],
        dest: 'demo'
      },
      distToDemo: {
        expand: true,
        cwd: 'dist',
        src: 'bootstrap-without-jquery.js',
        dest: 'demo'
      }
    },
    jshint: {
      all: [
        'bower.json',
        'package.json',
        'src/bootstrap-without-jquery.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    replace: {
      demo: {
        options: {
          patterns: [
            {
              match: /\.\.\/\.\.\//g,
              replacement: ''
            },
            {
              match: /(<\/body>)/g,
              replacement: '<script src="bootstrap-without-jquery.js"></script>$1'
            },
            {
              match: /<script.*\/script>/g,
              replacement: ''
            }
          ]
        },
        files: [{
          expand: true,
          flatten: true,
          src: 'demo/index.html',
          dest: 'demo'
        }]
      },
    },
    uglify: {
      dist: {
        files: {
          'dist/bootstrap-without-jquery.min.js': 'dist/bootstrap-without-jquery.js'
        }
      },
      options: {
        preserveComments: false,
        sourceMap: false
      }
    },
    watch: {
      files: 'src/bootstrap-without-jquery.js',
      tasks: ['babel', 'copy:distToDemo']
    }
  })

  grunt.registerTask('build', [
    'demo',
    'jshint',
    'babel',
    'uglify'
  ])

  grunt.registerTask('demo', [
    'copy',
    'replace',
  ])

  grunt.registerTask('default', ['browserSync', 'watch'])
}
