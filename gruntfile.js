'use strict'

module.exports = grunt => {
  require('load-grunt-tasks')(grunt)

  grunt.initConfig({
    babel: {
      dist: {
        files: {
          'dist/bootstrap-without-jquery.js': 'src/index.js'
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
    watch: {
      files: 'src/**/*.js',
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

  // Created as a custom task because of an obscure warning :
  // "Cannot create property subarray" (linked to grunt-contrib-uglify)
  grunt.registerTask('uglify', () => {
    const file = 'dist/bootstrap-without-jquery'
    const fs = require('fs')
    const UglifyJS = require('uglify-js')
    const result = UglifyJS.minify(`${file}.js`)
    fs.writeFileSync(`${file}.min.js`, result.code)
  });

  grunt.registerTask('default', ['browserSync', 'watch'])
}
