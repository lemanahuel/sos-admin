'use strict';

const _ = require('lodash'),
  defaultAssets = require('./config/assets/default');

module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      test: {
        NODE_ENV: 'test'
      },
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },

    watch: {
      options: {
        spawn: false
      },
      clientViews: {
        files: defaultAssets.client.views
      },
      clientJS: {
        files: defaultAssets.client.js
      },
      clientCSS: {
        files: defaultAssets.client.css
      },
      clientLESS: {
        files: defaultAssets.client.less,
        tasks: ['less:dev']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          ext: 'js,html',
          watch: _.union(defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config),
          ignore: ['node_modules/*', 'scripts/*', 'public/*', '.idea/*', '.bower-tmp/*', '.bower-registry/*', '.bower-cache/*'],
          delay: 1000
        }
      }
    },

    concurrent: {
      options: {
        logConcurrentOutput: true,
        limit: 2
      },
      default: ['nodemon:dev', 'watch'],
      prod: ['env:prod'],
      prod1: ['less:prod', 'cdnify:prod'],
      prod2: ['cssmin:prod', 'htmlmin:prod'],
      prod3: ['autoprefixer:prod', 'ngtemplates:prod'],
      prod4: ['ngAnnotate:prod_app', 'ngAnnotate:prod_libs'],
      prod5: ['uglify:prod_app', 'uglify:prod_libs'],
      prod6: ['concat:prod']
    },

    esformatter: {
      all: _.union(defaultAssets.server.allJS, defaultAssets.client.js)
    },

    prettify: {
      options: {
        config: '.prettifyrc'
      },
      all: {
        expand: true,
        cwd: '',
        src: _.union(defaultAssets.server.views, defaultAssets.client.views),
        dest: ''
      }
    },

    htmlangular: {
      files: {
        src: ['modules/**/*.html']
      }
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      client: {
        src: _.union(defaultAssets.client.js),
        options: {
          jshintrc: '.jshintrc_client'
        }
      },
      server: {
        src: _.union(defaultAssets.server.allJS),
        options: {
          jshintrc: '.jshintrc_server'
        }
      }
    },

    eslint: {
      client: {
        options: {
          configFile: '.eslintrc_client',
          force: false,
          quiet: true,
          plugins: ['angular'],
          globals: [
            'sessionStorage',
            'localStorage',
            '$',
            'angular',
            'window',
            'document',
            'location',
            'console',
            'APP',
            'device',
            '$MPC',
            'Mercadopago',
            'require',
            'module',
            'exports',
            'process',
            'SimpleMDE'
          ]
        },
        src: _.union(defaultAssets.client.js)
      },
      server: {
        options: {
          configFile: '.eslintrc_server',
          force: false,
          quiet: true,
          globals: [
            'Mercadopago',
            'require',
            'module',
            'exports',
            'process',
            '__dirname',
            'console'
          ]
        },
        src: _.union(defaultAssets.server.allJS)
      }
    },

    htmllint: {
      options: {
        htmllintrc: '.htmllintrc'
      },
      all: {
        src: _.union(defaultAssets.server.views, defaultAssets.client.views)
      }
    },

    lesslint: {
      src: defaultAssets.client.less
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: defaultAssets.client.css
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      app_di: {
        files: [{
          expand: true,
          src: [defaultAssets.client.js],
          ext: '.js',
          extDot: 'last'
        }]
      },
      prod_app: {
        files: {
          'public/.tmp/app.js': [defaultAssets.client.js, 'public/.tmp/views.js']
        }
      },
      prod_libs: {
        files: {
          'public/.tmp/libs.js': [defaultAssets.client.lib.js]
        }
      }
    },

    uglify: {
      prod_app: {
        options: {
          mangle: true,
          beautify: false,
          preserveComments: false,
          quoteStyle: 1,
          compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true
          },
          banner: '\n/* <%= pkg.name %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'public/.tmp/app.submin.js': ['public/.tmp/app.js']
        }
      },
      prod_libs: {
        options: {
          mangle: false,
          beautify: false,
          preserveComments: false,
          quoteStyle: 1,
          compress: {
            sequences: true,
            dead_code: true,
            conditionals: true,
            booleans: true,
            unused: true,
            if_return: true,
            join_vars: true,
            drop_console: true
          }
        },
        files: {
          'public/.tmp/libs.submin.js': 'public/.tmp/libs.js'
        }
      }
    },

    concat: {
      options: {
        stripBanners: true,
        separator: ';'
      },
      prod: {
        src: ['public/.tmp/libs.submin.js', 'public/.tmp/app.submin.js'],
        dest: 'public/dist/ch.' + Date.now() + '.js'
      }
    },

    less: {
      options: {
        sourceMap: false,
        cleancss: true,
        compress: true
      },
      dev: {
        files: [{
          expand: true,
          src: defaultAssets.client.less,
          ext: '.css',
          rename: (base, src) => {
            return src.replace('/less/', '/css/');
          }
        }]
      },
      prod: {
        files: {
          'public/.tmp/application.css': defaultAssets.client.less
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      prod: {
        src: 'public/.tmp/application.css',
        dest: 'public/.tmp/application.css'
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        keepSpecialComments: 0,
        roundingPrecision: -1
      },
      prod: {
        src: _.union(defaultAssets.client.lib.css, defaultAssets.client.css),
        dest: 'public/dist/ch.' + Date.now() + '.css'
      }
    },

    htmlmin: {
      options: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeAttributeQuotes: true,
        removeComments: true, // Only if you don't use comment directives!
        removeEmptyAttributes: false,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
      },
      prod: {
        files: [{
          expand: true,
          cwd: '',
          src: ['modules/core/server/views/*.html'],
          dest: ''
        }]
      }
    },

    ngtemplates: {
      prod: {
        src: ['modules/**/*.html', '!modules/core/server/**/*.html'],
        dest: 'public/.tmp/views.js',
        options: {
          module: 'core',
          htmlmin: '<%= htmlmin.options %>',
          url: (url) => {
            return url.replace('public/.tmp/views/', '');
          }
        }
      }
    },

    copy: {
      prod_fonts: {
        expand: true,
        cwd: 'public/lib/font-awesome/fonts',
        src: '**',
        dest: 'public/fonts/',
        flatten: true,
        filter: 'isFile'
      }
    },

    sloc: {
      all: {
        files: {
          'modules': [
            '**/*.html',
            '**/*.css',
            '**/*.less',
            '**/*.scss',
            '**/*.js'
          ]
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.option('force', true);

  grunt.registerTask('lint', [
    'ngAnnotate:app_di',
    //'esformatter',
    //'prettify',
    'jshint',
    'eslint'
    //'htmllint'
    //'lesslint',
    //'csslint'
  ]);

  grunt.registerTask('build-qa', [
    'lint',
    'env:prod',
    'less:prod',
    'autoprefixer:prod',
    'cssmin:prod',
    'htmlmin:prod',
    'ngtemplates:prod',
    'ngAnnotate:prod_app',
    'ngAnnotate:prod_libs',
    'uglify:prod_app',
    'uglify:prod_libs',
    'concat:prod',
    'copy:prod_fonts'
  ]);

  grunt.registerTask('build-prod', [
    'lint',
    'env:prod',
    'less:prod',
    //'cdnify:prod',
    'autoprefixer:prod',
    'cssmin:prod',
    'htmlmin:prod',
    'ngtemplates:prod',
    'ngAnnotate:prod_app',
    'ngAnnotate:prod_libs',
    'uglify:prod_app',
    'uglify:prod_libs',
    'concat:prod',
    'copy:prod_fonts'
  ]);

  grunt.registerTask('styles', ['less:dev', 'autoprefixer:prod', 'cssmin:prod']);
  grunt.registerTask('default', ['env:dev', 'less:dev', 'concurrent:default']);
  grunt.registerTask('local-prod', ['build-prod', 'concurrent:default']);
  grunt.registerTask('heroku:development', 'build-qa');
  grunt.registerTask('heroku:qa', 'build-qa');
  grunt.registerTask('heroku:production', process.env.ENV_QA ? 'build-qa' : 'build-prod');
};
